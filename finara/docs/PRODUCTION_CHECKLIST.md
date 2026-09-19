# Finara Platform — Production Readiness Checklist

## Production Launch Checklist

- [x] All customer-sensitive tables have active RLS policies.
- [x] Double-entry ledger enforces balance equality (`Debits == Credits`).
- [x] Idempotency keys enforced on transfer API requests.
- [x] MFA enforced for administrative and compliance roles.
- [x] Private Supabase Storage bucket configured for KYC document uploads with short-lived signed URLs.
- [x] Money calculations use exact decimal representation (`src/lib/money.ts`).
- [x] Provider abstractions configured with sandbox fallback.
- [x] Automated unit, integration, and RLS security tests passing.
- [x] `npx tsc --noEmit` exits with 0 errors.
- [x] `npm run build` generates production bundle cleanly.
