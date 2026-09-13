import type { Handler, HandlerEvent } from '@netlify/functions';
import { slugify } from './check-market-availability';

/**
 * AI Call Center offer page (/ai-callcenter) -> GoHighLevel.
 * Deliberately separate from ghl-lead.ts: that function fires the webinar
 * inbound webhook (access-link automation, session_time field) which would
 * send the wrong automated messages to a lead from this offer. This one
 * only upserts the contact with an honest source + tags, no workflow fired.
 *
 * Reworked 2026-09-13 for the market-exclusivity funnel: every lead now
 * carries mkt-industry-<slug> and mkt-city-<slug> tags (set here, checked
 * by check-market-availability.ts), plus either `ai-callcenter-lead`
 * (market was open when they came through) or `ai-callcenter-waitlist`
 * (market was already claimed, they only left an email to be notified).
 * Marking a market actually claimed is a separate manual step -- see the
 * README note at the bottom of check-market-availability.ts.
 *
 * Netlify env var: GHL_PIT (Private Integration Token, already set for the
 * existing ghl-lead.ts function -- reused here). Optional: GHL_LOCATION_ID.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';

interface LeadPayload {
  first_name?: string;
  email?: string;
  phone?: string;
  industry?: string;
  city?: string;
  waitlist?: boolean; // true = market was already claimed at submit time
  business_website?: string; // the URL they ran through the preview tool, if any
}

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload: LeadPayload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const firstName = (payload.first_name || '').trim();
  const email = (payload.email || '').trim();
  const phone = (payload.phone || '').trim();
  const industry = (payload.industry || '').trim();
  const city = (payload.city || '').trim();
  const waitlist = !!payload.waitlist;
  const website = (payload.business_website || '').trim();

  if (!email && !phone) {
    return json(400, { error: 'email or phone required' });
  }
  if (!industry || !city) {
    return json(400, { error: 'industry and city required' });
  }

  const token = process.env.GHL_PIT;
  if (!token) return json(502, { error: 'GHL not configured' });
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;

  const tags = [
    waitlist ? 'ai-callcenter-waitlist' : 'ai-callcenter-lead',
    `mkt-industry-${slugify(industry)}`,
    `mkt-city-${slugify(city)}`,
  ];

  try {
    const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Version: GHL_VERSION,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        locationId,
        firstName,
        email,
        phone,
        companyName: website || undefined,
        source: 'ai-callcenter-offer-page',
        tags,
      }),
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) return json(502, { error: 'GHL upsert failed', detail: data });

    const cid = (data && data.contact && data.contact.id) || null;
    if (cid) {
      const noteLines = [
        `Industry entered: ${industry}`,
        `City entered: ${city}`,
        waitlist
          ? 'Market was ALREADY CLAIMED at submit time -- this is a waitlist signup, not an active lead. Only follow up if that market opens back up.'
          : 'Market was open at submit time -- active lead, follow up normally.',
        website ? `Website they ran through the AI closer preview: ${website}` : '',
      ].filter(Boolean);
      await fetch(`${GHL_BASE}/contacts/${cid}/notes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Version: GHL_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: noteLines.join('\n') }),
      }).catch(() => {});
    }

    return json(200, { ok: true, id: cid, waitlist });
  } catch (err) {
    return json(502, { error: 'GHL request failed' });
  }
};
