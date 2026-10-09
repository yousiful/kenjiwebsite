import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * kenjiai.com/growth-quiz -> scores the answers and saves the lead in GoHighLevel.
 *
 * The qualification decision is made here, not in the browser, so the page can't be
 * talked into a booking link. Same pattern as modern-qualify.ts: the token never
 * reaches the browser, and no workflow is triggered (contacts are never auto-enrolled
 * without Yousif's approval). Two tags only, everything else goes in a note.
 *
 * Netlify env vars: GHL_PIT. Optional: GHL_LOCATION_ID.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';

// Answers that mean "not a fit yet". Bar set by Yousif 2026-10-07: a running business
// doing $10K+/month that can put $1K+/month toward growth, deciding for itself, not just researching.
const DISQUALIFY: Record<string, string[]> = {
  role: ['launching', 'browsing'],
  revenue: ['under_10k'],
  budget: ['under_1k'],
  timeline: ['researching'],
  decision: ['someone_else'],
};

const LABELS: Record<string, Record<string, string>> = {
  role: { owner: 'Owns a business already making sales', agency: 'Runs a marketing agency', launching: 'About to launch a business', browsing: 'Just looking around' },
  industry: { home: 'Home services', health: 'Health, wellness or med spa', professional: 'Legal, tax or financial services', realestate: 'Real estate', coaching: 'Coaching, consulting or courses', ecommerce: 'Ecommerce', other: 'Something else' },
  revenue: { under_10k: 'Under $10K/mo', '10k_30k': '$10K-$30K/mo', '30k_100k': '$30K-$100K/mo', '100k_plus': '$100K+/mo', '100k_1m': '$100K-$1M/mo', '1m_plus': '$1M+/mo' },
  bottleneck: { leads: 'Not enough leads', conversion: "Leads don't book or buy", followup: 'Missed calls and slow follow-up', time: 'Doing everything themselves', ad_cost: 'Ads cost too much for what they bring in' },
  budget: { under_1k: 'Under $1,000/mo', '1k_3k': '$1,000-$3,000/mo', '3k_10k': '$3,000-$10,000/mo', '10k_plus': '$10,000+/mo' },
  timeline: { now: 'Right away', '30_days': 'Within 30 days', '1_3_months': 'In 1 to 3 months', researching: 'Just researching' },
  decision: { me: 'Decides alone', partner: 'Decides with a partner', someone_else: 'Someone else decides' },
};
const QUESTION_LABEL: Record<string, string> = {
  role: 'Who', industry: 'Industry', revenue: 'Monthly revenue', bottleneck: 'Biggest bottleneck',
  budget: 'Monthly growth budget', timeline: 'Start', decision: 'Decision maker',
};

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

export function isQualified(answers: Record<string, string>): boolean {
  return Object.entries(DISQUALIFY).every(([q, bad]) => answers[q] && !bad.includes(answers[q]));
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let body: { first_name?: string; email?: string; phone?: string; answers?: Record<string, string>; page?: string };
  try { body = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Invalid JSON' }); }

  const firstName = String(body.first_name || '').trim().slice(0, 60);
  const email = String(body.email || '').trim().toLowerCase().slice(0, 200);
  const phone = String(body.phone || '').replace(/[^\d+]/g, '').slice(0, 20);
  const raw = body.answers && typeof body.answers === 'object' ? body.answers : {};
  const answers: Record<string, string> = {};
  for (const q of Object.keys(LABELS)) {
    const v = String(raw[q] || '');
    if (LABELS[q][v]) answers[q] = v;
  }

  if (!firstName) return json(400, { error: 'Please add your first name.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json(400, { error: 'Please enter a valid email address.' });
  if (phone.replace(/\D/g, '').length < 10) return json(400, { error: 'Please enter a phone number we can reach you on.' });

  const qualified = isQualified(answers);

  const token = process.env.GHL_PIT;
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
  if (!token) return json(200, { ok: true, qualified, saved: false });

  const headers = { Authorization: `Bearer ${token}`, Version: GHL_VERSION, 'Content-Type': 'application/json', Accept: 'application/json' };
  let contactId: string | null = null;
  try {
    const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        locationId, firstName, email, phone,
        source: 'kenjiai.com/growth-quiz',
        tags: ['growth quiz', qualified ? 'quiz qualified' : 'quiz not qualified'],
      }),
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error('[growth-quiz] upsert failed', r.status, JSON.stringify(data).slice(0, 300));
      // Never block the visitor on a CRM hiccup; they still get routed.
      return json(200, { ok: true, qualified, saved: false });
    }
    contactId = data?.contact?.id || null;
  } catch (e) {
    console.error('[growth-quiz] upsert threw', e);
    return json(200, { ok: true, qualified, saved: false });
  }

  if (contactId) {
    const note = [
      `Growth quiz (kenjiai.com/growth-quiz): ${qualified ? 'QUALIFIED, sent to the booking page' : 'NOT QUALIFIED, sent to the $7 offer'}`,
      ...Object.keys(LABELS).map((q) => `${QUESTION_LABEL[q]}: ${answers[q] ? LABELS[q][answers[q]] : 'not answered'}`),
    ].join('\n');
    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, { method: 'POST', headers, body: JSON.stringify({ body: note }) }).catch(() => null);
  }

  return json(200, { ok: true, qualified, saved: !!contactId });
};
