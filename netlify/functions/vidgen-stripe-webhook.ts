import { json } from './_vidgen/common';
import { neonDb, ensureSchema } from './_vidgen/db';
import { verifyStripeEvent } from './_vidgen/stripe';
import { handleStripeEvent } from './_vidgen/billing-events';

/**
 * Stripe webhook for Kenji Studio: https://kenjiai.com/.netlify/functions/vidgen-stripe-webhook
 * Events: checkout.session.completed, invoice.paid, customer.subscription.updated/deleted.
 * Verifies Stripe-Signature with STRIPE_WEBHOOK_SECRET on the raw body. Processing is
 * idempotent (ledger refs); the event id is recorded afterwards so repeats return fast.
 */

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return json(405, { ok: false });
  const secret = process.env.STRIPE_WEBHOOK_SECRET || '';
  if (!secret || !process.env.STRIPE_SECRET_KEY) return json(503, { error: 'Billing is not connected yet.' });
  const raw = await req.text();
  const event = verifyStripeEvent(raw, req.headers.get('stripe-signature'), secret);
  if (!event?.id || !event?.type) return json(400, { error: 'bad signature' });

  const db = neonDb();
  if (!db) return json(503, { error: 'database not connected' });
  try {
    await ensureSchema(db);
    const seen = await db.q(`SELECT 1 FROM vg_webhook_events WHERE source = 'stripe' AND event_id = $1`, [event.id]);
    if (seen.length) return json(200, { ok: true, duplicate: true });
    const result = await handleStripeEvent(db, event);
    await db.q(`INSERT INTO vg_webhook_events (source, event_id, status) VALUES ('stripe', $1, $2) ON CONFLICT DO NOTHING`, [event.id, event.type]);
    console.log(`vidgen-stripe ${event.type} ${event.id}: ${result}`);
    return json(200, { ok: true });
  } catch (e) {
    console.error('vidgen-stripe-webhook', event.type, event.id, e);
    return json(500, { ok: false }); // Stripe retries
  }
};
