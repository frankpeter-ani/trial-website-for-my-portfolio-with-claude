# Finara Digital Banking Platform — Architecture Specification

## Executive Overview
Finara is built as an enterprise-grade digital banking and fintech application. The architecture enforces strict separation of concerns, immutable double-entry accounting, server-side financial business logic, zero client-side balance mutations, and provider integration boundaries for regulated financial execution.

---

## High-Level System Architecture

```
                                    +-----------------------------------+
                                    |     Client Web Application        |
                                    | (React 19 + TypeScript + Tailwind)|
                                    +-----------------+-----------------+
                                                      |
                                       HTTPS / WSS    |   JWT Bearer / RLS
                                                      v
                                    +-----------------------------------+
                                    |       Supabase Platform API       |
                                    | Auth / PostgREST / Storage / Edge |
                                    +-----------------+-----------------+
                                                      |
                                                      v
                                    +-----------------------------------+
                                    |      PostgreSQL Database          |
                                    | Double-Entry Ledger, RLS, Triggers|
                                    +-----------------+-----------------+
                                                      |
                                                      v
                                    +-----------------------------------+
                                    |     Provider Adapters Layer       |
                                    |  (Payment, KYC, Cards, Transfers) |
                                    +-----------------------------------+
```

---

## Core Architectural Pillars

### 1. Dual-Application Boundaries
- **Customer Application**: Exposes `/dashboard`, `/cards`, `/analytics`, `/wallet`, `/transactions`, `/send`, `/receive`, `/deposit`, `/withdraw`, `/beneficiaries`, `/savings`, `/profile`, `/security`, `/kyc`, `/notifications`, `/support`, `/settings`.
- **Admin & Operations Suite**: Exposes `/admin/dashboard`, `/admin/users`, `/admin/kyc`, `/admin/accounts`, `/admin/wallets`, `/admin/transactions`, `/admin/transfers`, `/admin/deposits`, `/admin/withdrawals`, `/admin/cards`, `/admin/audit-logs`, `/admin/risk`, `/admin/compliance`, `/admin/reports`, `/admin/settings`, `/admin/system`, `/admin/webhooks`, `/admin/integrations`.
- **Authorization Separation**: Frontend routes enforce authentication and role checks, backed by database Row Level Security (RLS) policies and PostgreSQL helper functions (`is_admin()`, `has_permission()`).

---

### 2. Double-Entry Accounting Ledger
- **Authoritative Ledger Engine**: Money is never stored solely as a simple balance column. Financial movements are represented as balanced debits and credits in `ledger_entries`.
- **Invariance Rule**: For every transaction $T$:
  $$\sum \text{Debits} = \sum \text{Credits}$$
- **Atomic Database Transactions**: Balances are updated via PostgreSQL atomic transactions (`BEGIN ... COMMIT`). Failed operations trigger a complete `ROLLBACK`.

---

### 3. Financial Precision & Anti-Floating Point Engine
- All monetary operations (amounts, fees, exchange rates, balances) use PostgreSQL `NUMERIC(15, 2)` or `NUMERIC(15, 4)` and string/integer-based decimal arithmetic (`src/lib/money.ts`).
- JavaScript IEEE-754 floating-point arithmetic is strictly prohibited for monetary calculations.

---

### 4. Provider Integration Boundaries
- Internal ledger balances represent sandbox account states until integrated with regulated payment networks (e.g., Stripe, Plaid, Circle, Persona, Marqeta).
- Interfaces (`PaymentProvider`, `BankTransferProvider`, `CardProvider`, `KYCProvider`, `FXProvider`) decouple the core banking domain from specific third-party APIs.
