// ====================================================================
// FINARA PROVIDER ADAPTERS & INTEGRATION BOUNDARIES
// Clean Sandbox Implementations for Payment, KYC, Card & FX Providers
// ====================================================================

import type { SupportedCurrency } from '../../lib/money';

export interface PaymentProvider {
  name: string;
  createDepositIntent(amount: number, currency: SupportedCurrency): Promise<{ intentId: string; clientSecret: string }>;
  verifyWebhookSignature(payload: string, signature: string): boolean;
}

export interface CardProvider {
  name: string;
  issueCard(userId: string, type: 'virtual' | 'physical'): Promise<{ cardId: string; maskedPan: string; exp: string }>;
  freezeCard(cardId: string): Promise<boolean>;
  unfreezeCard(cardId: string): Promise<boolean>;
}

export interface KYCProvider {
  name: string;
  submitApplicant(userId: string, idType: string, docPath: string): Promise<{ applicantId: string; status: 'approved' | 'rejected' | 'under_review' }>;
}

/**
 * Sandbox Payment Provider Implementation
 */
export class SandboxPaymentProvider implements PaymentProvider {
  name = 'Finara Sandbox Payment Processor';

  async createDepositIntent(_amount: number, _currency: SupportedCurrency) {
    return {
      intentId: `pi_sb_${Date.now()}`,
      clientSecret: `secret_sb_${Math.random().toString(36).substring(2, 9)}`,
    };
  }

  verifyWebhookSignature(_payload: string, signature: string): boolean {
    return signature.startsWith('sb_sig_') || signature === 'valid_sandbox_sig';
  }
}

/**
 * Sandbox Card Provider Implementation
 */
export class SandboxCardProvider implements CardProvider {
  name = 'Finara Sandbox Issuer';

  async issueCard(_userId: string, _type: 'virtual' | 'physical') {
    const lastFour = Math.floor(1000 + Math.random() * 9000).toString();
    return {
      cardId: `crd_sb_${Date.now()}`,
      maskedPan: `•••• •••• •••• ${lastFour}`,
      exp: '12/28',
    };
  }

  async freezeCard(_cardId: string): Promise<boolean> {
    return true;
  }

  async unfreezeCard(_cardId: string): Promise<boolean> {
    return true;
  }
}

/**
 * Sandbox KYC Provider Implementation
 */
export class SandboxKYCProvider implements KYCProvider {
  name = 'Finara Identity Verification Sandbox';

  async submitApplicant(_userId: string, _idType: string, _docPath: string) {
    return {
      applicantId: `kyc_sb_${Date.now()}`,
      status: 'approved' as const,
    };
  }
}
