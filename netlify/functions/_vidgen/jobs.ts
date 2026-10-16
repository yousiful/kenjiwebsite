import { DISPATCH_LOCK, refundGeneration, type Db, type Row } from './db';
import { hfSubmit, hfStatus, outputUrl, type HfRequestStatus } from './hf';
import { hmacWith, safeEqual, sessionSecret } from './common';
import { MAX_RUNNING_PER_USER } from '../../../src/vidgen/models';

/**
 * Generation job lifecycle.
 *
 *   queued       waiting for a free Higgsfield slot (credits already held)
 *   submitting   claimed by a dispatcher, POST in flight
 *   submitted    accepted by Higgsfield (their "queued")
 *   in_progress  rendering
 *   completed    output URL known; media_stored flips true once copied to Blobs
 *   failed | nsfw | canceled   credits refunded
 *
 * Higgsfield allows only a few concurrent requests per account (about 4), so jobs
 * wait in our DB and are submitted when a slot frees up: from the generate call
 * itself, from the library poll, and from the every-minute vidgen-queue function.
 */

export const GLOBAL_CAP = () => Math.max(1, Math.min(20, Number(process.env.VIDGEN_HF_CONCURRENCY || 3)));
const MAX_ATTEMPTS = 10;
const GIVE_UP_AFTER_MIN = 180;

export function hookSig(gid: string): string {
  const s = sessionSecret();
  return s ? hmacWith(s, 'hook:' + gid).slice(0, 32) : '';
}
export const checkHookSig = (gid: string, sig: string) => !!sig && safeEqual(hookSig(gid), sig);

export function webhookUrl(origin: string, gid: string): string | undefined {
  if (!/^https:\/\//.test(origin) || process.env.NETLIFY_DEV === 'true') return undefined; // Higgsfield needs a public HTTPS URL
  return `${origin}/.netlify/functions/vidgen-hf-webhook?gid=${gid}&sig=${hookSig(gid)}`;
}

/** Atomically claims the oldest queued job that fits both the account cap and the per-user cap. */
export async function claimNext(db: Db): Promise<Row | null> {
  const [, rows] = await db.tx([
    [`SELECT pg_advisory_xact_lock(${DISPATCH_LOCK})`],
    [
      `UPDATE vg_generations g SET status = 'submitting', attempts = g.attempts + 1, updated_at = now()
       WHERE g.id = (
         SELECT q.id FROM vg_generations q
         WHERE q.status = 'queued' AND q.next_try_at <= now()
           AND (SELECT count(*) FROM vg_generations a WHERE a.status IN ('submitting','submitted','in_progress')) < $1
           AND (SELECT count(*) FROM vg_generations a WHERE a.user_id = q.user_id AND a.status IN ('submitting','submitted','in_progress')) < $2
         ORDER BY q.created_at
         LIMIT 1
         FOR UPDATE SKIP LOCKED
       )
       RETURNING g.*`,
      [GLOBAL_CAP(), MAX_RUNNING_PER_USER],
    ],
  ]);
  return rows[0] || null;
}

async function failAndRefund(db: Db, gid: string, status: 'failed' | 'nsfw' | 'canceled', error: string) {
  await db.q(
    `UPDATE vg_generations SET status = $2, error = $3, finished_at = now(), updated_at = now()
     WHERE id = $1 AND status NOT IN ('completed','failed','nsfw','canceled')`,
    [gid, status, error.slice(0, 500)],
  );
  await refundGeneration(db, gid);
}

export async function submitJob(db: Db, job: Row, origin: string): Promise<'submitted' | 'busy' | 'retry' | 'rejected'> {
  const gid = String(job.id);
  const body = typeof job.hf_body === 'string' ? JSON.parse(job.hf_body) : job.hf_body;
  const r = await hfSubmit(String(job.hf_path), body, gid, webhookUrl(origin, gid));
  if (r.ok) {
    await db.q(
      `UPDATE vg_generations SET status = CASE WHEN $3 = 'in_progress' THEN 'in_progress' ELSE 'submitted' END,
         hf_request_id = $2, submitted_at = now(), checked_at = now(), updated_at = now()
       WHERE id = $1 AND status = 'submitting'`,
      [gid, r.requestId, r.status],
    );
    return 'submitted';
  }
  console.warn(`vidgen submit ${gid}: ${r.kind} ${r.status} ${r.detail}`);
  if (r.kind === 'reject') {
    await failAndRefund(db, gid, 'failed', `rejected ${r.status}: ${r.detail}`);
    return 'rejected';
  }
  const ageMin = (Date.now() - new Date(job.created_at).getTime()) / 60000;
  if (r.kind === 'retry' && (Number(job.attempts) >= MAX_ATTEMPTS || ageMin > GIVE_UP_AFTER_MIN)) {
    await failAndRefund(db, gid, 'failed', `gave up after ${job.attempts} tries: ${r.status} ${r.detail}`);
    return 'rejected';
  }
  // busy: the account is at its concurrency cap, try again soon without counting it as a failed attempt
  const waitSec = r.kind === 'busy' ? 20 : Math.min(600, 15 * 2 ** Math.min(6, Number(job.attempts)));
  await db.q(
    `UPDATE vg_generations SET status = 'queued', next_try_at = now() + ($2 || ' seconds')::interval,
       attempts = CASE WHEN $3 THEN GREATEST(attempts - 1, 0) ELSE attempts END, updated_at = now()
     WHERE id = $1 AND status = 'submitting'`,
    [gid, String(waitSec), r.kind === 'busy'],
  );
  return r.kind;
}

/** Submits as many queued jobs as there are free slots (bounded per call). */
export async function dispatch(db: Db, origin: string, max = 4): Promise<number> {
  let n = 0;
  for (let i = 0; i < max; i++) {
    const job = await claimNext(db);
    if (!job) break;
    const r = await submitJob(db, job, origin);
    if (r === 'submitted') n++;
    if (r === 'busy') break;
  }
  return n;
}

export type Applied = { changed: boolean; completed: boolean };

/** Applies a status we fetched ourselves from Higgsfield. Terminal transitions happen once (conditional UPDATE). */
export async function applyStatus(db: Db, gid: string, s: HfRequestStatus): Promise<Applied> {
  if (s.status === 'queued' || s.status === 'in_progress') {
    const rows = await db.q(
      `UPDATE vg_generations SET status = $2, hf_request_id = COALESCE(hf_request_id, $3), checked_at = now(), updated_at = now()
       WHERE id = $1 AND status IN ('submitting','submitted','in_progress') RETURNING id`,
      [gid, s.status === 'queued' ? 'submitted' : 'in_progress', s.request_id],
    );
    return { changed: rows.length > 0, completed: false };
  }
  if (s.status === 'completed') {
    const url = outputUrl(s);
    if (!url) {
      await failAndRefund(db, gid, 'failed', 'completed without an output url');
      return { changed: true, completed: false };
    }
    const rows = await db.q(
      `UPDATE vg_generations SET status = 'completed', hf_output_url = $2, hf_request_id = COALESCE(hf_request_id, $3),
         finished_at = now(), checked_at = now(), updated_at = now()
       WHERE id = $1 AND status IN ('submitting','submitted','in_progress') RETURNING id`,
      [gid, url, s.request_id],
    );
    return { changed: rows.length > 0, completed: rows.length > 0 };
  }
  await failAndRefund(db, gid, s.status, s.error || s.status);
  return { changed: true, completed: false };
}

/** Polls Higgsfield for active jobs that have not been checked recently (webhook fallback). */
export async function refreshActive(db: Db, opts: { uid?: string; staleSec: number; limit: number }): Promise<string[]> {
  const rows = await db.q(
    `SELECT id, hf_request_id FROM vg_generations
     WHERE status IN ('submitted','in_progress') AND hf_request_id IS NOT NULL
       AND (checked_at IS NULL OR checked_at < now() - ($1 || ' seconds')::interval)
       ${opts.uid ? 'AND user_id = $3' : ''}
     ORDER BY checked_at NULLS FIRST LIMIT $2`,
    opts.uid ? [String(opts.staleSec), opts.limit, opts.uid] : [String(opts.staleSec), opts.limit],
  );
  const completed: string[] = [];
  await Promise.all(
    rows.map(async (r) => {
      try {
        const s = await hfStatus(String(r.hf_request_id));
        const a = await applyStatus(db, String(r.id), s);
        if (a.completed) completed.push(String(r.id));
        if (!a.changed) await db.q(`UPDATE vg_generations SET checked_at = now() WHERE id = $1`, [r.id]);
      } catch (e) {
        console.warn('vidgen refresh', r.id, e instanceof Error ? e.message : e);
        await db.q(`UPDATE vg_generations SET checked_at = now() WHERE id = $1`, [r.id]);
      }
    }),
  );
  return completed;
}

/** Jobs stuck in 'submitting' (a function died mid-POST) go back to the queue; the idempotency key makes the resubmit safe. */
export async function requeueStale(db: Db): Promise<number> {
  const rows = await db.q(
    `UPDATE vg_generations SET status = 'queued', next_try_at = now(), updated_at = now()
     WHERE status = 'submitting' AND updated_at < now() - interval '3 minutes' RETURNING id`,
  );
  return rows.length;
}

/** Starts the background copy of a finished video into Netlify Blobs. Returns quickly (background functions answer 202). */
export async function triggerStore(origin: string, gid: string): Promise<void> {
  try {
    await fetch(`${origin}/.netlify/functions/vidgen-store-background`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gid, sig: hookSig(gid) }),
      signal: AbortSignal.timeout(4000),
    });
  } catch (e) {
    console.warn('vidgen triggerStore', gid, e instanceof Error ? e.message : e); // the every-minute sweep retries
  }
}
