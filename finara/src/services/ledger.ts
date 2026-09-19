// ====================================================================
// FINARA DOUBLE-ENTRY ACCOUNTING SERVICE
// Atomic Double-Entry Ledger Engine (Debits == Credits)
// ====================================================================

import { toExactDecimal, verifyLedgerBalance, type SupportedCurrency } from '../lib/money';

export interface LedgerEntryRecord {
  id: string;
  transactionId: string;
  accountCode: string;
  entryType: 'debit' | 'credit';
  amount: number;
  currency: SupportedCurrency;
  createdAt: string;
}

export interface DoubleEntryTransactionParams {
  idempotencyKey: string;
  userId: string;
  type: 'internal_transfer' | 'bank_transfer' | 'deposit' | 'withdrawal' | 'currency_exchange' | 'stock_buy' | 'sell_stock';
  amount: number;
  currency: SupportedCurrency;
  fee?: number;
  sourceAccountCode: string; // e.g. '1010-CASH-USD' or '2010-USER-WALLET'
  destinationAccountCode: string; // e.g. '2010-USER-WALLET' or '4010-REVENUE-FEE'
  metadata?: Record<string, any>;
}

export interface LedgerTransactionResult {
  success: boolean;
  transactionId: string;
  idempotencyKey: string;
  entries: LedgerEntryRecord[];
  error?: string;
}

/**
 * Execute double-entry accounting transaction with debit and credit balance invariant enforcement
 */
export function createDoubleEntryTransaction(
  params: DoubleEntryTransactionParams
): LedgerTransactionResult {
  const cleanAmount = toExactDecimal(params.amount);
  const cleanFee = toExactDecimal(params.fee || 0);
  const totalMovement = cleanAmount + cleanFee;

  if (cleanAmount <= 0) {
    return {
      success: false,
      transactionId: '',
      idempotencyKey: params.idempotencyKey,
      entries: [],
      error: 'Transaction amount must be strictly greater than zero.',
    };
  }

  // Construct balanced debit and credit entries
  const debits = [totalMovement];
  const credits = [cleanAmount, cleanFee].filter(v => v > 0);

  if (!verifyLedgerBalance(debits, credits)) {
    return {
      success: false,
      transactionId: '',
      idempotencyKey: params.idempotencyKey,
      entries: [],
      error: 'Ledger Invariance Error: Total Debits do not equal Total Credits.',
    };
  }

  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const entries: LedgerEntryRecord[] = [
    {
      id: `ent_${Date.now()}_1`,
      transactionId: txId,
      accountCode: params.sourceAccountCode,
      entryType: 'debit',
      amount: totalMovement,
      currency: params.currency,
      createdAt: now,
    },
    {
      id: `ent_${Date.now()}_2`,
      transactionId: txId,
      accountCode: params.destinationAccountCode,
      entryType: 'credit',
      amount: cleanAmount,
      currency: params.currency,
      createdAt: now,
    },
  ];

  if (cleanFee > 0) {
    entries.push({
      id: `ent_${Date.now()}_3`,
      transactionId: txId,
      accountCode: '4010-FINARA-FEE-REVENUE',
      entryType: 'credit',
      amount: cleanFee,
      currency: params.currency,
      createdAt: now,
    });
  }

  return {
    success: true,
    transactionId: txId,
    idempotencyKey: params.idempotencyKey,
    entries,
  };
}
