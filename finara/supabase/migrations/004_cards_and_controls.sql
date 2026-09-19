-- ====================================================================
-- FINARA MIGRATION 004: CARDS & SPENDING CONTROLS
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_id UUID NOT NULL REFERENCES public.accounts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  card_type TEXT NOT NULL CHECK (card_type IN ('virtual', 'physical')),
  card_brand TEXT NOT NULL DEFAULT 'VISA',
  masked_number TEXT NOT NULL,
  last_four TEXT NOT NULL,
  expiration_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'frozen', 'terminated', 'pending')),
  is_pin_set BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.card_controls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  card_id UUID NOT NULL REFERENCES public.cards(id) ON DELETE CASCADE UNIQUE,
  allow_online BOOLEAN NOT NULL DEFAULT true,
  allow_atm BOOLEAN NOT NULL DEFAULT true,
  allow_contactless BOOLEAN NOT NULL DEFAULT true,
  allow_international BOOLEAN NOT NULL DEFAULT false,
  daily_limit NUMERIC(15, 2) NOT NULL DEFAULT 2500.00,
  monthly_limit NUMERIC(15, 2) NOT NULL DEFAULT 10000.00,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cards_user ON public.cards(user_id);
