-- ====================================================================
-- 0005 — TRANSACTIONS, IDEMPOTENCY, STATE MACHINE
-- ====================================================================

create type transaction_status as enum (
  'initiated','pending','processing','completed','failed',
  'cancelled','reversed','refunded','requires_review','blocked'
);

create type transaction_type as enum (
  'internal_transfer','bank_transfer','deposit','withdrawal',
  'currency_exchange','fee','reversal','refund','adjustment'
);

create table transactions (
  id              uuid primary key default gen_random_uuid(),
  reference       text not null unique,
  user_id         uuid not null references profiles(id) on delete restrict,
  type            transaction_type not null,
  status          transaction_status not null default 'initiated',
  currency        text not null references currencies(code),
  amount          money_amount not null check (amount > 0),
  fee             money_amount not null default 0 check (fee >= 0),
  total           money_amount not null check (total > 0),
  source_account_id      uuid references accounts(id),
  destination_account_id uuid references accounts(id),
  counterparty    jsonb not null default '{}'::jsonb,
  provider        text,
  provider_reference text,
  risk_score      smallint check (risk_score between 0 and 100),
  description     text not null default '',
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  completed_at    timestamptz,
  constraint transactions_total_is_amount_plus_fee check (total = amount + fee),
  -- A transfer must move between two distinct accounts.
  constraint transactions_distinct_accounts
    check (source_account_id is null or destination_account_id is null
           or source_account_id <> destination_account_id)
);
create trigger transactions_updated_at before update on transactions
  for each row execute function set_updated_at();

create index transactions_user_id_created_idx on transactions (user_id, created_at desc);
create index transactions_status_idx on transactions (status);
create index transactions_type_idx on transactions (type);
create index transactions_currency_idx on transactions (currency);
create index transactions_created_at_idx on transactions (created_at desc);
create index transactions_source_account_idx on transactions (source_account_id);
create index transactions_destination_account_idx on transactions (destination_account_id);
create unique index transactions_provider_reference_idx
  on transactions (provider, provider_reference)
  where provider_reference is not null;

alter table ledger_journals
  add constraint ledger_journals_transaction_fk
  foreign key (transaction_id) references transactions(id) on delete restrict;

-- --------------------------------------------------------------------
-- Idempotency. The unique constraint IS the mechanism — a replayed request
-- fails to insert and the caller returns the stored original response.
-- Not application logic that can be forgotten.
-- --------------------------------------------------------------------
create table idempotency_keys (
  key             text primary key check (length(key) between 8 and 128),
  user_id         uuid not null references profiles(id) on delete cascade,
  operation       text not null,
  -- Hash of the request body. A replay with the SAME key but DIFFERENT
  -- parameters is a client bug and must be rejected, not silently served.
  request_hash    text not null,
  transaction_id  uuid references transactions(id),
  response_status smallint,
  response_body   jsonb,
  state           text not null default 'in_progress'
                  check (state in ('in_progress','succeeded','failed')),
  created_at      timestamptz not null default now(),
  completed_at    timestamptz,
  expires_at      timestamptz not null default now() + interval '24 hours'
);
create index idempotency_keys_user_idx on idempotency_keys (user_id);
create index idempotency_keys_expires_idx on idempotency_keys (expires_at);

-- --------------------------------------------------------------------
-- Status history — append-only, one row per transition.
-- --------------------------------------------------------------------
create table transaction_status_history (
  id              uuid primary key default gen_random_uuid(),
  transaction_id  uuid not null references transactions(id) on delete restrict,
  previous_status transaction_status,
  new_status      transaction_status not null,
  actor_id        uuid references profiles(id),
  actor_kind      text not null default 'system'
                  check (actor_kind in ('customer','staff','system','provider')),
  reason          text not null default '',
  correlation_id  uuid,
  metadata        jsonb not null default '{}'::jsonb,
  created_at      timestamptz not null default now()
);
create index tsh_transaction_idx on transaction_status_history (transaction_id, created_at);

create trigger tsh_no_update before update on transaction_status_history
  for each row execute function ledger_forbid_mutation();
create trigger tsh_no_delete before delete on transaction_status_history
  for each row execute function ledger_forbid_mutation();

-- --------------------------------------------------------------------
-- The state machine, enforced in the database rather than trusted to callers.
-- --------------------------------------------------------------------
create or replace function transaction_transition_allowed(
  p_from transaction_status, p_to transaction_status
) returns boolean
language sql
immutable
as $$
  select case p_from
    when 'initiated'       then p_to in ('pending','cancelled','failed','blocked','requires_review')
    when 'pending'         then p_to in ('processing','cancelled','failed','blocked','requires_review')
    when 'processing'      then p_to in ('completed','failed','requires_review')
    when 'requires_review' then p_to in ('processing','blocked','cancelled','failed')
    when 'completed'       then p_to in ('reversed','refunded')
    when 'blocked'         then p_to in ('cancelled','requires_review')
    -- terminal
    when 'failed'    then false
    when 'cancelled' then false
    when 'reversed'  then false
    when 'refunded'  then false
    else false
  end;
$$;

create or replace function transactions_enforce_transition()
returns trigger
language plpgsql
as $$
begin
  if new.status is distinct from old.status
     and not transaction_transition_allowed(old.status, new.status) then
    raise exception 'illegal transaction transition % -> % for %',
      old.status, new.status, old.id
      using errcode = 'integrity_constraint_violation';
  end if;

  if new.status = 'completed' and new.completed_at is null then
    new.completed_at := now();
  end if;

  -- Record every transition without relying on the caller to remember.
  if new.status is distinct from old.status then
    insert into transaction_status_history
      (transaction_id, previous_status, new_status, actor_id, actor_kind, reason)
    values
      (new.id, old.status, new.status, auth.uid(),
       case when auth.uid() is null then 'system' else 'customer' end,
       coalesce(new.metadata->>'transition_reason', ''));
  end if;

  return new;
end;
$$;

create trigger transactions_transition before update on transactions
  for each row execute function transactions_enforce_transition();

comment on function transaction_transition_allowed is
  'Single source of truth for the transaction state machine. Mirrored in '
  'src/services/transactionState.ts and covered by tests.';
