-- ====================================================================
-- 0006 — ROW LEVEL SECURITY
-- ====================================================================
-- Default deny. Every table below is RLS-enabled; a table with RLS on and
-- no matching policy returns nothing and accepts nothing. Customers get a
-- narrow READ slice of their own rows and essentially no write path into
-- anything financial. All financial writes go through server-side code
-- holding the service role, which bypasses RLS by design.

alter table profiles                   enable row level security;
alter table organizations              enable row level security;
alter table organization_members       enable row level security;
alter table roles                      enable row level security;
alter table permissions                enable row level security;
alter table role_permissions           enable row level security;
alter table user_roles                 enable row level security;
alter table currencies                 enable row level security;
alter table accounts                   enable row level security;
alter table account_balances           enable row level security;
alter table ledger_accounts            enable row level security;
alter table ledger_journals            enable row level security;
alter table ledger_entries             enable row level security;
alter table transactions               enable row level security;
alter table transaction_status_history enable row level security;
alter table idempotency_keys           enable row level security;

-- --------------------------------------------------------------------
-- Reference data: readable by any authenticated user, writable by nobody.
-- --------------------------------------------------------------------
create policy currencies_read on currencies
  for select to authenticated using (true);
create policy roles_read on roles
  for select to authenticated using (auth_is_staff());
create policy permissions_read on permissions
  for select to authenticated using (auth_is_staff());
create policy role_permissions_read on role_permissions
  for select to authenticated using (auth_is_staff());

-- --------------------------------------------------------------------
-- Profiles: read and update your own; staff with users.read may read all.
-- Column protection is a trigger, since RLS cannot scope columns.
-- --------------------------------------------------------------------
create policy profiles_read_own on profiles
  for select to authenticated
  using (id = auth.uid() or auth_has_permission('users.read'));

create policy profiles_update_own on profiles
  for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

-- A customer may edit presentation fields only. Everything that grants
-- standing (kyc/account status) or identity is rejected here, so no
-- request shape can escalate via mass assignment.
create or replace function profiles_guard_privileged_columns()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if auth.uid() is null then          -- server-side/service role
    return new;
  end if;
  if auth_has_permission('users.update') then
    return new;
  end if;
  if new.id            is distinct from old.id
  or new.email         is distinct from old.email
  or new.kyc_status    is distinct from old.kyc_status
  or new.account_status is distinct from old.account_status
  or new.created_at    is distinct from old.created_at then
    raise exception 'not permitted to modify privileged profile fields'
      using errcode = 'insufficient_privilege';
  end if;
  return new;
end;
$$;

create trigger profiles_guard_columns before update on profiles
  for each row execute function profiles_guard_privileged_columns();

-- --------------------------------------------------------------------
-- Roles: you may SEE your own grants. You may never write any grant.
-- There is deliberately no INSERT/UPDATE/DELETE policy on user_roles, so
-- self-promotion is impossible through PostgREST at any request shape.
-- --------------------------------------------------------------------
create policy user_roles_read_own on user_roles
  for select to authenticated
  using (user_id = auth.uid() or auth_has_permission('roles.manage'));

-- --------------------------------------------------------------------
-- Organizations
-- --------------------------------------------------------------------
create policy organizations_read_member on organizations
  for select to authenticated
  using (
    auth_is_staff()
    or exists (select 1 from organization_members m
               where m.organization_id = organizations.id and m.user_id = auth.uid())
  );
create policy organization_members_read on organization_members
  for select to authenticated
  using (user_id = auth.uid() or auth_is_staff());

-- --------------------------------------------------------------------
-- Accounts and balances: READ your own. No customer write path at all.
-- --------------------------------------------------------------------
create policy accounts_read_own on accounts
  for select to authenticated
  using (user_id = auth.uid() or auth_has_permission('users.read'));

create policy account_balances_read_own on account_balances
  for select to authenticated
  using (
    exists (select 1 from accounts a
            where a.id = account_balances.account_id
              and (a.user_id = auth.uid() or auth_has_permission('users.read')))
  );

-- --------------------------------------------------------------------
-- Ledger: staff-read only. Customers never touch the ledger directly;
-- they see the derived transaction list instead.
-- --------------------------------------------------------------------
create policy ledger_accounts_read_staff on ledger_accounts
  for select to authenticated using (auth_has_permission('transactions.read'));
create policy ledger_journals_read_staff on ledger_journals
  for select to authenticated using (auth_has_permission('transactions.read'));
create policy ledger_entries_read_staff on ledger_entries
  for select to authenticated using (auth_has_permission('transactions.read'));

-- --------------------------------------------------------------------
-- Transactions: read your own. Creation and status changes happen in
-- server-side functions, so there is no customer INSERT or UPDATE policy.
-- --------------------------------------------------------------------
create policy transactions_read_own on transactions
  for select to authenticated
  using (user_id = auth.uid() or auth_has_permission('transactions.read'));

create policy tsh_read_own on transaction_status_history
  for select to authenticated
  using (
    exists (select 1 from transactions t
            where t.id = transaction_status_history.transaction_id
              and (t.user_id = auth.uid() or auth_has_permission('transactions.read')))
  );

-- idempotency_keys: no policy at all. Service role only, by design.

comment on policy transactions_read_own on transactions is
  'Read-only. There is no customer INSERT/UPDATE policy: money moves only '
  'through server-side code that validates, posts a balanced journal and audits.';
