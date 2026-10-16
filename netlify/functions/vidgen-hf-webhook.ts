import type { Context } from '@netlify/functions';
import { json, isUuid, siteUrl } from './_vidgen/common';
import { neonDb, ensureSchema } from './_vidgen/db';
import { hfConfigured, hfStatus, HF_STATUSES } from './_vidgen/hf';
import { applyStatus, checkHookSig, triggerStore } from './_vidgen/jobs';

/**
 * Higgsfield webhook (hf_webhook on submit), POSTed when a request ends completed,
 * failed or nsfw. The payload is never trusted: we only take its request_id, then
 * re-fetch /requests/<id>/status with our own key and apply that. The URL carries
 * our generation id plus an HMAC so a delivery can only touch the job it was made for.
 * Duplicates are expected (deduped on request_id + status) and always get a 2xx.
 * Must answer within 10 seconds, so the video copy runs in vidgen-store-background.
 */

export default async (req: Request, context: Context): Promise<Response> => {
  if (req.method !== 'POST') return json(405, { ok: false });
  const url = new URL(req.url);
  const gid = url.searchParams.get('gid') || '';
  const sig = url.searchParams.get('sig') || '';
  if (!isUuid(gid) || !checkHookSig(gid, sig)) return json(400, { ok: false });

  let payload: { request_id?: unknown; status?: unknown };
  try {
    payload = JSON.parse(await req.text());
  } catch {
    return json(400, { ok: false });
  }
  const requestId = String(payload?.request_id || '');
  if (!isUuid(requestId) || !HF_STATUSES.includes(payload?.status as never)) return json(400, { ok: false });

  const db = neonDb();
  if (!db || !hfConfigured()) return json(503, { ok: false }); // 5xx: Higgsfield retries for up to two hours
  try {
    await ensureSchema(db);
    const seen = await db.q(
      `INSERT INTO vg_webhook_events (source, event_id, status) VALUES ('hf', $1, $2) ON CONFLICT DO NOTHING RETURNING event_id`,
      [requestId, String(payload.status)],
    );
    const rows = await db.q(`SELECT id, status, hf_request_id FROM vg_generations WHERE id = $1`, [gid]);
    const g = rows[0];
    if (!g) return json(200, { ok: true, ignored: 'unknown' });
    if (g.hf_request_id && g.hf_request_id !== requestId) return json(200, { ok: true, ignored: 'mismatch' });
    if (!seen.length && ['completed', 'failed', 'nsfw', 'canceled'].includes(String(g.status))) return json(200, { ok: true, duplicate: true });

    const s = await hfStatus(requestId, 5000); // the truth, from Higgsfield, with our key
    if (s.request_id && s.request_id !== requestId) return json(200, { ok: true, ignored: 'mismatch' });
    const a = await applyStatus(db, gid, s);
    if (a.completed) await triggerStore(siteUrl(context), gid);
    return json(200, { ok: true });
  } catch (e) {
    console.error('vidgen-hf-webhook', gid, e);
    // undo the dedupe mark so the retry is processed
    await db.q(`DELETE FROM vg_webhook_events WHERE source = 'hf' AND event_id = $1 AND status = $2`, [requestId, String(payload.status)]).catch(() => undefined);
    return json(500, { ok: false });
  }
};
