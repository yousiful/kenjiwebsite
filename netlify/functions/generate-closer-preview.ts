import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * /ai-callcenter's real interactive hook: visitor enters their website, we
 * fetch it, and generate a short, real, personalized preview of what their
 * AI closer would actually sound like -- not a generic template, an excerpt
 * built from their real site content. Full agent build happens after they
 * sign up (voice.kenjiai.com/try), this is the lead magnet, not the product.
 *
 * Uses OpenRouter (key already in this account from the Kalshi bot setup,
 * see project_kalshi memory) calling anthropic/claude-haiku-4.5 -- fast,
 * cheap, good at short structured sales copy.
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

function stripHtml(html: string): string {
  let text = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
  return text.slice(0, 3500);
}

function extractTitle(html: string): string {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? m[1].trim() : '';
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  if (!OPENROUTER_KEY) return json(502, { error: 'Generator not configured' });

  let body: { url?: string };
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  let siteUrl = (body.url || '').trim();
  if (!siteUrl) return json(400, { error: 'url required' });
  if (!/^https?:\/\//i.test(siteUrl)) siteUrl = 'https://' + siteUrl;

  let pageText = '';
  let pageTitle = '';
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(siteUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; KenjiAI-PromptPreview/1.0)' },
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const html = await res.text();
    pageText = stripHtml(html);
    pageTitle = extractTitle(html);
  } catch {
    return json(422, { error: "Couldn't reach that website. Double check the URL and try again." });
  }

  if (pageText.length < 40) {
    return json(422, { error: "That site didn't return enough content to work with. Try a different page on your site." });
  }

  const systemPrompt = `You write short, real previews of a custom AI phone agent ("closer") for a business, based on their real website content. This is a marketing preview shown to the business owner to convince them to sign up, not the actual production agent, so it must be SHORT and feel personalized and specific to their real business, never generic.

Return ONLY valid JSON, no markdown fences, no commentary, in exactly this shape:
{
  "business_name": "the real business name, inferred from the site",
  "business_summary": "one sentence, what this business actually does, specific to what you read",
  "greeting_line": "a natural, real-sounding opening line the AI would say answering their phone, must reference something specific and real about this business, not generic",
  "qualifying_questions": ["2 short, specific questions the AI would ask a caller to qualify them, based on this business's real services"],
  "objection_example": "one short line showing how the AI would handle a real, specific objection a caller from THIS business's industry would actually raise"
}

Rules: no em dashes anywhere. Write like a real, sharp human, not corporate copy. Be specific to what's actually on the site, generic output is a failure.`;

  const userPrompt = `Website: ${siteUrl}\nPage title: ${pageTitle}\n\nSite content:\n${pageText}`;

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
        temperature: 0.7,
        max_tokens: 500,
      }),
    });
    clearTimeout(timeout);
    const data: any = await res.json();
    if (!res.ok) return json(502, { error: 'Generation failed', detail: data });

    const raw = data?.choices?.[0]?.message?.content || '';
    const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return json(502, { error: 'Could not parse generated preview' });
    }

    return json(200, parsed);
  } catch (err) {
    return json(502, { error: 'Generation request failed' });
  }
};
