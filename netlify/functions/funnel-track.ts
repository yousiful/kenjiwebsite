import type { Handler, HandlerEvent } from '@netlify/functions';
import { connectLambda, getStore } from '@netlify/blobs';

// Public write endpoint for funnel drop-off tracking (startlearning.kenjiai.com
// sends events here via sendBeacon). One blob per event, keyed
// <funnel>/<YYYY-MM-DD>/<sid>/<step>, so events that arrive at the same moment
// can't overwrite each other (a single per-session blob lost most steps to
// read-modify-write races). funnel-stats.ts groups them back by session.

// Blobs context comes from the invocation event (connectLambda). The old
// NETLIFY_BLOBS_TOKEN env var was a personal token that got revoked, which
// silently broke tracking with 401s; this needs no token.
function funnelStore(event: HandlerEvent) {
  connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
  return getStore('funnel-sessions');
}

// lowticket = startlearning.kenjiai.com; kenjiai = every page on kenjiai.com (public/ft.js).
const ALLOWED_FUNNELS = new Set(['lowticket', 'kenjiai']);
// Anything not on this list is rejected so the public endpoint can't be stuffed.
const STEP_PATTERN = /^(page_view|video_play|video_(25|50|75|95|100)|scroll_(25|50|75|100)|section_[a-z_]{1,30}|time_\d{1,3}s|cta_click|cta_[a-z-]{1,30}|exit_popup_shown)$/;

interface IncomingEvent {
  funnel: string;
  sid: string;
  step: string;
  source?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  device?: string;
  page?: string;
  version?: string;
}

export interface SessionRecord {
  firstSeen: string;
  lastSeen: string;
  steps: Record<string, string>; // step -> first time reached (ISO)
  utm_source: string;
  utm_campaign: string;
  utm_content: string;
  device: string;
  page: string;
  version: string;
}

// What each event blob holds. Only page_view carries the utm/device fields.
export interface EventBlob {
  t: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  device?: string;
  page?: string;
  version?: string;
}

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const clip = (s: unknown, n = 120) => String(s ?? '').slice(0, n);

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: CORS, body: 'Method Not Allowed' };

  let payload: IncomingEvent;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, headers: CORS, body: 'Invalid JSON' };
  }

  if (
    !ALLOWED_FUNNELS.has(payload.funnel) ||
    !/^[a-z0-9-]{6,40}$/.test(payload.sid || '') ||
    !STEP_PATTERN.test(payload.step || '')
  ) {
    return { statusCode: 400, headers: CORS, body: 'Unrecognized event' };
  }

  const now = new Date().toISOString();
  const store = funnelStore(event);
  const base = `${payload.funnel}/${now.slice(0, 10)}/${payload.sid}`;
  const writes: Promise<unknown>[] = [];
  const put = (step: string, blob: EventBlob) =>
    // onlyIfNew keeps the first time a step was reached.
    writes.push(store.setJSON(`${base}/${step}`, blob, { onlyIfNew: true }).catch(() => {}));

  if (payload.step === 'page_view') {
    put('page_view', {
      t: now,
      utm_source: clip(payload.utm_source),
      utm_campaign: clip(payload.utm_campaign),
      utm_content: clip(payload.utm_content),
      device: payload.device === 'mobile' ? 'mobile' : 'desktop',
      page: clip(payload.page, 60),
      version: clip(payload.version, 40),
    });
  } else {
    put(payload.step, { t: now });
  }
  if (payload.step === 'cta_click' && payload.source && /^[a-z-]{1,30}$/.test(payload.source)) {
    put('cta_' + payload.source, { t: now });
  }
  await Promise.all(writes);

  return { statusCode: 204, headers: CORS, body: '' };
};
