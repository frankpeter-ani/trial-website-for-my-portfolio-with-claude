# Finara — Deployment

## Current deployment paths

### 1. Static preview (working today)

The app is a pure client bundle, so any static host serves it.

```bash
VITE_BASE=/ VITE_HASH_ROUTER=false npm run build   # root-hosted
```

For a sub-path host, set `VITE_BASE=/<path>/` and `VITE_HASH_ROUTER=true`
(static hosts cannot rewrite deep links to `index.html`).

`public/` assets are **not** rewritten by Vite's `base`; resolve them through
`import.meta.env.BASE_URL` (see the `asset()` helper in `Hero.tsx`).

### 2. GitHub Pages (configured, pending one setting)

`.github/workflows/deploy-finara-pages.yml` builds `finara/` and publishes to Pages
on push. It sets `VITE_BASE` from the Pages base path and enables hash routing.

**Blocked on:** repository *Settings → Pages → Source: GitHub Actions*. The workflow
token cannot enable Pages itself (`Create Pages site failed: Resource not accessible
by integration`). Once enabled, the workflow succeeds unchanged.

Target URL: `https://frankpeter-ani.github.io/trial-website-for-my-portfolio-with-claude/`

## Not yet possible

A production deployment of a *financial* platform requires components that do not
exist yet:

- Supabase project with migrations applied
- Edge Functions deployed (the only writer of financial state)
- Secrets in Supabase secret management, never in the bundle
- RLS verified by automated negative tests
- Provider credentials for a licensed payment/banking partner

Until those exist, only the **sandbox/demo** build may be deployed, and it must be
visibly labelled as such.

## Environment modes

`APP_MODE` ∈ `development | staging | sandbox | production`.

Sandbox must render a persistent indicator and must never present simulated
balances as cleared funds.

## Pre-deploy gate

```bash
npm ci
npm run lint
npx tsc -b            # must be clean
node tests/run-tests.js
npm run build
```
