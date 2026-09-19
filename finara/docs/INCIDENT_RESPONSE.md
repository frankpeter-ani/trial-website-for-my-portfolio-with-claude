# Finara Platform — Incident Response Plan

## Security & Operational Severity Levels

### Severity 1 — Critical (Data Breach / Unbalanced Ledger / Ransomware)
- **Response Time**: < 15 minutes.
- **Action**:
  1. Trigger platform emergency freeze via `adminTogglePlatformFreeze()`.
  2. Rotate database passwords and Supabase service role keys.
  3. Notify compliance officers and engineering leads.
  4. Perform ledger reconciliation audit.

### Severity 2 — High (Provider Downtime / KYC Webhook Delays)
- **Response Time**: < 1 hour.
- **Action**: Switch payment/KYC provider adapter to fallback sandbox mode.
