import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * Sales call audit deck (kenjiai.com/audit) lead capture.
 *
 * The last slide of the deck asks the prospect for their name, email and phone. POST JSON
 * {team, rep, firstName, lastName, email, phone, business, sendEmail,
 *  audit:{now, goal, value, gapMonth, leaks, answers[4], checks[]}}
 * finds the GHL contact by email (then phone). New contact: created with the details.
 * Existing contact: only tags are added, so a typo never overwrites a real record.
 * Either way the audit numbers go on the contact as a note. Tags: "sales audit",
 * "audit rep <name>", and "sales audit emailed" once the roadmap email is accepted by GHL.
 * No workflow enrollment.
 *
 * sendEmail: the prospect asked for their audit on the call, so the audit and the
 * next-step roadmap (ads, fast follow-up, the done-for-you system) are emailed right away
 * from support@mediatraffics.com, the same sender as the Find the Leak results email.
 *
 * Only the team can post: the deck link carries ?team=<AUDIT_TEAM_CODE>.
 * Netlify env vars: GHL_PIT (shared with the other ghl-*.ts functions), AUDIT_TEAM_CODE.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
const PLANS_URL = 'https://kenjiai.com/pricing';

const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const s = (v: unknown, max = 200) => String(v ?? '').trim().slice(0, max);
const n = (v: unknown) => { const x = Number(v); return Number.isFinite(x) && x >= 0 ? Math.round(x) : 0; };
const usd = (v: number) => '$' + v.toLocaleString('en-US');
const esc = (v: string) => v.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

// One line per audit check, used when the answer was "No".
const LEAKS = [
  'No ads bringing in buyers yet. Without steady traffic, the rest of the system has nothing to work with.',
  'New leads wait longer than 5 minutes. The longer a lead waits, the more likely they have already called someone else.',
  'Night and weekend leads go unanswered. That is when a lot of people fill out forms.',
  'Booking depends on you chasing people. Leads slip through when you are busy doing the work.',
];

async function ghl(path: string, token: string, method: string, body?: unknown) {
  const r = await fetch(`${GHL_BASE}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, Version: GHL_VERSION, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data: any = await r.json().catch(() => ({}));
  if (!r.ok) console.error(`sales-audit: GHL ${method} ${path} ${r.status}`, JSON.stringify(data).slice(0, 300));
  return { ok: r.ok, data };
}

async function find(token: string, locationId: string, field: 'email' | 'phone', value: string) {
  if (!value) return undefined;
  const r = await ghl('/contacts/search', token, 'POST', { locationId, pageLimit: 1, filters: [{ field, operator: 'eq', value }] });
  return r.data?.contacts?.[0]?.id as string | undefined;
}

function auditEmail(f: { firstName: string; business: string; rep: string }, a: { now: number; goal: number; value: number; gapMonth: number; answers: string[] }) {
  const gap = Math.max(0, a.goal - a.now);
  const leaks = a.answers.map((x, i) => (x === '0' ? LEAKS[i] : '')).filter(Boolean);
  const biz = f.business ? esc(f.business) : 'your business';
  const who = f.rep ? esc(f.rep[0].toUpperCase() + f.rep.slice(1)) : 'our team';
  const numbers = a.value && gap
    ? `<p>You're at <b>${a.now}</b> new clients a month and want <b>${a.goal}</b>. With one client worth <b>${usd(a.value)}</b>, that gap is about <b style="color:#c2610b">${usd(a.gapMonth)} a month</b>, or ${usd(a.gapMonth * 12)} a year.</p>`
    : '';
  const leakHtml = leaks.length
    ? `<p><b>Where leads are slipping</b></p><ul style="padding-left:20px;margin:0 0 16px">${leaks.map((l) => `<li style="margin:0 0 8px">${l}</li>`).join('')}</ul>`
    : '<p>You answered yes on all four lead checks, so the work is mostly about getting more buyers in front of you.</p>';
  return `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#222;max-width:560px">
<p>Hi ${esc(f.firstName)},</p>
<p>Thanks for going through the client growth audit with ${who}. Here's what we found for ${biz}, so you have it in writing.</p>
${numbers}
${leakHtml}
<p><b>Your roadmap</b></p>
<ol style="padding-left:20px;margin:0 0 16px">
<li style="margin:0 0 8px"><b>Run ads that bring in buyers.</b> Campaigns built around your offer and tested before you spend real money, not boosted posts.</li>
<li style="margin:0 0 8px"><b>Answer every lead within 5 minutes, day or night.</b> An AI agent calls and texts each new lead and books them on your calendar, so nobody waits until Monday.</li>
<li style="margin:0 0 8px"><b>You show up and close.</b> Your time goes to booked calls with people who asked to talk to you.</li>
</ol>
<p><b>The fastest way to get there</b></p>
<p>Our done-for-you system does steps 1 and 2 for you. We set up and run your ads, build your funnel, and set up the CRM, calendar and AI follow-up so every lead gets an answer. We've been running ads since 2013 and have generated $3.35M for clients across 500+ businesses.</p>
<p><a href="${PLANS_URL}" style="display:inline-block;background:#e07a16;color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:bold">See the done-for-you plans</a></p>
<p>Or just reply to this email and ${who} will help you get started.</p>
<p>Yousif Alias<br>KenjiAI and Media Traffics</p>
</div>`;
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  const code = process.env.AUDIT_TEAM_CODE;
  const token = process.env.GHL_PIT;
  if (!code || !token) return json(500, { error: 'The deck is not set up yet (missing env vars).' });

  let p: Record<string, any>;
  try { p = JSON.parse((event.isBase64Encoded ? Buffer.from(event.body || '', 'base64').toString('utf8') : event.body) || '{}'); }
  catch { return json(400, { error: 'Invalid request' }); }
  if (s(p.team, 80) !== code) return json(403, { error: 'Open the deck from your team link to save leads.' });

  const rep = s(p.rep, 40).toLowerCase().replace(/[^a-z ]/g, '').trim();
  const firstName = s(p.firstName, 60);
  const lastName = s(p.lastName, 60);
  const email = s(p.email, 120).toLowerCase();
  const phone = s(p.phone, 30);
  const business = s(p.business, 120);
  const sendEmail = p.sendEmail === true;
  if (!firstName) return json(400, { error: 'Add their first name.' });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: 'That email looks off.' });
  if (sendEmail && !email) return json(400, { error: 'Add their email to send the audit, or switch off the email.' });
  if (!email && phone.replace(/\D/g, '').length < 10) return json(400, { error: 'Add an email or a full phone number.' });

  const a = p.audit || {};
  const answers: string[] = Array.isArray(a.answers) ? [0, 1, 2, 3].map((i) => (a.answers[i] === '1' || a.answers[i] === '0' ? a.answers[i] : '')) : ['', '', '', ''];
  const audit = { now: n(a.now), goal: n(a.goal), value: n(a.value), gapMonth: n(a.gapMonth), answers };
  const checks: string[] = Array.isArray(a.checks) ? a.checks.slice(0, 4).map((c: unknown) => s(c, 160)) : [];

  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
  const tags = ['sales audit', ...(rep ? [`audit rep ${rep}`] : [])];
  try {
    let id = (await find(token, locationId, 'email', email)) || (await find(token, locationId, 'phone', phone));
    const existed = !!id;
    if (id) {
      await ghl(`/contacts/${id}/tags`, token, 'POST', { tags });
    } else {
      const made = await ghl('/contacts/', token, 'POST', {
        locationId, firstName, lastName: lastName || undefined, email: email || undefined, phone: phone || undefined,
        companyName: business || undefined, source: 'kenjiai.com/audit', tags,
      });
      id = made.data?.contact?.id;
      if (!id) return json(502, { error: 'GHL did not save the contact. Try again.' });
    }

    let emailed = false;
    if (sendEmail) {
      const c = await ghl('/conversations/', token, 'POST', { locationId, contactId: id });
      const conversationId = c.data?.conversation?.id || c.data?.conversationId;
      const sent = await ghl('/conversations/messages', token, 'POST', {
        type: 'Email', ...(conversationId ? { conversationId } : {}), contactId: id,
        fromName: 'Yousif | KenjiAI', from: 'support@mediatraffics.com', to: email,
        subject: `Your client growth audit${business ? ` for ${business}` : ''}`,
        html: auditEmail({ firstName, business, rep }, audit),
      });
      emailed = sent.ok;
      if (emailed) await ghl(`/contacts/${id}/tags`, token, 'POST', { tags: ['sales audit emailed'] });
      else console.error('sales-audit: email not sent', JSON.stringify(sent.data).slice(0, 200));
    }

    const lines = [
      `Sales call audit${rep ? ` (rep: ${rep})` : ''}, ${new Date().toISOString().slice(0, 10)}${sendEmail ? (emailed ? '. Audit + roadmap emailed.' : '. Audit email FAILED to send.') : '. Not emailed.'}`,
      business && `Business: ${business}`,
      `Clients a month now: ${audit.now}. Goal: ${audit.goal}. One client is worth ${usd(audit.value)}.`,
      `Gap: ${usd(audit.gapMonth)} a month (${usd(audit.gapMonth * 12)} a year). Leaks found: ${answers.filter((x) => x === '0').length} of 4.`,
      ...checks,
    ].filter(Boolean);
    await ghl(`/contacts/${id}/notes`, token, 'POST', { body: lines.join('\n') });
    return json(200, { ok: true, existed, emailed });
  } catch (e) {
    console.error('sales-audit: failed', String(e));
    return json(502, { error: 'Could not reach GHL. Try again.' });
  }
};
