# Finara — Security Posture

> Status: **Phase 0 baseline audit.** This documents real, verified weaknesses in
> the current code. It is a work list, not a compliance statement.

## Summary

The application currently has **no security boundary**. Every control that looks
like a control is client-side state. This is expected for a design prototype and
is the primary thing the rebuild must fix.

## Verified findings

### S-1 — Privilege escalation is a function call (critical)

`AuthContext` exposes `login: (role?: 'user' | 'admin') => void`. Calling
`login('admin')` grants the admin console. `AdminLoginPage` wires this to a button
("Launch Admin Console Portal") that performs **no credential check**. There is no
server-side role verification anywhere.

### S-2 — Financial state is client-writable (critical)

Balances live in `localStorage.finara_user_session`. Editing that value in DevTools
changes the displayed balance and every downstream calculation. The same applies to
`finara_all_users`, `finara_audit_logs`, and `finara_platform_freeze`.

### S-3 — Audit log is written by the thing it audits (critical)

`finara_audit_logs` is a browser array the user can rewrite or delete. An audit log
mutable by its subject provides no evidentiary value.

### S-4 — No authorization on admin data (critical)

`AdminDashboardPage` renders every user in `finara_all_users`. There is no check
that the viewer may see other customers' balances, emails, or IBANs.

### S-5 — Float arithmetic on money (high)

`money.ts` is labelled "Anti-Floating Point Decimal Arithmetic" but implements
`Math.round((amount + Number.EPSILON) * 100) / 100` over a JS `number`. That is
IEEE-754 with a rounding step, not exact decimal. It loses precision above
2^53 minor units and accumulates error across repeated operations.
`verifyLedgerBalance` sums floats before comparing, so it can report a balanced
ledger that is not balanced.

### S-6 — No idempotency (high)

No money-moving path carries an idempotency key. A double-submitted transfer
produces two balance mutations.

### S-7 — Secrets handling (medium, partly fixed)

`.env` holding live Supabase credentials was **not** covered by `.gitignore`
(the template ships `*.local`, which does not match `.env`). Fixed: `.env` is now
ignored and was excluded from the commit. The key is a Supabase **anon** key, so
exposure severity depends entirely on RLS — which is why RLS is a blocking item.

### S-8 — Hooks-order crash (fixed)

`Navbar.tsx` called `useEffect` after a conditional `return null`, changing hook
count across routes and crashing the dashboard with *"Rendered fewer hooks than
expected"*. Fixed by hoisting the effect above the guard.

## Controls required before any real money

| Control | State |
|---|---|
| Server-side authorization | absent |
| Row Level Security enforced | policies drafted, never applied |
| Immutable ledger | code exists, unreachable |
| Idempotency keys | absent |
| MFA | absent |
| Rate limiting | absent |
| Webhook signature verification | absent |
| Audit log integrity | absent |
| Secrets isolation | partial |

## Non-goals

This system is **not** a bank and holds no licence. Until a regulated provider is
integrated, all balances are sandbox figures and must be labelled as such in the UI.
