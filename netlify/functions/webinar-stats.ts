import type { Handler, HandlerEvent } from '@netlify/functions';
import { getStore } from '@netlify/blobs';

const PAGES = ['watch', 'vsl2-watch', 'replay', 'overview'] as const;

// See webinar-track.ts for why this manual fallback exists.
const SITE_ID = '22d32da4-ca6e-4ea2-aea7-156e152407f5';
function webinarStore() {
  const token = process.env.NETLIFY_BLOBS_TOKEN;
  return token ? getStore({ name: 'webinar-stats', siteID: SITE_ID, token }) : getStore('webinar-stats');
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const secret = process.env.WEBINAR_STATS_SECRET;
  const provided = event.headers['x-webinar-stats-secret'];
  if (!secret || provided !== secret) {
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const store = webinarStore();
  const pages: Record<string, unknown> = {};

  for (const page of PAGES) {
    const agg = await store.get(page, { type: 'json' });
    pages[page] = agg || null;
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pages, fetchedAt: new Date().toISOString() }),
  };
};
