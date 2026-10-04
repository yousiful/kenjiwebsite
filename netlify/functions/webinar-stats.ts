import type { Handler, HandlerEvent } from '@netlify/functions';
import { connectLambda, getStore } from '@netlify/blobs';

const PAGES = ['watch', 'vsl2-watch', 'replay', 'overview'] as const;

// Blobs context comes from the invocation event (connectLambda). The old
// NETLIFY_BLOBS_TOKEN env var was a personal token that got revoked, which
// silently broke tracking with 401s; this needs no token.
function webinarStore(event: HandlerEvent) {
  connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
  return getStore('webinar-stats');
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

  const store = webinarStore(event);
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
