// ====================================================================
// FINARA — DOUBLE-ENTRY LEDGER (domain layer)
// ====================================================================
// Builds and validates balanced journal entries. This module is pure: it
// decides what *should* be written. Persistence is the server's job, inside
// one database transaction (see docs/DATABASE.md).
//
// The previous implementation derived its own debits and credits from the
// same inputs and then "checked" they matched - an invariant that could not
// fail. Here the caller supplies the legs and the invariant is real.

import { Money, verifyLedgerBalance, type CurrencyCode, MoneyError } from '../lib/money/index.ts';

export type EntryDirection = 'debit' | 'credit';

export type TransactionType =
  | 'internal_transfer'
  | 'bank_transfer'
  | 'deposit'
  | 'withdrawal'
  | 'currency_exchange'
  | 'fee'
  | 'reversal'
  | 'adjustment';

/** One side of a posting. Amounts are always positive; direction carries sign. */
export interface PostingLeg {
  readonly accountCode: string;
  readonly direction: EntryDirection;
  readonly amount: Money;
  readonly memo?: string;
}

export interface JournalEntryDraft {
  readonly idempotencyKey: string;
  readonly type: TransactionType;
  readonly legs: readonly PostingLeg[];
  readonly metadata?: Readonly<Record<string, string | number | boolean>>;
}

export interface ValidatedJournalEntry extends JournalEntryDraft {
  readonly currency: CurrencyCode;
  readonly total: Money;
}

export type LedgerValidation =
  | { readonly ok: true; readonly entry: ValidatedJournalEntry }
  | { readonly ok: false; readonly code: string; readonly message: string };

const IDEMPOTENCY_PATTERN = /^[A-Za-z0-9][A-Za-z0-9_:-]{7,127}$/;

/**
 * Validate a draft posting. Rejects anything that would corrupt the ledger:
 * missing idempotency, empty or one-sided postings, non-positive amounts,
 * mixed currencies, or debits that do not equal credits.
 */
export function validateJournalEntry(draft: JournalEntryDraft): LedgerValidation {
  if (!IDEMPOTENCY_PATTERN.test(draft.idempotencyKey)) {
    return {
      ok: false,
      code: 'INVALID_IDEMPOTENCY_KEY',
      message: 'Idempotency key must be 8-128 chars of [A-Za-z0-9_:-] and start alphanumeric.',
    };
  }
  if (draft.legs.length < 2) {
    return { ok: false, code: 'INSUFFICIENT_LEGS', message: 'A posting requires at least two legs.' };
  }

  const debits = draft.legs.filter((l) => l.direction === 'debit');
  const credits = draft.legs.filter((l) => l.direction === 'credit');
  if (debits.length === 0 || credits.length === 0) {
    return { ok: false, code: 'ONE_SIDED_POSTING', message: 'A posting needs both debit and credit legs.' };
  }
  if (draft.legs.some((l) => !l.accountCode.trim())) {
    return { ok: false, code: 'MISSING_ACCOUNT_CODE', message: 'Every leg needs an account code.' };
  }
  if (draft.legs.some((l) => !l.amount.isPositive())) {
    return {
      ok: false,
      code: 'NON_POSITIVE_AMOUNT',
      message: 'Leg amounts must be strictly positive; direction carries the sign.',
    };
  }

  const currency = draft.legs[0].amount.currency;
  if (draft.legs.some((l) => l.amount.currency !== currency)) {
    return {
      ok: false,
      code: 'CURRENCY_MISMATCH',
      message: 'A single posting may not mix currencies. Use two postings and an FX bridge account.',
    };
  }

  let balanced: boolean;
  try {
    balanced = verifyLedgerBalance(debits.map((l) => l.amount), credits.map((l) => l.amount));
  } catch (err) {
    const code = err instanceof MoneyError ? err.code : 'LEDGER_CHECK_FAILED';
    return { ok: false, code, message: (err as Error).message };
  }
  if (!balanced) {
    return {
      ok: false,
      code: 'UNBALANCED_POSTING',
      message: 'Total debits do not equal total credits.',
    };
  }

  const total = debits.reduce((acc, l) => acc.add(l.amount), Money.zero(currency));
  return { ok: true, entry: { ...draft, currency, total } };
}

/**
 * The common two-sided movement with an optional fee, expressed as explicit
 * legs so the balance check has something real to verify.
 *
 *   debit  source            amount + fee
 *   credit destination       amount
 *   credit fee revenue       fee            (only when fee > 0)
 */
export function buildTransferPosting(params: {
  idempotencyKey: string;
  type: TransactionType;
  amount: Money;
  fee?: Money;
  sourceAccountCode: string;
  destinationAccountCode: string;
  feeAccountCode?: string;
  metadata?: Readonly<Record<string, string | number | boolean>>;
}): LedgerValidation {
  const {
    idempotencyKey, type, amount, sourceAccountCode, destinationAccountCode,
    feeAccountCode = '4010-FEE-REVENUE', metadata,
  } = params;
  const fee = params.fee ?? Money.zero(amount.currency);

  if (fee.currency !== amount.currency) {
    return { ok: false, code: 'CURRENCY_MISMATCH', message: 'Fee currency must match amount currency.' };
  }
  if (fee.isNegative()) {
    return { ok: false, code: 'NEGATIVE_FEE', message: 'Fee may not be negative.' };
  }

  const legs: PostingLeg[] = [
    { accountCode: sourceAccountCode, direction: 'debit', amount: amount.add(fee) },
    { accountCode: destinationAccountCode, direction: 'credit', amount },
  ];
  if (fee.isPositive()) {
    legs.push({ accountCode: feeAccountCode, direction: 'credit', amount: fee, memo: 'transfer fee' });
  }

  return validateJournalEntry({ idempotencyKey, type, legs, metadata });
}

/** Net effect on one account, for assertions and reconciliation. */
export function netForAccount(entry: ValidatedJournalEntry, accountCode: string): Money {
  return entry.legs
    .filter((l) => l.accountCode === accountCode)
    .reduce(
      (acc, l) => (l.direction === 'debit' ? acc.add(l.amount) : acc.subtract(l.amount)),
      Money.zero(entry.currency),
    );
}
