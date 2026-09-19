-- ====================================================================
-- FINARA MIGRATION 007: ROW LEVEL SECURITY & GRANULAR RBAC POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- HELPER: IS ADMIN OR PRIVILEGED STAFF
CREATE OR REPLACE FUNCTION public.is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('administrator', 'super_admin', 'support_agent', 'kyc_reviewer', 'compliance_officer', 'finance_operator', 'risk_analyst', 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- PROFILES
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin_or_staff());
CREATE POLICY "Users can update own profile name/avatar" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin_or_staff());

-- ACCOUNTS & WALLETS
CREATE POLICY "Users view own accounts" ON public.accounts FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_staff());
CREATE POLICY "Users view own wallets" ON public.wallets FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_staff());

-- TRANSACTIONS
CREATE POLICY "Users view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_staff());

-- KYC
CREATE POLICY "Users view own kyc" ON public.kyc_profiles FOR SELECT USING (auth.uid() = user_id OR public.is_admin_or_staff());
CREATE POLICY "Users insert own kyc" ON public.kyc_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- CARDS & SAVINGS
CREATE POLICY "Users manage own cards" ON public.cards FOR ALL USING (auth.uid() = user_id OR public.is_admin_or_staff());
CREATE POLICY "Users manage own savings" ON public.savings_goals FOR ALL USING (auth.uid() = user_id OR public.is_admin_or_staff());

-- AUDIT LOGS
CREATE POLICY "Only staff view audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin_or_staff());

-- ====================================================================
-- END OF MIGRATION 007
-- ====================================================================
