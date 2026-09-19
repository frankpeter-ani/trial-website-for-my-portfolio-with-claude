// ====================================================================
// FINARA TRANSACTION STATE MACHINE & TRANSFERS SERVICE
// State Machine Machine & Invariance Validation Engine
// ====================================================================

export type TransactionStatus =
  | 'initiated'
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'reversed'
  | 'refunded'
  | 'requires_review'
  | 'blocked';

const VALID_TRANSITIONS: Record<TransactionStatus, TransactionStatus[]> = {
  initiated: ['pending', 'processing', 'cancelled', 'blocked'],
  pending: ['processing', 'completed', 'failed', 'requires_review', 'blocked'],
  processing: ['completed', 'failed', 'requires_review', 'blocked'],
  requires_review: ['pending', 'processing', 'completed', 'cancelled', 'blocked'],
  completed: ['reversed', 'refunded'],
  failed: [],
  cancelled: [],
  reversed: [],
  refunded: [],
  blocked: [],
};

export interface StateTransitionResult {
  allowed: boolean;
  fromStatus: TransactionStatus;
  toStatus: TransactionStatus;
  reason?: string;
}

/**
 * Check if a transaction status transition is valid according to state machine rules
 */
export function isValidStatusTransition(
  currentStatus: TransactionStatus,
  targetStatus: TransactionStatus
): StateTransitionResult {
  const allowedNextStates = VALID_TRANSITIONS[currentStatus] || [];
  const allowed = allowedNextStates.includes(targetStatus);

  if (!allowed) {
    return {
      allowed: false,
      fromStatus: currentStatus,
      toStatus: targetStatus,
      reason: `Invalid transaction state transition from '${currentStatus}' to '${targetStatus}'.`,
    };
  }

  return {
    allowed: true,
    fromStatus: currentStatus,
    toStatus: targetStatus,
  };
}
