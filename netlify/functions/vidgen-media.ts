import { fail, isUuid } from './_vidgen/common';
import { withUser } from './_vidgen/guard';
import { CHUNK, mediaStore, parseRange, clampToChunk, type MediaMeta } from './_vidgen/media';

/**
 * Serves a finished Kenji Studio video to its owner only.
 *   GET ?id=<generation id>[&download=1]
 * Supports HTTP Range (the <video> element and the download button both use it);
 * each response is at most one 4 MiB chunk. Before the copy into Blobs finishes,
 * the owner is redirected to Higgsfield's own output URL (kept for about 7 days).
 */

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return fail(405, 'Method not allowed');
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  if (!isUuid(id)) return fail(400, 'Unknown video.');
  const ctx = await withUser(req);
  if (ctx instanceof Response) return ctx;
  const { db, user } = ctx;

  const rows = await db.q(`SELECT id, status, media_stored, hf_output_url, title FROM vg_generations WHERE id = $1 AND user_id = $2`, [id, user.id]);
  const g = rows[0];
  if (!g || g.status !== 'completed') return fail(404, 'This video is not ready.');

  const store = mediaStore();
  const meta = g.media_stored ? ((await store.get(`${id}/meta`, { type: 'json' })) as MediaMeta | null) : null;
  if (!meta) {
    if (g.hf_output_url) return new Response(null, { status: 302, headers: { Location: String(g.hf_output_url), 'Cache-Control': 'private, no-store' } });
    return fail(404, 'This video is not ready.');
  }

  const ext = meta.type.includes('mp4') ? 'mp4' : meta.type.split('/')[1] || 'bin';
  const base: Record<string, string> = {
    'Content-Type': meta.type,
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'private, max-age=3600',
    'X-Content-Type-Options': 'nosniff',
  };
  if (url.searchParams.get('download')) base['Content-Disposition'] = `attachment; filename="kenji-studio-${String(id).slice(0, 8)}.${ext}"`;

  const range = parseRange(req.headers.get('range'), meta.size);
  if (range === 'bad') return new Response(null, { status: 416, headers: { ...base, 'Content-Range': `bytes */${meta.size}` } });

  // No Range header: small files whole, larger ones as the first chunk (206) so the client keeps asking.
  const r = range ? clampToChunk(range) : clampToChunk({ start: 0, end: meta.size - 1 });
  const whole = !range && meta.size <= CHUNK;
  if (req.method === 'HEAD') {
    return new Response(null, { status: 200, headers: { ...base, 'Content-Length': String(meta.size) } });
  }
  const buf = (await store.get(`${id}/${r.chunk}`, { type: 'arrayBuffer' })) as ArrayBuffer | null;
  if (!buf) return fail(404, 'This video is missing. Please contact support.');
  const offset = r.start - r.chunk * CHUNK;
  const bytes = new Uint8Array(buf).subarray(offset, offset + (r.end - r.start + 1));
  if (whole) return new Response(bytes, { status: 200, headers: { ...base, 'Content-Length': String(bytes.length) } });
  return new Response(bytes, {
    status: 206,
    headers: { ...base, 'Content-Length': String(bytes.length), 'Content-Range': `bytes ${r.start}-${r.start + bytes.length - 1}/${meta.size}` },
  });
};
