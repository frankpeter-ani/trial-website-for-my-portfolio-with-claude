# Finara Platform — Backup & Disaster Recovery Policy

## Backup Schedule & Strategy
- **Point-In-Time Recovery (PITR)**: Supabase Pro WAL logs enabled with 7-day continuous PITR.
- **Daily Automated Snapshots**: Daily automated physical backups stored in geographically redundant S3 storage buckets.
- **Ledger Verification Job**: Daily reconciliation script ensuring total debits equals total credits across all account balances.
