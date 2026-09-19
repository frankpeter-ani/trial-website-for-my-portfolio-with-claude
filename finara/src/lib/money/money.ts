// ====================================================================
// FINARA — EXACT DECIMAL MONEY
// ====================================================================
// Money is an immutable (bigint minor units + currency) pair. There is no
// JS `number` anywhere in the arithmetic path, so there is no IEEE-754
// rounding drift and no 2^53 ceiling.
//
// Rules enforced by construction:
//   - amounts are exact; parsing rejects anything it cannot represent exactly
//   - arithmetic across two different currencies throws, never coerces
//   - every operation that can lose precision takes an explicit RoundingMode
//   - splitting money conserves the total to the last minor unit

import { type CurrencyCode, type CurrencyDef, getCurrency, MoneyError } from './currency.ts';

export type RoundingMode =
  | 'HALF_EVEN'  // banker's rounding - default, unbiased over many operations
  | 'HALF_UP'
  | 'DOWN'       // truncate toward zero
  | 'UP'         // away from zero
  | 'FLOOR'      // toward -infinity
  | 'CEIL';      // toward +infinity

/** Divide `n` by `d` (d > 0) returning an exact bigint under `mode`. */
function divideRounded(n: bigint, d: bigint, mode: RoundingMode): bigint {
  if (d === 0n) throw new MoneyError('DIVIDE_BY_ZERO', 'Division by zero');
  const negative = n < 0n !== d < 0n;
  const an = n < 0n ? -n : n;
  const ad = d < 0n ? -d : d;
  const q = an / ad;
  const r = an % ad;
  if (r === 0n) return negative ? -q : q;

  let bumpMagnitude: boolean;
  switch (mode) {
    case 'DOWN':  bumpMagnitude = false; break;
    case 'UP':    bumpMagnitude = true; break;
    case 'FLOOR': bumpMagnitude = negative; break;
    case 'CEIL':  bumpMagnitude = !negative; break;
    case 'HALF_UP': {
      bumpMagnitude = r * 2n >= ad;
      break;
    }
    case 'HALF_EVEN': {
      const twice = r * 2n;
      if (twice > ad) bumpMagnitude = true;
      else if (twice < ad) bumpMagnitude = false;
      else bumpMagnitude = q % 2n !== 0n; // exact half -> round to even
      break;
    }
    default:
      throw new MoneyError('UNKNOWN_ROUNDING_MODE', `Unknown rounding mode: ${String(mode)}`);
  }
  const mag = bumpMagnitude ? q + 1n : q;
  return negative ? -mag : mag;
}

function pow10(n: number): bigint {
  if (n < 0) throw new MoneyError('NEGATIVE_EXPONENT', 'Exponent must be >= 0');
  return 10n ** BigInt(n);
}

/** Parse a plain decimal string ("-1234.56") into scaled minor units. */
function parseDecimalToMinor(input: string, exponent: number, mode: RoundingMode): bigint {
  const raw = input.trim();
  if (!/^[+-]?(\d+(\.\d*)?|\.\d+)$/.test(raw)) {
    throw new MoneyError('INVALID_AMOUNT', `Not a plain decimal amount: "${input}"`);
  }
  const negative = raw.startsWith('-');
  const unsigned = raw.replace(/^[+-]/, '');
  const [intPart = '0', fracPart = ''] = unsigned.split('.');

  // Scale by the currency exponent, keeping every supplied digit, then round
  // the surplus away explicitly rather than silently truncating.
  const scaled = BigInt(intPart + (fracPart.padEnd(exponent, '0').slice(0, exponent) || ''));
  const surplus = fracPart.slice(exponent);
  let minor = exponent === 0 ? BigInt(intPart) : scaled;
  if (surplus.length > 0) {
    minor = divideRounded(
      BigInt(intPart + fracPart) , pow10(fracPart.length - exponent), mode,
    );
  }
  return negative ? -minor : minor;
}

export class Money {
  readonly minor: bigint;
  readonly currency: CurrencyCode;

  private constructor(minor: bigint, currency: CurrencyCode) {
    this.minor = minor;
    this.currency = currency;
    Object.freeze(this);
  }

  // ---- construction -------------------------------------------------

  /** Preferred constructor: exact minor units (cents), no parsing. */
  static fromMinor(minor: bigint | number, currency: CurrencyCode): Money {
    getCurrency(currency);
    if (typeof minor === 'number') {
      if (!Number.isInteger(minor)) {
        throw new MoneyError('NON_INTEGER_MINOR', `Minor units must be an integer, got ${minor}`);
      }
      if (!Number.isSafeInteger(minor)) {
        throw new MoneyError('UNSAFE_INTEGER', 'Minor units exceed safe integer range; pass a bigint');
      }
      return new Money(BigInt(minor), currency);
    }
    return new Money(minor, currency);
  }

  /** Parse an exact decimal string. Strings, never floats, cross the boundary. */
  static fromDecimalString(
    value: string,
    currency: CurrencyCode,
    mode: RoundingMode = 'HALF_EVEN',
  ): Money {
    const def = getCurrency(currency);
    return new Money(parseDecimalToMinor(value, def.exponent, mode), currency);
  }

  static zero(currency: CurrencyCode): Money {
    return Money.fromMinor(0n, currency);
  }

  // ---- guards -------------------------------------------------------

  private sameCurrency(other: Money): void {
    if (other.currency !== this.currency) {
      throw new MoneyError(
        'CURRENCY_MISMATCH',
        `Cannot combine ${this.currency} with ${other.currency}`,
      );
    }
  }

  // ---- arithmetic ---------------------------------------------------

  add(other: Money): Money {
    this.sameCurrency(other);
    return new Money(this.minor + other.minor, this.currency);
  }

  subtract(other: Money): Money {
    this.sameCurrency(other);
    return new Money(this.minor - other.minor, this.currency);
  }

  negate(): Money {
    return new Money(-this.minor, this.currency);
  }

  abs(): Money {
    return this.minor < 0n ? this.negate() : this;
  }

  /**
   * Scale by an exact rational (numerator/denominator) - how fees, rates and
   * percentages are applied. A float multiplier is never accepted.
   */
  multiplyByRatio(numerator: bigint, denominator: bigint, mode: RoundingMode = 'HALF_EVEN'): Money {
    return new Money(divideRounded(this.minor * numerator, denominator, mode), this.currency);
  }

  /**
   * Split across integer weights, distributing the remainder one minor unit at
   * a time so the parts always sum exactly back to the original. This is how a
   * fee split or a goal allocation avoids losing (or inventing) a penny.
   */
  allocate(weights: readonly number[]): Money[] {
    if (weights.length === 0) throw new MoneyError('NO_WEIGHTS', 'allocate requires at least one weight');
    if (weights.some((w) => !Number.isInteger(w) || w < 0)) {
      throw new MoneyError('INVALID_WEIGHT', 'Weights must be non-negative integers');
    }
    const total = weights.reduce((a, b) => a + b, 0);
    if (total === 0) throw new MoneyError('ZERO_WEIGHT_TOTAL', 'Weights must not sum to zero');

    const totalB = BigInt(total);
    const parts = weights.map((w) => (this.minor * BigInt(w)) / totalB);
    let remainder = this.minor - parts.reduce((a, b) => a + b, 0n);

    // Hand out the remainder deterministically, largest weight first.
    const order = weights
      .map((w, i) => ({ w, i }))
      .sort((a, b) => b.w - a.w || a.i - b.i);
    const step = remainder < 0n ? -1n : 1n;
    for (let k = 0; remainder !== 0n; k = (k + 1) % order.length) {
      parts[order[k].i] += step;
      remainder -= step;
    }
    return parts.map((p) => new Money(p, this.currency));
  }

  // ---- comparison ---------------------------------------------------

  compare(other: Money): -1 | 0 | 1 {
    this.sameCurrency(other);
    return this.minor < other.minor ? -1 : this.minor > other.minor ? 1 : 0;
  }

  equals(other: Money): boolean {
    return this.currency === other.currency && this.minor === other.minor;
  }

  greaterThan(other: Money): boolean { return this.compare(other) === 1; }
  lessThan(other: Money): boolean { return this.compare(other) === -1; }
  greaterThanOrEqual(other: Money): boolean { return this.compare(other) >= 0; }
  isZero(): boolean { return this.minor === 0n; }
  isNegative(): boolean { return this.minor < 0n; }
  isPositive(): boolean { return this.minor > 0n; }

  // ---- output -------------------------------------------------------

  private def(): CurrencyDef { return getCurrency(this.currency); }

  /** Exact decimal string, e.g. "-1234.56". Safe for NUMERIC columns. */
  toDecimalString(): string {
    const { exponent } = this.def();
    const negative = this.minor < 0n;
    const digits = (negative ? -this.minor : this.minor).toString().padStart(exponent + 1, '0');
    const whole = digits.slice(0, digits.length - exponent) || '0';
    const frac = exponent > 0 ? '.' + digits.slice(digits.length - exponent) : '';
    return `${negative ? '-' : ''}${whole}${frac}`;
  }

  /** Display string with grouping and symbol. Formatting only - never arithmetic. */
  format(locale = 'en-US'): string {
    const { exponent, symbol } = this.def();
    const [whole, frac = ''] = this.toDecimalString().replace('-', '').split('.');
    const grouped = Number(whole).toLocaleString(locale); // grouping only, value already exact
    const sign = this.isNegative() ? '-' : '';
    return `${sign}${symbol}${grouped}${exponent > 0 ? '.' + frac : ''}`;
  }

  toJSON(): { amount: string; currency: CurrencyCode } {
    return { amount: this.toDecimalString(), currency: this.currency };
  }

  toString(): string { return `${this.toDecimalString()} ${this.currency}`; }
}

/**
 * Exact double-entry invariant. Unlike a float sum this cannot report an
 * unbalanced set as balanced. Mixed currencies are rejected, not coerced.
 */
export function verifyLedgerBalance(debits: readonly Money[], credits: readonly Money[]): boolean {
  if (debits.length === 0 && credits.length === 0) return true;
  const all = [...debits, ...credits];
  const currency = all[0].currency;
  if (all.some((m) => m.currency !== currency)) {
    throw new MoneyError('CURRENCY_MISMATCH', 'Ledger entries must share one currency');
  }
  const sum = (xs: readonly Money[]) => xs.reduce((acc, m) => acc + m.minor, 0n);
  return sum(debits) === sum(credits);
}
