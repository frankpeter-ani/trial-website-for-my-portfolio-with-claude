import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Money, verifyLedgerBalance, MoneyError, quoteConversion, parseRate } from '../../src/lib/money/index.ts';

describe('Money — exactness', () => {
  it('does not drift when accumulating 0.1 ten times (float impl gave 0.9999999999999999)', () => {
    let sum = Money.zero('USD');
    for (let i = 0; i < 10; i++) sum = sum.add(Money.fromDecimalString('0.10', 'USD'));
    assert.equal(sum.toDecimalString(), '1.00');
    assert.ok(sum.equals(Money.fromDecimalString('1.00', 'USD')));
  });

  it('0.1 + 0.2 === 0.3 exactly', () => {
    const r = Money.fromDecimalString('0.10', 'USD').add(Money.fromDecimalString('0.20', 'USD'));
    assert.equal(r.toDecimalString(), '0.30');
  });

  it('holds precision far beyond 2^53 minor units (float impl lost the cent)', () => {
    const big = Money.fromDecimalString('9007199254740.99', 'USD');
    assert.equal(big.add(Money.fromDecimalString('0.01', 'USD')).toDecimalString(), '9007199254741.00');
    const huge = Money.fromMinor(9_007_199_254_740_993n, 'USD');
    assert.equal(huge.add(Money.fromMinor(1n, 'USD')).minor, 9_007_199_254_740_994n);
  });

  it('round-trips decimal strings', () => {
    for (const v of ['0.00', '0.01', '-0.01', '1234567.89', '-9999999999.99']) {
      assert.equal(Money.fromDecimalString(v, 'USD').toDecimalString(), v);
    }
  });

  it('rejects non-decimal input rather than silently coercing', () => {
    for (const bad of ['', 'abc', '1.2.3', '1e5', 'NaN', 'Infinity', '1,234.00']) {
      assert.throws(() => Money.fromDecimalString(bad, 'USD'), MoneyError, `should reject "${bad}"`);
    }
  });

  it('rejects a non-integer minor unit', () => {
    assert.throws(() => Money.fromMinor(1.5, 'USD'), MoneyError);
  });
});

describe('Money — currency safety', () => {
  it('refuses to add across currencies instead of coercing', () => {
    const usd = Money.fromDecimalString('10.00', 'USD');
    const eur = Money.fromDecimalString('10.00', 'EUR');
    assert.throws(() => usd.add(eur), (e: unknown) => e instanceof MoneyError && e.code === 'CURRENCY_MISMATCH');
  });
  it('treats same amount in different currencies as unequal', () => {
    assert.equal(Money.fromDecimalString('5.00', 'USD').equals(Money.fromDecimalString('5.00', 'GBP')), false);
  });
});

describe('Money — rounding', () => {
  it('HALF_EVEN breaks exact ties toward even', () => {
    // 2.5 -> 2, 3.5 -> 4 (in minor units via ratio division)
    assert.equal(Money.fromMinor(25n, 'USD').multiplyByRatio(1n, 10n, 'HALF_EVEN').minor, 2n);
    assert.equal(Money.fromMinor(35n, 'USD').multiplyByRatio(1n, 10n, 'HALF_EVEN').minor, 4n);
  });
  it('HALF_UP always lifts an exact tie', () => {
    assert.equal(Money.fromMinor(25n, 'USD').multiplyByRatio(1n, 10n, 'HALF_UP').minor, 3n);
  });
  it('DOWN truncates toward zero symmetrically', () => {
    assert.equal(Money.fromMinor(29n, 'USD').multiplyByRatio(1n, 10n, 'DOWN').minor, 2n);
    assert.equal(Money.fromMinor(-29n, 'USD').multiplyByRatio(1n, 10n, 'DOWN').minor, -2n);
  });
  it('FLOOR and CEIL respect sign', () => {
    assert.equal(Money.fromMinor(-29n, 'USD').multiplyByRatio(1n, 10n, 'FLOOR').minor, -3n);
    assert.equal(Money.fromMinor(-29n, 'USD').multiplyByRatio(1n, 10n, 'CEIL').minor, -2n);
  });
});

describe('Money — allocate conserves the total', () => {
  it('splits an indivisible amount without losing or inventing a unit', () => {
    const parts = Money.fromDecimalString('0.10', 'USD').allocate([1, 1, 1]);
    assert.deepEqual(parts.map((p) => p.toDecimalString()), ['0.04', '0.03', '0.03']);
    const sum = parts.reduce((a, b) => a.add(b), Money.zero('USD'));
    assert.equal(sum.toDecimalString(), '0.10');
  });
  it('conserves across weighted splits', () => {
    const total = Money.fromDecimalString('100.00', 'USD');
    const parts = total.allocate([3, 5, 1]);
    assert.equal(parts.reduce((a, b) => a.add(b), Money.zero('USD')).toDecimalString(), '100.00');
  });
  it('conserves for negative totals too', () => {
    const parts = Money.fromDecimalString('-0.10', 'USD').allocate([1, 1, 1]);
    assert.equal(parts.reduce((a, b) => a.add(b), Money.zero('USD')).toDecimalString(), '-0.10');
  });
});

describe('verifyLedgerBalance — exact invariant', () => {
  it('accepts a genuinely balanced set', () => {
    assert.equal(verifyLedgerBalance(
      [Money.fromDecimalString('100.00', 'USD')],
      [Money.fromDecimalString('99.50', 'USD'), Money.fromDecimalString('0.50', 'USD')],
    ), true);
  });
  it('rejects an unbalanced set', () => {
    assert.equal(verifyLedgerBalance(
      [Money.fromDecimalString('100.00', 'USD')],
      [Money.fromDecimalString('50.00', 'USD')],
    ), false);
  });
  it('REGRESSION: the float implementation reported 1e15 vs 1e15+0.01 as balanced', () => {
    assert.equal(verifyLedgerBalance(
      [Money.fromDecimalString('1000000000000000.00', 'USD')],
      [Money.fromDecimalString('1000000000000000.01', 'USD')],
    ), false);
  });
  it('refuses to compare across currencies', () => {
    assert.throws(() => verifyLedgerBalance(
      [Money.fromDecimalString('1.00', 'USD')],
      [Money.fromDecimalString('1.00', 'EUR')],
    ), MoneyError);
  });
});

describe('FX', () => {
  it('parses a rate as an exact rational', () => {
    assert.deepEqual(parseRate('0.9235'), { num: 9235n, den: 10000n });
  });
  it('applies a bps fee then converts, conserving the fee split', () => {
    const q = quoteConversion({
      source: Money.fromDecimalString('100.00', 'USD'), to: 'EUR',
      rate: '0.9000', feeBasisPoints: 50,
    });
    assert.equal(q.fee.toDecimalString(), '0.50');
    assert.equal(q.netSource.toDecimalString(), '99.50');
    assert.equal(q.target.toDecimalString(), '89.55');
    assert.equal(q.fee.add(q.netSource).toDecimalString(), q.source.toDecimalString());
  });
  it('rejects negative amounts, same-currency and bad fees', () => {
    const src = Money.fromDecimalString('10.00', 'USD');
    assert.throws(() => quoteConversion({ source: src.negate(), to: 'EUR', rate: '1.0' }), MoneyError);
    assert.throws(() => quoteConversion({ source: src, to: 'USD', rate: '1.0' }), MoneyError);
    assert.throws(() => quoteConversion({ source: src, to: 'EUR', rate: '1.0', feeBasisPoints: 10001 }), MoneyError);
    assert.throws(() => quoteConversion({ source: src, to: 'EUR', rate: '0' }), MoneyError);
  });
});
