-- ====================================================================
-- 0001 — FOUNDATION: extensions, conventions, currencies
-- ====================================================================
-- Conventions used throughout this schema:
--   * money is NUMERIC(23,4) — exact decimal, never float8. Paired with an
--     explicit currency column; a row never implies a currency.
--   * rates are NUMERIC(20,10).
--   * ids are uuid; timestamps are timestamptz, always UTC.
--   * every customer-facing table is RLS-enabled in 0020 and is default-deny
--     until a policy grants a narrow slice.

create extension if not exists pgcrypto;   -- gen_random_uuid()
create extension if not exists citext;     -- case-insensitive email

-- Money domain: one place to change precision, and a name that documents intent.
create domain money_amount as numeric(23,4);
create domain fx_rate      as numeric(20,10);

-- Shared updated_at trigger.
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- --------------------------------------------------------------------
-- Currencies are data, not hard-coded branches (mirrors src/lib/money).
-- --------------------------------------------------------------------
create table currencies (
  code          text primary key check (code ~ '^[A-Z]{3}$'),
  exponent      smallint not null check (exponent between 0 and 4),
  symbol        text     not null,
  name          text     not null,
  is_active     boolean  not null default true,
  created_at    timestamptz not null default now()
);

insert into currencies (code, exponent, symbol, name) values
  ('USD', 2, '$', 'US Dollar'),
  ('EUR', 2, '€', 'Euro'),
  ('GBP', 2, '£', 'Pound Sterling'),
  ('NGN', 2, '₦', 'Nigerian Naira');

comment on domain money_amount is
  'Exact decimal monetary value. Never float. Always accompanied by a currency column.';
