import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Money } from '../../src/lib/money/index.ts';
import {
  validateJournalEntry, buildTransferPosting, netForAccount, type PostingLeg,
} from '../../src/services/ledger.ts';

const usd = (v: string) => Money.fromDecimalString(v, 'USD');
const KEY = 'idem_0123456789abcdef';

const leg = (accountCode: string, direction: 'debit' | 'credit', amount: Money): PostingLeg =>
  ({ accountCode, direction, amount });

describe('ledger — balance invariant is real, not tautological', () => {
  it('accepts a balanced multi-leg posting', () => {
    const r = validateJournalEntry({
      idempotencyKey: KEY, type: 'internal_transfer',
      legs: [
        leg('1010-SRC', 'debit', usd('100.00')),
        leg('2010-DST', 'credit', usd('99.50')),
        leg('4010-FEE-REVENUE', 'credit', usd('0.50')),
      ],
    });
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.entry.total.toDecimalString(), '100.00');
  });

  it('REJECTS an unbalanced posting the caller supplied', () => {
    const r = validateJournalEntry({
      idempotencyKey: KEY, type: 'internal_transfer',
      legs: [leg('1010-SRC', 'debit', usd('100.00')), leg('2010-DST', 'credit', usd('99.99'))],
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, 'UNBALANCED_POSTING');
  });

  it('rejects a one-sided posting', () => {
    const r = validateJournalEntry({
      idempotencyKey: KEY, type: 'deposit',
      legs: [leg('1010-SRC', 'debit', usd('10.00')), leg('1011-SRC2', 'debit', usd('10.00'))],
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, 'ONE_SIDED_POSTING');
  });

  it('rejects fewer than two legs', () => {
    const r = validateJournalEntry({
      idempotencyKey: KEY, type: 'deposit', legs: [leg('1010', 'debit', usd('10.00'))],
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, 'INSUFFICIENT_LEGS');
  });

  it('rejects zero and negative leg amounts', () => {
    for (const amt of [usd('0.00'), usd('-5.00')]) {
      const r = validateJournalEntry({
        idempotencyKey: KEY, type: 'adjustment',
        legs: [leg('1010', 'debit', amt), leg('2010', 'credit', amt)],
      });
      assert.equal(r.ok, false);
      if (!r.ok) assert.equal(r.code, 'NON_POSITIVE_AMOUNT');
    }
  });

  it('refuses to mix currencies inside one posting', () => {
    const r = validateJournalEntry({
      idempotencyKey: KEY, type: 'currency_exchange',
      legs: [leg('1010', 'debit', usd('10.00')), leg('2010', 'credit', Money.fromDecimalString('10.00', 'EUR'))],
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, 'CURRENCY_MISMATCH');
  });

  it('rejects a blank account code', () => {
    const r = validateJournalEntry({
      idempotencyKey: KEY, type: 'deposit',
      legs: [leg('   ', 'debit', usd('1.00')), leg('2010', 'credit', usd('1.00'))],
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, 'MISSING_ACCOUNT_CODE');
  });
});

describe('ledger — idempotency key is mandatory and validated', () => {
  it('rejects missing, short or malformed keys', () => {
    for (const bad of ['', 'short', 'has space!!', '_leadingUnderscore']) {
      const r = validateJournalEntry({
        idempotencyKey: bad, type: 'deposit',
        legs: [leg('1010', 'debit', usd('1.00')), leg('2010', 'credit', usd('1.00'))],
      });
      assert.equal(r.ok, false, `should reject "${bad}"`);
      if (!r.ok) assert.equal(r.code, 'INVALID_IDEMPOTENCY_KEY');
    }
  });
});

describe('buildTransferPosting', () => {
  it('produces balanced legs with a fee', () => {
    const r = buildTransferPosting({
      idempotencyKey: KEY, type: 'internal_transfer',
      amount: usd('250.00'), fee: usd('1.25'),
      sourceAccountCode: '2010-WALLET-A', destinationAccountCode: '2010-WALLET-B',
    });
    assert.equal(r.ok, true);
    if (!r.ok) return;
    assert.equal(r.entry.legs.length, 3);
    // source is debited amount + fee
    assert.equal(netForAccount(r.entry, '2010-WALLET-A').toDecimalString(), '251.25');
    // destination receives the amount only
    assert.equal(netForAccount(r.entry, '2010-WALLET-B').toDecimalString(), '-250.00');
    assert.equal(netForAccount(r.entry, '4010-FEE-REVENUE').toDecimalString(), '-1.25');
  });

  it('omits the fee leg when the fee is zero', () => {
    const r = buildTransferPosting({
      idempotencyKey: KEY, type: 'internal_transfer', amount: usd('10.00'),
      sourceAccountCode: 'A', destinationAccountCode: 'B',
    });
    assert.equal(r.ok, true);
    if (r.ok) assert.equal(r.entry.legs.length, 2);
  });

  it('rejects a negative fee and a mismatched fee currency', () => {
    const base = {
      idempotencyKey: KEY, type: 'internal_transfer' as const, amount: usd('10.00'),
      sourceAccountCode: 'A', destinationAccountCode: 'B',
    };
    const neg = buildTransferPosting({ ...base, fee: usd('-1.00') });
    assert.equal(neg.ok, false);
    if (!neg.ok) assert.equal(neg.code, 'NEGATIVE_FEE');

    const mism = buildTransferPosting({ ...base, fee: Money.fromDecimalString('1.00', 'EUR') });
    assert.equal(mism.ok, false);
    if (!mism.ok) assert.equal(mism.code, 'CURRENCY_MISMATCH');
  });

  it('rejects a zero-value transfer', () => {
    const r = buildTransferPosting({
      idempotencyKey: KEY, type: 'internal_transfer', amount: usd('0.00'),
      sourceAccountCode: 'A', destinationAccountCode: 'B',
    });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.code, 'NON_POSITIVE_AMOUNT');
  });
});
