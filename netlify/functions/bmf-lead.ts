import type { Handler } from '@netlify/functions';
import { toGhl, sha256, BMF_PIXEL_ID } from './bmf-confirm';

/**
 * BMF Fitness quiz opt-in (kenjiai.com/bmf, step 1 of 2).
 *
 * POST { name, email, phone, answers, score, band, protein, event_id, fbp, fbc, company }
 *   - upserts the lead into BRENTEN'S GHL location, tags "bmf quiz lead" + "bmf score <band>",
 *     and adds the answers + score as a note. Every opt-in is his lead, bought or not.
 *   - sends a server-side Meta Lead to his pixel with event_id (the page fires the same id).
 * `company` is a honeypot: bots fill it, people never see it.
 * Tags and notes only. Never workflow enrollment, never SMS/email through the API.
 */

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});
const clean = (v: unknown, max = 120) => String(v ?? '').replace(/[\r\n]+/g, ' ').trim().slice(0, max);

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'POST only' });
  let b: Record<string, unknown> = {};
  try {
    b = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Bad JSON' });
  }
  if (clean(b.company)) return json(200, { ok: true });

  const name = clean(b.name, 80);
  const email = clean(b.email, 120).toLowerCase();
  const phone = clean(b.phone, 30);
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || phone.replace(/\D/g, '').length < 10) {
    return json(400, { error: 'Please check your name, email and phone.' });
  }

  const a = (b.answers && typeof b.answers === 'object' ? b.answers : {}) as Record<string, unknown>;
  const score = Math.max(0, Math.min(100, Number(b.score) || 0));
  const band = clean(b.band, 30);
  const note = [
    'BMF Protein Score quiz (kenjiai.com/bmf)',
    `Score: ${score}/100 (${band})`,
    `Daily protein number: ${clean(b.protein, 10)} g`,
    `Goal: ${clean(a.goal)}`,
    `Goal bodyweight: ${clean(a.weight, 10)} lb`,
    `Meals a day with real protein: ${clean(a.meals)}`,
    `Plans meals ahead: ${clean(a.plan)}`,
    `Trains: ${clean(a.days)} days a week`,
    `Biggest thing in the way: ${clean(a.blocker)}`,
    'Next: shown the $9 7-Day Protein Fix. A "bmf protein fix $9" tag means they bought.',
  ].join('\n');

  const ghl = await toGhl({ name, email, phone }, ['bmf quiz lead', `bmf score ${band.toLowerCase()}`], note).catch((e) => `threw ${e}`);
  if (ghl !== 'ok') {
    console.error('[bmf-lead] ghl', ghl);
    return json(502, { error: 'Could not save. Try again.' });
  }

  const token = process.env.BMF_META_TOKEN;
  const eventId = clean(b.event_id, 80);
  if (token && eventId) {
    const user_data: Record<string, unknown> = {
      em: [sha256(email)],
      ph: [sha256(phone.replace(/\D/g, ''))],
      fn: [sha256(name.split(/\s+/)[0])],
      client_ip_address: event.headers['x-nf-client-connection-ip'] || '',
      client_user_agent: event.headers['user-agent'] || '',
    };
    if (clean(b.fbp, 200)) user_data.fbp = clean(b.fbp, 200);
    if (clean(b.fbc, 300)) user_data.fbc = clean(b.fbc, 300);
    await fetch(`https://graph.facebook.com/v21.0/${BMF_PIXEL_ID}/events?access_token=${token}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: [{
          event_name: 'Lead',
          event_time: Math.floor(Date.now() / 1000),
          event_id: eventId,
          event_source_url: 'https://kenjiai.com/bmf',
          action_source: 'website',
          user_data,
          custom_data: { content_name: 'BMF Protein Score quiz' },
        }],
      }),
    }).catch(() => null);
  }
  return json(200, { ok: true });
};
