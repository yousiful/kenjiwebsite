import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * /ai-callcenter's exclusivity gate: "one AI Call Center per industry, per
 * city" is a REAL constraint, not a conversion trick (see project memory,
 * confirmed with Yousif 2026-09-13 -- this is the opposite of Scalify's
 * roofing-territory post that inspired the flow, since software has no real
 * capacity limit unless we choose one, and we did).
 *
 * Source of truth: GHL contacts tagged `ai-callcenter-market-claimed`, which
 * only gets added manually when a lead actually becomes a paying client (no
 * checkout exists for this offer yet, it's booked-call-to-close, so there's
 * no automatic trigger -- see the README note at the bottom of this file).
 * Every claimed contact also carries `mkt-industry-<slug>` and
 * `mkt-city-<slug>` tags set by ghl-lead-callcenter.ts at the point they
 * first came through the funnel. AND-filtering all three tags together
 * (confirmed live 2026-09-13: multiple entries in GHL's contacts/search
 * `filters` array are ANDed, not ORed) tells us whether this exact
 * industry+city combo is already spoken for.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export function slugify(s: string): string {
  return (s || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let body: { industry?: string; city?: string };
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const industry = (body.industry || '').trim();
  const city = (body.city || '').trim();
  if (!industry || !city) return json(400, { error: 'industry and city required' });

  const industrySlug = slugify(industry);
  const citySlug = slugify(city);
  if (!industrySlug || !citySlug) return json(400, { error: 'industry and city could not be read' });

  const token = process.env.GHL_PIT;
  if (!token) return json(502, { error: 'GHL not configured' });
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;

  try {
    const r = await fetch(`${GHL_BASE}/contacts/search`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Version: GHL_VERSION,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        locationId,
        pageLimit: 1,
        filters: [
          { field: 'tags', operator: 'contains', value: 'ai-callcenter-market-claimed' },
          { field: 'tags', operator: 'contains', value: `mkt-industry-${industrySlug}` },
          { field: 'tags', operator: 'contains', value: `mkt-city-${citySlug}` },
        ],
      }),
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) return json(502, { error: 'Availability check failed', detail: data });

    const claimed = (data.total || 0) > 0;
    return json(200, {
      available: !claimed,
      industry,
      city,
      industrySlug,
      citySlug,
    });
  } catch (err) {
    return json(502, { error: 'Availability check request failed' });
  }
};

/**
 * HOW TO CLAIM A MARKET (manual, do this when a lead actually becomes a
 * paying AI Call Center client -- there's no self-serve checkout for this
 * offer, so nothing does this automatically):
 * 1. Find their contact in Kenji's GHL (locationId q5L4ttbBMHNxieXIcTVJ).
 * 2. Confirm they already carry mkt-industry-<slug> and mkt-city-<slug>
 *    tags from when they went through the funnel (ghl-lead-callcenter.ts
 *    sets these on every lead, claimed or not).
 * 3. Add the tag `ai-callcenter-market-claimed` to that contact.
 * That's it -- the next person checking that same industry+city combo will
 * see it as taken.
 */
