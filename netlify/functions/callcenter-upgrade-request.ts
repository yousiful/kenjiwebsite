import type { Handler, HandlerEvent } from '@netlify/functions';

/**
 * /call-center-upgrade -> real draft invoice in GHL.
 *
 * This is a TEST of the AI Call Center upsell against the ~11 currently
 * active $375/mo KenjiAI clients (2026-09-14). Deliberately does NOT send
 * anything to the client -- creating a GHL invoice via POST /invoices/
 * leaves it in "draft" status (confirmed live against a throwaway test
 * contact before wiring this up), it only becomes visible to the client
 * once someone explicitly sends it from the GHL dashboard. That send step
 * stays a manual, reviewed action by Yousif -- this function only gets a
 * real draft invoice ready and tags the contact so it shows up for review.
 *
 * CONTACT_ALLOWLIST: this offer isn't public yet. Only the contactIds of
 * real, currently-active $375/mo (or $475/mo) clients as of the 2026-09-14
 * subscription pull are accepted -- anyone else (including a stray/guessed
 * contactId) is rejected before anything is created. Widen this list only
 * after the small test is reviewed and Yousif wants to roll it out further.
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

// Real, currently-active $375/mo (+ one $475/mo) KenjiAI clients as of the
// 2026-09-14 subscription pull. Test population for this upsell only.
const CONTACT_ALLOWLIST = new Set([
  'OBlY5TiR1wfaoZPMGSak', // Vernon Daniel
  'XN8CyhSBoaytXce4ne36', // Johnny Frame
  'f60hESHsp1OVi32jVFaR', // Gilberto Escobar
  'D68gBDIQws2xQnoLwseg', // Robert Holland
  'lkK70FGnIn7R94lYI9QE', // Ward Bond
  'CaaUMfDdLHSFNBoJZdQW', // Vern Rockwell
  'LVYn3qXN3lIrImXvemgO', // Carl Merkle
  'brA36Qgloo7nBa4P9Ttj', // Fatoumata Ceesay
  'wOAzxIYSIThgoicHpUFT', // Nick Chavez
  '9yNwSi7CHP8hlAoAA3Zu', // Wesley Cannon
  'mIcqNBOb4TlEZ3ZRwKCZ', // Ken Jaross
]);

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload: { contactId?: string; tier?: string };
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const contactId = (payload.contactId || '').trim();
  const tier = (payload.tier || '').trim();

  if (!TIERS[tier]) return json(400, { error: 'invalid tier' });
  if (!contactId || !CONTACT_ALLOWLIST.has(contactId)) {
    return json(403, { error: 'not eligible for this offer yet' });
  }

  const token = process.env.GHL_PIT;
  if (!token) return json(502, { error: 'GHL not configured' });

  const headers = {
    Authorization: `Bearer ${token}`,
    Version: GHL_VERSION,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  try {
    // Look up the real contact so the invoice has a real name/email/phone
    // (required fields, confirmed via live test) instead of guessed data.
    const contactRes = await fetch(`${GHL_BASE}/contacts/${contactId}`, { headers });
    const contactData: any = await contactRes.json().catch(() => ({}));
    if (!contactRes.ok || !contactData.contact) {
      return json(502, { error: 'could not load contact' });
    }
    const c = contactData.contact;
    const plan = TIERS[tier];

    const issueDate = new Date();
    const dueDate = new Date(issueDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    const invoiceRes = await fetch(`${GHL_BASE}/invoices/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        altId: LOCATION_ID,
        altType: 'location',
        name: `AI Call Center Upgrade - ${c.contactName || c.firstName || 'Client'}`,
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
          name: c.contactName || `${c.firstName || ''} ${c.lastName || ''}`.trim() || 'Client',
          email: c.email || undefined,
          phoneNo: c.phone || undefined,
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

    // Tag + note the contact so this shows up for Yousif's review. Never
    // send the invoice from here -- that stays a manual step in GHL.
    await fetch(`${GHL_BASE}/contacts/${contactId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ tags: [...(c.tags || []), `callcenter-upsell-requested-${tier}`] }),
    }).catch(() => {});

    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        body: `Requested AI Call Center upgrade (${plan.name}) via /call-center-upgrade on ${issueDate.toISOString()}. DRAFT invoice #${invoiceData.invoiceNumber || invoiceData._id} created, NOT sent yet -- review and send from Payments > Invoices to actually collect payment.`,
      }),
    }).catch(() => {});

    return json(200, { ok: true, invoiceId: invoiceData._id, status: invoiceData.status });
  } catch (err) {
    return json(502, { error: 'request failed' });
  }
};
