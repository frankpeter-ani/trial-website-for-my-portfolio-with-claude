-- ====================================================================
-- 0002 — IDENTITY & RBAC
-- ====================================================================
-- Authoritative identity lives in auth.users (Supabase Auth). `profiles`
-- extends it. Roles are NEVER a column on the profile the user can reach —
-- they are rows in user_roles, writable only by privileged server code.

create table profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         citext not null unique,
  full_name     text   not null default '',
  phone         text,
  avatar_url    text,
  -- Lifecycle of the customer relationship, not of money.
  account_status text not null default 'pending'
                 check (account_status in ('pending','active','suspended','closed')),
  -- Denormalised KYC status for display. Source of truth is kyc_profiles.
  -- Customers can never write this column (see 0020).
  kyc_status    text not null default 'not_started',
  locale        text not null default 'en-US',
  timezone      text not null default 'UTC',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger profiles_updated_at before update on profiles
  for each row execute function set_updated_at();

create table organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        citext not null unique,
  status      text not null default 'active' check (status in ('active','suspended')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger organizations_updated_at before update on organizations
  for each row execute function set_updated_at();

create table organization_members (
  organization_id uuid not null references organizations(id) on delete cascade,
  user_id         uuid not null references profiles(id) on delete cascade,
  member_role     text not null default 'member' check (member_role in ('owner','admin','member')),
  created_at      timestamptz not null default now(),
  primary key (organization_id, user_id)
);

-- --------------------------------------------------------------------
-- Roles and granular permissions.
-- --------------------------------------------------------------------
create table roles (
  key         text primary key,
  name        text not null,
  description text not null default '',
  -- Privileged roles require MFA and shorter sessions (Phase 43).
  is_privileged boolean not null default false
);

insert into roles (key, name, is_privileged, description) values
  ('customer',           'Customer',           false, 'End user of the platform'),
  ('support_agent',      'Support Agent',      true,  'Reads customer context, cannot move money'),
  ('kyc_reviewer',       'KYC Reviewer',       true,  'Works the identity review queue'),
  ('compliance_officer', 'Compliance Officer', true,  'Owns cases, monitoring and reporting'),
  ('finance_operator',   'Finance Operator',   true,  'Reconciliation and controlled adjustments'),
  ('risk_analyst',       'Risk Analyst',       true,  'Rules, alerts and dispositions'),
  ('administrator',      'Administrator',      true,  'User and configuration management'),
  ('super_admin',        'Super Admin',        true,  'Full control including role management');

create table permissions (
  key         text primary key check (key ~ '^[a-z_]+\.[a-z_]+$'),
  description text not null default ''
);

insert into permissions (key, description) values
  ('users.read','View customer records'),
  ('users.update','Edit customer records'),
  ('users.suspend','Suspend or reinstate a customer'),
  ('users.delete','Delete a customer'),
  ('transactions.read','View transactions'),
  ('transactions.review','Place a transaction under review'),
  ('transactions.approve','Approve a held transaction'),
  ('transactions.reject','Reject a held transaction'),
  ('transactions.reverse','Reverse a completed transaction'),
  ('kyc.read','View KYC submissions'),
  ('kyc.review','Take ownership of a KYC review'),
  ('kyc.approve','Approve a KYC submission'),
  ('kyc.reject','Reject a KYC submission'),
  ('cards.read','View cards'),
  ('cards.manage','Freeze, unfreeze or terminate cards'),
  ('reports.read','View reports'),
  ('reports.export','Export report data'),
  ('risk.read','View risk events'),
  ('risk.manage','Edit risk rules'),
  ('compliance.read','View compliance cases'),
  ('compliance.manage','Work compliance cases'),
  ('audit.read','Read audit logs'),
  ('system.settings','Change system configuration'),
  ('roles.manage','Assign or revoke roles');

create table role_permissions (
  role_key       text not null references roles(key) on delete cascade,
  permission_key text not null references permissions(key) on delete cascade,
  primary key (role_key, permission_key)
);

-- Least privilege by default. Support can read, not mutate money.
insert into role_permissions (role_key, permission_key) values
  ('support_agent','users.read'),
  ('support_agent','transactions.read'),
  ('support_agent','kyc.read'),
  ('support_agent','cards.read'),
  ('kyc_reviewer','users.read'),
  ('kyc_reviewer','kyc.read'),
  ('kyc_reviewer','kyc.review'),
  ('kyc_reviewer','kyc.approve'),
  ('kyc_reviewer','kyc.reject'),
  ('compliance_officer','users.read'),
  ('compliance_officer','transactions.read'),
  ('compliance_officer','transactions.review'),
  ('compliance_officer','compliance.read'),
  ('compliance_officer','compliance.manage'),
  ('compliance_officer','audit.read'),
  ('compliance_officer','reports.read'),
  ('compliance_officer','reports.export'),
  ('finance_operator','transactions.read'),
  ('finance_operator','transactions.approve'),
  ('finance_operator','transactions.reject'),
  ('finance_operator','transactions.reverse'),
  ('finance_operator','reports.read'),
  ('risk_analyst','transactions.read'),
  ('risk_analyst','risk.read'),
  ('risk_analyst','risk.manage'),
  ('risk_analyst','users.read'),
  ('administrator','users.read'),
  ('administrator','users.update'),
  ('administrator','users.suspend'),
  ('administrator','transactions.read'),
  ('administrator','cards.read'),
  ('administrator','cards.manage'),
  ('administrator','kyc.read'),
  ('administrator','risk.read'),
  ('administrator','compliance.read'),
  ('administrator','audit.read'),
  ('administrator','reports.read'),
  ('administrator','reports.export'),
  ('administrator','system.settings');

-- super_admin gets everything, maintained as data rather than a code branch.
insert into role_permissions (role_key, permission_key)
  select 'super_admin', key from permissions;

create table user_roles (
  user_id     uuid not null references profiles(id) on delete cascade,
  role_key    text not null references roles(key) on delete restrict,
  granted_by  uuid references profiles(id),
  granted_at  timestamptz not null default now(),
  expires_at  timestamptz,
  primary key (user_id, role_key)
);

-- --------------------------------------------------------------------
-- Authorization helpers. SECURITY DEFINER so RLS policies can call them
-- without the caller needing read access to the role tables themselves.
-- search_path is pinned to defeat search-path hijacking.
-- --------------------------------------------------------------------
create or replace function auth_has_permission(p_permission text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from user_roles ur
    join role_permissions rp on rp.role_key = ur.role_key
    where ur.user_id = auth.uid()
      and rp.permission_key = p_permission
      and (ur.expires_at is null or ur.expires_at > now())
  );
$$;

create or replace function auth_has_role(p_role text)
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from user_roles ur
    where ur.user_id = auth.uid()
      and ur.role_key = p_role
      and (ur.expires_at is null or ur.expires_at > now())
  );
$$;

-- Any staff role at all. Used to widen read scope, never write scope.
create or replace function auth_is_staff()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1 from user_roles ur
    join roles r on r.key = ur.role_key
    where ur.user_id = auth.uid()
      and r.is_privileged
      and (ur.expires_at is null or ur.expires_at > now())
  );
$$;

comment on table user_roles is
  'Role grants. No customer-reachable write path exists; see RLS in 0020.';
