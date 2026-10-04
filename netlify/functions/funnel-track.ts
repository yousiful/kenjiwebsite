import type { Handler, HandlerEvent } from '@netlify/functions';
import { connectLambda, getStore } from '@netlify/blobs';

// Public write endpoint for funnel drop-off tracking (startlearning.kenjiai.com
// sends events here via sendBeacon). One blob per visitor session, keyed
// <funnel>/<YYYY-MM-DD>/<sid>, holding every step that session reached.
// funnel-stats.ts reads them back and builds the drop-off funnel.

// Blobs context comes from the invocation event (connectLambda). The old
// NETLIFY_BLOBS_TOKEN env var was a personal token that got revoked, which
// silently broke tracking with 401s; this needs no token.
function funnelStore(event: HandlerEvent) {
  connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
  return getStore('funnel-sessions');
}

const ALLOWED_FUNNELS = new Set(['lowticket']);
// Anything not on this list is rejected so the public endpoint can't be stuffed.
const STEP_PATTERN = /^(page_view|video_play|video_(25|50|75|95|100)|section_[a-z_]{1,30}|time_\d{1,3}s|cta_click|cta_[a-z-]{1,30}|exit_popup_shown)$/;

interface IncomingEvent {
  funnel: string;
  sid: string;
  step: string;
  source?: string;
  utm_source?: string;
  utm_campaign?: string;
  utm_content?: string;
  device?: string;
}

export interface SessionRecord {
  firstSeen: string;
  lastSeen: string;
  steps: Record<string, string>; // step -> first time reached (ISO)
  utm_source: string;
  utm_campaign: string;
  utm_content: string;
  device: string;
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
  const key = `${payload.funnel}/${now.slice(0, 10)}/${payload.sid}`;
  const store = funnelStore(event);
  // A session that crosses midnight UTC keeps writing to the day it started on.
  const prevKey = `${payload.funnel}/${new Date(Date.now() - 864e5).toISOString().slice(0, 10)}/${payload.sid}`;
  let useKey = key;
  let rec = (await store.get(key, { type: 'json' })) as SessionRecord | null;
  if (!rec && payload.step !== 'page_view') {
    const prev = (await store.get(prevKey, { type: 'json' })) as SessionRecord | null;
    if (prev) {
      rec = prev;
      useKey = prevKey;
    }
  }
  rec = rec || {
    firstSeen: now,
    lastSeen: now,
    steps: {},
    utm_source: clip(payload.utm_source),
    utm_campaign: clip(payload.utm_campaign),
    utm_content: clip(payload.utm_content),
    device: payload.device === 'mobile' ? 'mobile' : 'desktop',
  };
  if (!rec.steps[payload.step]) rec.steps[payload.step] = now;
  if (payload.step === 'cta_click' && payload.source) rec.steps['cta_' + clip(payload.source, 30)] ||= now;
  rec.lastSeen = now;
  await store.setJSON(useKey, rec);

  return { statusCode: 204, headers: CORS, body: '' };
};
