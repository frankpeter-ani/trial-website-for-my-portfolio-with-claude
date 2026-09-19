# Finara — Database

> Status: **Phase 0 baseline audit.**

## Current state

`supabase/migrations/` contains 7 ordered SQL files declaring **19 tables**:

```
accounts              kyc_documents         risk_events
audit_logs            kyc_profiles          risk_rules
card_controls         ledger_accounts       savings_goals
cards                 ledger_entries        transaction_status_history
exchange_rates        organization_members  transactions
organizations         profiles              wallets
                      webhook_events
```

Plus `supabase/schema.sql`, a separate 7.5 KB snapshot that is **not** part of the
migration sequence and may drift from it.

### What is good

- Monetary columns are `NUMERIC(15,2)` (and `NUMERIC(15,6)` for rates) — correct
  choice, exact decimal, not `float`/`double precision`.
- A `ledger_accounts` / `ledger_entries` pair exists, so double-entry was intended.
- 9 `ENABLE ROW LEVEL SECURITY` statements and 10 `CREATE POLICY` statements exist.

### What is missing or wrong

- **Never applied.** No evidence any of this ran against a live database.
- **Nothing reads it.** No application code queries these tables.
- **RLS is thin.** 10 policies across 19 tables. Most tables have no policy, and
  an RLS-enabled table with no policy denies everything — so the app would break
  the moment it did connect.
- **One function total.** All money movement logic would have to live in the client
  or in Edge Functions that do not exist.
- **No ledger balance constraint.** Nothing enforces `SUM(debits) = SUM(credits)`
  at the database level.
- **No idempotency table or unique constraint** on transaction references.
- **Index coverage unverified.**
- ~56 of the tables required by the brief do not exist yet.

## Target design principles

1. **The ledger is the source of truth.** No authoritative `balance` column.
   Balances are derived, or maintained as a materialised projection that is
   reconcilable against the ledger and never written directly by a client.
2. **Every financial mutation is one atomic database transaction** that writes
   balanced ledger entries, updates the projection, records status history, and
   emits an audit row — or rolls back entirely.
3. **`NUMERIC` everywhere for money.** Never `float8`. Currency is explicit on every
   monetary row; a ledger entry may never mix currencies.
4. **Idempotency is a unique constraint**, not application logic.
5. **RLS default-deny.** Enable on every customer-facing table, then grant the
   narrowest readable slice. Customers never get `UPDATE` on financial tables.
6. **Privileged writes go through `SECURITY DEFINER` functions or Edge Functions**
   holding the service role — never from the browser.

## Environment status (blocking)

| Project | Ref | Status | Usable? |
|---|---|---|---|
| Configured in `.env` | `vlvgnytevonpklupdtpr` | unreachable from this environment (proxy `403`), not in the connected Supabase account | **No** |
| `vevv` | `onpnfqafvbytedxnhqxn` | `ACTIVE_HEALTHY` | **No — in use by a different app** |
| `bevv` | `tsyfktcekcbjkrtbkmvf` | `INACTIVE` | unknown |
| `bluecliqq-cpu's Project` | `knzkrfatqsbbiennxqgl` | `INACTIVE` | unknown |

`vevv` already contains a live, unrelated investment application
(`holdings`, `investments`, `payouts`, `position_credits`, 15 transactions,
4 profiles) with colliding table names (`profiles`, `transactions`, `deposits`,
`withdrawals`). Applying the Finara schema there would corrupt a working system.

**A database target must be chosen before any migration can be applied.**
Schema authoring proceeds regardless; only execution is blocked.
