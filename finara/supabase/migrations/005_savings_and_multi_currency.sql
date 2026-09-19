-- ====================================================================
-- FINARA MIGRATION 005: SMART WALLET SAVINGS & MULTI-CURRENCY FX
-- ====================================================================

-- SAVINGS GOALS (Smart Wallet Categories: Travel, Property, Education, etc.)
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('Travel', 'Property', 'Education', 'Emergency', 'Custom')),
  name TEXT NOT NULL,
  target_amount NUMERIC(15, 2) NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (current_amount >= 0),
  currency TEXT NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP', 'NGN')),
  target_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EXCHANGE RATES TABLE
CREATE TABLE IF NOT EXISTS public.exchange_rates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_currency TEXT NOT NULL CHECK (from_currency IN ('USD', 'EUR', 'GBP', 'NGN')),
  to_currency TEXT NOT NULL CHECK (to_currency IN ('USD', 'EUR', 'GBP', 'NGN')),
  rate NUMERIC(15, 6) NOT NULL CHECK (rate > 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(from_currency, to_currency)
);

-- SEED DEFAULT EXCHANGE RATES
INSERT INTO public.exchange_rates (from_currency, to_currency, rate)
VALUES
  ('USD', 'EUR', 0.920000),
  ('EUR', 'USD', 1.086957),
  ('USD', 'GBP', 0.790000),
  ('GBP', 'USD', 1.265823),
  ('USD', 'NGN', 1550.000000),
  ('NGN', 'USD', 0.000645)
ON CONFLICT (from_currency, to_currency) DO UPDATE SET rate = EXCLUDED.rate;

CREATE INDEX IF NOT EXISTS idx_savings_goals_user ON public.savings_goals(user_id);
