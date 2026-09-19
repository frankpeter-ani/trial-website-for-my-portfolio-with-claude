// ====================================================================
// FINARA KYC WORKFLOW & DOCUMENT SERVICE
// Private Storage Buckets & Applicant State Engine
// ====================================================================

export type KycStatus =
  | 'not_started'
  | 'started'
  | 'documents_uploaded'
  | 'submitted'
  | 'under_review'
  | 'needs_information'
  | 'approved'
  | 'rejected'
  | 'expired';

export interface KycDocument {
  id: string;
  documentType: 'passport_front' | 'passport_back' | 'id_front' | 'id_back' | 'proof_of_address' | 'selfie';
  storagePath: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  uploadedAt: string;
}

export interface KycProfileModel {
  id: string;
  userId: string;
  status: KycStatus;
  idType?: string;
  idNumber?: string;
  dateOfBirth?: string;
  addressLine1?: string;
  city?: string;
  country?: string;
  documents: KycDocument[];
  rejectionReason?: string;
  submittedAt?: string;
  reviewedAt?: string;
}

export function createInitialKycProfile(userId: string): KycProfileModel {
  return {
    id: `kyc_${Date.now()}`,
    userId,
    status: 'not_started',
    documents: [],
  };
}

export function submitKycDocuments(profile: KycProfileModel, docs: KycDocument[]): KycProfileModel {
  return {
    ...profile,
    status: 'submitted',
    documents: [...profile.documents, ...docs],
    submittedAt: new Date().toISOString(),
  };
}

export function reviewKycProfile(
  profile: KycProfileModel,
  decision: 'approved' | 'rejected' | 'needs_information',
  reason?: string
): KycProfileModel {
  return {
    ...profile,
    status: decision,
    rejectionReason: reason || undefined,
    reviewedAt: new Date().toISOString(),
  };
}
