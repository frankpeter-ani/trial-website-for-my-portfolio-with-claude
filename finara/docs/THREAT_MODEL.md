# Finara — Threat Model

> Status: **Phase 0 baseline.** Each threat lists the *current* exposure and the
> planned mitigation. "Current" is honest, not aspirational.

Assets: customer funds (sandbox), customer PII, KYC documents, credentials,
provider secrets, the ledger, the audit trail.

Trust boundaries: browser (untrusted) → Supabase RLS → Edge Functions
(service role) → external providers.

| # | Threat | Current exposure | Mitigation |
|---|---|---|---|
| T-1 | Privilege escalation | **Open.** `login('admin')` grants admin with no check | Server-verified roles; RBAC tables; RLS on role assignment; no client role writes |
| T-2 | Broken object-level auth (IDOR) | **Open.** Admin page reads all users from browser state | RLS scoping every row to `auth.uid()`; negative tests per table |
| T-3 | Client tampering with balances | **Open.** `localStorage` edit changes balance | Ledger in Postgres; browser has no write path |
| T-4 | Double spending / race | **Open.** No locking, no atomicity | Single DB transaction, row locks, balance check inside the transaction |
| T-5 | Replay / duplicate submission | **Open.** No idempotency | Unique idempotency key per money movement |
| T-6 | Webhook forgery | N/A — no webhooks | HMAC signature verification, replay window, event-id dedupe |
| T-7 | Credential theft | Partial. Supabase Auth exists but unused | Supabase Auth only; no custom password storage; MFA for privileged roles |
| T-8 | Session hijacking | **Open.** Session is a `localStorage` JSON blob | Supabase session handling, expiry, device/session registry |
| T-9 | KYC document exposure | N/A — no uploads | Private buckets, short-lived signed URLs, no public paths |
| T-10 | Secret exposure | Partial. `.env` was un-ignored (fixed) | Service-role keys server-side only; `.env.example` placeholders; secret scanning |
| T-11 | XSS | Low. React escapes by default; no `dangerouslySetInnerHTML` found | Keep it that way; CSP |
| T-12 | SQL injection | N/A — no SQL from client | Parameterised queries; no string-built SQL in functions |
| T-13 | Audit tampering | **Open.** Log is a browser array | Append-only table; no `UPDATE`/`DELETE` grant to admins |
| T-14 | Negative / zero amounts | **Open.** No validation found | `CHECK (amount > 0)`; server-side validation |
| T-15 | Insider threat | **Open.** No least privilege | Granular permissions, dual authorisation on sensitive actions, audit |
| T-16 | Rate abuse | **Open.** None | Server-side limits on auth, transfers, uploads, webhooks |
| T-17 | Supply chain | Unmeasured | `npm audit` in CI; lockfile committed; minimal deps |
| T-18 | Error leakage | Unmeasured | Coded errors to client, detail to server logs |

## Deliberate non-goals

Finara is not a licensed institution. The threat model assumes a regulated provider
holds and moves actual funds. Risks arising from *being* the ledger of record for
real money are out of scope until that boundary is defined.
