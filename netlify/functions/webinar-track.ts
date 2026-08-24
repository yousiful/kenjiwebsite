import type { Handler, HandlerEvent } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

// @netlify/blobs' automatic environment detection doesn't reliably reach esbuild-
// bundled TypeScript functions on this site (MissingBlobsEnvironmentError even
// when running on Netlify's own infra) — fall back to explicit manual config
// once NETLIFY_BLOBS_TOKEN is set. Site ID is public, safe to inline.
const SITE_ID = '22d32da4-ca6e-4ea2-aea7-156e152407f5';
function webinarStore() {
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  return token ? getStore({ name: 'webinar-stats', siteID: SITE_ID, token }) : getStore('webinar-stats');
}

// Event types the watch/replay pages actually send. Anything else is rejected
// so this public endpoint can't be used to stuff arbitrary data into the store.
const ALLOWED_EVENTS = new Set(['video_progress', 'video_watch_seconds', 'offer_revealed']);
const ALLOWED_PAGES = new Set(['watch', 'vsl2-watch', 'replay', 'overview']);
const MILESTONES = [25, 50, 75, 95, 100] as const;

interface IncomingEvent {
  event: string;
  page: string;
  percent?: number;
  seconds?: number;
}

interface PageAggregate {
  milestoneHits: Record<string, number>;
  offerRevealed: number;
  watchSecondsSum: number;
  watchSecondsCount: number;
  lastUpdated: string;
}

function emptyAggregate(): PageAggregate {
  return {
    milestoneHits: Object.fromEntries(MILESTONES.map((m) => [String(m), 0])),
    offerRevealed: 0,
    watchSecondsSum: 0,
    watchSecondsCount: 0,
    lastUpdated: new Date().toISOString(),
  };
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload: IncomingEvent;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!ALLOWED_EVENTS.has(payload.event) || !ALLOWED_PAGES.has(payload.page)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Unrecognized event or page' }) };
  }

  const store = webinarStore();
  const key = payload.page;
  const existing = (await store.get(key, { type: 'json' })) as PageAggregate | null;
  const agg: PageAggregate = existing || emptyAggregate();

  if (payload.event === 'video_progress') {
    const pct = Number(payload.percent);
    if (MILESTONES.includes(pct as (typeof MILESTONES)[number])) {
      agg.milestoneHits[String(pct)] = (agg.milestoneHits[String(pct)] || 0) + 1;
    }
  } else if (payload.event === 'video_watch_seconds') {
    const secs = Number(payload.seconds);
    if (Number.isFinite(secs) && secs > 0 && secs < 24 * 3600) {
      agg.watchSecondsSum += secs;
      agg.watchSecondsCount += 1;
    }
  } else if (payload.event === 'offer_revealed') {
    agg.offerRevealed += 1;
  }

  agg.lastUpdated = new Date().toISOString();
  await store.setJSON(key, agg);

  return { statusCode: 204, body: '' };
};
