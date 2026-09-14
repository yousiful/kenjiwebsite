import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * /call-center-upgrade -> real draft invoice in GHL.
 *
 * 2026-09-14: originally built gated to the ~11 currently-active $375/mo
 * KenjiAI clients as an upsell test (contactId allowlist). Yousif reframed
 * same day: 11 people is too small a population to gate around, and he
 * wants this open to current AND future clients -- opened to any visitor.
 * No allowlist anymore; any real name+contact info submitted here is
 * accepted and upserted as a GHL contact.
 *
 * Still deliberately does NOT send anything to the submitter. Creating a
 * GHL invoice via POST /invoices/ leaves it in "draft" status (confirmed
 * live against a throwaway test contact before wiring this up originally)
 * -- it only becomes visible to the client once someone explicitly sends
 * it from the GHL dashboard. That send step stays a manual, reviewed
 * action by Yousif regardless of audience size -- opening this up to the
 * public raises volume, not risk, since nothing auto-sends either way.
 *
 * Netlify env var: GHL_PIT (reused from ghl-lead-callcenter.ts / ghl-lead.ts).
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';

const TIERS: Record<string, { productId: string; priceId: string; name: string; amount: number }> = {
  metered: {
    productId: '6aa83fb6dab1d13e4dfadfe7',
    priceId: '6aa83fc03b4b7ff2989833e2',
    name: 'AI Call Center - $199/mo + usage',
    amount: 199,
  },
  unlimited: {
    productId: '6aa83fcbcbcb3878b4777bbc',
    priceId: '6aa83fccf6935646c1b185f0',
    name: 'AI Call Center - $399/mo Unlimited',
    amount: 399,
  },
};

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload: { tier?: string; firstName?: string; email?: string; phone?: string };
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const tier = (payload.tier || '').trim();
  const firstName = (payload.firstName || '').trim();
  const email = (payload.email || '').trim();
  const phone = (payload.phone || '').trim();

  if (!TIERS[tier]) return json(400, { error: 'invalid tier' });
  if (!email && !phone) return json(400, { error: 'email or phone required' });

  const token = process.env.GHL_PIT;
  if (!token) return json(502, { error: 'GHL not configured' });

  const headers = {
    Authorization: `Bearer ${token}`,
    Version: GHL_VERSION,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  const plan = TIERS[tier];

  try {
    // Upsert (not a fresh create) so a submitter who's already a real GHL
    // contact -- existing client or a past lead -- gets matched onto their
    // existing record instead of duplicated.
    const upsertRes = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        locationId: LOCATION_ID,
        firstName,
        email: email || undefined,
        phone: phone || undefined,
        source: 'call-center-upgrade-page',
        tags: [`callcenter-request-${tier}`],
      }),
    });
    const upsertData: any = await upsertRes.json().catch(() => ({}));
    if (!upsertRes.ok || !upsertData.contact) {
      return json(502, { error: 'contact upsert failed', detail: upsertData });
    }
    const c = upsertData.contact;
    const contactId = c.id;

    const issueDate = new Date();
    const dueDate = new Date(issueDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    const invoiceRes = await fetch(`${GHL_BASE}/invoices/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        altId: LOCATION_ID,
        altType: 'location',
        name: `AI Call Center Request - ${c.contactName || firstName || 'Lead'}`,
        currency: 'USD',
        businessDetails: {
          name: 'Media Traffics | KenjiAI',
          phoneNo: '+14247226369',
          website: 'https://go.MediaTraffics.com',
          address: {
            addressLine1: '801 a st',
            countryCode: 'US',
            state: 'CA',
            city: 'san diego',
            postalCode: '92101',
          },
        },
        contactDetails: {
          id: contactId,
          name: c.contactName || firstName || 'Lead',
          email: c.email || email || undefined,
          phoneNo: c.phone || phone || undefined,
        },
        issueDate: issueDate.toISOString().slice(0, 10),
        dueDate: dueDate.toISOString().slice(0, 10),
        items: [
          { productId: plan.productId, priceId: plan.priceId, name: plan.name, qty: 1, amount: plan.amount, currency: 'USD' },
        ],
        title: 'INVOICE',
      }),
    });
    const invoiceData: any = await invoiceRes.json().catch(() => ({}));
    if (!invoiceRes.ok) return json(502, { error: 'invoice creation failed', detail: invoiceData });

    // Note the contact so this shows up for Yousif's review. Never send
    // the invoice from here -- that stays a manual step in GHL.
    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        body: `Requested AI Call Center (${plan.name}) via /call-center-upgrade on ${issueDate.toISOString()}. DRAFT invoice #${invoiceData.invoiceNumber || invoiceData._id} created, NOT sent yet -- review and send from Payments > Invoices to actually collect payment.`,
      }),
    }).catch(() => {});

    return json(200, { ok: true, invoiceId: invoiceData._id, status: invoiceData.status });
  } catch (err) {
    return json(502, { error: 'request failed' });
  }
};
