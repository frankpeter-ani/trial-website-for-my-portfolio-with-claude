# Finara — Development

## Prerequisites

Node 22+, npm. (Vite 8 / TypeScript 6 require a current Node.)

## Setup

```bash
cd finara
npm install
cp .env.example .env     # fill in your own Supabase project values
npm run dev              # http://localhost:5173
```

`.env` is gitignored. **Never commit real credentials.** Only `.env.example`,
containing placeholders, belongs in the repository.

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | `tsc -b && vite build` — typecheck then bundle |
| `npm run preview` | Serve the production build |
| `npm run lint` | oxlint |
| `node tests/run-tests.js` | Current bespoke test runner |

### Build-time environment

| Variable | Purpose | Default |
|---|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL | empty → app runs in demo mode |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key | empty → app runs in demo mode |
| `VITE_BASE` | Vite `base` for sub-path hosting | `/` |
| `VITE_HASH_ROUTER` | `'true'` selects `HashRouter` for static hosts | unset |

`isSupabaseConfigured()` gates backend calls, so the app renders fully with no
backend — useful for UI work, and the basis of the current demo mode.

## Demo mode

With no Supabase configured, one-click demo sessions are available:

- `/login` → "Sign In as Demo Customer (Mila Wilson)"
- `/admin/login` → "Launch Admin Console Portal"

Both are `localStorage`-backed and carry **no authentication**. They are a design
preview mechanism and must be removed or gated behind a sandbox flag before any
deployment that is not explicitly a demo.

## Testing

The current runner is `tests/run-tests.js` — a hand-rolled Node script with 5
assertions. It imports `src/services/*` directly.

**Known limitation:** those modules are not imported by any application code, so
the suite currently exercises code no user can reach. Passing tests therefore say
nothing about whether the product works. Replacing this with a real runner
(Vitest) and wiring the services into actual flows is a Phase 41 deliverable.

## Conventions

- TypeScript strict. Avoid `any`.
- Money is never a JS `number` in new code — see the Phase 4 decimal work.
- No business logic in components; it belongs in `services/`.
- Every financial mutation is server-side, idempotent, audited, and tested.
