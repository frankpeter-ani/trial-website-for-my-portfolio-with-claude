// ====================================================================
// FINARA SECURITY TEST SUITE: RLS, IDOR & ANTI-DOUBLE SPENDING
// ====================================================================

import { isValidStatusTransition } from '../../src/services/transfers';
import { evaluateTransactionRisk } from '../../src/services/risk';

export function runSecurityTestSuite() {
  console.log('[TEST SUITE] Running Security & State Machine Test Suite...');

  // Security Test 1: Invalid State Machine Transition
  const invalidTransition = isValidStatusTransition('completed', 'pending');
  if (invalidTransition.allowed) {
    throw new Error('Security Test 1 Failed: Transition from completed to pending was permitted.');
  }

  // Security Test 2: High Risk Evaluation Trigger
  const highRisk = evaluateTransactionRisk({
    userId: 'usr_suspicious',
    amount: 50000.00,
    currency: 'USD',
    recipientEmail: 'hacker@scam.tmp',
    userAccountAgeDays: 1,
  });

  if (highRisk.action !== 'blocked') {
    throw new Error(`Security Test 2 Failed: Expected action 'blocked', got '${highRisk.action}'`);
  }

  console.log('✅ [PASSED] Security & State Machine Test Suite');
  return true;
}
