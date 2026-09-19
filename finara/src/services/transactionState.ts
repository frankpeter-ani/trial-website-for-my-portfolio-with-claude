// ====================================================================
// FINARA — TRANSACTION STATE MACHINE (client mirror)
// ====================================================================
// The DATABASE is the authority: supabase/migrations/0005_transactions.sql
// defines transaction_transition_allowed() and a BEFORE UPDATE trigger
// rejects anything illegal. This module mirrors that table so the UI can
// disable impossible actions and fail fast — it is a convenience, never a
// control. tests/unit/transactionState.test.ts parses the SQL and asserts
// the two tables are identical, so they cannot drift.

export const TRANSACTION_STATUSES = [
  'initiated', 'pending', 'processing', 'completed', 'failed',
  'cancelled', 'reversed', 'refunded', 'requires_review', 'blocked',
] as const;

export type TransactionStatus = (typeof TRANSACTION_STATUSES)[number];

export const TRANSITIONS: Readonly<Record<TransactionStatus, readonly TransactionStatus[]>> =
  Object.freeze({
    initiated:       ['pending', 'cancelled', 'failed', 'blocked', 'requires_review'],
    pending:         ['processing', 'cancelled', 'failed', 'blocked', 'requires_review'],
    processing:      ['completed', 'failed', 'requires_review'],
    requires_review: ['processing', 'blocked', 'cancelled', 'failed'],
    completed:       ['reversed', 'refunded'],
    blocked:         ['cancelled', 'requires_review'],
    failed:          [],
    cancelled:       [],
    reversed:        [],
    refunded:        [],
  });

/** Terminal states accept no further transition. */
export const TERMINAL_STATUSES: readonly TransactionStatus[] =
  TRANSACTION_STATUSES.filter((s) => TRANSITIONS[s].length === 0);

export function isTerminal(status: TransactionStatus): boolean {
  return TRANSITIONS[status].length === 0;
}

export function canTransition(from: TransactionStatus, to: TransactionStatus): boolean {
  return TRANSITIONS[from].includes(to);
}

export type TransitionCheck =
  | { readonly ok: true }
  | { readonly ok: false; readonly code: string; readonly message: string };

export function checkTransition(from: TransactionStatus, to: TransactionStatus): TransitionCheck {
  if (from === to) {
    return { ok: false, code: 'NO_OP_TRANSITION', message: `Already ${from}.` };
  }
  if (isTerminal(from)) {
    return {
      ok: false,
      code: 'TERMINAL_STATUS',
      message: `${from} is terminal; no further transition is possible.`,
    };
  }
  if (!canTransition(from, to)) {
    return {
      ok: false,
      code: 'ILLEGAL_TRANSITION',
      message: `Cannot move a transaction from ${from} to ${to}.`,
    };
  }
  return { ok: true };
}

/** Statuses a customer may still see change; useful for polling decisions. */
export function isSettled(status: TransactionStatus): boolean {
  return isTerminal(status) || status === 'completed';
}
