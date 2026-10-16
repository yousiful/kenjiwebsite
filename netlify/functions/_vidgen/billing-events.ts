import { balance, grant, type Db, type Row } from './db';
import { planForPrice, invoiceLines, invoiceSubscriptionId } from './stripe';
import { PLANS, TOPUP, isPlanId } from '../../../src/vidgen/models';

/**
 * Applies one verified Stripe event to Kenji Studio. Every credit grant is keyed by a
 * unique ledger ref (invoice:<id>, topup:<checkout id>, expire:<sub id>), so a replayed
 * or duplicated event never grants twice.
 *
 *  checkout.session.completed  subscription: link customer + subscription to the user.
 *                              topup (paid): +250 credits.
 *  invoice.paid                subscription_create / subscription_cycle: + the plan's monthly credits.
 *                              subscription_update with money paid (upgrade): + the difference
 *                              between the new and the previous plan's credits.
 *  customer.subscription.updated  plan + status.
 *  customer.subscription.deleted  plan off. Unused credits only roll over while subscribed,
 *                              so the remaining balance is expired (one ledger entry).
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Obj = any;

async function userFor(db: Db, obj: Obj): Promise<Row | null> {
  const uid = obj?.metadata?.vidgen_uid || obj?.client_reference_id || obj?.subscription_details?.metadata?.vidgen_uid || obj?.parent?.subscription_details?.metadata?.vidgen_uid;
  const customer = typeof obj?.customer === 'string' ? obj.customer : obj?.customer?.id;
  if (customer) {
    const r = await db.q(`SELECT * FROM vg_users WHERE stripe_customer_id = $1`, [customer]);
    if (r[0]) return r[0];
  }
  if (typeof uid === 'string' && /^[0-9a-f-]{36}$/i.test(uid)) {
    const r = await db.q(`SELECT * FROM vg_users WHERE id = $1`, [uid]);
    if (r[0]) {
      if (customer && !r[0].stripe_customer_id) await db.q(`UPDATE vg_users SET stripe_customer_id = $2 WHERE id = $1 AND stripe_customer_id IS NULL`, [uid, customer]);
      return r[0];
    }
  }
  return null;
}

export async function handleStripeEvent(db: Db, event: { id: string; type: string; data: { object: Obj } }): Promise<string> {
  const o = event.data?.object;
  switch (event.type) {
    case 'checkout.session.completed': {
      const u = await userFor(db, o);
      if (!u) return 'no user';
      if (o.mode === 'subscription' && o.subscription) {
        const subId = typeof o.subscription === 'string' ? o.subscription : o.subscription.id;
        await db.q(`UPDATE vg_users SET stripe_subscription_id = $2, updated_at = now() WHERE id = $1`, [u.id, subId]);
        return 'linked subscription';
      }
      if (o.mode === 'payment' && o.metadata?.kind === 'topup' && o.payment_status === 'paid') {
        const added = await grant(db, String(u.id), TOPUP.credits, 'topup', `topup:${o.id}`);
        return added ? 'topup granted' : 'topup already granted';
      }
      return 'ignored session';
    }

    case 'invoice.paid': {
      const u = await userFor(db, o);
      if (!u) return 'no user';
      // on an upgrade the old plan shows up as a negative proration line, the new one as a positive line
      const lines = invoiceLines(o);
      const plan = lines.filter((l) => l.amount >= 0).map((l) => planForPrice(l.price)).find((p) => p) || null;
      if (!plan) return 'not a studio invoice';
      const credited = lines.filter((l) => l.amount < 0).map((l) => planForPrice(l.price)).find((p) => p) || null;
      const reason = String(o.billing_reason || '');
      let credits = 0;
      if (reason === 'subscription_create' || reason === 'subscription_cycle') credits = PLANS[plan].credits;
      else if (reason === 'subscription_update' && Number(o.amount_paid) > 0) {
        const prevPlan = credited || (isPlanId(u.plan) && u.plan !== plan ? u.plan : null);
        const prev = prevPlan ? PLANS[prevPlan].credits : 0;
        credits = Math.max(0, PLANS[plan].credits - prev);
      }
      const subId = invoiceSubscriptionId(o);
      await db.q(
        `UPDATE vg_users SET plan = $2, sub_status = 'active', stripe_subscription_id = COALESCE($3, stripe_subscription_id), updated_at = now() WHERE id = $1`,
        [u.id, plan, subId],
      );
      if (!credits) return `plan ${plan}, no credits for ${reason}`;
      const added = await grant(db, String(u.id), credits, `plan:${plan}`, `invoice:${o.id}`);
      return added ? `granted ${credits}` : 'invoice already granted';
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const u = await userFor(db, o);
      if (!u) return 'no user';
      const priceId = o.items?.data?.[0]?.price?.id;
      const plan = planForPrice(priceId);
      await db.q(
        `UPDATE vg_users SET plan = COALESCE($2, plan), sub_status = $3, stripe_subscription_id = $4, updated_at = now() WHERE id = $1`,
        [u.id, plan, String(o.status || ''), String(o.id)],
      );
      return `status ${o.status}`;
    }

    case 'customer.subscription.deleted': {
      const u = await userFor(db, o);
      if (!u) return 'no user';
      if (u.stripe_subscription_id && u.stripe_subscription_id !== o.id) return 'old subscription, ignored';
      await db.q(`UPDATE vg_users SET plan = 'none', sub_status = 'canceled', updated_at = now() WHERE id = $1`, [u.id]);
      const left = await balance(db, String(u.id));
      if (left > 0) await grant(db, String(u.id), -left, 'expired', `expire:${o.id}`);
      return `canceled, expired ${Math.max(0, left)}`;
    }

    default:
      return 'ignored';
  }
}
