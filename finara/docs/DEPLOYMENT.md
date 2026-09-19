# Finara Platform — Production Deployment Guide

## Production Deployment Workflow

### 1. Database Migrations Execution
Apply sequential migrations to your production Supabase database:
```bash
supabase db push --linked
```
Or execute SQL files sequentially in the Supabase SQL Editor:
1. `001_initial_schema.sql`
2. `002_double_entry_ledger.sql`
3. `003_kyc_and_documents.sql`
4. `004_cards_and_controls.sql`
5. `005_savings_and_multi_currency.sql`
6. `006_risk_audit_webhooks.sql`
7. `007_rls_and_rbac_policies.sql`

### 2. Production Environment Variables
Configure the following secrets in your deployment provider (Vercel / Netlify / AWS Amplify):
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `APP_MODE=production`

### 3. Build & Optimization Verification
```bash
npm run build
```
Verify that `dist/index.html` builds without bundle warnings or missing dependencies.
