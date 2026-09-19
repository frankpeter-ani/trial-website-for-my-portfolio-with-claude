import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import {
  TRANSITIONS, TRANSACTION_STATUSES, canTransition, checkTransition,
  isTerminal, TERMINAL_STATUSES, type TransactionStatus,
} from '../../src/services/transactionState.ts';

const here = dirname(fileURLToPath(import.meta.url));
const MIGRATION = resolve(here, '../../supabase/migrations/0005_transactions.sql');

/** Parse the SQL CASE in transaction_transition_allowed() into the same shape. */
function parseSqlTransitions(): Record<string, string[]> {
  const sql = readFileSync(MIGRATION, 'utf8');
  const fn = sql.slice(sql.indexOf('function transaction_transition_allowed'));
  const body = fn.slice(fn.indexOf('case p_from'), fn.indexOf('end;'));
  const out: Record<string, string[]> = {};
  for (const line of body.split('\n')) {
    const m = /when\s+'(\w+)'\s+then\s+(.*)$/.exec(line.trim());
    if (!m) continue;
    const [, from, rest] = m;
    if (/^false/.test(rest)) { out[from] = []; continue; }
    const inList = /p_to in \(([^)]*)\)/.exec(rest);
    out[from] = inList ? [...inList[1].matchAll(/'(\w+)'/g)].map((x) => x[1]) : [];
  }
  return out;
}

describe('transaction state machine — SQL/TS parity', () => {
  it('the SQL function and the TS mirror define the same transitions', () => {
    const sqlTable = parseSqlTransitions();
    assert.ok(Object.keys(sqlTable).length > 0, 'failed to parse the SQL CASE');

    for (const status of TRANSACTION_STATUSES) {
      assert.ok(status in sqlTable, `SQL is missing a branch for "${status}"`);
      assert.deepEqual(
        [...sqlTable[status]].sort(),
        [...TRANSITIONS[status]].sort(),
        `transitions differ for "${status}" — SQL and TS have drifted`,
      );
    }
    for (const status of Object.keys(sqlTable)) {
      assert.ok(
        (TRANSACTION_STATUSES as readonly string[]).includes(status),
        `SQL defines unknown status "${status}"`,
      );
    }
  });

  it('every status in the enum is covered by the TS table', () => {
    for (const s of TRANSACTION_STATUSES) assert.ok(Array.isArray(TRANSITIONS[s]));
  });
});

describe('transaction state machine — behaviour', () => {
  it('allows the documented happy path', () => {
    assert.ok(canTransition('initiated', 'pending'));
    assert.ok(canTransition('pending', 'processing'));
    assert.ok(canTransition('processing', 'completed'));
  });

  it('refuses to skip straight to completed', () => {
    assert.equal(canTransition('initiated', 'completed'), false);
    assert.equal(canTransition('pending', 'completed'), false);
  });

  it('treats failed, cancelled, reversed and refunded as terminal', () => {
    assert.deepEqual([...TERMINAL_STATUSES].sort(),
      ['cancelled', 'failed', 'refunded', 'reversed']);
    for (const s of TERMINAL_STATUSES) {
      assert.ok(isTerminal(s));
      for (const t of TRANSACTION_STATUSES) assert.equal(canTransition(s, t), false);
    }
  });

  it('permits reversal and refund only from completed', () => {
    for (const s of TRANSACTION_STATUSES) {
      const expected = s === 'completed';
      assert.equal(canTransition(s, 'reversed'), expected, `reversed from ${s}`);
      assert.equal(canTransition(s, 'refunded'), expected, `refunded from ${s}`);
    }
  });

  it('reports a no-op and a terminal move with distinct codes', () => {
    const noop = checkTransition('pending', 'pending');
    assert.equal(noop.ok, false);
    if (!noop.ok) assert.equal(noop.code, 'NO_OP_TRANSITION');

    const term = checkTransition('failed', 'processing');
    assert.equal(term.ok, false);
    if (!term.ok) assert.equal(term.code, 'TERMINAL_STATUS');

    const illegal = checkTransition('initiated', 'completed');
    assert.equal(illegal.ok, false);
    if (!illegal.ok) assert.equal(illegal.code, 'ILLEGAL_TRANSITION');
  });

  it('never allows a transition out of a terminal state, exhaustively', () => {
    let checked = 0;
    for (const from of TRANSACTION_STATUSES) {
      for (const to of TRANSACTION_STATUSES) {
        checked++;
        if (isTerminal(from)) assert.equal(canTransition(from, to as TransactionStatus), false);
      }
    }
    assert.equal(checked, TRANSACTION_STATUSES.length ** 2);
  });
});
