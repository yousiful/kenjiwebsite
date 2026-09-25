import type { Handler, HandlerEvent } from '@netlify/functions';
import crypto from 'crypto';

/**
 * Partner Program application (/partner-apply) -> GoHighLevel.
 * Feeds the same "whale" segment as whale_outreach.py's cold-sent contacts,
 * plus a qualified/unqualified split based on the real $20K/mo ad-spend
 * threshold from the /partnerup offer (see PartnerUpPage.tsx) -- someone
 * who clicked through the soft-disqualify screen anyway still gets tagged
 * honestly as under-threshold, not silently treated as qualified.
 *
 * Netlify env var: GHL_PIT (Private Integration Token, shared with the
 * other ghl-lead-*.ts functions). Optional: GHL_LOCATION_ID.
 * Also uses META_PIXEL_ID, META_CAPI_TOKEN (shared, see ghl-purchase-sync.ts).
 */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GHL_VERSION = '2021-07-28';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
const META_API_VERSION = 'v21.0';

const sha256 = (v: string) => crypto.createHash('sha256').update(v.trim().toLowerCase()).digest('hex');

const QUALIFIED_SPEND = new Set(['20-50k', '50-100k', '100k+']);

interface ApplyPayload {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  website?: string;
  running_ads?: string;
  ad_spend?: string;
  revenue?: string;
  industry?: string;
  event_id?: string;
  fbc?: string;
  fbp?: string;
}

const json = (statusCode: number, body: unknown) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

const SPEND_LABEL: Record<string, string> = {
  under5k: 'Under $5K/mo', '5-20k': '$5K-$20K/mo', '20-50k': '$20K-$50K/mo',
  '50-100k': '$50K-$100K/mo', '100k+': '$100K+/mo',
};
const REV_LABEL: Record<string, string> = {
  under50k: 'Under $50K/mo', '50-100k': '$50K-$100K/mo', '100-250k': '$100K-$250K/mo',
  '250-500k': '$250K-$500K/mo', '500k+': '$500K+/mo',
};
const INDUSTRY_LABEL: Record<string, string> = {
  ecommerce: 'E-commerce / DTC', home_services: 'Home services / trades / construction',
  professional: 'Legal / financial / professional services', health: 'Health / wellness / medical',
  info_coaching: 'Info product / coaching / consulting', b2b_agency: 'B2B / SaaS / agency', other: 'Other',
};

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload: ApplyPayload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  const firstName = (payload.first_name || '').trim();
  const lastName = (payload.last_name || '').trim();
  const email = (payload.email || '').trim();
  const phone = (payload.phone || '').trim();
  const website = (payload.website || '').trim();

  if (!email && !phone) {
    return json(400, { error: 'email or phone required' });
  }

  const token = process.env.GHL_PIT;
  if (!token) return json(502, { error: 'GHL not configured' });
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;

  const qualified = payload.ad_spend ? QUALIFIED_SPEND.has(payload.ad_spend) : false;
  const tags = ['whale', 'partner-apply', qualified ? 'partner-apply-qualified' : 'partner-apply-under-threshold'];

  try {
    const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Version: GHL_VERSION,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        email,
        phone,
        website: website || undefined,
        source: 'partner-apply-page',
        tags,
      }),
    });
    const data: any = await r.json().catch(() => ({}));
    if (!r.ok) return json(502, { error: 'GHL upsert failed', detail: data });

    const cid = (data && data.contact && data.contact.id) || null;
    if (cid) {
      const noteLines = [
        `Partner Program application (/partner-apply)`,
        `Running paid ads: ${payload.running_ads === 'yes' ? 'Yes' : 'No'}`,
        `Ad spend: ${SPEND_LABEL[payload.ad_spend || ''] || 'not given'}`,
        `Revenue: ${REV_LABEL[payload.revenue || ''] || 'not given'}`,
        `Industry: ${INDUSTRY_LABEL[payload.industry || ''] || 'not given'}`,
        qualified
          ? 'Meets the $20K+/mo spend threshold -- real fit for the $25K/15% offer.'
          : 'Below the $20K/mo spend threshold -- applied anyway, review before booking a call.',
      ];
      await fetch(`${GHL_BASE}/contacts/${cid}/notes`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Version: GHL_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: noteLines.join('\n') }),
      }).catch(() => {});
    }

    // Server-side Meta CAPI Lead event, same event_id the client pixel used.
    const pixelId = process.env.META_PIXEL_ID;
    const capiToken = process.env.META_CAPI_TOKEN;
    if (pixelId && capiToken) {
      const clientIp =
        event.headers['x-nf-client-connection-ip'] ||
        event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
        '';
      const userAgent = event.headers['user-agent'] || '';
      const userData: Record<string, unknown> = {
        client_ip_address: clientIp,
        client_user_agent: userAgent,
      };
      if (email) userData.em = [sha256(email)];
      if (phone) userData.ph = [sha256(phone.replace(/^\+/, ''))];
      if (payload.fbc) userData.fbc = payload.fbc;
      if (payload.fbp) userData.fbp = payload.fbp;

      fetch(`https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events?access_token=${capiToken}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [
            {
              event_name: 'Lead',
              event_time: Math.floor(Date.now() / 1000),
              event_id: payload.event_id,
              action_source: 'website',
              event_source_url: 'https://kenjiai.com/partner-apply',
              user_data: userData,
              custom_data: { content_name: 'partner-apply', qualified },
            },
          ],
        }),
      }).catch(() => {});
    }

    return json(200, { ok: true, id: cid, qualified });
  } catch (err) {
    return json(502, { error: 'GHL request failed' });
  }
};
