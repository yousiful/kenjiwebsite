import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * /tools/icp-generator's engine: a business describes what it sells, at what
 * price, to whom, and gets back 2-3 real named buyer segments with the actual
 * Meta Ads detailed-targeting categories a media buyer would type into Ads
 * Manager, plus the trigger, the objection, a lookalike seed, and an
 * affordability read on whether the stated price needs a spending-capacity
 * signal layered on top.
 *
 * Built after our own $7 low-ticket campaign was found running broad
 * Advantage+ audiences with zero interest or lookalike layering, and a chunk
 * of the declined checkouts turned out to be real bank refusals on debit and
 * prepaid cards. Untargeted reach was buying people who could not pay. This
 * tool exists to stop that happening again, for us and for anyone else.
 *
 * Same LLM pattern as generate-closer-preview.ts: OpenRouter ->
 * anthropic/claude-haiku-4.5, JSON-only system prompt, capped tokens,
 * abort-controller timeout, defensive parse.
 *
 * Netlify env var needed: OPENROUTER_API_KEY
 */

const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY || '';
const MODEL = 'anthropic/claude-haiku-4.5';

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

interface ICPRequest {
  offer?: string;
  currentCustomer?: string;
  pricePoint?: string;
  audienceType?: string;
  billing?: string;
  geo?: string;
}

const clean = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, max) : '';

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  if (!OPENROUTER_KEY) return json(502, { error: 'Generator not configured' });

  let body: ICPRequest;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const offer = clean(body.offer, 1200);
  const currentCustomer = clean(body.currentCustomer, 600);
  const pricePoint = clean(body.pricePoint, 120);
  const audienceType = clean(body.audienceType, 40) || 'Not specified';
  const billing = clean(body.billing, 40) || 'Not specified';
  const geo = clean(body.geo, 120) || 'United States';

  if (offer.length < 25) {
    return json(400, {
      error: 'Describe what you sell in a bit more detail. One real sentence about the offer is enough.',
    });
  }
  if (!pricePoint) {
    return json(400, { error: 'Price point is required. It changes the whole audience.' });
  }

  const systemPrompt = `You are a senior paid media buyer who builds Meta Ads audiences for a living. A business gives you their offer and price, you give back the Ideal Customer Profile you would actually configure the campaign around.

Return ONLY valid JSON, no markdown fences, no commentary, in exactly this shape:
{
  "offer_read": "one short sentence proving you understood what they actually sell and to whom",
  "price_band": "one of: low-ticket, mid-ticket, high-ticket, enterprise",
  "affordability_warning": "2 sentences max. The minimum affordability or intent signal this price point still needs in the audience, and what goes wrong if targeting stays broad. Write this even for cheap offers: a low price is not a reason to target everyone, and broad reach on a cheap offer buys people whose cards decline.",
  "segments": [
    {
      "name": "a specific named buyer type, for example 'Owner-operator HVAC, 2 to 8 trucks', never 'small business owners'",
      "who_they_are": "ONE sentence, 30 words max, concrete about their actual situation",
      "age_range": "for example 35-54",
      "gender_skew": "only if genuinely real for this buyer, for example '70% male'. Empty string if there is no real skew. Never invent one.",
      "spending_signal": "15 words max. The income, revenue, or spending-capacity threshold to require, matched to the stated price",
      "meta_interests": ["4 to 6 real Meta Ads detailed-targeting interests. Each must be a specific named thing that exists in Ads Manager, like 'ServiceTitan', 'Wim Hof Method', 'Angi', 'Cryotherapy'. Broad umbrella terms like Entrepreneurship, Business, Marketing, Health and Wellness are banned: they reach everyone and target no one."],
      "meta_behaviors": ["2 to 3 real Meta behavior, demographic, or job-title options, named the way Meta names them"],
      "exclusions": ["exactly 2 audiences to exclude so budget stops reaching people who cannot buy"],
      "buying_trigger": "20 words max. The specific event that makes them buy this month instead of next year",
      "objection": "10 words max, in their own voice",
      "objection_counter": "ONE shippable ad-copy sentence answering it",
      "lookalike_seed": "20 words max. The specific list to seed a 1% lookalike from, or what to collect first if they have no list",
      "ad_angle": "one hook line for this segment, 15 words max, not a slogan"
    }
  ],
  "campaign_setup_notes": ["exactly 3 strings, 25 words max each: budget split across the segments, what to test first, and when to cage Advantage+ versus let it expand"],
  "do_not_target": ["exactly 3 strings, 20 words max each: an audience that will burn this budget, with the reason in the same string"]
}

Rules:
- Exactly 2 or 3 segments, whichever is real. Pick the ones worth separate ad sets, not personas.
- Be terse. Respect every word cap. A media buyer scanning this on a phone has to act on it.
- Everything must be specific to the offer you were given. If two different businesses would get the same answer, you have failed.
- Every interest must be something this buyer personally follows. On a B2C offer that means consumer brands, breeds, hobbies, and publications, never business software or agency tools. On a B2B offer it means the software, trade publications, and suppliers that buyer's industry actually uses.
- No em dashes anywhere. No "here is the thing", no "it is not X, it is Y" constructions, no throat-clearing openers, no importance puffery, no grand closing statements.`;

  const userPrompt = [
    `Offer: ${offer}`,
    `Price point: ${pricePoint}`,
    `Sells to: ${audienceType}`,
    `Billing: ${billing}`,
    `Market / geo: ${geo}`,
    currentCustomer
      ? `Who they currently think their customer is: ${currentCustomer}\n(Treat this as a hypothesis. If it is too broad or partly wrong, correct it in the segments instead of repeating it back.)`
      : 'Who they currently think their customer is: not stated, so build it from the offer.',
  ].join('\n');

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENROUTER_KEY}`,
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.6,
        max_tokens: 2200,
      }),
    });
    clearTimeout(timeout);
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    if (!res.ok) return json(502, { error: 'Generation failed', detail: data });

    const raw: string = data?.choices?.[0]?.message?.content || '';
    const cleaned = raw
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();

    let parsed: { segments?: unknown };
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return json(502, { error: 'Could not parse the generated ICP. Try again.' });
    }

    if (!parsed || !Array.isArray(parsed.segments) || parsed.segments.length === 0) {
      return json(502, { error: 'The generated ICP came back incomplete. Try again.' });
    }

    return json(200, parsed);
  } catch {
    return json(502, { error: 'Generation request failed' });
  }
};
