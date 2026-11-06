import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * Living Benefits Policy Builder (/living-benefits) -> GoHighLevel.
 * The page posts twice: stage "viewed_results" when they consent and see their plan,
 * and stage "requested_agent" when they tap Send to my agent. Both upsert the same contact.
 * SSN, license and bank info are NOT collected; the carrier's secure application asks for those.
 * CORS is open so the same HTML also works pasted into a GHL custom code element.
 *
 * Netlify env var: GHL_PIT (shared with the other ghl-*.ts functions). Optional: GHL_LOCATION_ID.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', ...CORS },
  body: JSON.stringify(body),
});

const s = (v: unknown, max = 200) => String(v ?? '').trim().slice(0, max);
const list = (v: unknown) => (Array.isArray(v) ? v.map((x) => s(x, 40)).filter(Boolean).join(', ') : s(v));

const LABELS: Record<string, string> = {
  sickness: 'Money if seriously sick', cash: 'Cash to borrow later', family: 'Protect family', disability: 'Covered if disabled',
  heart: 'Heart', stroke: 'Stroke', cancer: 'Cancer', diabetes: 'Diabetes', none: 'None',
  bp: 'High blood pressure', chol: 'High cholesterol',
};
const nice = (v: unknown) => (Array.isArray(v) ? v.map((x) => LABELS[String(x)] || s(x, 40)).join(', ') : s(v));

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: CORS, body: '' };
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method Not Allowed' });

  let p: Record<string, any>;
  try {
    p = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }
  if (s(p.company)) return json(200, { ok: true }); // honeypot

  const firstName = s(p.first_name, 60);
  const lastName = s(p.last_name, 60);
  const email = s(p.email, 120);
  const phone = s(p.phone, 20);
  if (!firstName || !email || !phone) return json(400, { error: 'name, email and phone are required' });
  if (p.consent?.agreed !== true) return json(400, { error: 'consent required' });

  const token = process.env.GHL_PIT;
  if (!token) return json(502, { error: 'GHL not configured' });
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
  const headers = { Authorization: `Bearer ${token}`, Version: GHL_VERSION, 'Content-Type': 'application/json', Accept: 'application/json' };

  const stage = s(p.stage, 30) === 'requested_agent' ? 'requested_agent' : 'viewed_results';
  const tags = (Array.isArray(p.tags) ? p.tags : []).map((t: unknown) => s(t, 40).toLowerCase()).filter(Boolean).slice(0, 8);
  if (!tags.includes('life-lead')) tags.unshift('life-lead');
  if (stage === 'requested_agent' && !tags.includes('life-agent-requested')) tags.push('life-agent-requested');

  const dob = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s(p.date_of_birth, 10));
  const a = p.answers || {};
  const u = p.utm || {};
  const pr = p.projection || {};
  const k = (n: unknown) => `$${Math.round(+n / 1000) || 0}K`;

  try {
    const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        locationId, firstName, lastName, email, phone,
        state: s(p.state, 2) || undefined,
        dateOfBirth: dob ? `${dob[3]}-${dob[1]}-${dob[2]}` : undefined,
        source: 'living-benefits-page',
        tags,
      }),
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) return json(502, { error: 'GHL upsert failed', detail: data });

    const cid = data?.contact?.id;
    if (cid) {
      const lines = [
        `Living Benefits Calculator (kenjiai.com/living-benefits)${stage === 'requested_agent' ? ': APPLY REQUEST, wants a ' + (s(a.preferred_contact, 10) || 'call') + ' in the ' + (s(a.best_time, 12) || 'any time') : ''}`,
        `Plan: ${s(p.plan_profile, 40)} | ${s(p.death_benefit_option, 80)} | target product: ${s(p.product_target, 80)}`,
        `Riders: ${list(p.riders)}`,
        `Budget: $${s(a.monthly_budget, 6)}/mo`,
        pr.face && `Calculator (hypothetical, not a quote): ${pr.design === 'cash' ? 'max cash value' : 'max protection'}, age ${s(pr.tool_age, 3)}, viewed at ${Math.round(+pr.rate_viewed * 100)}%: face ${k(pr.face)}, cash value at 65 ${k(pr.cv_at_65)}, death benefit at 65 ${k(pr.db_at_65)}${pr.lapse_age_at_rate ? ', needs more premium by ' + s(pr.lapse_age_at_rate, 3) : ''}`,
        p.estimated_coverage_low && `Page estimate: ${k(p.estimated_coverage_low)} to ${k(p.estimated_coverage_high)} (rough, not a quote)`,
        `Goals: ${nice(a.goals)}`,
        `Family history: ${nice(a.family_history)}${a.family_before_60 ? ' | before 60: ' + s(a.family_before_60, 5) : ''}`,
        `DOB: ${s(p.date_of_birth, 10)} (age ${s(a.age, 3)}) | ${s(a.gender, 10)} | State: ${s(p.state, 2)} | Tobacco 12 mo: ${s(a.tobacco_12mo, 5)}`,
        `Height ${s(a.height, 10)} | Weight ${s(a.weight_lbs, 5)} lbs`,
        `Health: ${nice(a.health_conditions)} | Rx: ${s(a.prescriptions, 5)}${s(a.prescriptions_detail, 200) ? ' (' + s(a.prescriptions_detail, 200) + ')' : ''}`,
        `Work: ${s(a.occupation, 80)} | self-employed: ${s(a.self_employed, 5)} | income: ${s(a.income_range, 30)}`,
        `Existing coverage: ${s(a.has_existing_coverage, 5)}${s(a.existing_coverage_amount, 30) ? ' (' + s(a.existing_coverage_amount, 30) + ')' : ''} | wants GI rider: ${s(a.wants_guaranteed_insurability, 5)}`,
        `Best time: ${s(a.best_time, 12)} | Prefers: ${s(a.preferred_contact, 10)}`,
        Object.keys(u).length && `UTM: ${Object.entries(u).map(([k, v]) => `${k}=${s(v, 80)}`).join(' ')}`,
        `Consent (TCPA) agreed ${s(p.consent?.at, 30)}: "${s(p.consent?.text, 400)}"`,
        'SSN, license and bank info NOT collected; those go in the carrier secure application.',
      ].filter(Boolean);
      await fetch(`${GHL_BASE}/contacts/${cid}/notes`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ body: lines.join('\n') }),
      }).catch(() => {});
    }
    return json(200, { ok: true });
  } catch {
    return json(502, { error: 'GHL request failed' });
  }
};
