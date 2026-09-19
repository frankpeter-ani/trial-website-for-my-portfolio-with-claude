// ====================================================================
// FINARA — CURRENCY REGISTRY
// ====================================================================
// Currencies are data, not hard-coded branches. Adding one is a registry
// entry; no arithmetic code changes. `exponent` is the number of decimal
// places the currency's minor unit uses (ISO 4217): USD cents = 2, JPY = 0.

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'NGN';

export interface CurrencyDef {
  readonly code: CurrencyCode;
  readonly exponent: number;
  readonly symbol: string;
  readonly name: string;
}

const REGISTRY: Readonly<Record<CurrencyCode, CurrencyDef>> = Object.freeze({
  USD: { code: 'USD', exponent: 2, symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', exponent: 2, symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', exponent: 2, symbol: '£', name: 'Pound Sterling' },
  NGN: { code: 'NGN', exponent: 2, symbol: '₦', name: 'Nigerian Naira' },
});

export function getCurrency(code: CurrencyCode): CurrencyDef {
  const def = REGISTRY[code];
  if (!def) throw new MoneyError('UNKNOWN_CURRENCY', `Unknown currency: ${String(code)}`);
  return def;
}

export function isCurrencyCode(value: unknown): value is CurrencyCode {
  return typeof value === 'string' && Object.prototype.hasOwnProperty.call(REGISTRY, value);
}

export function listCurrencies(): readonly CurrencyDef[] {
  return Object.values(REGISTRY);
}

/** Typed error so callers can branch on `code` rather than parsing messages. */
export class MoneyError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.name = 'MoneyError';
    this.code = code;
  }
}
