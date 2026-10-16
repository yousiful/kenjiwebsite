#!/usr/bin/env node
/**
 * Kenji Studio: one-time Stripe setup. Creates (or reuses) the products, prices,
 * customer portal configuration and webhook endpoint, then prints the Netlify env
 * values to set. Safe to re-run: prices are found by lookup_key, the webhook by URL.
 *
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/vidgen-stripe-setup.cjs
 *
 * Creates:
 *   Starter  $29/mo   (300 credits)    lookup_key vidgen_starter_monthly
 *   Creator  $79/mo   (900 credits)    lookup_key vidgen_creator_monthly
 *   Studio   $199/mo  (2,500 credits)  lookup_key vidgen_studio_monthly
 *   Credit pack $25 one-time (250)     lookup_key vidgen_topup_250
 *   Webhook https://kenjiai.com/.netlify/functions/vidgen-stripe-webhook
 *     events: checkout.session.completed, invoice.paid,
 *             customer.subscription.updated, customer.subscription.deleted
 */

const KEY = process.env.STRIPE_SECRET_KEY;
if (!KEY) {
  console.error('Set STRIPE_SECRET_KEY first.');
  process.exit(1);
}
const WEBHOOK_URL = process.env.VIDGEN_WEBHOOK_URL || 'https://kenjiai.com/.netlify/functions/vidgen-stripe-webhook';
const EVENTS = ['checkout.session.completed', 'invoice.paid', 'customer.subscription.updated', 'customer.subscription.deleted'];

const ITEMS = [
  { env: 'STRIPE_PRICE_STARTER', lookup: 'vidgen_starter_monthly', name: 'Kenji Studio Starter', desc: '300 video credits every month', cents: 2900, recurring: true },
  { env: 'STRIPE_PRICE_CREATOR', lookup: 'vidgen_creator_monthly', name: 'Kenji Studio Creator', desc: '900 video credits every month', cents: 7900, recurring: true },
  { env: 'STRIPE_PRICE_STUDIO', lookup: 'vidgen_studio_monthly', name: 'Kenji Studio Studio', desc: '2,500 video credits every month, plus Genjutsu', cents: 19900, recurring: true },
  { env: 'STRIPE_PRICE_TOPUP', lookup: 'vidgen_topup_250', name: 'Kenji Studio credit pack', desc: '250 extra video credits', cents: 2500, recurring: false },
];

function encode(params, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item && typeof item === 'object') out.push(...encode(item, `${key}[${i}]`));
        else out.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(item))}`);
      });
    } else if (typeof v === 'object') out.push(...encode(v, key));
    else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  }
  return out;
}

async function stripe(method, path, params = {}) {
  const body = encode(params).join('&');
  const url = `https://api.stripe.com/v1/${path}${method === 'GET' && body ? `?${body}` : ''}`;
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: method === 'POST' ? body : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${method} ${path}: ${data?.error?.message || res.status}`);
  return data;
}

(async () => {
  const env = {};
  const products = [];
  for (const it of ITEMS) {
    const found = await stripe('GET', 'prices', { 'lookup_keys[]': it.lookup, limit: 1 });
    let price = found.data && found.data[0];
    if (!price) {
      const product = await stripe('POST', 'products', { name: it.name, description: it.desc, metadata: { app: 'kenji-studio' } });
      price = await stripe('POST', 'prices', {
        product: product.id,
        unit_amount: it.cents,
        currency: 'usd',
        lookup_key: it.lookup,
        recurring: it.recurring ? { interval: 'month' } : undefined,
        metadata: { app: 'kenji-studio' },
      });
      console.log(`created ${it.name}: ${price.id}`);
    } else {
      console.log(`reusing ${it.name}: ${price.id}`);
    }
    env[it.env] = price.id;
    if (it.recurring) products.push({ product: typeof price.product === 'string' ? price.product : price.product.id, prices: [price.id] });
  }

  // Customer portal: update card, see invoices, cancel, switch between the three plans.
  const portal = await stripe('POST', 'billing_portal/configurations', {
    business_profile: { headline: 'Kenji Studio billing' },
    features: {
      payment_method_update: { enabled: true },
      invoice_history: { enabled: true },
      subscription_cancel: { enabled: true, mode: 'at_period_end' },
      subscription_update: { enabled: true, default_allowed_updates: ['price'], proration_behavior: 'always_invoice', products },
    },
    metadata: { app: 'kenji-studio' },
  });
  env.STRIPE_PORTAL_CONFIG = portal.id;
  console.log(`created portal configuration: ${portal.id}`);

  const hooks = await stripe('GET', 'webhook_endpoints', { limit: 100 });
  const existing = (hooks.data || []).find((h) => h.url === WEBHOOK_URL);
  if (existing) {
    await stripe('POST', `webhook_endpoints/${existing.id}`, { enabled_events: EVENTS });
    console.log(`webhook already exists (${existing.id}); events updated. Its signing secret is in the Stripe dashboard.`);
    env.STRIPE_WEBHOOK_SECRET = '(copy from Stripe dashboard > Webhooks > ' + existing.id + ')';
  } else {
    const hook = await stripe('POST', 'webhook_endpoints', { url: WEBHOOK_URL, enabled_events: EVENTS, description: 'Kenji Studio credits' });
    env.STRIPE_WEBHOOK_SECRET = hook.secret;
    console.log(`created webhook: ${hook.id}`);
  }

  console.log('\nSet these in Netlify (Site configuration > Environment variables):\n');
  for (const [k, v] of Object.entries(env)) console.log(`${k}=${v}`);
  console.log('\nThen redeploy.');
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
