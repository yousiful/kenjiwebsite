import type { Handler, HandlerEvent } from '@netlify/functions';
import { connectLambda, getStore } from '@netlify/blobs';
import type { SessionRecord, EventBlob } from './funnel-track';

// Secret-protected read endpoint behind kenjiai.com/funnel-stats/.
// GET ?funnel=lowticket&days=7 -> raw sessions for the dashboard to aggregate.
// Uses the same WEBINAR_STATS_SECRET as webinar-stats so there's one secret to manage.

// Blobs context comes from the invocation event (connectLambda). The old
// NETLIFY_BLOBS_TOKEN env var was a personal token that got revoked, which
// silently broke tracking with 401s; this needs no token.
function funnelStore(event: HandlerEvent) {
  connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
  return getStore('funnel-sessions');
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };

  const secret = process.env.WEBINAR_STATS_SECRET;
  if (!secret || event.headers['x-webinar-stats-secret'] !== secret) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const funnel = event.queryStringParameters?.funnel === 'kenjiai' ? 'kenjiai' : 'lowticket';
  const days = Math.min(Math.max(Number(event.queryStringParameters?.days) || 7, 1), 60);
  // ?offset=N reads just the one UTC day N days ago. Site-wide kenjiai traffic is too many blobs
  // to read 7 days inside the 10s function limit (502s), so the dashboard asks day by day in
  // parallel and merges by sid.
  const offsetParam = event.queryStringParameters?.offset;
  const offset = offsetParam === undefined ? null : Math.min(Math.max(Math.floor(Number(offsetParam)) || 0, 0), 59);
  const store = funnelStore(event);

  // Keys are <funnel>/<day>/<sid>/<step>. A session that crosses midnight UTC
  // shows up under both days, and grouping by sid joins it back up.
  const bySid = new Map<string, SessionRecord & { sid: string }>();
  const pageViewKey = new Map<string, string>();
  for (let d = offset ?? 0; d < (offset === null ? days : offset + 1); d++) {
    const day = new Date(Date.now() - d * 864e5).toISOString().slice(0, 10);
    const { blobs } = await store.list({ prefix: `${funnel}/${day}/` });
    for (const b of blobs) {
      const [, , sid, step] = b.key.split('/');
      if (!sid || !step) continue;
      const rec = bySid.get(sid) || { sid, firstSeen: '', lastSeen: '', steps: {}, utm_source: '', utm_campaign: '', utm_content: '', device: '', page: '', version: '' };
      rec.steps[step] = day; // truthy marker; the dashboard checks steps[step]
      bySid.set(sid, rec);
      if (step === 'page_view') pageViewKey.set(sid, b.key);
    }
  }
  // Only page_view blobs carry utm/device and the visit time, so fetch just those.
  await Promise.all(
    [...pageViewKey.entries()].map(async ([sid, key]) => {
      const pv = (await store.get(key, { type: 'json' })) as EventBlob | null;
      const rec = bySid.get(sid);
      if (!pv || !rec) return;
      rec.firstSeen = pv.t;
      rec.utm_source = pv.utm_source || '';
      rec.utm_campaign = pv.utm_campaign || '';
      rec.utm_content = pv.utm_content || '';
      rec.device = pv.device || '';
      rec.page = pv.page || '/';
      rec.version = pv.version || 'before-versioning';
    }),
  );
  const sessions = [...bySid.values()];

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({ funnel, days, sessions, fetchedAt: new Date().toISOString() }),
  };
};
