/**
 * Higgsfield API client (server-side only). Docs: https://docs.higgsfield.ai
 *   Auth:      Authorization: Key <HIGGSFIELD_KEY_ID>:<HIGGSFIELD_KEY_SECRET>
 *   Submit:    POST /<model-path>[?hf_webhook=...]  + Idempotency-Key  -> {status, request_id, status_url, cancel_url}
 *   Status:    GET  /requests/<id>/status  -> {status, request_id, error?, video?{url}, images?[{url}]}
 *   Estimate:  POST /estimate/<model-path> (same body) -> {credits, usd} (decimal strings)
 *   Upload:    POST /files/generate-upload-url {content_type} -> {upload_url, public_url, upload_headers}
 *   Presets:   GET  /models/higgsfield/genjutsu/restyle/v1.0/presets -> {model, items:[{id,name,preview_url}]}
 * Errors use the FastAPI envelope {detail}. Concurrency reached is a 400 whose detail
 * mentions "concurrent requests".
 */

const BASE = 'https://api.higgsfield.ai';

export const hfConfigured = () => !!(process.env.HIGGSFIELD_KEY_ID && process.env.HIGGSFIELD_KEY_SECRET);

const authHeader = () => `Key ${process.env.HIGGSFIELD_KEY_ID}:${process.env.HIGGSFIELD_KEY_SECRET}`;

export type HfStatus = 'queued' | 'in_progress' | 'completed' | 'failed' | 'nsfw' | 'canceled';
export const HF_STATUSES: HfStatus[] = ['queued', 'in_progress', 'completed', 'failed', 'nsfw', 'canceled'];

export interface HfRequestStatus {
  status: HfStatus;
  request_id: string;
  error?: string | null;
  video?: { url: string };
  images?: { url: string }[];
}

export class HfError extends Error {
  status: number;
  detail: string;
  constructor(status: number, detail: string) {
    super(`Higgsfield ${status}: ${detail}`);
    this.status = status;
    this.detail = detail;
  }
}

const PATH_RE = /^[a-z0-9][a-z0-9._/-]{2,120}$/;

async function hfFetch(path: string, init: RequestInit & { timeoutMs?: number } = {}): Promise<unknown> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), init.timeoutMs ?? 8000);
  let res: Response;
  try {
    res = await fetch(`${BASE}/${path}`, {
      ...init,
      signal: ctrl.signal,
      headers: { Authorization: authHeader(), 'Content-Type': 'application/json', Accept: 'application/json', ...((init.headers as Record<string, string>) || {}) },
    });
  } catch (e) {
    throw new HfError(0, e instanceof Error ? e.message : 'network error');
  } finally {
    clearTimeout(t);
  }
  const text = await res.text();
  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    const d = (data as { detail?: unknown } | null)?.detail;
    throw new HfError(res.status, typeof d === 'string' ? d : JSON.stringify(d ?? text.slice(0, 300)));
  }
  return data;
}

export type SubmitResult =
  | { ok: true; requestId: string; status: HfStatus }
  | { ok: false; kind: 'busy' | 'retry' | 'reject'; status: number; detail: string };

/** Submits a generation. Idempotency-Key = our generation id, so a retry after a timeout never creates a second job. */
export async function hfSubmit(path: string, body: Record<string, unknown>, idempotencyKey: string, webhookUrl?: string): Promise<SubmitResult> {
  if (!PATH_RE.test(path)) return { ok: false, kind: 'reject', status: 0, detail: 'bad model path' };
  const qs = webhookUrl ? `?hf_webhook=${encodeURIComponent(webhookUrl)}` : '';
  try {
    const r = (await hfFetch(path + qs, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Idempotency-Key': idempotencyKey },
      timeoutMs: 15000,
    })) as { request_id?: string; status?: HfStatus };
    if (!r?.request_id) return { ok: false, kind: 'retry', status: 200, detail: 'no request_id in response' };
    return { ok: true, requestId: String(r.request_id), status: (r.status as HfStatus) || 'queued' };
  } catch (e) {
    const err = e instanceof HfError ? e : new HfError(0, String(e));
    return { ok: false, kind: classifySubmitError(err.status, err.detail), status: err.status, detail: err.detail };
  }
}

/** busy = account concurrency reached (wait for a slot); retry = transient or our setup; reject = this request will never work. */
export function classifySubmitError(status: number, detail: string): 'busy' | 'retry' | 'reject' {
  if (status === 400 && /concurren/i.test(detail)) return 'busy';
  if (status === 0 || status >= 500 || status === 423 || status === 401 || status === 403 || status === 429) return 'retry';
  return 'reject'; // 400 (bad input), 404 (model unavailable to the account), 422 (validation / idempotency mismatch)
}

export async function hfStatus(requestId: string, timeoutMs = 6000): Promise<HfRequestStatus> {
  if (!/^[0-9a-f-]{36}$/i.test(requestId)) throw new HfError(400, 'bad request id');
  const r = (await hfFetch(`requests/${requestId}/status`, { method: 'GET', timeoutMs })) as HfRequestStatus;
  if (!r || !HF_STATUSES.includes(r.status)) throw new HfError(502, 'unexpected status payload');
  return r;
}

export async function hfEstimate(path: string, body: Record<string, unknown>): Promise<{ credits: string; usd: string }> {
  if (!PATH_RE.test(path)) throw new HfError(400, 'bad model path');
  const r = (await hfFetch(`estimate/${path}`, { method: 'POST', body: JSON.stringify(body), timeoutMs: 8000 })) as { credits?: unknown; usd?: unknown };
  if (r?.usd === undefined || r?.usd === null || !Number.isFinite(Number(r.usd))) throw new HfError(502, 'estimate missing usd');
  return { credits: String(r.credits ?? ''), usd: String(r.usd) };
}

export const UPLOAD_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'video/mp4'];

export async function hfUploadUrl(contentType: string): Promise<{ upload_url: string; public_url: string; upload_headers: Record<string, string> }> {
  const r = (await hfFetch('files/generate-upload-url', { method: 'POST', body: JSON.stringify({ content_type: contentType }) })) as {
    upload_url?: string; public_url?: string; upload_headers?: Record<string, string>;
  };
  if (!r?.upload_url || !r?.public_url) throw new HfError(502, 'upload url missing');
  return { upload_url: r.upload_url, public_url: r.public_url, upload_headers: r.upload_headers || { 'Content-Type': contentType } };
}

export interface Preset { id: string; name: string; preview_url: string }
let presetCache: { at: number; items: Preset[] } | null = null;

export async function hfRestylePresets(path: string): Promise<Preset[]> {
  if (presetCache && Date.now() - presetCache.at < 10 * 60 * 1000) return presetCache.items;
  const r = (await hfFetch(path, { method: 'GET' })) as { items?: Preset[] };
  const items = (r?.items || [])
    .filter((p) => p && typeof p.id === 'string')
    .map((p) => ({ id: p.id, name: String(p.name || ''), preview_url: String(p.preview_url || '') }));
  presetCache = { at: Date.now(), items };
  return items;
}

/** The output URL of a completed request: video first, then the first image. */
export const outputUrl = (s: HfRequestStatus): string | null => s.video?.url || s.images?.[0]?.url || null;
