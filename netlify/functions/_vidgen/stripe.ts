import { createHmac } from 'node:crypto';
import { safeEqual } from './common';
import { PLANS, isPlanId, type PlanId } from '../../../src/vidgen/models';

/**
 * Minimal Stripe REST client over fetch (no SDK). Env:
 *   STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET,
 *   STRIPE_PRICE_STARTER, STRIPE_PRICE_CREATOR, STRIPE_PRICE_STUDIO, STRIPE_PRICE_TOPUP,
 *   STRIPE_PORTAL_CONFIG (optional billing portal configuration id).
 * Create them with scripts/vidgen-stripe-setup.cjs.
 */

export const stripeConfigured = () =>
  !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_STARTER && process.env.STRIPE_PRICE_CREATOR && process.env.STRIPE_PRICE_STUDIO);

export function priceForPlan(plan: PlanId): string {
  return { starter: process.env.STRIPE_PRICE_STARTER, creator: process.env.STRIPE_PRICE_CREATOR, studio: process.env.STRIPE_PRICE_STUDIO }[plan] || '';
}

export function planForPrice(priceId: string | undefined | null): PlanId | null {
  if (!priceId) return null;
  for (const id of Object.keys(PLANS)) if (isPlanId(id) && priceForPlan(id) === priceId) return id;
  return null;
}

/** Flattens nested params into Stripe's form encoding: a[b][0][c]=v. */
export function formEncode(params: Record<string, unknown>, prefix = ''): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item && typeof item === 'object') out.push(...formEncode(item as Record<string, unknown>, `${key}[${i}]`));
        else out.push(`${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(item))}`);
      });
    } else if (typeof v === 'object') {
      out.push(...formEncode(v as Record<string, unknown>, key));
    } else {
      out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
    }
  }
  return out;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function stripe(method: 'GET' | 'POST', path: string, params: Record<string, unknown> = {}): Promise<any> {
  const body = formEncode(params).join('&');
  const url = `https://api.stripe.com/v1/${path}${method === 'GET' && body ? `?${body}` : ''}`;
  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: method === 'POST' ? body : undefined,
    signal: AbortSignal.timeout(9000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Stripe ${res.status}: ${data?.error?.message || 'error'}`);
  return data;
}

/**
 * Verifies a Stripe-Signature header (t=...,v1=...) against the raw body.
 * Returns the parsed event, or null when the signature or timestamp is wrong.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function verifyStripeEvent(raw: string, header: string | null, secret: string, toleranceSec = 300, now = Date.now()): any | null {
  if (!header || !secret) return null;
  let t = '';
  const sigs: string[] = [];
  for (const part of header.split(',')) {
    const [k, v] = part.split('=');
    if (k === 't') t = v;
    if (k === 'v1' && v) sigs.push(v);
  }
  if (!t || !sigs.length) return null;
  if (Math.abs(now / 1000 - Number(t)) > toleranceSec) return null;
  const expected = createHmac('sha256', secret).update(`${t}.${raw}`, 'utf8').digest('hex');
  if (!sigs.some((s) => safeEqual(s, expected))) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/** Price id + amount per invoice line, across Stripe API versions (line.price.id, or line.pricing.price_details.price). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function invoiceLines(invoice: any): { price: string; amount: number }[] {
  const lines = invoice?.lines?.data || [];
  return lines
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((l: any) => ({ price: l?.price?.id || l?.pricing?.price_details?.price || l?.plan?.id, amount: Number(l?.amount) || 0 }))
    .filter((x: { price: unknown }): x is { price: string; amount: number } => typeof x.price === 'string');
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function invoiceSubscriptionId(invoice: any): string | null {
  const s = invoice?.subscription ?? invoice?.parent?.subscription_details?.subscription;
  return typeof s === 'string' ? s : s?.id || null;
}
