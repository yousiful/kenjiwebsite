import type { Handler, HandlerEvent } from '@netlify/functions';
import { getStore } from '@netlify/blobs';
import type { SessionRecord } from './funnel-track';

// Secret-protected read endpoint behind kenjiai.com/funnel-stats/.
// GET ?funnel=lowticket&days=7 -> raw sessions for the dashboard to aggregate.
// Uses the same WEBINAR_STATS_SECRET as webinar-stats so there's one secret to manage.

const SITE_ID = '22d32da4-ca6e-4ea2-aea7-156e152407f5';
function funnelStore() {
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  return token ? getStore({ name: 'funnel-sessions', siteID: SITE_ID, token }) : getStore('funnel-sessions');
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'GET') return { statusCode: 405, body: 'Method Not Allowed' };

  const secret = process.env.WEBINAR_STATS_SECRET;
  if (!secret || event.headers['x-webinar-stats-secret'] !== secret) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const funnel = 'lowticket'; // only funnel tracked so far
  const days = Math.min(Math.max(Number(event.queryStringParameters?.days) || 7, 1), 60);
  const store = funnelStore();

  const sessions: SessionRecord[] = [];
  for (let d = 0; d < days; d++) {
    const day = new Date(Date.now() - d * 864e5).toISOString().slice(0, 10);
    const { blobs } = await store.list({ prefix: `${funnel}/${day}/` });
    const recs = await Promise.all(blobs.map((b) => store.get(b.key, { type: 'json' }) as Promise<SessionRecord | null>));
    for (const r of recs) if (r) sessions.push(r);
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify({ funnel, days, sessions, fetchedAt: new Date().toISOString() }),
  };
};
