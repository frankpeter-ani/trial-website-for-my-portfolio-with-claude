# Finara Platform — Threat Model & Security Mitigations

## Threat Matrix & Safeguards

| Threat Vector | Attack Scenario | Impact | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Balance Mutation (IDOR)** | User sends POST payload directly mutating wallet balance | Critical | Client balance writes strictly prohibited. Balances computed via server-side double-entry ledger. |
| **Double Spending / Replay** | Rapid submission of transfer API requests | High | Idempotency keys enforced per transaction reference UUID + database `SELECT FOR UPDATE` locks. |
| **Privilege Escalation** | Customer attempts accessing `/admin/users` or calling admin RPC | Critical | Supabase RLS enforces `public.is_admin()` checks at PostgreSQL policy level. |
| **Webhook Spoofing** | Attacker posts fake deposit webhooks to unlock funds | Critical | HMAC SHA-256 signature verification required on all incoming webhooks. Unsigned payloads rejected. |
| **KYC File Exfiltration** | Attacker accesses direct bucket URL for passport scans | High | Private Supabase Storage bucket with RLS policies. Access granted via short-lived (< 15 min) signed URLs. |
| **Float Precision Loss** | IEEE-754 rounding creates fractional cent leakage | Medium | PostgreSQL `NUMERIC` types + Central `DecimalMath` engine (`src/lib/money.ts`). |
