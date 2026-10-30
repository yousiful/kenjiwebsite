import type { Handler } from '@netlify/functions';

/* Client onboarding, kenjiai.com/onboarding (Yousif 2026-10-30).
   stage 'start': intake answers -> GHL upsert, tag 'onboarding started', note.
   stage 'done' : finished steps + ad account ID -> tag 'onboarding complete', note.
   Tags only. No workflow enrollment from here. Netlify env: GHL_PIT (GHL_LOCATION_ID optional). */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';

const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const clip = (v: unknown, n = 300) => String(v ?? '').trim().slice(0, n);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  let b: any;
  try { b = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Invalid JSON' }); }
  const f = b.form || {};
  const email = clip(f.email, 120);
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return json(400, { error: 'valid email required' });

  const token = process.env.GHL_PIT;
  if (!token) return json(200, { ok: true, saved: false });
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
  const headers = { Authorization: `Bearer ${token}`, Version: '2021-07-28', 'Content-Type': 'application/json', Accept: 'application/json' };
  const done = b.stage === 'done';

  try {
    const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: 'POST', headers,
      body: JSON.stringify({
        locationId, email, firstName: clip(f.firstName, 60), phone: clip(f.phone, 30) || undefined,
        companyName: clip(f.business, 120) || undefined, website: clip(f.website, 200) || undefined,
        source: 'kenjiai.com/onboarding', tags: [done ? 'onboarding complete' : 'onboarding started'],
      }),
    });
    const data: any = await r.json().catch(() => ({}));
    const contactId = data?.contact?.id;
    if (!r.ok || !contactId) { console.error('[onboarding] upsert', r.status, JSON.stringify(data).slice(0, 200)); return json(502, { error: 'save failed' }); }

    const note = done
      ? [
          'Onboarding finished (kenjiai.com/onboarding).',
          `Ad account ID: ${clip(b.adAccountId, 40) || 'not given'}`,
          `Facebook page: ${clip(b.pageName, 120) || 'not given'}`,
          `Steps marked complete: ${(Array.isArray(b.completed) ? b.completed : []).map((s: unknown) => clip(s, 60)).join(', ') || 'none'}`,
          'Next: accept the invite in Business Settings (support@mediatraffics.com) and check partner access.',
        ]
      : [
          'Onboarding started (kenjiai.com/onboarding).',
          `Business: ${clip(f.business, 120)}`,
          `Website: ${clip(f.website, 200) || 'none'}`,
          `We run their ads: ${clip(f.ads, 10)}`,
          `Monthly ad budget: ${clip(f.budget, 40) || 'not given'}`,
          `Main goal: ${clip(f.goal, 500) || 'not given'}`,
          `Best way to reach them: ${clip(f.contact, 40) || 'not given'}`,
        ];
    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, { method: 'POST', headers, body: JSON.stringify({ body: note.join('\n') }) });
    return json(200, { ok: true, saved: true });
  } catch (e) {
    console.error('[onboarding] threw', e);
    return json(502, { error: 'save failed' });
  }
};
