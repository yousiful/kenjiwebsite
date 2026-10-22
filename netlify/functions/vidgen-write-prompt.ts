import type { Context } from '@netlify/functions';
import { json, fail, ipHash, notConnected, readJson, readSession, sameOrigin, str } from './_vidgen/common';
import { getUser, readyDb, underHourlyIpLimit, underHourlyLimit, type Db } from './_vidgen/db';
import { goalById, MODELS, AD_PLACEMENTS, ASPECTS, type Aspect, type GoalId, type ModelId } from '../../src/vidgen/models';

/**
 * Kenji Studio prompt writer. Either the person types one sentence ({ idea }) and the writer
 * picks the kind of video and frame, or they answer 2-4 plain questions for a kind they chose.
 * Both come back as a model-ready, shot-by-shot video prompt. Free (no credits). Works signed
 * out so people can try before signing in: 8 an hour per (hashed) IP signed out, 30 an
 * hour per person signed in. OpenRouter: anthropic/claude-sonnet-5.5, falling back to claude-haiku-5.5.
 * Env: OPENROUTER_API_KEY.
 */

const PER_HOUR = 30;
const ANON_PER_HOUR = 8;
const PRIMARY = 'anthropic/claude-sonnet-5.5';
const FALLBACK = 'anthropic/claude-haiku-5.5';

const BASE_RULES = `You write prompts for AI video models (Kling, Seedance, Wan). The person gave plain answers; you turn them into one prompt the model can shoot.

Every prompt covers, in this order, in plain concrete words:
1. Subject: who or what is on screen, with 2-3 specific visual details (age, clothing, materials, colors).
2. Action: what physically happens, one clear beat at a time. Use present tense verbs.
3. Camera: shot size, angle and one camera move (slow push-in, handheld follow, orbit, static locked-off, crane down).
4. Lighting and setting: time of day, light source, a few environment details.
5. Style: the look (photoreal commercial, 35mm film, clean 3D animation, documentary handheld) and the color palette.
6. On-screen text: video models garble lettering, so do not ask for readable text, logos or captions inside the shot. If text matters, say "leave clean space in the upper third for a caption added later".

Hard rules:
- Describe only what a camera can see and hear. No abstract marketing words like "innovative", "seamless", "game-changing", "unlock", "elevate".
- No real celebrities, no real brand logos, no real public figures, nothing sexual, nothing violent toward real people.
- No em dashes. Write plain sentences.
- The main prompt is at most 900 characters.`;

const GOAL_RULES: Record<GoalId, string> = {
  ad: `This is a paid social ad. The first 2 seconds are the hook: open on the most surprising or relatable moment (the problem in action or the result), never on a logo or a slow establishing shot. Then show the product in use and the result. End on a clean, steady product or result shot that suits a call to action added later. Keep the pace quick.`,
  vsl: `This is b-roll for a video sales letter. It backs up the point being spoken over it, so it must show that point literally and emotionally. Grounded, believable, real-world footage of everyday business owners or customers. No text, no hype. Calm, purposeful camera.`,
  course: `This is a visual for a lesson. It should make the idea easier to understand: show the concept as a concrete physical metaphor or a clear demonstration. Simple composition, one idea per shot, steady camera, nothing distracting in the background.`,
  walkthrough: `This animates a screenshot or product photo the person uploaded (it becomes the first frame). Keep the interface or product exactly as it is: no new buttons, no changed text, no warping. Describe a smooth, slow camera move toward the part they want to show off, soft depth of field, subtle light sweep. Nothing on screen should morph.`,
  story: `This is a film scene. Think like a director: a strong opening image, one clear dramatic beat, and a final frame worth holding on. Specify the genre's visual language (lens, color grade, pacing).`,
  genjutsu: `This guides a video-to-video edit of the person's own clip. Say what to keep (motion, camera, framing) and what should change. Keep it under 300 characters.`,
};

const SHAPE = `Return ONLY valid JSON, no markdown fences, no commentary:
{"prompt": "the full single-take prompt", "shots": [{"prompt": "shot 1, at most 400 characters", "duration": 3}]}
"shots" is a 2-4 shot version of the same video for models that support multi-shot. Shot durations are whole seconds and must add up to exactly the total length given. If the video should be one continuous take, return "shots": [].`;

async function callModel(model: string, system: string, user: string, timeoutMs: number): Promise<string> {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://kenjiai.com/video-generation',
      'X-Title': 'Kenji Studio',
    },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({
      model,
      messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });
  const data = (await res.json().catch(() => ({}))) as { choices?: { message?: { content?: string } }[] };
  if (!res.ok) throw new Error(`openrouter ${res.status}`);
  return data?.choices?.[0]?.message?.content || '';
}

const noDashes = (s: string) => s.replace(/\s*[—–]\s*/g, ', ');

/** Parses the model's JSON defensively and forces shot durations to add up to the total. */
export function parseWriterOutput(raw: string, total: number): { prompt: string; shots: { prompt: string; duration: number }[] } | null {
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start < 0 || end <= start) return null;
  let v: { prompt?: unknown; shots?: unknown };
  try {
    v = JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
  const prompt = noDashes(str(v.prompt, 2500));
  if (prompt.length < 20) return null;
  let shots = Array.isArray(v.shots)
    ? (v.shots as { prompt?: unknown; duration?: unknown }[])
        .map((s) => ({ prompt: noDashes(str(s?.prompt, 512)), duration: Math.max(1, Math.round(Number(s?.duration) || 0)) }))
        .filter((s) => s.prompt.length >= 10)
        .slice(0, 4)
    : [];
  if (shots.length < 2 || !total) shots = [];
  if (shots.length) {
    const sum = shots.reduce((a, s) => a + s.duration, 0);
    if (sum !== total) {
      // rescale, then put the rounding difference on the last shot
      shots = shots.map((s) => ({ ...s, duration: Math.max(1, Math.round((s.duration * total) / sum)) }));
      const diff = total - shots.reduce((a, s) => a + s.duration, 0);
      shots[shots.length - 1].duration += diff;
      if (shots.some((s) => s.duration < 1 || s.duration > 15)) shots = [];
    }
  }
  return { prompt, shots };
}

/** One-box mode: the person types one sentence, the writer picks the kind of video and the frame. */
const IDEA_GOALS: GoalId[] = ['ad', 'vsl', 'course', 'story'];
const IDEA_GOALS_WITH_IMAGE: GoalId[] = ['ad', 'walkthrough'];

export function ideaSystem(allowed: GoalId[]): string {
  const kinds = allowed
    .map((id) => {
      const g = goalById(id)!;
      return `"${id}" (${g.title}, ${g.duration} seconds): ${g.blurb}\n${GOAL_RULES[id]}`;
    })
    .join('\n\n');
  return `${BASE_RULES}

The person described the video in their own words. First decide which kind of video it is, then follow that kind's rules. If it is unclear, pick "ad" when they mention selling, a product, a service or an offer; otherwise pick the closest fit.

Kinds:
${kinds}

Pick the frame: "9:16" for Reels, Stories, TikTok, Shorts or anything phone-first (the default for ads), "1:1" for a square feed post, "16:9" for YouTube, a website, a VSL, a course or a film scene. Follow what they say if they name a platform.

Return ONLY valid JSON, no markdown fences, no commentary:
{"goal": "one of the kind ids above", "aspect": "9:16 | 1:1 | 16:9", "prompt": "the full single-take prompt", "shots": [{"prompt": "shot 1, at most 400 characters", "duration": 3}]}
"shots" is a 2-4 shot version of the same video for models that support multi-shot. Shot durations are whole seconds and must add up to exactly the length of the kind you picked. If the video should be one continuous take, return "shots": [].`;
}

/** Reads the goal and frame the writer picked, falling back to safe defaults. */
export function parseIdeaChoice(raw: string, allowed: GoalId[]): { goal: GoalId; aspect: Aspect } {
  let v: { goal?: unknown; aspect?: unknown } = {};
  try {
    const c = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    v = JSON.parse(c.slice(c.indexOf('{'), c.lastIndexOf('}') + 1));
  } catch {
    /* defaults below */
  }
  const goal = allowed.includes(v.goal as GoalId) ? (v.goal as GoalId) : allowed[0];
  const aspect = ASPECTS.includes(v.aspect as Aspect) ? (v.aspect as Aspect) : goalById(goal)!.aspect;
  return { goal, aspect };
}

export default async (req: Request, context: Context): Promise<Response> => {
  if (req.method !== 'POST') return fail(405, 'Method not allowed');
  if (!sameOrigin(req)) return fail(403, 'Please use the Kenji Studio page.');
  if (!process.env.OPENROUTER_API_KEY) return fail(503, 'The prompt writer is not connected yet. You can type your own prompt for now.', { notConnected: 'writer' });
  let db: Db | null;
  try {
    db = await readyDb();
  } catch (e) {
    console.error('vidgen-write-prompt db', e);
    return fail(503, 'The prompt writer is busy. Please try again in a minute.');
  }
  if (!db) return notConnected('database');
  const s = readSession(req);
  const user = s ? await getUser(db, s.uid) : null;

  const body = (await readJson(req)) || {};

  const allowed = user
    ? await underHourlyLimit(db, String(user.id), 'write', PER_HOUR)
    : await underHourlyIpLimit(db, ipHash(req, context), 'write', ANON_PER_HOUR);
  if (!allowed) {
    return fail(429, user
      ? 'You have written a lot of prompts this hour. Take a short break and try again.'
      : 'You have tried a lot of prompts this hour. Sign in to keep going, or try again in a bit.', { signIn: !user });
  }

  if (typeof body.idea === 'string') {
    const idea = str(body.idea, 600);
    if (idea.length < 3) return fail(400, 'Tell us in a few words what video you want.');
    const hasImage = !!body.hasImage;
    const kinds = hasImage ? IDEA_GOALS_WITH_IMAGE : IDEA_GOALS;
    const userMsg = [
      hasImage ? 'The person added a picture that will be the first frame. Describe motion that starts from that picture, do not redescribe it in a way that changes it.' : '',
      `What they want:\n${idea}`,
    ].filter(Boolean).join('\n\n');
    for (const [m, t] of [[PRIMARY, 16000], [FALLBACK, 10000]] as const) {
      try {
        const raw = await callModel(m, ideaSystem(kinds), userMsg, t);
        const pick = parseIdeaChoice(raw, kinds);
        const out = parseWriterOutput(raw, goalById(pick.goal)!.duration);
        if (out) return json(200, { ...out, ...pick });
      } catch (e) {
        console.warn('vidgen-write-prompt idea', m, e instanceof Error ? e.message : e);
      }
    }
    return fail(502, 'The prompt writer is busy. Please try again in a moment.');
  }

  const goal = goalById(String(body.goal || ''));
  if (!goal) return fail(400, 'Pick what you want to make first.');
  const answersIn = (body.answers && typeof body.answers === 'object' ? body.answers : {}) as Record<string, unknown>;
  const answers = goal.questions
    .map((q) => ({ q: q.label, a: str(answersIn[q.id], 400) }))
    .filter((x) => x.a);
  const required = goal.questions.filter((q) => !q.optional);
  if (answers.length < Math.min(2, required.length)) return fail(400, 'Answer the questions first so we know what to make.');

  const model = (String(body.model || '') in MODELS ? String(body.model) : goal.model) as ModelId;
  const total = Math.max(0, Math.min(30, Math.round(Number(body.duration) || goal.duration)));
  const hasImage = !!body.hasImage;
  const placement = goal.id === 'ad' ? str(answersIn.placement, 80) : '';
  const aspect = (placement && AD_PLACEMENTS[placement]) || str(body.aspect, 8) || goal.aspect;

  const system = `${BASE_RULES}\n\n${GOAL_RULES[goal.id]}\n\n${SHAPE}`;
  const userMsg = [
    `Kind of video: ${goal.title}`,
    `Total length: ${total ? `${total} seconds` : 'follows the uploaded video'}`,
    `Frame: ${aspect}`,
    `Video model: ${MODELS[model].label}`,
    hasImage ? 'The person uploaded an image that will be the first frame. Describe motion that starts from that image, do not redescribe it in a way that changes it.' : '',
    '',
    ...answers.map((x) => `${x.q}\n${x.a}`),
  ].filter((l) => l !== null).join('\n');

  for (const [m, t] of [[PRIMARY, 14000], [FALLBACK, 9000]] as const) {
    try {
      const out = parseWriterOutput(await callModel(m, system, userMsg, t), total);
      if (out) return json(200, out);
    } catch (e) {
      console.warn('vidgen-write-prompt', m, e instanceof Error ? e.message : e);
    }
  }
  return fail(502, 'The prompt writer is busy. Please try again in a moment.');
};
