# Finara — Architecture

> Status: **Phase 0 baseline audit.** Describes the system *as it actually is today*,
> not as intended. Read `IMPLEMENTATION_REPORT.md` for the change log.

## Stack (verified)

| Concern | Actual |
|---|---|
| Build | Vite 8, `type: module` |
| UI | React 19.2, TypeScript ~6.0 (strict) |
| Routing | react-router-dom 7, `BrowserRouter` (`HashRouter` for static hosts) |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` — no config file, CSS-first |
| Animation | framer-motion 13 |
| Lint | oxlint |
| State | React Context (`AuthContext`) + `localStorage` |
| Backend client | Hand-rolled `fetch` wrapper — **`@supabase/supabase-js` is not a dependency** |
| Server runtime | **None.** No Edge Functions, no API routes, no server process |
| Package manager | npm (`package-lock.json`) |
| Tests | Bespoke Node runner (`tests/run-tests.js`) — no Vitest/Jest |

## Application shape

Single Vite SPA serving three audiences from one bundle and one origin:

1. **Marketing site** — `/`, `/about`, `/features`, `/pricing`, `/faqs`, `/waitlist`
2. **Customer app** — `/dashboard` + 9 aliases
3. **Admin console** — `/admin` + 9 aliases

### Routing is not real routing

`App.tsx` maps all ten customer routes to the *same* `DashboardPage`, and all ten
admin routes to the *same* `AdminDashboardPage`. Section switching is component
state, not URL state. Consequences: no deep-linking, no per-route code-splitting,
no per-route authorization, browser back/forward does not move between sections.

### There is no authorization boundary

Admin and customer code ship in the same bundle to every visitor. Access is decided
by a `role` field in a React state object. This is presentation logic, not security.

## Module map

```
src/
  lib/
    money.ts        financial arithmetic      (imported by 1 file)
    supabase.ts     REST/auth client          (imported by AuthContext only)
  services/
    ledger.ts       double-entry builder      ORPHANED - 0 app imports
    transfers.ts    status state machine      ORPHANED - 0 app imports
    risk.ts         risk scoring              ORPHANED - 0 app imports
    kyc.ts          KYC state model           ORPHANED - 0 app imports
    cards.ts        card model                imported by 1 file
    providers/      sandbox adapters          ORPHANED - 0 app imports
  context/
    AuthContext.tsx 632 lines - auth, users, balances, transfers, stocks,
                    admin actions, audit log. The de-facto backend.
  pages/            10 pages; Dashboard 807 LOC, AdminDashboard 663 LOC
```

## The central finding

**The service layer is disconnected from the application.**

`ledger.ts`, `transfers.ts`, `risk.ts`, `kyc.ts` and `providers/` are imported by
**zero** application files. Their only importers are the test files. They are
well-formed, reasonable modules that no user action can reach.

Money actually moves in `AuthContext.tsx`, like this:

```ts
// AuthContext.tsx:261
const newBalances = { ...user.balances, [currency]: user.balances[currency] - amount };
```

That is: **IEEE-754 subtraction, in the browser, persisted to `localStorage`.**
No ledger entry is written. No double-entry invariant is checked. No idempotency
key exists. No server is involved at any point.

So the repository contains a *description* of a ledger-backed fintech platform and
a *implementation* of a client-side mock. The gap between them is the project.

## Data flow today

```
User action → React handler → setState → localStorage.setItem → re-render
```

No network call. No persistence beyond the browser profile. Clearing site data
resets all balances. Two devices never agree. DevTools can set any balance.

## Target architecture (to be built)

```
Browser (untrusted)
    │  supabase-js, anon key, RLS-scoped reads only
    ▼
Supabase Postgres ── RLS ── immutable double-entry ledger (NUMERIC)
    ▲
    │  service-role, server-only
Edge Functions (Deno) ── the ONLY writer of financial state
    │
    ▼
Provider adapters (sandbox → licensed provider)
```

Invariant: the browser may **read** its own rows and **request** operations. It may
never write balances, ledger entries, transaction status, KYC status, or roles.
