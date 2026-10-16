import { getStore } from '@netlify/blobs';
import type { Db } from './db';

/**
 * Finished videos live in the Netlify Blobs store "vidgen-media" (Higgsfield deletes
 * outputs after about 7 days). Each video is split into 4 MiB chunks:
 *   <gid>/meta   {size, chunks, type}
 *   <gid>/<n>    bytes [n*CHUNK, (n+1)*CHUNK)
 * so vidgen-media can answer HTTP Range requests by reading one chunk, and every
 * response stays well under the function response size limit.
 */

export const CHUNK = 4 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 400 * 1024 * 1024;

export function mediaStore() {
  if (process.env.NETLIFY_DEV === 'true') return getStore({ name: 'vidgen-media' });
  return getStore({ name: 'vidgen-media', consistency: 'strong' });
}

export interface MediaMeta { size: number; chunks: number; type: string }

/** Streams the Higgsfield output into Blobs chunk by chunk. Returns the meta written. */
export async function copyToBlobs(gid: string, url: string): Promise<MediaMeta> {
  const store = mediaStore();
  const res = await fetch(url, { signal: AbortSignal.timeout(10 * 60 * 1000) });
  if (!res.ok || !res.body) throw new Error(`download failed ${res.status}`);
  const type = (res.headers.get('content-type') || 'video/mp4').split(';')[0].trim() || 'video/mp4';
  const reader = res.body.getReader();
  let buf = new Uint8Array(CHUNK);
  let fill = 0;
  let size = 0;
  let n = 0;
  const flush = async () => {
    if (!fill) return;
    await store.set(`${gid}/${n}`, buf.slice(0, fill).buffer as ArrayBuffer);
    n++;
    fill = 0;
    buf = new Uint8Array(CHUNK);
  };
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    let off = 0;
    while (off < value.length) {
      const take = Math.min(CHUNK - fill, value.length - off);
      buf.set(value.subarray(off, off + take), fill);
      fill += take;
      off += take;
      size += take;
      if (size > MAX_VIDEO_BYTES) throw new Error('video too large');
      if (fill === CHUNK) await flush();
    }
  }
  await flush();
  if (!size) throw new Error('empty download');
  const meta: MediaMeta = { size, chunks: n, type };
  await store.setJSON(`${gid}/meta`, meta);
  return meta;
}

export async function storeGeneration(db: Db, gid: string): Promise<boolean> {
  const rows = await db.q(
    `UPDATE vg_generations SET store_attempts = store_attempts + 1 WHERE id = $1 AND status = 'completed' AND NOT media_stored AND hf_output_url IS NOT NULL
     RETURNING hf_output_url`,
    [gid],
  );
  if (!rows.length) return false;
  const meta = await copyToBlobs(gid, String(rows[0].hf_output_url));
  await db.q(`UPDATE vg_generations SET media_stored = true, media_bytes = $2, media_type = $3, updated_at = now() WHERE id = $1`, [gid, meta.size, meta.type]);
  return true;
}

/** Parses a single "bytes=a-b" range against a known size. Returns null when absent or unsatisfiable. */
export function parseRange(header: string | null, size: number): { start: number; end: number } | 'bad' | null {
  if (!header) return null;
  const m = /^bytes=(\d*)-(\d*)$/.exec(header.trim());
  if (!m || (m[1] === '' && m[2] === '')) return 'bad';
  let start: number;
  let end: number;
  if (m[1] === '') {
    const suffix = Number(m[2]);
    if (!suffix) return 'bad';
    start = Math.max(0, size - suffix);
    end = size - 1;
  } else {
    start = Number(m[1]);
    end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  }
  if (start >= size || end < start) return 'bad';
  return { start, end };
}

/** Clamps a range to the chunk that holds its first byte, so one response = one blob read. */
export function clampToChunk(r: { start: number; end: number }): { start: number; end: number; chunk: number } {
  const chunk = Math.floor(r.start / CHUNK);
  return { start: r.start, end: Math.min(r.end, (chunk + 1) * CHUNK - 1), chunk };
}
