import { isUuid } from './_vidgen/common';
import { neonDb, ensureSchema } from './_vidgen/db';
import { checkHookSig } from './_vidgen/jobs';
import { storeGeneration } from './_vidgen/media';

/**
 * Background function (up to 15 minutes): copies one finished video from Higgsfield
 * into the vidgen-media Blobs store. Called by the webhook, the library poll and the
 * every-minute queue sweep, with an HMAC of the generation id. Idempotent: it only
 * acts on completed generations that are not stored yet.
 */

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  let body: { gid?: unknown; sig?: unknown } = {};
  try {
    body = JSON.parse(await req.text());
  } catch {
    return new Response(null, { status: 400 });
  }
  const gid = String(body.gid || '');
  if (!isUuid(gid) || !checkHookSig(gid, String(body.sig || ''))) return new Response(null, { status: 400 });
  const db = neonDb();
  if (!db) return new Response(null, { status: 503 });
  try {
    await ensureSchema(db);
    const ok = await storeGeneration(db, gid);
    console.log(`vidgen-store ${gid}: ${ok ? 'stored' : 'nothing to do'}`);
  } catch (e) {
    console.error('vidgen-store', gid, e);
  }
  return new Response(null, { status: 200 });
};
