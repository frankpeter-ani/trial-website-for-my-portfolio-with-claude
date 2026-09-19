# Finara Platform — Database Schema & Migration Guide

## Overview
Finara uses Supabase PostgreSQL. Schema migrations are located in `/supabase/migrations/`.

---

## Entity Relationship Summary

```
                      +-------------------+
                      |   auth.users      |
                      +---------+---------+
                                |
                                v
                      +-------------------+
                      |    profiles       |
                      +---------+---------+
                                |
            +-------------------+-------------------+
            |                   |                   |
            v                   v                   v
   +-----------------+  +---------------+  +------------------+
   |    accounts     |  | kyc_profiles  |  |   beneficiaries  |
   +--------+--------+  +---------------+  +------------------+
            |
            v
   +-----------------+
   |    wallets      |
   +--------+--------+
            |
            v
   +-----------------+
   | ledger_accounts |
   +--------+--------+
            |
            v
   +-----------------+
   | ledger_entries  |
   +-----------------+
```

---

## Table Classifications

### Core Identity & RBAC
- `profiles`: Core user attributes, roles, and verification status.
- `roles` & `permissions`: RBAC matrix (`customer`, `support_agent`, `kyc_reviewer`, `compliance_officer`, `finance_operator`, `administrator`).
- `user_roles`: Mapping between users and administrative roles.

### Financial Engine & Ledger
- `accounts`: Financial accounts linked to currency types (`USD`, `EUR`, `GBP`, `NGN`).
- `wallets`: Multi-currency customer balances.
- `ledger_accounts`: Double-entry chart of accounts (Assets, Liabilities, Equity, Revenue, Expense).
- `ledger_entries`: Double-entry debits and credits (`entry_type IN ('debit', 'credit')`).
- `transactions`: High-level transfer & deposit ledger entries.
- `transaction_status_history`: Audit record of state machine transitions.

### Compliance & Risk
- `kyc_profiles` & `kyc_documents`: KYC submission metadata and secure storage references.
- `risk_rules` & `risk_events`: Real-time risk evaluation records.
- `audit_logs`: Immutable security and administrative actions log.
