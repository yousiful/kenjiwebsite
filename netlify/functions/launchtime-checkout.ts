import type { Handler } from '@netlify/functions';
import { stripe } from './_vidgen/stripe';

/**
 * Launch Time by Freedom Club: $17 vs $97 a month price split test (Yousif, 2026-10-23).
 * POST { variant: '17' | '97', fbp?, fbc? } -> { url } of a Stripe Checkout session.
 *
 * Prices are found by lookup_key and created on first use, so nothing has to be set up by hand
 * in Stripe. Needs Netlify env STRIPE_SECRET_KEY (a restricted key with write access to Products,
 * Prices and Checkout Sessions is enough). After payment Stripe sends the buyer to
 * /launch-time/welcome, which calls launchtime-confirm to tag them in GHL.
 */

const SITE = 'https://kenjiai.com';
const PRODUCT_NAME = 'Launch Time by Freedom Club';
export const VARIANTS = { '17': 1700, '97': 9700 } as const;
export type Variant = keyof typeof VARIANTS;
const lookupKey = (v: Variant) => `launchtime_monthly_${v}`;

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

async function priceIds(): Promise<Record<Variant, string>> {
  const keys = (Object.keys(VARIANTS) as Variant[]).map(lookupKey);
  const found = await stripe('GET', 'prices', { lookup_keys: keys, active: 'true', limit: 10 });
  const byKey: Record<string, { id: string; product: string }> = {};
  for (const p of found.data || []) byKey[p.lookup_key] = { id: p.id, product: p.product };

  let product = Object.values(byKey)[0]?.product;
  for (const v of Object.keys(VARIANTS) as Variant[]) {
    if (byKey[lookupKey(v)]) continue;
    if (!product) {
      const created = await stripe('POST', 'products', {
        name: PRODUCT_NAME,
        description: 'Monthly membership: ads and sales training, weekly live calls and Q&A, AI systems.',
        metadata: { source: 'kenjiai.com/launch-time' },
      });
      product = created.id as string;
    }
    const price = await stripe('POST', 'prices', {
      product,
      currency: 'usd',
      unit_amount: VARIANTS[v],
      recurring: { interval: 'month' },
      lookup_key: lookupKey(v),
      transfer_lookup_key: 'true',
      nickname: `Launch Time $${v}/month`,
    });
    byKey[lookupKey(v)] = { id: price.id, product: product as string };
  }
  return { '17': byKey[lookupKey('17')].id, '97': byKey[lookupKey('97')].id };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'POST only' });
  if (!process.env.STRIPE_SECRET_KEY) return json(503, { error: 'Checkout is not connected yet.' });

  let body: { variant?: string; fbp?: string; fbc?: string } = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Bad JSON' });
  }
  const variant = body.variant === '97' ? '97' : body.variant === '17' ? '17' : null;
  if (!variant) return json(400, { error: 'variant must be 17 or 97' });

  try {
    const prices = await priceIds();
    const session = await stripe('POST', 'checkout/sessions', {
      mode: 'subscription',
      line_items: [{ price: prices[variant], quantity: 1 }],
      phone_number_collection: { enabled: 'true' },
      allow_promotion_codes: 'false',
      billing_address_collection: 'auto',
      success_url: `${SITE}/launch-time/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE}/launch-time?p=${variant}`,
      metadata: { offer: 'launch-time', price_variant: variant, fbp: body.fbp?.slice(0, 200), fbc: body.fbc?.slice(0, 300) },
      subscription_data: { metadata: { offer: 'launch-time', price_variant: variant } },
    });
    return json(200, { url: session.url });
  } catch (e) {
    console.error('[launchtime-checkout]', e instanceof Error ? e.message : e);
    return json(502, { error: 'Could not open checkout.' });
  }
};
