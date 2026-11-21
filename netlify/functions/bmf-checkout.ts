import type { Handler } from '@netlify/functions';
import { stripe } from './_vidgen/stripe';

/**
 * BMF Fitness (client Brenten Fortner) low-ticket funnel, kenjiai.com/bmf (2026-11-20).
 * POST { bumps?: ('kickstart' | 'starter')[], fbp?, fbc? } -> { url } of a Stripe Checkout session.
 *
 * Runs on our Stripe (same STRIPE_SECRET_KEY as Launch Time) with honest labeling: each item is
 * its own "BMF ..." product, and the card statement reads "MEDIA-TRAF* BMFFITNESS". Our account's
 * card prefix is MEDIA-TRAF (10 chars), so the suffix gets 10 of the 22 characters; "BMF FITNESS"
 * (11) would be cut to "BMF FITNES". Prices are found by lookup_key and created on first use.
 * After payment Stripe sends the buyer to /bmf/welcome, which calls bmf-confirm.
 */

const SITE = 'https://kenjiai.com';
export const DESCRIPTOR_SUFFIX = 'BMFFITNESS';

const ITEMS = {
  protein: { name: 'BMF $9 Offer', cents: 900, key: 'bmf_protein_fix_9' },
  kickstart: { name: 'BMF $27 Add-on', cents: 2700, key: 'bmf_kickstart_27' },
  starter: { name: 'BMF $47 Add-on', cents: 4700, key: 'bmf_starter_47' },
} as const;
type ItemId = keyof typeof ITEMS;
const BUMPS: ItemId[] = ['kickstart', 'starter'];

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  body: JSON.stringify(body),
});

async function priceIds(): Promise<Record<ItemId, string>> {
  const ids = Object.keys(ITEMS) as ItemId[];
  const found = await stripe('GET', 'prices', { lookup_keys: ids.map((i) => ITEMS[i].key), active: 'true', limit: 10 });
  const byKey: Record<string, string> = {};
  for (const p of found.data || []) byKey[p.lookup_key] = p.id;

  for (const id of ids) {
    const item = ITEMS[id];
    if (byKey[item.key]) continue;
    const product = await stripe('POST', 'products', {
      name: item.name,
      metadata: { client: 'bmf_fitness', source: 'kenjiai.com/bmf' },
    });
    const price = await stripe('POST', 'prices', {
      product: product.id,
      currency: 'usd',
      unit_amount: item.cents,
      lookup_key: item.key,
      transfer_lookup_key: 'true',
      nickname: `${item.name} $${item.cents / 100}`,
    });
    byKey[item.key] = price.id;
  }
  return Object.fromEntries(ids.map((i) => [i, byKey[ITEMS[i].key]])) as Record<ItemId, string>;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') return json(405, { error: 'POST only' });
  if (!process.env.STRIPE_SECRET_KEY) return json(503, { error: 'Checkout is not connected yet.' });

  let body: { bumps?: unknown; fbp?: string; fbc?: string } = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Bad JSON' });
  }
  const picked = Array.isArray(body.bumps) ? body.bumps : [];
  const bumps = BUMPS.filter((b) => picked.includes(b));
  const items: ItemId[] = ['protein', ...bumps];
  const bumpList = bumps.join(',') || 'none';

  try {
    const prices = await priceIds();
    const session = await stripe('POST', 'checkout/sessions', {
      mode: 'payment',
      line_items: items.map((i) => ({ price: prices[i], quantity: 1 })),
      phone_number_collection: { enabled: 'true' },
      customer_creation: 'always',
      allow_promotion_codes: 'false',
      billing_address_collection: 'auto',
      success_url: `${SITE}/bmf/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE}/bmf`,
      metadata: { client: 'bmf_fitness', offer: 'bmf-protein-fix', bumps: bumpList, fbp: body.fbp?.slice(0, 200), fbc: body.fbc?.slice(0, 300) },
      payment_intent_data: {
        statement_descriptor_suffix: DESCRIPTOR_SUFFIX,
        description: `BMF order: ${items.map((i) => ITEMS[i].name).join(' + ')}`,
        metadata: { client: 'bmf_fitness', bumps: bumpList },
      },
    });
    return json(200, { url: session.url });
  } catch (e) {
    console.error('[bmf-checkout]', e instanceof Error ? e.message : e);
    return json(502, { error: 'Could not open checkout.' });
  }
};
