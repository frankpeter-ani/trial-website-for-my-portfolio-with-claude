-- ====================================================================
-- 0003 — ACCOUNTS & WALLETS
-- ====================================================================
-- An account is a customer-facing container in exactly one currency.
-- Its balance is NOT authoritative: it is a projection of the ledger,
-- maintained only by server-side code and reconcilable at any time.

create table accounts (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references profiles(id) on delete restrict,
  currency       text not null references currencies(code),
  account_type   text not null default 'wallet'
                 check (account_type in ('wallet','savings','settlement')),
  display_name   text not null default '',
  -- Human-facing reference. Unique, opaque, not derived from the user id.
  reference      text not null unique,
  status         text not null default 'active'
                 check (status in ('active','frozen','closed')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- One wallet per currency per user; savings accounts may repeat.
  constraint accounts_one_wallet_per_currency
    exclude (user_id with =, currency with =) where (account_type = 'wallet')
);
create trigger accounts_updated_at before update on accounts
  for each row execute function set_updated_at();

create index accounts_user_id_idx on accounts (user_id);
create index accounts_currency_idx on accounts (currency);
create index accounts_status_idx on accounts (status) where status <> 'active';

-- --------------------------------------------------------------------
-- Balance projection. Derived, never asserted.
--   available = posted - held
-- A negative available balance is impossible for customer wallets and the
-- CHECK enforces it at the storage layer, not just in application code.
-- --------------------------------------------------------------------
create table account_balances (
  account_id     uuid primary key references accounts(id) on delete cascade,
  currency       text not null references currencies(code),
  posted         money_amount not null default 0,
  held           money_amount not null default 0,
  available      money_amount generated always as (posted - held) stored,
  -- Monotonic counter bumped on every mutation; lets reconciliation and
  -- optimistic callers detect a concurrent change.
  version        bigint not null default 0,
  updated_at     timestamptz not null default now(),
  constraint account_balances_held_non_negative check (held >= 0),
  constraint account_balances_no_overdraft      check (posted - held >= 0)
);

comment on table account_balances is
  'Projection of the ledger. Written only by server-side functions; customers '
  'have no UPDATE path (see 0020). Must reconcile against ledger_entries.';
comment on column account_balances.available is
  'Generated: posted - held. Cannot drift from its inputs.';
