// ====================================================================
// FINARA FINANCIAL PRECISION ENGINE
// Anti-Floating Point Decimal Arithmetic & Currency Formatting
// ====================================================================

export type SupportedCurrency = 'USD' | 'EUR' | 'GBP' | 'NGN';

export interface MoneyValue {
  amount: number; // Stored as integer cents internally or fixed decimal
  formatted: string;
  currency: SupportedCurrency;
}

export interface FXConversionParams {
  amount: number;
  fromCurrency: SupportedCurrency;
  toCurrency: SupportedCurrency;
  rate: number;
}

export interface FXConversionResult {
  sourceAmount: number;
  targetAmount: number;
  fromCurrency: SupportedCurrency;
  toCurrency: SupportedCurrency;
  appliedRate: number;
  feeAmount: number;
}

const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  NGN: '₦',
};

/**
 * Safely parse amount into exact fixed 2 decimal places to prevent IEEE-754 precision loss
 */
export function toExactDecimal(amount: number): number {
  if (isNaN(amount) || !isFinite(amount)) return 0;
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

/**
 * Format currency amount with symbol and exact 2 decimal places
 */
export function formatMoney(amount: number, currency: SupportedCurrency = 'USD'): string {
  const cleanAmount = toExactDecimal(amount);
  const symbol = CURRENCY_SYMBOLS[currency] || '$';
  return `${symbol}${cleanAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Central FX conversion logic with explicit fee calculation
 */
export function calculateFXConversion({
  amount,
  fromCurrency,
  toCurrency,
  rate,
}: FXConversionParams): FXConversionResult {
  const cleanSource = toExactDecimal(amount);
  const feeAmount = toExactDecimal(cleanSource * 0.005); // 0.5% fee
  const netAmount = cleanSource - feeAmount;
  const rawTarget = netAmount * rate;
  const cleanTarget = toExactDecimal(rawTarget);

  return {
    sourceAmount: cleanSource,
    targetAmount: cleanTarget,
    fromCurrency,
    toCurrency,
    appliedRate: rate,
    feeAmount,
  };
}

/**
 * Verify if double-entry debit and credit totals match exactly
 */
export function verifyLedgerBalance(debits: number[], credits: number[]): boolean {
  const totalDebits = debits.reduce((acc, v) => acc + toExactDecimal(v), 0);
  const totalCredits = credits.reduce((acc, v) => acc + toExactDecimal(v), 0);
  return toExactDecimal(totalDebits) === toExactDecimal(totalCredits);
}
