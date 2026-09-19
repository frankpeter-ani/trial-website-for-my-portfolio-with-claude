# Finara Digital Banking Platform — Security Policy & Guidelines

## 1. Security Principles
- **Least Privilege Access**: Users and microservices are granted minimum permissions required to perform their functions.
- **Zero Client-Side Trust**: Client applications are treated as untrusted. All input validation, fee calculations, status checks, and privilege verifications occur server-side.
- **Row Level Security (RLS)**: Enforced across 100% of customer tables in Supabase PostgreSQL.

---

## 2. Authentication & Session Management
- **Supabase Auth**: Managed JWT tokens with short lifespan and secure refresh token rotation.
- **Multi-Factor Authentication (MFA)**: TOTP-based 2FA mandatory for privileged roles (`administrator`, `finance_operator`, `compliance_officer`).
- **Security Log Events**: Logins, failed attempts, password changes, MFA updates, and IP changes are recorded in `security_events`.

---

## 3. Financial Transaction Security
- **Idempotency**: All transfer requests require an `Idempotency-Key` or unique reference UUID. Duplicate submissions return existing results without re-executing money movement.
- **Transaction State Machine**: Invalid state transitions (e.g. `completed` $\rightarrow$ `initiated`) are blocked at database constraints level.
- **Anti-Double Spending**: Database pessimistic locking (`SELECT FOR UPDATE`) prevents concurrent balance over-drafting.

---

## 4. Data Protection & File Security
- **KYC & Sensitive Storage**: Identity documents are stored in private Supabase Storage buckets with strict RLS policies. Signed URLs with short expiration (< 15 mins) are required for access.
- **Secrets Management**: Service keys, API credentials, and webhooks keys are stored strictly in environment variables and never bundled in client code.
