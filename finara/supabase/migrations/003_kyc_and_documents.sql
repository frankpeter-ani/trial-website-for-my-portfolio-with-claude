-- ====================================================================
-- FINARA MIGRATION 003: KYC WORKFLOW & DOCUMENT MANAGEMENT
-- ====================================================================

-- KYC PROFILES
CREATE TABLE IF NOT EXISTS public.kyc_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  status TEXT NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'started', 'documents_uploaded', 'submitted', 'under_review', 'needs_information', 'approved', 'rejected', 'expired')),
  id_type TEXT CHECK (id_type IN ('passport', 'national_id', 'drivers_license')),
  id_number TEXT,
  date_of_birth DATE,
  nationality TEXT,
  address_line1 TEXT,
  city TEXT,
  country TEXT,
  postal_code TEXT,
  rejection_reason TEXT,
  reviewer_id UUID REFERENCES public.profiles(id),
  submitted_at TIMESTAMPTZ,
  reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- KYC DOCUMENTS (Private Storage Bucket References)
CREATE TABLE IF NOT EXISTS public.kyc_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  kyc_profile_id UUID NOT NULL REFERENCES public.kyc_profiles(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('passport_front', 'passport_back', 'id_front', 'id_back', 'proof_of_address', 'selfie')),
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  verification_status TEXT NOT NULL DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_kyc_profiles_user ON public.kyc_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_profiles_status ON public.kyc_profiles(status);
