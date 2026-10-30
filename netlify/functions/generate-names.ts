import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * /tools/name-generator's "Generate New Variations" button. The page renders a
 * template set instantly on load; this function returns 10 fresh names written
 * for the person's niche, buyer, outcome and price, in the same shape the page
 * already renders. If it fails, the page falls back to the templates.
 *
 * Same LLM pattern as generate-icp.ts: OpenRouter, JSON-only system prompt,
 * capped tokens, timeout, defensive parse.
 *
 * Netlify env var needed: OPENROUTER_API_KEY
 */

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const MODEL = 'anthropic/claude-haiku-5.5';

const CATEGORIES = [
  'Modern AI & Tech',
  'High-Status & Authority',
  'Action & Outcome-Driven',
  'Compound & Portmanteau',
  'Alex Hormozi $100M Grand Slam',
] as const;

const MODE_BRIEF: Record<string, string> = {
  business: 'a company or brand name',
  offer: 'a named offer in the style of a $100M Grand Slam Offer (a name that states the outcome, the speed and the risk reversal)',
  product: 'a product, SaaS feature or software module name',
  lead_magnet: 'a lead magnet, free guide, workshop or course title',
};

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

const clean = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '';

const noDashes = (s: string) => s.replace(/\s*[—–]\s*/g, ', ');

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  if (!OPENROUTER_KEY) return json(502, { error: 'Generator not configured' });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const mode = clean(body.mode, 20);
  const niche = clean(body.niche, 160);
  const avatar = clean(body.avatar, 200);
  const outcome = clean(body.outcome, 300);
  const seed = clean(body.seed, 40);
  const pricePoint = clean(body.pricePoint, 80);
  const exclude = Array.isArray(body.exclude)
    ? (body.exclude as unknown[]).map((x) => clean(x, 80)).filter(Boolean).slice(0, 40)
    : [];

  if (!MODE_BRIEF[mode]) return json(400, { error: 'Pick what you are naming first.' });
  if (niche.length < 3) return json(400, { error: 'Tell us your niche or industry first.' });

  const systemPrompt = `You name businesses, offers and products for a direct-response marketing agency. Every name has to be easy to say, easy to spell, and make the buyer want to click.

Return ONLY valid JSON, no markdown fences, no commentary, in exactly this shape:
{"items":[{"name":"","category":"","tagline":"","psychology":"","formula":"","adHook":"","domainName":""}]}

Rules:
- Exactly 10 items, two in each of these categories, using the category text exactly: ${CATEGORIES.map((c) => `"${c}"`).join(', ')}.
- name: at most 6 words for business and product names, at most 12 words for offers and lead magnets.
- tagline: one plain sentence, 20 words max, about what the buyer gets.
- psychology: one sentence, 20 words max, on why the name works on this buyer.
- formula: the naming pattern in 3 to 8 words, like "Outcome + Speed + Guarantee".
- adHook: one ad opening line, 20 words max, written to this buyer.
- domainName: a plausible lowercase .com (or .ai / .co when the name suits it), letters and digits only before the dot.
- Write for the niche, buyer and outcome you were given. Generic names that would fit any business are a failure.
- No em dashes. No words like "unlock", "elevate", "seamless", "revolutionary", "game-changing", "next-level".
- Never reuse a name from the "already shown" list.`;

  const userPrompt = [
    `Naming: ${MODE_BRIEF[mode]}`,
    `Niche: ${niche}`,
    avatar ? `Buyer: ${avatar}` : '',
    outcome ? `Outcome they get: ${outcome}` : '',
    pricePoint ? `Price: ${pricePoint}` : '',
    seed ? `Root word to work in where it fits: ${seed}` : '',
    exclude.length ? `Already shown, do not repeat: ${exclude.join('; ')}` : '',
  ].filter(Boolean).join('\n');

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://kenjiai.com/tools/name-generator',
        'X-Title': 'KenjiAI Name Generator',
      },
      signal: AbortSignal.timeout(20000),
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 2500,
        // Haiku 5.5 thinks by default and the hidden reasoning eats max_tokens,
        // leaving empty content. Names do not need it.
        reasoning: { enabled: false },
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { choices?: { message?: { content?: string } }[] };
    if (!res.ok) return json(502, { error: 'Generation failed' });

    const raw = data?.choices?.[0]?.message?.content || '';
    const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    let parsed: { items?: unknown };
    try {
      parsed = JSON.parse(cleaned.slice(start, end + 1));
    } catch {
      console.warn('generate-names parse', raw.slice(0, 300), raw.slice(-200));
      return json(502, { error: 'Could not read the generated names. Try again.' });
    }
    const items = (Array.isArray(parsed.items) ? parsed.items : [])
      .map((x) => {
        const it = (x || {}) as Record<string, unknown>;
        const category = CATEGORIES.find((c) => c === it.category) || CATEGORIES[0];
        return {
          name: noDashes(clean(it.name, 120)),
          category,
          tagline: noDashes(clean(it.tagline, 220)),
          psychology: noDashes(clean(it.psychology, 220)),
          formula: noDashes(clean(it.formula, 120)),
          adHook: noDashes(clean(it.adHook, 220)),
          domainName: clean(it.domainName, 60).toLowerCase().replace(/[^a-z0-9.]/g, ''),
        };
      })
      .filter((it) => it.name.length >= 2 && it.tagline)
      .slice(0, 12);
    if (items.length < 4) return json(502, { error: 'The names came back incomplete. Try again.' });
    return json(200, { items });
  } catch {
    return json(502, { error: 'Generation request failed' });
  }
};
