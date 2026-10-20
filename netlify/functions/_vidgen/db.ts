// Plain Neon client on purpose: depending on @netlify/neon makes Netlify run its DB extension step on every
// build, and that step failed every deploy on 2026-10-16 (exit code 3). Same neon() API, same NETLIFY_DATABASE_URL.
import { neon } from '@neondatabase/serverless';
import { getConnectionString } from '@netlify/database';
import { TRIAL_CREDITS, MAX_RUNNING_PER_USER, REFUND_STATUSES } from '../../../src/vidgen/models';

/**
 * Kenji Studio storage: Netlify DB (Neon Postgres, env NETLIFY_DATABASE_URL).
 * Tables are prefixed vg_. The canonical migration is db/migrations/vidgen_001_init.sql;
 * SCHEMA below is the same set of statements, run idempotently once per cold start.
 *
 * Credits live in an append-only ledger (vg_credit_ledger): balance = SUM(delta).
 * Every write carries a unique ref (trial:<uid>, hold:<gid>, refund:<gid>, invoice:<id>,
 * topup:<checkout id>, expire:<sub id>) so retries and duplicate webhooks never
 * double-count. A debit locks the user's row first (SELECT ... FOR UPDATE inside one
 * transaction), so two generations started at the same moment cannot overdraw.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

export interface Db {
  q(text: string, params?: unknown[]): Promise<Row[]>;
  /** Runs the statements in one non-interactive transaction and returns each statement's rows. */
  tx(stmts: [string, unknown[]?][]): Promise<Row[][]>;
}

export const SCHEMA = `
CREATE TABLE IF NOT EXISTS vg_users (
  id uuid PRIMARY KEY,
  google_sub text NOT NULL UNIQUE,
  email text NOT NULL,
  name text NOT NULL DEFAULT '',
  picture text NOT NULL DEFAULT '',
  plan text NOT NULL DEFAULT 'none',
  sub_status text NOT NULL DEFAULT '',
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vg_credit_ledger (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES vg_users(id),
  delta integer NOT NULL,
  reason text NOT NULL,
  ref text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS vg_credit_ledger_user ON vg_credit_ledger (user_id);

CREATE TABLE IF NOT EXISTS vg_generations (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES vg_users(id),
  goal text NOT NULL,
  model text NOT NULL,
  title text NOT NULL DEFAULT '',
  prompt text NOT NULL DEFAULT '',
  aspect text,
  seconds integer NOT NULL DEFAULT 0,
  hf_path text NOT NULL,
  hf_body jsonb NOT NULL,
  credits integer NOT NULL,
  est_usd numeric(12,4) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'queued',
  hf_request_id text UNIQUE,
  hf_output_url text,
  error text,
  attempts integer NOT NULL DEFAULT 0,
  next_try_at timestamptz NOT NULL DEFAULT now(),
  media_stored boolean NOT NULL DEFAULT false,
  media_bytes bigint,
  media_type text,
  store_attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  checked_at timestamptz,
  finished_at timestamptz
);
CREATE INDEX IF NOT EXISTS vg_generations_user ON vg_generations (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS vg_generations_status ON vg_generations (status);

CREATE TABLE IF NOT EXISTS vg_uploads (
  public_url text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES vg_users(id),
  kind text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vg_usage (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  kind text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS vg_usage_lookup ON vg_usage (user_id, kind, created_at);

CREATE TABLE IF NOT EXISTS vg_ip_usage (
  id bigserial PRIMARY KEY,
  ip_hash text NOT NULL,
  kind text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS vg_ip_usage_lookup ON vg_ip_usage (ip_hash, kind, created_at);

CREATE TABLE IF NOT EXISTS vg_webhook_events (
  source text NOT NULL,
  event_id text NOT NULL,
  status text NOT NULL DEFAULT '',
  received_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (source, event_id, status)
);
`;

export const schemaStatements = (sql = SCHEMA) =>
  sql
    .split('\n')
    .filter((l) => !l.trim().startsWith('--'))
    .join('\n')
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean);

const SCHEMA_LOCK = 7302001;
const DISPATCH_LOCK = 7302002;
export { DISPATCH_LOCK };

/** Netlify Database (managed Postgres, provisioned on deploy). The legacy Neon extension's NETLIFY_DATABASE_URL stopped authenticating 2026-10-20. */
function netlifyDatabaseUrl(): string | undefined {
  try {
    return getConnectionString();
  } catch {
    return undefined;
  }
}

export function neonDb(url?: string): Db | null {
  const conn = url || netlifyDatabaseUrl() || process.env.NETLIFY_DATABASE_URL;
  if (!conn) return null;
  const sql = neon(conn);
  return {
    q: (text, params = []) => sql.query(text, params as unknown[]) as Promise<Row[]>,
    tx: (stmts) => sql.transaction(stmts.map(([t, p]) => sql.query(t, (p || []) as unknown[]))) as Promise<Row[][]>,
  };
}

let schemaReady: Promise<void> | null = null;

/** Ensures the schema once per cold start. A transaction-scoped advisory lock keeps parallel cold starts from racing. */
export function ensureSchema(db: Db): Promise<void> {
  if (!schemaReady) {
    schemaReady = db
      .tx([[`SELECT pg_advisory_xact_lock(${SCHEMA_LOCK})`], ...schemaStatements().map((s) => [s] as [string])])
      .then(() => undefined)
      .catch((e) => {
        schemaReady = null;
        throw e;
      });
  }
  return schemaReady;
}

/** The ready database, or null when Netlify DB is not connected (functions answer 503). */
export async function readyDb(): Promise<Db | null> {
  const db = neonDb();
  if (!db) return null;
  await ensureSchema(db);
  return db;
}

// ---------- users ----------

export interface GoogleProfile { sub: string; email: string; name: string; picture: string }

/** Creates or updates the user for a Google account. New users get the free trial credits exactly once. */
export async function upsertUser(db: Db, p: GoogleProfile, newId: string): Promise<{ id: string; created: boolean }> {
  const rows = await db.q(
    `INSERT INTO vg_users (id, google_sub, email, name, picture) VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (google_sub) DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, picture = EXCLUDED.picture, updated_at = now()
     RETURNING id, (xmax = 0) AS created`,
    [newId, p.sub, p.email, p.name, p.picture],
  );
  const id = String(rows[0].id);
  await grant(db, id, TRIAL_CREDITS, 'trial', `trial:${id}`);
  return { id, created: !!rows[0].created };
}

export async function getUser(db: Db, uid: string): Promise<Row | null> {
  const rows = await db.q(`SELECT * FROM vg_users WHERE id = $1`, [uid]);
  return rows[0] || null;
}

// ---------- ledger ----------

export async function balance(db: Db, uid: string): Promise<number> {
  const rows = await db.q(`SELECT COALESCE(SUM(delta), 0)::int AS b FROM vg_credit_ledger WHERE user_id = $1`, [uid]);
  return Number(rows[0]?.b || 0);
}

/** Adds a ledger entry once per ref. Returns true when it was written now (false = already there). */
export async function grant(db: Db, uid: string, delta: number, reason: string, ref: string): Promise<boolean> {
  const rows = await db.q(
    `INSERT INTO vg_credit_ledger (user_id, delta, reason, ref) VALUES ($1, $2, $3, $4) ON CONFLICT (ref) DO NOTHING RETURNING id`,
    [uid, delta, reason, ref],
  );
  return rows.length > 0;
}

export interface NewGeneration {
  id: string;
  uid: string;
  goal: string;
  model: string;
  title: string;
  prompt: string;
  aspect: string | null;
  seconds: number;
  hfPath: string;
  hfBody: Record<string, unknown>;
  credits: number;
  estUsd: number;
}

export const MAX_WAITING_PER_USER = 6;

/**
 * Creates the generation and debits (holds) its credits in one transaction:
 *  1. lock the user's row (serializes this user's debits),
 *  2. insert the generation only if balance >= credits and the user has fewer than
 *     MAX_WAITING_PER_USER unfinished jobs,
 *  3. insert the hold only if step 2 inserted the row.
 * Returns 'ok', 'insufficient' or 'too-many'.
 */
export async function createGenerationWithHold(db: Db, g: NewGeneration): Promise<'ok' | 'insufficient' | 'too-many'> {
  const [, inserted] = await db.tx([
    [`SELECT id FROM vg_users WHERE id = $1 FOR UPDATE`, [g.uid]],
    [
      `INSERT INTO vg_generations (id, user_id, goal, model, title, prompt, aspect, seconds, hf_path, hf_body, credits, est_usd)
       SELECT $1::uuid, $2::uuid, $3, $4, $5, $6, $7, $8::int, $9, $10::jsonb, $11::int, $12::numeric
       WHERE (SELECT COALESCE(SUM(delta), 0) FROM vg_credit_ledger WHERE user_id = $2::uuid) >= $11::int
         AND (SELECT count(*) FROM vg_generations WHERE user_id = $2::uuid AND status IN ('queued','submitting','submitted','in_progress')) < $13::int
       RETURNING id`,
      [g.id, g.uid, g.goal, g.model, g.title, g.prompt, g.aspect, g.seconds, g.hfPath, JSON.stringify(g.hfBody), g.credits, g.estUsd, MAX_WAITING_PER_USER],
    ],
    [
      `INSERT INTO vg_credit_ledger (user_id, delta, reason, ref)
       SELECT $1, -$2::int, 'hold', $3
       WHERE EXISTS (SELECT 1 FROM vg_generations WHERE id = $4)
       ON CONFLICT (ref) DO NOTHING`,
      [g.uid, g.credits, `hold:${g.id}`, g.id],
    ],
  ]);
  if (inserted.length) return 'ok';
  const [bal, waiting] = await Promise.all([
    balance(db, g.uid),
    db.q(`SELECT count(*)::int AS n FROM vg_generations WHERE user_id = $1 AND status IN ('queued','submitting','submitted','in_progress')`, [g.uid]),
  ]);
  if (bal < g.credits) return 'insufficient';
  return Number(waiting[0]?.n || 0) >= MAX_WAITING_PER_USER ? 'too-many' : 'insufficient';
}

const REFUND_LIST = REFUND_STATUSES.map((s) => `'${s}'`).join(',');

/** Gives back a generation's held credits if it ended failed/nsfw/canceled. Safe to call any number of times. */
export async function refundGeneration(db: Db, gid: string): Promise<boolean> {
  const rows = await db.q(
    `INSERT INTO vg_credit_ledger (user_id, delta, reason, ref)
     SELECT g.user_id, g.credits, 'refund', 'refund:' || g.id::text FROM vg_generations g
     WHERE g.id = $1 AND g.status IN (${REFUND_LIST}) AND g.credits > 0
       AND EXISTS (SELECT 1 FROM vg_credit_ledger h WHERE h.ref = 'hold:' || g.id::text)
     ON CONFLICT (ref) DO NOTHING RETURNING id`,
    [gid],
  );
  return rows.length > 0;
}

/** Refunds every ended-without-video generation that somehow missed its refund (crash between steps). */
export async function sweepRefunds(db: Db): Promise<number> {
  const rows = await db.q(
    `INSERT INTO vg_credit_ledger (user_id, delta, reason, ref)
     SELECT g.user_id, g.credits, 'refund', 'refund:' || g.id::text FROM vg_generations g
     WHERE g.status IN (${REFUND_LIST}) AND g.credits > 0
       AND EXISTS (SELECT 1 FROM vg_credit_ledger h WHERE h.ref = 'hold:' || g.id::text)
     ON CONFLICT (ref) DO NOTHING RETURNING id`,
  );
  return rows.length;
}

/** Rate limit helper: records a use and says whether the person is still under `limit` per hour. */
export async function underHourlyLimit(db: Db, uid: string, kind: string, limit: number): Promise<boolean> {
  const rows = await db.q(
    `SELECT count(*)::int AS n FROM vg_usage WHERE user_id = $1 AND kind = $2 AND created_at > now() - interval '1 hour'`,
    [uid, kind],
  );
  if (Number(rows[0]?.n || 0) >= limit) return false;
  await db.q(`INSERT INTO vg_usage (user_id, kind) VALUES ($1, $2)`, [uid, kind]);
  return true;
}

/** Same as underHourlyLimit for signed-out visitors, keyed by a hashed IP. */
export async function underHourlyIpLimit(db: Db, ipHash: string, kind: string, limit: number): Promise<boolean> {
  const rows = await db.q(
    `SELECT count(*)::int AS n FROM vg_ip_usage WHERE ip_hash = $1 AND kind = $2 AND created_at > now() - interval '1 hour'`,
    [ipHash, kind],
  );
  if (Number(rows[0]?.n || 0) >= limit) return false;
  await db.q(`INSERT INTO vg_ip_usage (ip_hash, kind) VALUES ($1, $2)`, [ipHash, kind]);
  return true;
}

export { MAX_RUNNING_PER_USER };
