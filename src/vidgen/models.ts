/**
 * Kenji Studio model, goal, plan and pricing config. Shared by the browser
 * (goal cards, Advanced options) and the vidgen-* Netlify Functions (request
 * building, validation, credit math). Keep every Higgsfield request field here.
 *
 * Request schemas were taken from https://docs.higgsfield.ai/docs/llms-full.txt
 * (the openapi.json only covers a handful of models). Notable facts from the docs:
 *  - kling-video/v2.5-turbo/pro/image-to-video: duration 5|10, no aspect, no sound.
 *  - kling-video/v3.0/pro/*: duration 3-15, sound "on"|"off" (default on),
 *    aspect_ratio only on text-to-video (16:9|9:16|1:1), multi_shots + multi_prompt
 *    (1-6 shots, each prompt <= 512 chars, durations summed for billing).
 *  - bytedance/seedance-2.0/*: duration 4-15, resolution, generate_audio,
 *    aspect_ratio only on text-to-video.
 *  - alibaba/wan-3.0/*: duration 2-30, resolution (default 1080p), generate_audio,
 *    aspect_ratio on both text- and image-to-video.
 *  - higgsfield/genjutsu/restyle/v1.0: preset_id required, image_urls max 5 (not 8).
 *  - genjutsu motion-transfer and object-swap: image_urls 1-8 required, prompt optional.
 */

export const CREDITS_PER_USD = 25; // 1 credit ~ $0.04 of Higgsfield cost
export const TRIAL_CREDITS = 30; // must cover the default first video of every non-Studio goal (tested)
export const MAX_RUNNING_PER_USER = 2;

export type Aspect = '9:16' | '1:1' | '16:9';
export const ASPECTS: Aspect[] = ['9:16', '1:1', '16:9'];
export const ASPECT_LABEL: Record<Aspect, string> = { '9:16': 'Tall 9:16', '1:1': 'Square 1:1', '16:9': 'Wide 16:9' };

export type ModelId = 'kling-3-pro' | 'kling-25-turbo' | 'seedance-2' | 'wan-3' | 'gj-restyle' | 'gj-motion' | 'gj-swap';
export type GoalId = 'ad' | 'vsl' | 'course' | 'walkthrough' | 'story' | 'genjutsu';

export interface ModelSpec {
  id: ModelId;
  label: string;
  note: string;
  genjutsu: boolean;
  t2v?: string; // text-to-video endpoint path
  i2v?: string; // image-to-video endpoint path
  durations: number[]; // choices we offer (all inside the model's documented range)
  minDur: number;
  maxDur: number;
  aspectOnT2v: boolean;
  aspectOnI2v: boolean;
  audio?: 'sound' | 'generate_audio';
  resolution?: string; // value we send when the model takes a resolution
  multiShot?: boolean;
}

export const MODELS: Record<ModelId, ModelSpec> = {
  'kling-3-pro': {
    id: 'kling-3-pro', label: 'Kling 3.0 Pro', note: 'Sharp people and motion, sound, multi-shot', genjutsu: false,
    t2v: 'kling-video/v3.0/pro/text-to-video', i2v: 'kling-video/v3.0/pro/image-to-video',
    durations: [3, 5, 8, 10, 15], minDur: 3, maxDur: 15, aspectOnT2v: true, aspectOnI2v: false, audio: 'sound', multiShot: true,
  },
  'kling-25-turbo': {
    id: 'kling-25-turbo', label: 'Kling 2.5 Turbo Pro', note: 'Fast, good value, brings a still image to life', genjutsu: false,
    i2v: 'kling-video/v2.5-turbo/pro/image-to-video',
    durations: [5, 10], minDur: 5, maxDur: 10, aspectOnT2v: false, aspectOnI2v: false,
  },
  'seedance-2': {
    id: 'seedance-2', label: 'Seedance 2.0', note: 'Smooth cinematic camera work', genjutsu: false,
    t2v: 'bytedance/seedance-2.0/text-to-video', i2v: 'bytedance/seedance-2.0/image-to-video',
    durations: [4, 5, 8, 10, 15], minDur: 4, maxDur: 15, aspectOnT2v: true, aspectOnI2v: false, audio: 'generate_audio', resolution: '720p',
  },
  'wan-3': {
    id: 'wan-3', label: 'Wan 3.0', note: 'Clear explainers and longer clips', genjutsu: false,
    t2v: 'alibaba/wan-3.0/text-to-video', i2v: 'alibaba/wan-3.0/image-to-video',
    durations: [3, 5, 8, 10, 15], minDur: 2, maxDur: 30, aspectOnT2v: true, aspectOnI2v: true, audio: 'generate_audio', resolution: '720p',
  },
  'gj-restyle': {
    id: 'gj-restyle', label: 'Genjutsu Restyle', note: 'Your video in a new look', genjutsu: true,
    durations: [], minDur: 0, maxDur: 0, aspectOnT2v: false, aspectOnI2v: false, resolution: '720p',
  },
  'gj-motion': {
    id: 'gj-motion', label: 'Genjutsu Motion transfer', note: 'Your movement on a new character', genjutsu: true,
    durations: [], minDur: 0, maxDur: 0, aspectOnT2v: false, aspectOnI2v: false, resolution: '720p',
  },
  'gj-swap': {
    id: 'gj-swap', label: 'Genjutsu Object swap', note: 'Swap one thing in your video for another', genjutsu: true,
    durations: [], minDur: 0, maxDur: 0, aspectOnT2v: false, aspectOnI2v: false, resolution: '720p',
  },
};

export const GENJUTSU_PATHS: Record<'gj-restyle' | 'gj-motion' | 'gj-swap', string> = {
  'gj-restyle': 'higgsfield/genjutsu/restyle/v1.0',
  'gj-motion': 'higgsfield/genjutsu/motion-transfer/v1.0',
  'gj-swap': 'higgsfield/genjutsu/object-swap/v1.0',
};
export const RESTYLE_PRESETS_PATH = 'models/higgsfield/genjutsu/restyle/v1.0/presets';

export const VIDEO_MODEL_IDS: ModelId[] = ['kling-3-pro', 'seedance-2', 'wan-3', 'kling-25-turbo'];

export interface Question {
  id: string;
  label: string;
  placeholder?: string;
  kind: 'text' | 'choice';
  options?: string[];
  optional?: boolean;
}

export type MediaNeed = 'none' | 'image-optional' | 'image' | 'video';

export interface Goal {
  id: GoalId;
  title: string;
  blurb: string;
  model: ModelId;
  duration: number;
  aspect: Aspect;
  media: MediaNeed;
  mediaLabel?: string;
  questions: Question[];
  studioOnly?: boolean;
}

export const AD_PLACEMENTS: Record<string, Aspect> = {
  'Reels, Stories or TikTok (tall)': '9:16',
  'Feed post (square)': '1:1',
  'YouTube or a website (wide)': '16:9',
};

export const GOALS: Goal[] = [
  {
    id: 'ad', title: 'Ad', blurb: 'A scroll-stopping ad for Facebook, Instagram or TikTok.',
    model: 'kling-3-pro', duration: 8, aspect: '9:16', media: 'image-optional', mediaLabel: 'Product photo (optional)',
    questions: [
      { id: 'product', label: 'What are you selling?', placeholder: 'A $49 teeth whitening kit that works in 7 days', kind: 'text' },
      { id: 'audience', label: 'Who is it for?', placeholder: 'Busy moms in their 30s who want a brighter smile', kind: 'text' },
      { id: 'action', label: 'What should people do after watching?', placeholder: 'Tap Shop Now and get 20% off this week', kind: 'text' },
      { id: 'placement', label: 'Where will it run?', kind: 'choice', options: Object.keys(AD_PLACEMENTS) },
    ],
  },
  {
    id: 'vsl', title: 'VSL scene', blurb: 'B-roll and scenes that back up what you say in your sales video.',
    model: 'seedance-2', duration: 5, aspect: '16:9', media: 'none',
    questions: [
      { id: 'point', label: 'What point is this scene backing up?', placeholder: 'Most local businesses miss half their calls', kind: 'text' },
      { id: 'show', label: 'What should we see?', placeholder: 'A shop owner watching missed calls stack up on his phone at night', kind: 'text' },
      { id: 'mood', label: 'How should it feel?', kind: 'choice', options: ['Serious', 'Hopeful', 'Urgent but calm', 'Premium'] },
    ],
  },
  {
    id: 'course', title: 'Course or lesson', blurb: 'Visuals that make a lesson easier to follow.',
    model: 'wan-3', duration: 10, aspect: '16:9', media: 'none',
    questions: [
      { id: 'topic', label: 'What is the lesson about?', placeholder: 'How compound interest grows savings over 20 years', kind: 'text' },
      { id: 'visual', label: 'What should the viewer see while you teach?', placeholder: 'A small pile of coins slowly growing into a tall stack', kind: 'text' },
      { id: 'style', label: 'Pick a look', kind: 'choice', options: ['Real footage', 'Clean animation', 'Whiteboard sketch', 'Cinematic'] },
    ],
  },
  {
    id: 'walkthrough', title: 'Product walkthrough', blurb: 'Turn a screenshot of your app or product into a moving shot.',
    model: 'kling-25-turbo', duration: 5, aspect: '16:9', media: 'image', mediaLabel: 'Screenshot or product photo',
    questions: [
      { id: 'what', label: 'What is on this screen?', placeholder: 'Our booking dashboard, calendar view', kind: 'text' },
      { id: 'focus', label: 'What should the camera show off?', placeholder: 'The one-click booking button on the right', kind: 'text' },
    ],
  },
  {
    id: 'story', title: 'Movie or story scene', blurb: 'Any scene you can picture, shot like a film.',
    model: 'kling-3-pro', duration: 10, aspect: '16:9', media: 'none',
    questions: [
      { id: 'what', label: 'What happens in the scene?', placeholder: 'A boxer laces up alone before his last fight', kind: 'text' },
      { id: 'where', label: 'Where and when?', placeholder: 'A worn-out gym in Detroit, just before dawn', kind: 'text' },
      { id: 'genre', label: 'What kind of film?', kind: 'choice', options: ['Drama', 'Action', 'Comedy', 'Sci-fi', 'Fantasy', 'Documentary'] },
    ],
  },
  {
    id: 'genjutsu', title: 'Genjutsu', blurb: 'Restyle a video you already have, move a new character with your motion, or swap an object.',
    model: 'gj-restyle', duration: 0, aspect: '16:9', media: 'video', mediaLabel: 'Your video (4 to 30 seconds, MP4)', studioOnly: true,
    questions: [
      { id: 'note', label: 'Anything to keep or change?', placeholder: 'Keep the same camera move. Make the jacket red.', kind: 'text', optional: true },
    ],
  },
];

export const goalById = (id: string): Goal | undefined => GOALS.find((g) => g.id === id);

// ---------- plans ----------

export type PlanId = 'starter' | 'creator' | 'studio';
export interface Plan { id: PlanId; name: string; usd: number; credits: number; genjutsu: boolean; line: string }
export const PLANS: Record<PlanId, Plan> = {
  starter: { id: 'starter', name: 'Starter', usd: 29, credits: 300, genjutsu: false, line: 'For testing a few ads a month' },
  creator: { id: 'creator', name: 'Creator', usd: 79, credits: 900, genjutsu: false, line: 'For weekly ads, VSL scenes and lessons' },
  studio: { id: 'studio', name: 'Studio', usd: 199, credits: 2500, genjutsu: true, line: 'For teams, plus Genjutsu' },
};
export const PLAN_IDS: PlanId[] = ['starter', 'creator', 'studio'];
export const TOPUP = { usd: 25, credits: 250 };
export const isPlanId = (v: unknown): v is PlanId => typeof v === 'string' && v in PLANS;

// ---------- credit math ----------

/** Our credits for a Higgsfield USD estimate: ceil(usd * 25), at least 1. Integer math so 0.2 -> 5, not 6. */
export function creditsFromUsd(usd: string | number): number {
  const n = typeof usd === 'number' ? usd : Number.parseFloat(String(usd));
  if (!Number.isFinite(n) || n < 0) throw new Error('bad usd estimate');
  const micros = Math.round(n * 1_000_000);
  return Math.max(1, Math.ceil((micros * CREDITS_PER_USD) / 1_000_000));
}

/**
 * Published Higgsfield list prices in USD per output second (2026-10). Used to show an
 * "about N credits" price before sign-in; signed-in prices come from POST /estimate.
 */
export const PUBLISHED_USD_PER_SEC: Partial<Record<ModelId, number>> = {
  'kling-3-pro': 0.084,
  'kling-25-turbo': 0.042,
  'wan-3': 0.05,
  'seedance-2': 0.141,
};

/** Approximate credits from the published per-second price, or null when it depends on an upload (Genjutsu). */
export function approxCredits(model: ModelId, seconds: number): number | null {
  const rate = PUBLISHED_USD_PER_SEC[model];
  if (!rate || !seconds) return null;
  return creditsFromUsd(Math.round(rate * seconds * 1_000_000) / 1_000_000);
}

// ---------- request building (validated, used server-side) ----------

export interface Shot { prompt: string; duration: number }

export interface GenInput {
  goal: GoalId;
  model: ModelId;
  prompt: string;
  shots?: Shot[];
  duration?: number;
  aspect?: Aspect;
  sound?: boolean;
  imageUrl?: string;
  videoUrl?: string;
  refUrls?: string[];
  presetId?: string;
}

export interface HfRequest { path: string; body: Record<string, unknown>; seconds: number }

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isHttps = (u: unknown): u is string => typeof u === 'string' && u.length <= 2083 && /^https:\/\/[^\s]+$/.test(u);
const clip = (s: unknown, max: number) => String(s ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max); // eslint-disable-line no-control-regex

/** Normalizes untrusted input into a GenInput. Returns an error message for the person on bad input. */
export function parseGenInput(raw: unknown): GenInput | string {
  if (!raw || typeof raw !== 'object') return 'Something was missing. Please try again.';
  const r = raw as Record<string, unknown>;
  const goal = goalById(String(r.goal || ''));
  if (!goal) return 'Pick what you want to make first.';
  const model = String(r.model || '') as ModelId;
  if (!(model in MODELS)) return 'Pick a model.';
  const spec = MODELS[model];
  if (spec.genjutsu !== (goal.id === 'genjutsu')) return 'That model does not fit this kind of video.';
  const out: GenInput = { goal: goal.id, model, prompt: clip(r.prompt, 2500) };
  if (Array.isArray(r.shots)) {
    out.shots = (r.shots as Record<string, unknown>[]).slice(0, 6).map((s) => ({ prompt: clip(s?.prompt, 512), duration: Math.round(Number(s?.duration)) }));
  }
  if (r.duration !== undefined) out.duration = Math.round(Number(r.duration));
  if (typeof r.aspect === 'string' && (ASPECTS as string[]).includes(r.aspect)) out.aspect = r.aspect as Aspect;
  if (typeof r.sound === 'boolean') out.sound = r.sound;
  if (r.imageUrl) out.imageUrl = String(r.imageUrl);
  if (r.videoUrl) out.videoUrl = String(r.videoUrl);
  if (Array.isArray(r.refUrls)) out.refUrls = (r.refUrls as unknown[]).map(String);
  if (r.presetId) out.presetId = String(r.presetId);
  return out;
}

/** Builds the exact Higgsfield path + JSON body for a GenInput, or returns an error message. */
export function buildHfRequest(i: GenInput): HfRequest | string {
  const spec = MODELS[i.model];
  if (!spec) return 'Pick a model.';

  if (spec.genjutsu) {
    if (!isHttps(i.videoUrl)) return 'Upload the video you want to change.';
    const refs = (i.refUrls || []).filter(isHttps);
    if ((i.refUrls || []).length !== refs.length) return 'One of the pictures did not upload. Please add it again.';
    const path = GENJUTSU_PATHS[i.model as keyof typeof GENJUTSU_PATHS];
    const body: Record<string, unknown> = { video_url: i.videoUrl, prompt: i.prompt || '', resolution: spec.resolution || '720p' };
    if (i.model === 'gj-restyle') {
      if (!i.presetId || !UUID_RE.test(i.presetId)) return 'Pick a style.';
      if (refs.length > 5) return 'Restyle takes up to 5 character pictures.';
      body.preset_id = i.presetId;
      body.image_urls = refs;
    } else {
      if (refs.length < 1) return i.model === 'gj-motion' ? 'Add a picture of the character who should do the moves.' : 'Add a picture of the new object.';
      if (refs.length > 8) return 'Add up to 8 pictures.';
      body.image_urls = refs;
    }
    return { path, body, seconds: 0 };
  }

  const useImage = !!i.imageUrl;
  if (useImage && !isHttps(i.imageUrl)) return 'The picture did not upload. Please add it again.';
  const path = useImage ? spec.i2v : spec.t2v;
  if (!path) return useImage ? 'This model cannot start from a picture.' : 'This model needs a picture to start from.';
  if (!i.prompt) return 'The prompt is empty. Write it with AI or type one in.';

  const body: Record<string, unknown> = { prompt: i.prompt };
  let seconds = i.duration ?? spec.durations[0];

  const shots = (i.shots || []).filter((s) => s.prompt);
  if (shots.length && spec.multiShot) {
    if (shots.some((s) => !Number.isInteger(s.duration) || s.duration < 1 || s.duration > 15)) return 'Each shot needs a length between 1 and 15 seconds.';
    seconds = shots.reduce((a, s) => a + s.duration, 0);
    if (seconds < spec.minDur || seconds > spec.maxDur) return `All shots together need to add up to ${spec.minDur} to ${spec.maxDur} seconds.`;
    body.multi_shots = true;
    body.multi_prompt = shots.map((s) => ({ prompt: s.prompt, duration: s.duration }));
    body.duration = seconds;
  } else {
    if (!Number.isInteger(seconds) || !spec.durations.includes(seconds)) return 'Pick one of the lengths on offer.';
    body.duration = seconds;
  }

  if (useImage) body.image_url = i.imageUrl;
  const aspectAllowed = useImage ? spec.aspectOnI2v : spec.aspectOnT2v;
  if (aspectAllowed) body.aspect_ratio = i.aspect || '16:9';
  if (spec.audio === 'sound') body.sound = i.sound === false ? 'off' : 'on';
  if (spec.audio === 'generate_audio') body.generate_audio = i.sound !== false;
  if (spec.resolution) body.resolution = spec.resolution;
  return { path, body, seconds };
}

/** Short label for the library card. */
export function genTitle(goal: GoalId, prompt: string): string {
  const g = goalById(goal);
  const p = prompt.replace(/\s+/g, ' ').trim();
  return `${g ? g.title : 'Video'}${p ? ': ' + (p.length > 60 ? p.slice(0, 57) + '...' : p) : ''}`;
}

// ---------- statuses ----------

export type GenStatus = 'queued' | 'submitting' | 'submitted' | 'in_progress' | 'completed' | 'failed' | 'nsfw' | 'canceled';
export const ACTIVE_STATUSES: GenStatus[] = ['submitting', 'submitted', 'in_progress'];
export const REFUND_STATUSES: GenStatus[] = ['failed', 'nsfw', 'canceled'];
export const TERMINAL_STATUSES: GenStatus[] = ['completed', 'failed', 'nsfw', 'canceled'];
