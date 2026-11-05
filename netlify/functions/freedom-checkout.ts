import type { Handler } from '@netlify/functions';
import { stripe } from './_vidgen/stripe';

/**
 * Freedom Club $7/month on kenjiai.com/freedom (Yousif, 2026-11-05: new low-ticket page, checkout on
 * Stripe instead of the GHL 2-step form, which had 0 first-time buyers from ~17 opt-ins since 10/23).
 * POST { fbp?, fbc?, where? } -> { url } of a Stripe Checkout session.
 * The price is found by lookup_key and created on first use. After payment Stripe sends the buyer to
 * /freedom/welcome, which calls freedom-confirm to tag them in GHL.
 */

const SITE = 'https://kenjiai.com';
const PRODUCT_NAME = 'Freedom Club';
const LOOKUP_KEY = 'freedom_club_monthly_7';
const AMOUNT = 700;

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

async function priceId(): Promise<string> {
  const found = await stripe('GET', 'prices', { lookup_keys: [LOOKUP_KEY], active: 'true', limit: 1 });
  if (found.data?.[0]?.id) return found.data[0].id;
  const product = await stripe('POST', 'products', {
    name: PRODUCT_NAME,
    description: 'Monthly membership: paid ads and sales training, weekly livestreams, private community.',
    metadata: { source: 'kenjiai.com/freedom' },
  });
  const price = await stripe('POST', 'prices', {
    product: product.id,
    currency: 'usd',
    unit_amount: AMOUNT,
    recurring: { interval: 'month' },
    lookup_key: LOOKUP_KEY,
    transfer_lookup_key: 'true',
    nickname: 'Freedom Club $7/month',
  });
  return price.id;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'POST only' });
  if (!process.env.STRIPE_SECRET_KEY) return json(503, { error: 'Checkout is not connected yet.' });

  let body: { fbp?: string; fbc?: string; where?: string } = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Bad JSON' });
  }

  try {
    const session = await stripe('POST', 'checkout/sessions', {
      mode: 'subscription',
      line_items: [{ price: await priceId(), quantity: 1 }],
      phone_number_collection: { enabled: 'true' },
      allow_promotion_codes: 'false',
      billing_address_collection: 'auto',
      success_url: `${SITE}/freedom/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE}/freedom`,
      metadata: { offer: 'freedom-club', where: body.where?.slice(0, 20), fbp: body.fbp?.slice(0, 200), fbc: body.fbc?.slice(0, 300) },
      subscription_data: { metadata: { offer: 'freedom-club' } },
    });
    return json(200, { url: session.url });
  } catch (e) {
    console.error('[freedom-checkout]', e instanceof Error ? e.message : e);
    return json(502, { error: 'Could not open checkout.' });
  }
};
