import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * kenjiai.com/modern -> the high-ticket Partner Program qualifying survey ->
 * GoHighLevel. Same pattern as ghl-lead.ts: the Private Integration Token
 * never reaches the browser, everything happens server-side here.
 *
 * Deliberately does NOT fire any GHL workflow/automation trigger - per
 * standing rule, contacts never get auto-enrolled into a workflow without
 * Yousif's explicit approval. This only upserts the contact, tags it, and
 * leaves a note with the full survey answers for a human to review and
 * decide what happens next.
 *
 * Netlify env vars: GHL_PIT (Private Integration Token). Optional: GHL_LOCATION_ID.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';

interface QualifyPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  monthly_ad_spend?: string; // 'under_5k' | '5k_20k' | '20k_50k' | '50k_plus'
  decision_maker?: string; // 'yes' | 'no'
  timeline?: string; // 'immediately' | '30_days' | 'exploring'
  business_type?: string;
}

const SPEND_LABEL: Record<string, string> = {
  under_5k: 'Under $5K/mo',
  '5k_20k': '$5K-$20K/mo',
  '20k_50k': '$20K-$50K/mo',
  '50k_plus': '$50K+/mo',
};

const TIMELINE_LABEL: Record<string, string> = {
  immediately: 'Ready to start immediately',
  '30_days': 'Within 30 days',
  exploring: 'Just exploring',
};

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload: QualifyPayload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const firstName = (payload.first_name || '').trim();
  const lastName = (payload.last_name || '').trim();
  const email = (payload.email || '').trim();
  const phone = (payload.phone || '').trim();
  const spend = payload.monthly_ad_spend || '';
  const decisionMaker = payload.decision_maker || '';
  const timeline = payload.timeline || '';
  const businessType = (payload.business_type || '').trim();

  if (!email && !phone) {
    return json(400, { error: 'email or phone required' });
  }
  if (!spend || !decisionMaker || !timeline) {
    return json(400, { error: 'monthly_ad_spend, decision_maker, and timeline are required' });
  }

  // Real qualifying bar for this offer: $20K+/month ad spend, matches the
  // threshold already stated on /partnerup. Under that is a real "not yet"
  // signal, not a hard block - the answer itself is stored either way so a
  // human reviews it, not an automated rejection.
  const isSpendQualified = spend === '20k_50k' || spend === '50k_plus';
  const isDecisionMakerQualified = decisionMaker === 'yes';
  const qualified = isSpendQualified && isDecisionMakerQualified;

  const tags = [
    'modern-application',
    qualified ? 'whale-qualified' : 'whale-underqualified',
    `spend-${spend}`,
    `timeline-${timeline}`,
    decisionMaker === 'yes' ? 'decision-maker' : 'not-decision-maker',
  ];

  const token = process.env.GHL_PIT;
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
  if (!token) {
    return json(500, { error: 'GHL_PIT not configured' });
  }

  let contactId: string | null = null;
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
        lastName,
        email,
        phone,
        source: 'kenjiai.com/modern',
        tags,
      }),
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) {
      return json(502, { error: 'GHL upsert failed', detail: data });
    }
    contactId = (data && data.contact && data.contact.id) || null;
  } catch {
    return json(502, { error: 'GHL upsert failed' });
  }

  // Leave a readable note with the full application for human review.
  // Best-effort - a note failure shouldn't fail the whole submission since
  // the contact + tags are already saved at this point.
  if (contactId) {
    const noteBody = [
      'Partner Program application (kenjiai.com/modern)',
      `Monthly ad spend: ${SPEND_LABEL[spend] || spend}`,
      `Decision maker on budget: ${decisionMaker === 'yes' ? 'Yes' : 'No'}`,
      `Timeline to start: ${TIMELINE_LABEL[timeline] || timeline}`,
      businessType ? `Business: ${businessType}` : null,
      `Qualified against $20K+/mo + decision-maker bar: ${qualified ? 'YES' : 'NO'}`,
    ]
      .filter(Boolean)
      .join('\n');

    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Version: GHL_VERSION,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ body: noteBody }),
    }).catch(() => null);
  }

  return json(200, { ok: true, id: contactId, qualified });
};
