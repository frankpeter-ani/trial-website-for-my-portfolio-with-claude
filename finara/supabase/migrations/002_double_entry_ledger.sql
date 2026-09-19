-- ====================================================================
-- FINARA MIGRATION 002: DOUBLE-ENTRY LEDGER & IDEMPOTENCY ENGINE
-- ====================================================================

-- CHART OF ACCOUNTS (Asset, Liability, Equity, Revenue, Expense)
CREATE TABLE IF NOT EXISTS public.ledger_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('asset', 'liability', 'equity', 'revenue', 'expense')),
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'EUR', 'GBP', 'NGN')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_id UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
  idempotency_key TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('internal_transfer', 'bank_transfer', 'deposit', 'withdrawal', 'currency_exchange', 'stock_buy', 'stock_sell', 'fee', 'refund')),
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  fee NUMERIC(15, 2) NOT NULL DEFAULT 0.00 CHECK (fee >= 0),
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'EUR', 'GBP', 'NGN')),
  status TEXT NOT NULL DEFAULT 'initiated' CHECK (status IN ('initiated', 'pending', 'processing', 'completed', 'failed', 'cancelled', 'reversed', 'refunded', 'requires_review', 'blocked')),
  source_wallet_id UUID REFERENCES public.wallets(id),
  destination_wallet_id UUID REFERENCES public.wallets(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- DOUBLE-ENTRY LEDGER ENTRIES (Debits and Credits)
CREATE TABLE IF NOT EXISTS public.ledger_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  ledger_account_id UUID NOT NULL REFERENCES public.ledger_accounts(id),
  entry_type TEXT NOT NULL CHECK (entry_type IN ('debit', 'credit')),
  amount NUMERIC(15, 2) NOT NULL CHECK (amount > 0),
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'EUR', 'GBP', 'NGN')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- TRANSACTION STATUS HISTORY AUDIT TRAIL
CREATE TABLE IF NOT EXISTS public.transaction_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES public.transactions(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  actor_id UUID REFERENCES public.profiles(id),
  reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ledger_entries_transaction ON public.ledger_entries(transaction_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
