// ====================================================================
// FINARA UNIT TEST SUITE: DOUBLE-ENTRY ACCOUNTING LEDGER
// ====================================================================

import { createDoubleEntryTransaction } from '../../src/services/ledger';

export function runLedgerUnitTests() {
  console.log('[TEST SUITE] Running Double-Entry Ledger Unit Tests...');

  // Test 1: Valid double entry creation
  const res1 = createDoubleEntryTransaction({
    idempotencyKey: 'idemp_test_001',
    userId: 'usr_test',
    type: 'internal_transfer',
    amount: 500.00,
    fee: 2.50,
    currency: 'USD',
    sourceAccountCode: '2010-USER-WALLET',
    destinationAccountCode: '2010-RECIPIENT-WALLET',
  });

  if (!res1.success) throw new Error(`Ledger Test 1 Failed: ${res1.error}`);
  if (res1.entries.length !== 3) throw new Error(`Ledger Test 1 Failed: Expected 3 entries (debit, credit, fee), got ${res1.entries.length}`);

  // Test 2: Reject negative or zero amount
  const res2 = createDoubleEntryTransaction({
    idempotencyKey: 'idemp_test_002',
    userId: 'usr_test',
    type: 'internal_transfer',
    amount: -100.00,
    currency: 'USD',
    sourceAccountCode: '2010-USER-WALLET',
    destinationAccountCode: '2010-RECIPIENT-WALLET',
  });

  if (res2.success) throw new Error('Ledger Test 2 Failed: Negative transfer was allowed unexpectedly.');

  console.log('✅ [PASSED] Double-Entry Ledger Unit Tests');
  return true;
}
