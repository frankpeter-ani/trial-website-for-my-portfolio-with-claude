// ====================================================================
// FINARA RISK EVALUATION ENGINE
// Configurable Risk Rule Engine & Real-Time Assessment
// ====================================================================

export interface RiskEvaluationRequest {
  userId: string;
  amount: number;
  currency: string;
  recipientEmail?: string;
  deviceFingerprint?: string;
  userAccountAgeDays?: number;
}

export interface RiskEvaluationResult {
  score: number; // 0 (Lowest Risk) to 100 (Highest Risk)
  action: 'approved' | 'flagged_for_review' | 'blocked';
  reasons: string[];
  evaluatedAt: string;
}

/**
 * Evaluate transaction context against risk rules
 */
export function evaluateTransactionRisk(req: RiskEvaluationRequest): RiskEvaluationResult {
  let score = 5; // Base minimal score
  const reasons: string[] = [];

  // Rule 1: High Amount Threshold Check
  if (req.amount >= 25000) {
    score += 45;
    reasons.push('High value transfer exceeds $25,000 threshold.');
  } else if (req.amount >= 10000) {
    score += 25;
    reasons.push('Transfer exceeds $10,000 threshold.');
  }

  // Rule 2: Account Age Check
  if (req.userAccountAgeDays !== undefined && req.userAccountAgeDays < 7 && req.amount > 1000) {
    score += 30;
    reasons.push('High value transfer on new account (< 7 days old).');
  }

  // Rule 3: Suspicious Recipient Email Domain Check
  if (req.recipientEmail && req.recipientEmail.endsWith('.tmp')) {
    score += 40;
    reasons.push('Recipient domain flagged as high risk temporary domain.');
  }

  let action: 'approved' | 'flagged_for_review' | 'blocked' = 'approved';
  if (score >= 75) {
    action = 'blocked';
  } else if (score >= 40) {
    action = 'flagged_for_review';
  }

  return {
    score: Math.min(100, score),
    action,
    reasons: reasons.length > 0 ? reasons : ['Standard low-risk pattern confirmed.'],
    evaluatedAt: new Date().toISOString(),
  };
}
