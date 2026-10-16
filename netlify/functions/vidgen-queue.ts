import type { Config, Context } from '@netlify/functions';
import { siteUrl } from './_vidgen/common';
import { neonDb, ensureSchema, sweepRefunds } from './_vidgen/db';
import { hfConfigured } from './_vidgen/hf';
import { dispatch, refreshActive, requeueStale, triggerStore } from './_vidgen/jobs';

/**
 * Every minute: keeps Kenji Studio's job queue moving even when nobody has the page open.
 *  1. jobs stuck mid-submit go back to the queue
 *  2. any ended-without-video job that missed its refund gets it
 *  3. active jobs not heard from in 45s are polled (webhook fallback)
 *  4. queued jobs are submitted while there are free Higgsfield slots
 *  5. finished videos not yet copied to Blobs get another copy attempt
 */

export default async (_req: Request, context: Context): Promise<Response> => {
  const db = neonDb();
  if (!db || !hfConfigured()) return new Response('vidgen-queue: not configured', { status: 200 });
  const origin = siteUrl(context);
  await ensureSchema(db);
  const requeued = await requeueStale(db);
  const refunded = await sweepRefunds(db);
  const done = await refreshActive(db, { staleSec: 45, limit: 10 });
  const submitted = await dispatch(db, origin, 6);
  const unstored = await db.q(
    `SELECT id FROM vg_generations WHERE status = 'completed' AND NOT media_stored AND hf_output_url IS NOT NULL
       AND store_attempts < 6 AND finished_at > now() - interval '6 days' AND updated_at < now() - interval '2 minutes'
     ORDER BY finished_at LIMIT 3`,
  );
  const toStore = [...new Set([...done, ...unstored.map((r) => String(r.id))])];
  await Promise.all(toStore.map((gid) => triggerStore(origin, gid)));
  const summary = `vidgen-queue: requeued ${requeued}, refunded ${refunded}, finished ${done.length}, submitted ${submitted}, store ${toStore.length}`;
  if (requeued || refunded || done.length || submitted || toStore.length) console.log(summary);
  return new Response(summary, { status: 200 });
};

export const config: Config = {
  schedule: '* * * * *',
};
