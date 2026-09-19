// ====================================================================
// FINARA — MONEY PUBLIC API
// ====================================================================

export { Money, verifyLedgerBalance, type RoundingMode } from './money.ts';
export {
  getCurrency, isCurrencyCode, listCurrencies, MoneyError,
  type CurrencyCode, type CurrencyDef,
} from './currency.ts';
export { quoteConversion, parseRate, type ConversionQuote, type Rational } from './fx.ts';

import { Money } from './money.ts';
import type { CurrencyCode } from './currency.ts';

/**
 * @deprecated Legacy float formatter retained only for the sandbox demo UI,
 * which still holds balances as JS numbers in localStorage. New code must use
 * `Money` and `Money.format()`. Removed when demo mode moves onto the ledger.
 */
export function formatMoney(amount: number, currency: CurrencyCode = 'USD'): string {
  if (!Number.isFinite(amount)) return Money.zero(currency).format();
  // Route through Money so display is consistent, accepting that the *input*
  // is already an inexact float - that inexactness is the demo's, not ours.
  return Money.fromDecimalString(amount.toFixed(2), currency).format();
}

/** @deprecated Use `Money.fromDecimalString` / `Money.fromMinor`. */
export type SupportedCurrency = CurrencyCode;
