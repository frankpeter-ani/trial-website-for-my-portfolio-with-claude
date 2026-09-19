// ====================================================================
// FINARA UNIT TEST SUITE: MONEY PRECISION & FX ARITHMETIC
// ====================================================================

import { toExactDecimal, formatMoney, calculateFXConversion, verifyLedgerBalance } from '../../src/lib/money';

export function runMoneyUnitTests() {
  console.log('[TEST SUITE] Running Money Precision Unit Tests...');

  // Test 1: Anti-floating point precision
  const p1 = toExactDecimal(0.1 + 0.2);
  if (p1 !== 0.3) throw new Error(`Money Test 1 Failed: Expected 0.3, got ${p1}`);

  // Test 2: Currency Formatting
  const f1 = formatMoney(12819.25, 'USD');
  if (f1 !== '$12,819.25') throw new Error(`Money Test 2 Failed: Expected $12,819.25, got ${f1}`);

  // Test 3: Ledger Invariance Rule
  const balanced = verifyLedgerBalance([100.00], [99.50, 0.50]);
  if (!balanced) throw new Error('Money Test 3 Failed: Balanced debits and credits failed check.');

  const unbalanced = verifyLedgerBalance([100.00], [50.00]);
  if (unbalanced) throw new Error('Money Test 4 Failed: Unbalanced ledger passed check unexpectedly.');

  // Test 4: FX Conversion Fee Math
  const fx = calculateFXConversion({ amount: 1000, fromCurrency: 'USD', toCurrency: 'EUR', rate: 0.92 });
  if (fx.feeAmount !== 5.00) throw new Error(`Money Test 5 Failed: Expected fee 5.00, got ${fx.feeAmount}`);

  console.log('✅ [PASSED] Money Precision Unit Tests');
  return true;
}
