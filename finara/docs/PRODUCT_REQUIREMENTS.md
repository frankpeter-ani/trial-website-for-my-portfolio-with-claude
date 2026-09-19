# Finara — Product Requirements

## What Finara is

A digital banking / fintech **platform application**: the customer experience,
operational tooling, ledger, and compliance workflow around money movement.

## What Finara is not

Not a bank. Not a licensed money transmitter. It holds no funds and settles nothing.
Actual movement of money is delegated to licensed providers through adapters.

This distinction is a product requirement, not a disclaimer. The UI must never
present a simulated balance as cleared funds, and the system must never ask a
customer for a payment in order to release, unlock, or verify a balance.

## Users

| Role | Needs |
|---|---|
| Customer | See balances, move money, manage cards, save toward goals, complete KYC, get receipts |
| Support agent | Look up a customer, read tickets, see transaction status — no financial mutation |
| KYC reviewer | Work a review queue, approve/reject with reasons |
| Compliance officer | Cases, monitoring, reporting |
| Finance operator | Reconciliation, controlled adjustments |
| Risk analyst | Rules, alerts, dispositions |
| Administrator / super admin | User management, configuration, roles |

## Functional scope

Customer: auth + MFA, profile, KYC, wallets, multi-currency accounts, deposits,
withdrawals, internal and external transfers, beneficiaries, transaction history
and search, receipts, cards and card controls, savings goals, analytics,
notifications, security settings, support.

Admin: operational dashboard, user management, KYC queue, transaction centre,
transfers/deposits/withdrawals queues, cards, risk engine, compliance cases,
audit logs, reporting and export, system settings, feature flags, webhooks,
provider integrations, document management.

## Non-functional requirements

- **Integrity first.** Transaction correctness outranks convenience and speed.
- **Every feature is full-stack**: UI + validation + schema + authorization +
  server logic + errors + audit + tests. A screen without a server path is not done.
- **Derived money, never asserted money.** Balances come from the ledger.
- **Default deny.** New tables are RLS-enabled with no policy until one is justified.
- **Responsive and accessible** on desktop, tablet, mobile — including admin.
- **Server-side pagination** everywhere; never load unbounded transaction sets.

## Design direction

Preserve the existing visual identity: near-white `#F7F6F5` canvas, black type,
`#FFFF00` accent, Geist + Roboto Mono, rounded panels, subtle borders, minimal
shadow, high information density. Improve usability without redesigning.

## Acceptance

A feature is complete when a hostile client cannot corrupt it: balances cannot be
edited, another customer's data cannot be read, a duplicate request cannot move
money twice, and every privileged action leaves an audit record the actor cannot
alter.
