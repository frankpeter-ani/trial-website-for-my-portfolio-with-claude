// ====================================================================
// FINARA TEST RUNNER SUITE
// Master Test Orchestration for Unit, Ledger, and Security Tests
// ====================================================================

import { runMoneyUnitTests } from './unit/money.test';
import { runLedgerUnitTests } from './unit/ledger.test';
import { runSecurityTestSuite } from './security/security.test';

export function runAllPlatformTests() {
  console.log('====================================================');
  console.log('       FINARA AUTOMATED SUITE EXECUTING             ');
  console.log('====================================================');

  try {
    runMoneyUnitTests();
    runLedgerUnitTests();
    runSecurityTestSuite();

    console.log('====================================================');
    console.log('   🎉 ALL 12 AUTOMATED PLATFORM TESTS PASSED!       ');
    console.log('====================================================');
    return true;
  } catch (err: any) {
    console.error('❌ [TEST SUITE FAILURE]:', err.message);
    return false;
  }
}

// Auto-execute if invoked directly
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  runAllPlatformTests();
}
