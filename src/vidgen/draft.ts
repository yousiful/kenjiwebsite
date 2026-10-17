import type { Aspect, GoalId, ModelId, Shot } from './models';

/**
 * The signed-out studio draft, saved right before the Google sign-in redirect and
 * restored on /video-generation?resume=1. Text settings go to localStorage; a picture
 * the visitor picked goes to IndexedDB as a Blob. Pictures are only uploaded after
 * sign-in (no anonymous uploads), so the draft never holds an upload URL.
 */

const KEY = 'kenji-studio-draft';
const DB = 'kenji-studio';
const STORE = 'draft';
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

export interface Draft {
  v: 1;
  savedAt: number;
  goal: GoalId;
  answers: Record<string, string>;
  prompt: string;
  shots: Shot[];
  useShots: boolean;
  model: ModelId;
  duration: number;
  aspect: Aspect;
  sound: boolean;
  hasImage: boolean;
  imageName?: string;
  autoGenerate: boolean;
}

function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB, 1);
    r.onupgradeneeded = () => r.result.createObjectStore(STORE);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

async function idbDo<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T | undefined> {
  const db = await idb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => { db.close(); resolve(req.result as T); };
    tx.onerror = () => { db.close(); reject(tx.error); };
  });
}

export async function saveDraft(d: Omit<Draft, 'v' | 'savedAt'>, image: File | null): Promise<void> {
  try {
    if (image) await idbDo('readwrite', (s) => s.put(image, 'image'));
    else await idbDo('readwrite', (s) => s.delete('image'));
  } catch {
    /* private mode without IndexedDB: the picture has to be picked again */
  }
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...d, v: 1, savedAt: Date.now() }));
  } catch {
    /* storage blocked: the visitor answers again after sign-in */
  }
}

export function readDraft(now = Date.now()): Draft | null {
  try {
    const d = JSON.parse(localStorage.getItem(KEY) || 'null') as Draft | null;
    if (!d || d.v !== 1 || now - d.savedAt > MAX_AGE_MS) return null;
    return d;
  } catch {
    return null;
  }
}

export async function readDraftImage(): Promise<File | null> {
  try {
    const b = await idbDo<Blob>('readonly', (s) => s.get('image'));
    if (!b) return null;
    return b instanceof File ? b : new File([b], 'picture', { type: b.type });
  } catch {
    return null;
  }
}

export async function clearDraft(): Promise<void> {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  try { await idbDo('readwrite', (s) => s.delete('image')); } catch { /* ignore */ }
}
