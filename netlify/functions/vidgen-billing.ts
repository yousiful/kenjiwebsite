import { json, fail, notConnected, readJson, sameOrigin, SITE } from './_vidgen/common';
import { withUser } from './_vidgen/guard';
import { stripe, stripeConfigured, priceForPlan } from './_vidgen/stripe';
import type { Db, Row } from './_vidgen/db';
import { isPlanId, PLANS } from '../../src/vidgen/models';

/**
 * Kenji Studio billing (Stripe Checkout + Customer Portal).
 *   POST ?op=checkout {plan: 'starter'|'creator'|'studio'}  -> {url}  monthly subscription
 *   POST ?op=checkout {topup: true}                         -> {url}  one-time 250 credits, subscribers only
 *   POST ?op=portal                                         -> {url}  manage card, plan, cancel
 * Credits are granted by vidgen-stripe-webhook, never here.
 */

const ACTIVE = ['active', 'trialing', 'past_due'];

function returnBase(req: Request): string {
  const o = new URL(req.url).origin;
  return /^https:\/\//.test(o) || o.startsWith('http://localhost') ? o : SITE;
}

async function ensureCustomer(db: Db, user: Row): Promise<string> {
  if (user.stripe_customer_id) return String(user.stripe_customer_id);
  const c = await stripe('POST', 'customers', { email: user.email, name: user.name || undefined, metadata: { vidgen_uid: String(user.id) } });
  const rows = await db.q(
    `UPDATE vg_users SET stripe_customer_id = $2, updated_at = now() WHERE id = $1 AND stripe_customer_id IS NULL RETURNING stripe_customer_id`,
    [user.id, c.id],
  );
  if (rows.length) return String(c.id);
  const again = await db.q(`SELECT stripe_customer_id FROM vg_users WHERE id = $1`, [user.id]); // lost a race with another tab
  return String(again[0].stripe_customer_id);
}

async function portalUrl(customer: string, base: string): Promise<string> {
  const p = await stripe('POST', 'billing_portal/sessions', {
    customer,
    return_url: `${base}/video-generation/billing`,
    configuration: process.env.STRIPE_PORTAL_CONFIG || undefined,
  });
  return String(p.url);
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return fail(405, 'Method not allowed');
  if (!sameOrigin(req)) return fail(403, 'Please use the Kenji Studio page.');
  if (!stripeConfigured()) return notConnected('billing');
  const ctx = await withUser(req);
  if (ctx instanceof Response) return ctx;
  const { db, user } = ctx;
  const op = new URL(req.url).searchParams.get('op');
  const body = (await readJson(req)) || {};
  const base = returnBase(req);

  try {
    const subscribed = isPlanId(user.plan) && ACTIVE.includes(String(user.sub_status));

    if (op === 'portal') {
      if (!user.stripe_customer_id) return fail(400, 'You do not have a subscription yet.');
      return json(200, { url: await portalUrl(String(user.stripe_customer_id), base) });
    }

    if (op === 'checkout') {
      const customer = await ensureCustomer(db, user);
      if (body.topup) {
        if (!subscribed) return fail(403, 'Extra credit packs are for subscribers. Pick a plan first.');
        const price = process.env.STRIPE_PRICE_TOPUP;
        if (!price) return notConnected('billing');
        const s = await stripe('POST', 'checkout/sessions', {
          mode: 'payment',
          customer,
          client_reference_id: String(user.id),
          line_items: [{ price, quantity: 1 }],
          metadata: { vidgen_uid: String(user.id), kind: 'topup' },
          payment_intent_data: { metadata: { vidgen_uid: String(user.id), kind: 'topup' } },
          success_url: `${base}/video-generation/billing?paid=topup`,
          cancel_url: `${base}/video-generation/billing`,
        });
        return json(200, { url: String(s.url) });
      }
      const plan = body.plan;
      if (!isPlanId(plan)) return fail(400, 'Pick a plan.');
      // already subscribed: plan changes go through the portal so Stripe handles proration
      if (subscribed) return json(200, { url: await portalUrl(customer, base) });
      const s = await stripe('POST', 'checkout/sessions', {
        mode: 'subscription',
        customer,
        client_reference_id: String(user.id),
        line_items: [{ price: priceForPlan(plan), quantity: 1 }],
        subscription_data: { metadata: { vidgen_uid: String(user.id), plan } },
        metadata: { vidgen_uid: String(user.id), kind: 'subscription', plan },
        allow_promotion_codes: true,
        success_url: `${base}/video-generation/billing?paid=${plan}`,
        cancel_url: `${base}/video-generation/billing`,
      });
      return json(200, { url: String(s.url), plan: PLANS[plan].name });
    }
    return fail(400, 'Unknown request');
  } catch (e) {
    console.error('vidgen-billing', op, e);
    return fail(502, 'We could not open checkout right now. Please try again in a minute.');
  }
};
