import type { Handler, HandlerEvent } from '@netlify/functions';
import crypto from 'crypto';

const META_API_VERSION = 'v17.0';

interface IncomingEvent {
  event_name: string;
  event_id?: string;
  event_source_url?: string;
  custom_data?: Record<string, unknown>;
  user_data?: {
    em?: string;
    ph?: string;
    fbp?: string;
    fbc?: string;
  };
}

const sha256 = (value: string) =>
  crypto.createHash('sha256').update(value.trim().toLowerCase()).digest('hex');

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_TOKEN;
  const testEventCode = process.env.META_TEST_EVENT_CODE;

  if (!pixelId || !accessToken) {
    return { statusCode: 500, body: JSON.stringify({ error: 'CAPI not configured' }) };
  }

  let payload: IncomingEvent;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  if (!payload.event_name) {
    return { statusCode: 400, body: JSON.stringify({ error: 'event_name required' }) };
  }

  const clientIp =
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    '';
  const userAgent = event.headers['user-agent'] || '';

  const userData: Record<string, unknown> = {
    client_ip_address: clientIp,
    client_user_agent: userAgent,
  };

  if (payload.user_data?.em) userData.em = [sha256(payload.user_data.em)];
  if (payload.user_data?.ph) userData.ph = [sha256(payload.user_data.ph)];
  if (payload.user_data?.fbp) userData.fbp = payload.user_data.fbp;
  if (payload.user_data?.fbc) userData.fbc = payload.user_data.fbc;

  const metaPayload = {
    data: [
      {
        event_name: payload.event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id: payload.event_id,
        event_source_url: payload.event_source_url,
        action_source: 'website',
        user_data: userData,
        custom_data: payload.custom_data || {},
      },
    ],
    ...(testEventCode ? { test_event_code: testEventCode } : {}),
  };

  try {
    const response = await fetch(
      `https://graph.facebook.com/${META_API_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metaPayload),
      }
    );

    const result = await response.json();

    return {
      statusCode: response.ok ? 200 : 502,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 502,
      body: JSON.stringify({ error: 'Upstream CAPI request failed' }),
    };
  }
};
