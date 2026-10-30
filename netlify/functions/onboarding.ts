import type { Handler, HandlerEvent } from '@netlify/functions';
import { connectLambda, getStore } from '@netlify/blobs';
import { createCipheriv, createHash, publicEncrypt, randomBytes, constants } from 'node:crypto';

/* Client onboarding, kenjiai.com/onboarding (Yousif 2026-10-30).
   stage 'start': intake answers -> GHL upsert, tag 'onboarding started', note.
   stage 'token': client's Meta system user token -> checked live against the Graph API (who it is, ad accounts,
                  pages, permissions), then encrypted with our public key (AES-256-GCM, key wrapped RSA-OAEP) and
                  saved in the "client-tokens" Blobs store. Only the private key on Yousif's PC can open it:
                  C:\Users\y_you\scheduled_tasks\agents\client_token_catch.py pulls, decrypts and deletes it.
                  GHL gets tag 'meta token received' and a note listing what the token can see. The token itself
                  never goes into GHL, email or logs.
   stage 'done' : finished steps + ad account ID -> tag 'onboarding complete', note.
   Tags only. No workflow enrollment from here. Netlify env: GHL_PIT (GHL_LOCATION_ID optional). */

const GHL_BASE = 'https://services.leadconnectorhq.com';
const GRAPH = 'https://graph.facebook.com/v21.0';
const DEFAULT_LOCATION_ID = 'q5L4ttbBMHNxieXIcTVJ';
const WANT_PERMS = ['ads_management', 'ads_read', 'business_management', 'pages_show_list', 'pages_read_engagement', 'pages_manage_ads', 'leads_retrieval', 'read_insights'];
const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEA9jbifCKaOr+Xq4Of+5B9
cFqo4IuTxwhBHpvLwIAzqeE/htnq4STPIjaREfSAp/Dgrvcgy2BHIWY+qGYpiEk+
pPIiraggwbhahoAG72aopNTA8TIK/ZUiICTPumMMxqFfe2dOazqCI6iWvGaqwLuO
QlTkFbsmVzgzZY9I3IcwX1XUK0Nv+iFsXm7b7RXFfFuSQYaSw+S7ur+JqtvcNyJY
SLMVQJqGjxrBER1GVO76QjH59EuLXUsDsX0jNibsspKHFhdOrQeKHAE2bW/tGDl9
0BOWDOySnNFXGIEgqHc72dH1VP0niEAF3ER/19f1M7pGCrkGXW/f3q4Jg72opdFg
4JieFyW34CQP5DXCmIrznbs3OciCCXF1thuvPdoBZyLTsvf2beSc3+Ihkpk6v/Fb
owL+SdNELiz44FiCSg57DaiWFLJO+oyBvgV5A8BpbikojWB+7p/508YMOCSinVdl
8bnrvDPxbnRXVIcp+2pFE+hOMXLFtPM6haIK1Fbmk79XAgMBAAE=
-----END PUBLIC KEY-----`;

const json = (statusCode: number, body: unknown) => ({ statusCode, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
const clip = (v: unknown, n = 300) => String(v ?? '').trim().slice(0, n);

function seal(secret: string) {
  const key = randomBytes(32), iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', key, iv);
  const data = Buffer.concat([c.update(secret, 'utf8'), c.final()]);
  const k = publicEncrypt({ key: PUBLIC_KEY, padding: constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' }, key);
  return { k: k.toString('base64'), iv: iv.toString('base64'), tag: c.getAuthTag().toString('base64'), data: data.toString('base64') };
}

async function graph(path: string, token: string) {
  const r = await fetch(`${GRAPH}/${path}${path.includes('?') ? '&' : '?'}access_token=${encodeURIComponent(token)}`);
  const d: any = await r.json().catch(() => ({}));
  if (!r.ok || d.error) throw new Error(clip(d?.error?.message || `Meta returned ${r.status}`, 200));
  return d;
}

/* Checks the token with Meta. Returns what it can see, or a plain-English problem. */
async function checkToken(token: string) {
  const me = await graph('me?fields=id,name', token);
  const perms = ((await graph('me/permissions', token).catch(() => ({ data: [] }))).data || [])
    .filter((p: any) => p.status === 'granted').map((p: any) => String(p.permission));
  const ads = ((await graph('me/adaccounts?fields=account_id,name,account_status&limit=50', token).catch(() => ({ data: [] }))).data || [])
    .map((a: any) => ({ id: String(a.account_id), name: clip(a.name, 80), active: a.account_status === 1 }));
  const pages = ((await graph('me/accounts?fields=id,name&limit=50', token).catch(() => ({ data: [] }))).data || [])
    .map((p: any) => ({ id: String(p.id), name: clip(p.name, 80) }));
  return { user: { id: String(me.id), name: clip(me.name, 80) }, perms, missing: WANT_PERMS.filter((p) => !perms.includes(p)), ads, pages };
}

async function ghlUpsert(headers: Record<string, string>, locationId: string, f: any, tag: string) {
  const r = await fetch(`${GHL_BASE}/contacts/upsert`, {
    method: 'POST', headers,
    body: JSON.stringify({
      locationId, email: clip(f.email, 120), firstName: clip(f.firstName, 60), phone: clip(f.phone, 30) || undefined,
      companyName: clip(f.business, 120) || undefined, website: clip(f.website, 200) || undefined,
      source: 'kenjiai.com/onboarding', tags: [tag],
    }),
  });
  const data: any = await r.json().catch(() => ({}));
  if (!r.ok || !data?.contact?.id) { console.error('[onboarding] upsert', r.status, JSON.stringify(data).slice(0, 200)); return null; }
  return String(data.contact.id);
}

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'Method Not Allowed' };
  let b: any;
  try { b = JSON.parse(event.body || '{}'); } catch { return json(400, { error: 'Invalid JSON' }); }
  const f = b.form || {};
  const email = clip(f.email, 120);
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) return json(400, { error: 'valid email required' });

  const pit = process.env.GHL_PIT;
  const locationId = process.env.GHL_LOCATION_ID || DEFAULT_LOCATION_ID;
  const headers = { Authorization: `Bearer ${pit}`, Version: '2021-07-28', 'Content-Type': 'application/json', Accept: 'application/json' };

  if (b.stage === 'token') {
    const token = clip(b.token, 1000).replace(/\s+/g, '');
    if (!/^EAA[A-Za-z0-9]{40,}$/.test(token)) return json(400, { error: "That doesn't look like a Meta token. It should start with EAA and be one long line of letters and numbers." });
    let info;
    try { info = await checkToken(token); } catch (e: any) { return json(400, { error: `Meta says that token doesn't work: ${e.message}` }); }
    if (!info.ads.length) return json(400, { error: "The token works, but it can't see any ad account yet. Go back one step, assign your ad account to the Media Traffics system user, then click Check again. You don't need a new token.", info });

    try {
      connectLambda(event as unknown as Parameters<typeof connectLambda>[0]);
      const key = `token/${createHash('sha256').update(email.toLowerCase()).digest('hex').slice(0, 24)}-${Date.now()}`;
      await getStore('client-tokens').setJSON(key, {
        email, firstName: clip(f.firstName, 60), business: clip(f.business, 120), phone: clip(f.phone, 30),
        ...info, sealed: seal(token), at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('[onboarding] token store failed', e);
      return json(502, { error: "We couldn't save it on our side. Try again in a minute, or tell us and we'll set it up on a call." });
    }

    if (pit) {
      const contactId = await ghlUpsert(headers, locationId, f, 'meta token received');
      if (contactId) {
        const note = [
          'Meta system user token received and checked (kenjiai.com/onboarding). Stored encrypted, not in GHL.',
          `System user: ${info.user.name} (${info.user.id})`,
          `Ad accounts: ${info.ads.map((a) => `${a.name} act_${a.id}${a.active ? '' : ' (not active)'}`).join(', ')}`,
          `Pages: ${info.pages.map((p) => p.name).join(', ') || 'none'}`,
          `Missing permissions: ${info.missing.join(', ') || 'none'}`,
        ];
        await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, { method: 'POST', headers, body: JSON.stringify({ body: note.join('\n') }) }).catch(() => {});
      }
    }
    return json(200, { ok: true, info });
  }

  if (!pit) return json(200, { ok: true, saved: false });
  const done = b.stage === 'done';
  try {
    const contactId = await ghlUpsert(headers, locationId, f, done ? 'onboarding complete' : 'onboarding started');
    if (!contactId) return json(502, { error: 'save failed' });

    const note = done
      ? [
          'Onboarding finished (kenjiai.com/onboarding).',
          `Ad account ID: ${clip(b.adAccountId, 40) || 'not given'}`,
          `Facebook page: ${clip(b.pageName, 120) || 'not given'}`,
          `System user token: ${b.tokenSent ? 'sent and checked' : 'not sent'}`,
          `Steps marked complete: ${(Array.isArray(b.completed) ? b.completed : []).map((s: unknown) => clip(s, 60)).join(', ') || 'none'}`,
          'Next: accept the invite in Business Settings (support@mediatraffics.com) and check partner access.',
        ]
      : [
          'Onboarding started (kenjiai.com/onboarding).',
          `Business: ${clip(f.business, 120)}`,
          `Website: ${clip(f.website, 200) || 'none'}`,
          `We run their ads: ${clip(f.ads, 10)}`,
          `Monthly ad budget: ${clip(f.budget, 40) || 'not given'}`,
          `Main goal: ${clip(f.goal, 500) || 'not given'}`,
          `Best way to reach them: ${clip(f.contact, 40) || 'not given'}`,
        ];
    await fetch(`${GHL_BASE}/contacts/${contactId}/notes`, { method: 'POST', headers, body: JSON.stringify({ body: note.join('\n') }) });
    return json(200, { ok: true, saved: true });
  } catch (e) {
    console.error('[onboarding] threw', e);
    return json(502, { error: 'save failed' });
  }
};
