import type { Handler, HandlerEvent } from '@netlify/functions';
import { cleanAnswers, fmtMoney, funnelModel, isQualified, labelOf, scoreAnswers, visibleQuestions } from '../../src/data/leadScore';
import type { Funnel } from '../../src/data/leadScore';

/**
 * kenjiai.com/lead-score -> scores the quiz, saves the lead in GoHighLevel, emails them their results.
 *
 * Same rules as growth-quiz.ts: the score and the fit decision are made here, the token never reaches
 * the browser, and no workflow is triggered. Tags: 'lead leak quiz' + 'quiz qualified'/'quiz not qualified'
 * (the 3-week quiz vs lead-form test from 2026-10-25 compares leads by these tags). Everything else goes in a note,
 * so whoever calls already knows their numbers.
 *
 * Netlify env vars: GHL_PIT. Optional: GHL_LOCATION_ID.
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
const BOOK_URL = 'https://kenjiai.com/growth-quiz/book';
const LOW_TICKET_URL = 'https://freedom.kenjiai.com/makemore';

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!));

function resultsEmail(first: string, score: number, grade: string, leaks: ReturnType<typeof scoreAnswers>['leaks'], qualified: boolean, funnel: Funnel) {
  const top = leaks.slice(0, 3);
  const items = top.length
    ? top.map((l) => `<li style="margin:0 0 14px"><b>${esc(l.title)}</b><br>${esc(l.why)}<br><span style="color:#0f766e">Fix: ${esc(l.fix)}</span></li>`).join('')
    : '<li>No big leaks showed up. Your next gains come from putting more budget behind what already works.</li>';
  const next = qualified
    ? `<p>You qualify for a free 15-minute leak review with our team. We’ll go through these with your numbers and show you what we’d fix first. <a href="${BOOK_URL}">Pick a time here</a>.</p>`
    : `<p>If you want to fix these yourself, our $7 Ad Optimization Community shows you how we run ads, follow-up and sales for our clients. <a href="${LOW_TICKET_URL}">Join here</a>.</p>`;
  return `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#222;max-width:560px">
<p>Hi ${esc(first)},</p>
<p>Here are your Find the Leak results.</p>
<p style="font-size:22px;margin:18px 0"><b>${score}/100</b> &middot; ${esc(grade)}</p>
<p><b>Your funnel, ${esc(funnel.basis)}</b> (a rough model from your answers):</p>
<p>${funnel.stages.map((st) => `${esc(st.label)}: ${Math.round(st.n)}${st.leak ? ` <span style="color:#c2410c">(${esc(st.leak)})</span>` : ''}`).join('<br>')}</p>
${funnel.slipping >= 100 ? `<p>That's roughly <b>${fmtMoney(funnel.slipping)}${funnel.perMonth ? ' a month' : ''}</b> slipping through with your current follow-up.</p>` : ''}
<p>What to fix, in order:</p>
<ol style="padding-left:20px">${items}</ol>
${next}
<p>Yousif Alias<br>KenjiAI</p></div>`;
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };

  let body: { first_name?: string; email?: string; phone?: string; answers?: unknown; utm?: Record<string, string>; seconds?: number };
  try { body = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Invalid JSON' }); }

  const firstName = String(body.first_name || '').trim().slice(0, 60);
  const email = String(body.email || '').trim().toLowerCase().slice(0, 200);
  const phone = String(body.phone || '').replace(/[^\d+]/g, '').slice(0, 20);
  if (!firstName) return json(400, { error: 'Please add your first name.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json(400, { error: 'Please enter a valid email address.' });
  if (phone.replace(/\D/g, '').length < 10) return json(400, { error: 'Please enter a phone number we can reach you on.' });

  const answers = cleanAnswers(body.answers);
  const qualified = isQualified(answers);
  const { score, leaks, grade } = scoreAnswers(answers);
  const result = { ok: true, qualified, score, grade };

  const token = process.env.GHL_PIT;
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
  if (!token) return json(200, { ...result, saved: false });
  const headers = { Authorization: `Bearer ${token}`, Version: GHL_VERSION, 'Content-Type': 'application/json', Accept: 'application/json' };

  let contactId: string | null = null;
  try {
    const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: 'POST', headers,
      body: JSON.stringify({
        locationId, firstName, email, phone, source: 'kenjiai.com/findtheleak',
        tags: ['lead leak quiz', qualified ? 'quiz qualified' : 'quiz not qualified'],
      }),
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) {
      console.error('[lead-score] upsert failed', r.status, JSON.stringify(data).slice(0, 300));
      return json(200, { ...result, saved: false });
    }
    contactId = data?.contact?.id || null;
  } catch (e) {
    console.error('[lead-score] upsert threw', e);
    return json(200, { ...result, saved: false });
  }
  if (!contactId) return json(200, { ...result, saved: false });

  const utm = body.utm && typeof body.utm === 'object' ? body.utm : {};
  const secs = Math.max(0, Math.min(36000, Math.round(Number(body.seconds) || 0)));
  const note = [
    `Find the Leak quiz (kenjiai.com/findtheleak): ${score}/100, ${grade}. ${qualified ? 'QUALIFIED, sent to booking' : 'NOT QUALIFIED, shown the $7 offer'}.`,
    `Time on quiz: ${Math.floor(secs / 60)}m ${secs % 60}s`,
    `Biggest leaks: ${leaks.slice(0, 3).map((l) => l.title).join('; ') || 'none'}`,
    '',
    ...visibleQuestions(answers).map((q) => `${q.title} ${answers[q.id] ? labelOf(q.id, answers[q.id]) : 'not answered'}`),
    ...(Object.keys(utm).length ? ['', 'Came from: ' + Object.entries(utm).map(([k, v]) => `${k}=${String(v).slice(0, 80)}`).join(', ')] : []),
  ].join('\n');
  await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, { method: 'POST', headers, body: JSON.stringify({ body: note }) }).catch(() => null);

  // They asked for their results, so this goes out right away (a reply to their request, not a campaign email).
  try {
    const c = await fetch(`${GHL_BASE}/conversations/`, { method: 'POST', headers, body: JSON.stringify({ locationId, contactId }) });
    const cj: any = await c.json().catch(() => ({}));
    const conversationId = cj?.conversation?.id || cj?.conversationId;
    if (conversationId) {
      await fetch(`${GHL_BASE}/conversations/messages`, {
        method: 'POST', headers,
        body: JSON.stringify({
          type: 'Email', conversationId, contactId, fromName: 'Yousif | KenjiAI', from: 'support@mediatraffics.com', to: email,
          subject: `Where your funnel is leaking (${score}/100)`, html: resultsEmail(firstName, score, grade, leaks, qualified, funnelModel(answers)),
        }),
      });
    }
  } catch (e) {
    console.error('[lead-score] results email failed', e);
  }

  return json(200, { ...result, saved: true });
};
