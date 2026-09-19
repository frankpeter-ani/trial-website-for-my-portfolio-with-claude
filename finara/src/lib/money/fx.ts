// ====================================================================
// FINARA — FX CONVERSION
// ====================================================================
// Rates arrive as exact decimal strings (as stored in NUMERIC columns) and
// are converted to an exact rational. Fees are basis points (integers), so a
// "0.5% fee" is 50 bps, not the float 0.005.

import { type CurrencyCode, getCurrency, MoneyError } from './currency.ts';
import { Money, type RoundingMode } from './money.ts';

export interface Rational { readonly num: bigint; readonly den: bigint }

/** "0.9235" -> 9235/10000, exactly. */
export function parseRate(rate: string): Rational {
  const raw = rate.trim();
  if (!/^\d+(\.\d+)?$/.test(raw)) {
    throw new MoneyError('INVALID_RATE', `Rate must be a positive plain decimal: "${rate}"`);
  }
  const [whole, frac = ''] = raw.split('.');
  const num = BigInt(whole + frac);
  if (num === 0n) throw new MoneyError('ZERO_RATE', 'Exchange rate must be greater than zero');
  return { num, den: 10n ** BigInt(frac.length) };
}

export interface ConversionQuote {
  readonly source: Money;
  readonly fee: Money;
  readonly netSource: Money;
  readonly target: Money;
  readonly rate: string;
  readonly feeBasisPoints: number;
}

/**
 * Quote a conversion. Fee is taken on the source side, then the net is
 * converted. Every step is exact; only the final scaling rounds, once,
 * under an explicit mode.
 */
export function quoteConversion(params: {
  source: Money;
  to: CurrencyCode;
  rate: string;
  feeBasisPoints?: number;
  mode?: RoundingMode;
}): ConversionQuote {
  const { source, to, rate, feeBasisPoints = 0, mode = 'HALF_EVEN' } = params;

  if (source.isNegative()) throw new MoneyError('NEGATIVE_AMOUNT', 'Cannot convert a negative amount');
  if (!Number.isInteger(feeBasisPoints) || feeBasisPoints < 0 || feeBasisPoints > 10_000) {
    throw new MoneyError('INVALID_FEE', 'feeBasisPoints must be an integer between 0 and 10000');
  }
  if (source.currency === to) throw new MoneyError('SAME_CURRENCY', 'Source and target currency are identical');

  const fee = source.multiplyByRatio(BigInt(feeBasisPoints), 10_000n, mode);
  const netSource = source.subtract(fee);

  const fromExp = getCurrency(source.currency).exponent;
  const toExp = getCurrency(to).exponent;
  const { num, den } = parseRate(rate);

  // targetMinor = netMinor * rate * 10^(toExp - fromExp), as one exact ratio.
  const scaleUp = toExp >= fromExp ? 10n ** BigInt(toExp - fromExp) : 1n;
  const scaleDown = toExp >= fromExp ? 1n : 10n ** BigInt(fromExp - toExp);

  const targetMinor = Money.fromMinor(netSource.minor * num * scaleUp, to)
    .multiplyByRatio(1n, den * scaleDown, mode);

  return { source, fee, netSource, target: targetMinor, rate, feeBasisPoints };
}
