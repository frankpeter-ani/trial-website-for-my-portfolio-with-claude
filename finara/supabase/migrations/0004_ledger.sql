-- ====================================================================
-- 0004 — IMMUTABLE DOUBLE-ENTRY LEDGER
-- ====================================================================
-- The ledger is the source of truth for money. It is append-only: there is
-- no UPDATE or DELETE path for anyone, including super_admin. A mistake is
-- corrected by posting a reversing journal, never by editing history.

create type ledger_direction as enum ('debit','credit');

create type ledger_account_kind as enum (
  'asset','liability','equity','revenue','expense'
);

-- Chart of accounts. Customer wallets map to liability accounts (the platform
-- owes the customer); provider settlement accounts are assets.
create table ledger_accounts (
  code         text primary key check (code ~ '^[0-9]{4}-[A-Z0-9-]+$'),
  kind         ledger_account_kind not null,
  currency     text not null references currencies(code),
  name         text not null,
  -- Set for per-customer wallet accounts; null for platform accounts.
  account_id   uuid references accounts(id) on delete restrict,
  is_active    boolean not null default true,
  created_at   timestamptz not null default now()
);
create index ledger_accounts_account_id_idx on ledger_accounts (account_id);

insert into ledger_accounts (code, kind, currency, name) values
  ('1010-SETTLEMENT-USD','asset','USD','Provider settlement USD'),
  ('1010-SETTLEMENT-EUR','asset','EUR','Provider settlement EUR'),
  ('1010-SETTLEMENT-GBP','asset','GBP','Provider settlement GBP'),
  ('1010-SETTLEMENT-NGN','asset','NGN','Provider settlement NGN'),
  ('4010-FEE-REVENUE-USD','revenue','USD','Fee revenue USD'),
  ('4010-FEE-REVENUE-EUR','revenue','EUR','Fee revenue EUR'),
  ('4010-FEE-REVENUE-GBP','revenue','GBP','Fee revenue GBP'),
  ('4010-FEE-REVENUE-NGN','revenue','NGN','Fee revenue NGN'),
  ('3010-FX-BRIDGE-USD','equity','USD','FX bridge USD'),
  ('3010-FX-BRIDGE-EUR','equity','EUR','FX bridge EUR'),
  ('3010-FX-BRIDGE-GBP','equity','GBP','FX bridge GBP'),
  ('3010-FX-BRIDGE-NGN','equity','NGN','FX bridge NGN');

-- --------------------------------------------------------------------
-- A journal is one balanced posting. Entries belong to exactly one journal.
-- --------------------------------------------------------------------
create table ledger_journals (
  id              uuid primary key default gen_random_uuid(),
  transaction_id  uuid,                       -- FK added in 0005
  currency        text not null references currencies(code),
  entry_type      text not null,
  description     text not null default '',
  -- Reversal linkage: a correcting journal points at what it reverses.
  reverses_journal_id uuid references ledger_journals(id),
  posted_at       timestamptz not null default now(),
  posted_by       uuid references profiles(id),
  metadata        jsonb not null default '{}'::jsonb
);
create index ledger_journals_transaction_id_idx on ledger_journals (transaction_id);
create index ledger_journals_posted_at_idx on ledger_journals (posted_at desc);

create table ledger_entries (
  id            uuid primary key default gen_random_uuid(),
  journal_id    uuid not null references ledger_journals(id) on delete restrict,
  account_code  text not null references ledger_accounts(code) on delete restrict,
  direction     ledger_direction not null,
  amount        money_amount not null,
  currency      text not null references currencies(code),
  created_at    timestamptz not null default now(),
  -- Direction carries the sign; the amount itself is always positive.
  constraint ledger_entries_amount_positive check (amount > 0)
);
create index ledger_entries_journal_id_idx on ledger_entries (journal_id);
create index ledger_entries_account_code_idx on ledger_entries (account_code);
create index ledger_entries_created_at_idx on ledger_entries (created_at desc);

-- --------------------------------------------------------------------
-- Append-only enforcement. Applies to every role, including the service
-- role and table owner, because the trigger runs regardless of privilege.
-- --------------------------------------------------------------------
create or replace function ledger_forbid_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception
    'ledger is append-only: % on % is not permitted. Post a reversing journal instead.',
    tg_op, tg_table_name
    using errcode = 'restrict_violation';
end;
$$;

create trigger ledger_entries_no_update before update on ledger_entries
  for each row execute function ledger_forbid_mutation();
create trigger ledger_entries_no_delete before delete on ledger_entries
  for each row execute function ledger_forbid_mutation();
create trigger ledger_journals_no_update before update on ledger_journals
  for each row execute function ledger_forbid_mutation();
create trigger ledger_journals_no_delete before delete on ledger_journals
  for each row execute function ledger_forbid_mutation();

-- --------------------------------------------------------------------
-- The invariant: debits = credits, per journal, in one currency.
-- Enforced as a CONSTRAINT TRIGGER deferred to COMMIT, so a multi-statement
-- insert is legal mid-transaction but can never commit unbalanced.
-- --------------------------------------------------------------------
create or replace function ledger_assert_balanced()
returns trigger
language plpgsql
as $$
declare
  v_journal uuid := coalesce(new.journal_id, old.journal_id);
  v_debits  money_amount;
  v_credits money_amount;
  v_currencies int;
begin
  select
    coalesce(sum(amount) filter (where direction = 'debit'), 0),
    coalesce(sum(amount) filter (where direction = 'credit'), 0),
    count(distinct currency)
  into v_debits, v_credits, v_currencies
  from ledger_entries where journal_id = v_journal;

  if v_currencies > 1 then
    raise exception 'journal % mixes currencies; use an FX bridge account', v_journal
      using errcode = 'integrity_constraint_violation';
  end if;

  if v_debits <> v_credits then
    raise exception
      'journal % is unbalanced: debits %, credits %', v_journal, v_debits, v_credits
      using errcode = 'integrity_constraint_violation';
  end if;
  return null;
end;
$$;

create constraint trigger ledger_entries_balanced
  after insert on ledger_entries
  deferrable initially deferred
  for each row execute function ledger_assert_balanced();

comment on table ledger_entries is
  'Append-only. UPDATE and DELETE are blocked by trigger for every role. '
  'Balance is enforced at COMMIT by a deferred constraint trigger.';
