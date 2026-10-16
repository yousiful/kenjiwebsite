import { randomUUID } from 'node:crypto';
import type { Context } from '@netlify/functions';
import {
  json, fail, notConnected, readJson, readSession, sameOrigin, sessionSecret, siteUrl, clearSessionCookie, str, isUuid,
} from './_vidgen/common';
import { readyDb, getUser, balance, createGenerationWithHold, refundGeneration, underHourlyLimit, type Db, type Row } from './_vidgen/db';
import { hfConfigured, hfEstimate, hfUploadUrl, hfRestylePresets, UPLOAD_TYPES, HfError } from './_vidgen/hf';
import { dispatch, refreshActive, triggerStore } from './_vidgen/jobs';
import { withUser } from './_vidgen/guard';
import { stripeConfigured } from './_vidgen/stripe';
import {
  MODELS, PLANS, isPlanId, parseGenInput, buildHfRequest, creditsFromUsd, genTitle, RESTYLE_PRESETS_PATH,
  type GenInput, type HfRequest,
} from '../../src/vidgen/models';

/**
 * Kenji Studio API (kenjiai.com/video-generation). Netlify DB holds users, credits and
 * generations; finished videos are copied into Blobs (vidgen-media).
 *
 *   GET  ?op=me          who is signed in, balance, plan, what is connected (works signed out)
 *   POST ?op=logout
 *   GET  ?op=presets     Genjutsu restyle styles (Studio plan)
 *   POST ?op=upload-url  {contentType, kind}  -> presigned Higgsfield upload (browser PUTs the file)
 *   POST ?op=estimate    {input}              -> {credits}
 *   POST ?op=generate    {input}              -> holds credits, queues, submits when a slot is free
 *   GET  ?op=list        the person's generations (also polls active jobs, webhook fallback)
 */

const UPLOADS_PER_HOUR = 60;
const ESTIMATES_PER_HOUR = 240;

const friendlyError = (status: string): string | null =>
  ({
    failed: 'This one did not render. Your credits are back.',
    nsfw: 'The content filter blocked this one. Your credits are back.',
    canceled: 'Canceled. Your credits are back.',
  })[status] || null;

function publicGen(g: Row) {
  return {
    id: String(g.id),
    title: String(g.title || ''),
    goal: String(g.goal),
    model: String(g.model),
    modelLabel: MODELS[g.model as keyof typeof MODELS]?.label || String(g.model),
    prompt: String(g.prompt || ''),
    status: String(g.status),
    credits: Number(g.credits),
    aspect: g.aspect || null,
    seconds: Number(g.seconds || 0),
    createdAt: new Date(g.created_at).toISOString(),
    error: friendlyError(String(g.status)),
    ready: g.status === 'completed',
    stored: !!g.media_stored,
    mediaUrl: g.status === 'completed' ? `/.netlify/functions/vidgen-media?id=${g.id}` : null,
  };
}

const hasGenjutsu = (u: Row) => isPlanId(u.plan) && PLANS[u.plan].genjutsu && ['active', 'trialing', 'past_due'].includes(String(u.sub_status));

/** Every media URL in the input must be one this person uploaded through us. */
async function ownsUploads(db: Db, uid: string, i: GenInput): Promise<boolean> {
  const urls = [i.imageUrl, i.videoUrl, ...(i.refUrls || [])].filter((u): u is string => !!u);
  if (!urls.length) return true;
  const rows = await db.q(`SELECT count(*)::int AS n FROM vg_uploads WHERE user_id = $1 AND public_url = ANY($2::text[])`, [uid, urls]);
  return Number(rows[0]?.n || 0) === new Set(urls).size;
}

async function prepare(db: Db, user: Row, raw: unknown): Promise<{ input: GenInput; req: HfRequest } | Response> {
  const input = parseGenInput(raw);
  if (typeof input === 'string') return fail(400, input);
  if (MODELS[input.model].genjutsu && !hasGenjutsu(user)) return fail(403, 'Genjutsu comes with the Studio plan.', { needsPlan: 'studio' });
  const req = buildHfRequest(input);
  if (typeof req === 'string') return fail(400, req);
  if (!(await ownsUploads(db, String(user.id), input))) return fail(400, 'One of your files did not upload. Please add it again.');
  return { input, req };
}

async function estimateCredits(req: HfRequest): Promise<{ credits: number; usd: number } | Response> {
  try {
    const e = await hfEstimate(req.path, req.body);
    return { credits: creditsFromUsd(e.usd), usd: Number(e.usd) };
  } catch (e) {
    const err = e instanceof HfError ? e : null;
    console.warn('vidgen estimate', err?.status, err?.detail || e);
    if (err && (err.status === 400 || err.status === 422)) return fail(400, 'Those settings do not work with this model. Try a different length or model.');
    return fail(502, 'We could not price this right now. Please try again in a moment.');
  }
}

async function me(req: Request): Promise<Response> {
  const setup = { signin: !!(sessionSecret() && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET), generation: hfConfigured(), billing: stripeConfigured(), database: !!process.env.NETLIFY_DATABASE_URL };
  const s = readSession(req);
  if (!s || !setup.database) return json(200, { user: null, setup });
  let db: Db | null;
  try {
    db = await readyDb();
  } catch {
    return json(200, { user: null, setup: { ...setup, database: false } });
  }
  if (!db) return json(200, { user: null, setup });
  const u = await getUser(db, s.uid);
  if (!u) return json(200, { user: null, setup });
  return json(200, {
    user: {
      email: u.email, name: u.name, picture: u.picture,
      plan: isPlanId(u.plan) ? u.plan : null, subStatus: u.sub_status || '',
      balance: await balance(db, s.uid), genjutsu: hasGenjutsu(u),
    },
    setup,
  });
}

export default async (req: Request, context: Context): Promise<Response> => {
  const op = new URL(req.url).searchParams.get('op') || '';
  try {
    if (op === 'me' && req.method === 'GET') return await me(req);
    if (req.method === 'POST' && !sameOrigin(req)) return fail(403, 'Please use the Kenji Studio page.');
    if (op === 'logout' && req.method === 'POST') return json(200, { ok: true }, { 'Set-Cookie': clearSessionCookie() });

    const ctx = await withUser(req);
    if (ctx instanceof Response) return ctx;
    const { db, user } = ctx;
    const uid = String(user.id);
    const origin = siteUrl(context);

    if (op === 'list' && req.method === 'GET') {
      if (hfConfigured()) {
        const done = await refreshActive(db, { uid, staleSec: 8, limit: 4 });
        await Promise.all(done.map((gid) => triggerStore(origin, gid)));
        await dispatch(db, origin, 2);
      }
      const rows = await db.q(`SELECT * FROM vg_generations WHERE user_id = $1 ORDER BY created_at DESC LIMIT 60`, [uid]);
      return json(200, { items: rows.map(publicGen), balance: await balance(db, uid) });
    }

    if (!hfConfigured()) return notConnected('generation');

    if (op === 'presets' && req.method === 'GET') {
      if (!hasGenjutsu(user)) return fail(403, 'Genjutsu comes with the Studio plan.', { needsPlan: 'studio' });
      return json(200, { items: await hfRestylePresets(RESTYLE_PRESETS_PATH) });
    }

    if (req.method !== 'POST') return fail(405, 'Method not allowed');
    const body = (await readJson(req)) || {};

    if (op === 'upload-url') {
      const contentType = str(body.contentType, 40).toLowerCase();
      const kind = body.kind === 'video' ? 'video' : 'image';
      if (!UPLOAD_TYPES.includes(contentType) || (kind === 'video') !== contentType.startsWith('video/')) {
        return fail(400, kind === 'video' ? 'Please upload an MP4 video.' : 'Please upload a JPG, PNG or WebP picture.');
      }
      if (!(await underHourlyLimit(db, uid, 'upload', UPLOADS_PER_HOUR))) return fail(429, 'That is a lot of uploads in one hour. Please wait a bit.');
      const u = await hfUploadUrl(contentType);
      await db.q(`INSERT INTO vg_uploads (public_url, user_id, kind) VALUES ($1, $2, $3) ON CONFLICT (public_url) DO NOTHING`, [u.public_url, uid, kind]);
      return json(200, u);
    }

    if (op === 'estimate') {
      if (!(await underHourlyLimit(db, uid, 'estimate', ESTIMATES_PER_HOUR))) return fail(429, 'Too many price checks in one hour. Please wait a bit.');
      const p = await prepare(db, user, body.input);
      if (p instanceof Response) return p;
      const e = await estimateCredits(p.req);
      if (e instanceof Response) return e;
      return json(200, { credits: e.credits, seconds: p.req.seconds });
    }

    if (op === 'generate') {
      const p = await prepare(db, user, body.input);
      if (p instanceof Response) return p;
      const e = await estimateCredits(p.req);
      if (e instanceof Response) return e;
      if (Number.isFinite(Number(body.expectCredits)) && e.credits > Number(body.expectCredits)) {
        return fail(409, `The price changed to ${e.credits} credits. Please check and press Generate again.`, { credits: e.credits });
      }
      const id = randomUUID();
      const r = await createGenerationWithHold(db, {
        id, uid, goal: p.input.goal, model: p.input.model, title: genTitle(p.input.goal, p.input.prompt), prompt: p.input.prompt,
        aspect: (p.req.body.aspect_ratio as string) || null, seconds: p.req.seconds,
        hfPath: p.req.path, hfBody: p.req.body, credits: e.credits, estUsd: e.usd,
      });
      if (r === 'insufficient') return fail(402, `This video needs ${e.credits} credits and you have ${await balance(db, uid)}.`, { needsCredits: e.credits });
      if (r === 'too-many') return fail(429, 'You already have several videos in the queue. Start this one when one of them is done.');
      try {
        await dispatch(db, origin, 1);
      } catch (err) {
        console.warn('vidgen dispatch after generate', err); // the queue function picks it up
      }
      const row = (await db.q(`SELECT * FROM vg_generations WHERE id = $1`, [id]))[0];
      return json(200, { item: publicGen(row), balance: await balance(db, uid) });
    }

    if (op === 'cancel') {
      // only jobs still waiting in our own queue can be canceled from here
      if (!isUuid(body.id)) return fail(400, 'Unknown video.');
      const rows = await db.q(
        `UPDATE vg_generations SET status = 'canceled', finished_at = now(), updated_at = now() WHERE id = $1 AND user_id = $2 AND status = 'queued' RETURNING id`,
        [body.id, uid],
      );
      if (!rows.length) return fail(409, 'This one has already started, so it cannot be canceled.');
      await refundGeneration(db, String(body.id));
      return json(200, { ok: true, balance: await balance(db, uid) });
    }

    return fail(400, 'Unknown request');
  } catch (e) {
    console.error('vidgen-api', op, e);
    return fail(500, 'Something went wrong on our side. Please try again.');
  }
};
