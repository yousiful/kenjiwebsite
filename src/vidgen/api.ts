import type { GenInput, GoalId, ModelId, PlanId, Shot } from './models';

const API = '/.netlify/functions/vidgen-api';
const WRITE = '/.netlify/functions/vidgen-write-prompt';
const BILLING = '/.netlify/functions/vidgen-billing';
export const SIGN_IN = '/.netlify/functions/vidgen-auth-start';

export class ApiError extends Error {
  status: number;
  data: Record<string, unknown>;
  constructor(message: string, status: number, data: Record<string, unknown> = {}) {
    super(message);
    this.status = status;
    this.data = data;
  }
  get notConnected() { return typeof this.data.notConnected === 'string'; }
}

async function call<T>(url: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, { credentials: 'same-origin', ...init, headers: { 'Content-Type': 'application/json', ...((init.headers as Record<string, string>) || {}) } });
  } catch {
    throw new ApiError('We could not reach the internet. Check your connection and try again.', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data?.error || 'Something went wrong. Please try again.', res.status, data || {});
  return data as T;
}

const post = <T>(url: string, body: unknown) => call<T>(url, { method: 'POST', body: JSON.stringify(body) });

export interface Me {
  user: null | { email: string; name: string; picture: string; plan: PlanId | null; subStatus: string; balance: number; genjutsu: boolean };
  setup: { signin: boolean; generation: boolean; billing: boolean; database: boolean };
}

export interface GenItem {
  id: string; title: string; goal: GoalId; model: ModelId; modelLabel: string; prompt: string; status: string;
  credits: number; aspect: string | null; seconds: number; createdAt: string; error: string | null;
  ready: boolean; stored: boolean; mediaUrl: string | null;
}

export interface Preset { id: string; name: string; preview_url: string }

export const api = {
  me: () => call<Me>(`${API}?op=me`),
  logout: () => post<{ ok: true }>(`${API}?op=logout`, {}),
  list: () => call<{ items: GenItem[]; balance: number }>(`${API}?op=list`),
  presets: () => call<{ items: Preset[] }>(`${API}?op=presets`),
  estimate: (input: GenInput) => post<{ credits: number; seconds: number }>(`${API}?op=estimate`, { input }),
  generate: (input: GenInput, expectCredits?: number) => post<{ item: GenItem; balance: number }>(`${API}?op=generate`, { input, expectCredits }),
  cancel: (id: string) => post<{ ok: true; balance: number }>(`${API}?op=cancel`, { id }),
  writePrompt: (body: { goal: GoalId; answers: Record<string, string>; model: ModelId; duration: number; aspect: string; hasImage: boolean }) =>
    post<{ prompt: string; shots: Shot[] }>(WRITE, body),
  checkout: (body: { plan?: PlanId; topup?: boolean }) => post<{ url: string }>(`${BILLING}?op=checkout`, body),
  portal: () => post<{ url: string }>(`${BILLING}?op=portal`, {}),
};

/** Gets a presigned Higgsfield URL from our API, PUTs the file there, returns the public URL to send back. */
export async function uploadFile(file: File, kind: 'image' | 'video', onProgress?: (pct: number) => void): Promise<string> {
  const type = file.type === 'image/jpg' ? 'image/jpeg' : file.type;
  const u = await post<{ upload_url: string; public_url: string; upload_headers: Record<string, string> }>(`${API}?op=upload-url`, { contentType: type, kind });
  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', u.upload_url);
    for (const [k, v] of Object.entries(u.upload_headers || {})) xhr.setRequestHeader(k, v);
    xhr.upload.onprogress = (e) => { if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100)); };
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new ApiError('The upload did not go through. Please try again.', xhr.status)));
    xhr.onerror = () => reject(new ApiError('The upload did not go through. Please check your connection and try again.', 0));
    xhr.send(file);
  });
  return u.public_url;
}

/** Downloads a finished video in 4 MB ranges (each server response is one chunk), then saves it. */
export async function downloadVideo(item: GenItem, onProgress?: (pct: number) => void): Promise<void> {
  if (!item.mediaUrl) return;
  const parts: BlobPart[] = [];
  let start = 0;
  let total = Infinity;
  let type = 'video/mp4';
  while (start < total) {
    const res = await fetch(item.mediaUrl, { credentials: 'same-origin', headers: { Range: `bytes=${start}-` } });
    if (res.status === 200) {
      // not stored in chunks yet (or small): whole file in one go
      const b = await res.blob();
      parts.push(b);
      type = b.type || type;
      break;
    }
    if (res.status !== 206) throw new ApiError('The download did not work. Please try again.', res.status);
    const m = /\/(\d+)$/.exec(res.headers.get('content-range') || '');
    total = m ? Number(m[1]) : start;
    type = res.headers.get('content-type') || type;
    const buf = await res.arrayBuffer();
    if (!buf.byteLength) break;
    parts.push(buf);
    start += buf.byteLength;
    if (onProgress && Number.isFinite(total)) onProgress(Math.round((start / total) * 100));
  }
  const blob = new Blob(parts, { type });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `kenji-studio-${item.id.slice(0, 8)}.mp4`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 30000);
}
