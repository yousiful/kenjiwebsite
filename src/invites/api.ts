import type { InviteEvent, Guest } from './shared';

const API = '/.netlify/functions/invites-api';
const AUTH = '/.netlify/functions/invites-auth';
const TOKEN_KEY = 'kenji-invites-token';
const EMAIL_KEY = 'kenji-invites-email';

export function getToken(): string {
  try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; }
}
export function getEmail(): string {
  try { return localStorage.getItem(EMAIL_KEY) || ''; } catch { return ''; }
}
export function setSession(token: string, email: string) {
  try { localStorage.setItem(TOKEN_KEY, token); localStorage.setItem(EMAIL_KEY, email); } catch { /* private mode */ }
}
export function signOut() {
  try { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(EMAIL_KEY); } catch { /* ignore */ }
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}

async function call<T>(url: string, init: RequestInit = {}, auth = true): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;
  let res: Response;
  try {
    res = await fetch(url, { ...init, headers: { ...headers, ...(init.headers as Record<string, string> || {}) } });
  } catch {
    throw new ApiError('We could not reach the internet. Please check your connection and try again.', 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && auth) signOut();
    throw new ApiError(data?.error || 'Something went wrong. Please try again.', res.status);
  }
  return data as T;
}

const post = <T>(op: string, body: unknown, auth = true) => call<T>(`${API}?op=${op}`, { method: 'POST', body: JSON.stringify(body) }, auth);
const get = <T>(op: string, params: Record<string, string> = {}, auth = true) => call<T>(`${API}?${new URLSearchParams({ op, ...params })}`, {}, auth);

export type HostEvent = InviteEvent;
export interface Summary { invited: number; opened: number; coming: number; notComing: number; noAnswer: number; peopleComing: number; sent: number }
export type PublicEvent = Omit<InviteEvent, 'openLinkEnabled' | 'openCode' | 'createdAt' | 'updatedAt'>;
export interface GuestView { name: string; seats: number; status: Guest['status']; partySize: number; partyNames: string; note: string; respondedAt: string }

export const api = {
  sendCode: (email: string) => call<{ ok: boolean; devCode?: string }>(`${AUTH}?op=send`, { method: 'POST', body: JSON.stringify({ email }) }, false),
  verifyCode: (email: string, code: string) => call<{ token: string; email: string }>(`${AUTH}?op=verify`, { method: 'POST', body: JSON.stringify({ email, code }) }, false),

  events: () => get<{ email: string; events: (HostEvent & { summary: Summary })[] }>('events'),
  event: (id: string) => get<{ event: HostEvent; guests: Guest[]; summary: Summary }>('event', { id }),
  createEvent: (fields: Partial<HostEvent>) => post<{ event: HostEvent }>('create-event', fields),
  updateEvent: (id: string, fields: Partial<HostEvent>) => post<{ event: HostEvent }>('update-event', { id, ...fields }),
  deleteEvent: (id: string) => post<{ ok: boolean }>('delete-event', { id }),
  uploadPhoto: (id: string, data: string) => post<{ event: HostEvent }>('photo-upload', { id, data }),
  deletePhoto: (id: string) => post<{ event: HostEvent }>('photo-delete', { id }),
  addGuests: (id: string, payload: { guests?: Partial<Guest>[]; text?: string }) => post<{ added: Guest[]; problems: string[] }>('add-guests', { id, ...payload }),
  updateGuest: (id: string, guestId: string, fields: Record<string, unknown>) => post<{ guest: Guest }>('update-guest', { id, guestId, ...fields }),
  deleteGuest: (id: string, guestId: string) => post<{ ok: boolean }>('delete-guest', { id, guestId }),
  markSent: (id: string, guestId: string, via: string) => post<{ guest: Guest }>('mark-sent', { id, guestId, via }),
  async downloadCsv(id: string, filename: string) {
    const res = await fetch(`${API}?op=csv&id=${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${getToken()}` } });
    if (!res.ok) throw new ApiError('We could not make the file. Please try again.', res.status);
    const blob = await res.blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  },

  invite: (code: string, preview = false) => get<{ event: PublicEvent; guest: GuestView | null; open: boolean; canChange: boolean; openSeats?: number }>('invite', preview ? { code, preview: '1' } : { code }, false),
  rsvp: (body: { code: string; attending: boolean; partySize: number; partyNames: string; note: string }) => post<{ ok: boolean; guest: GuestView }>('rsvp', body, false),
  openRsvp: (body: { code: string; name: string; phone: string; email: string; attending: boolean; partySize: number; partyNames: string; note: string }) => post<{ ok: boolean; code: string; guest: GuestView }>('open-rsvp', body, false),
};

export const photoUrl = (e: { id: string; photo: boolean; photoVersion: number }) => (e.photo ? `${API}?op=photo&e=${e.id}&v=${e.photoVersion}` : '');
export const icsUrl = (code: string, sub = 'main') => `${API}?op=ics&code=${encodeURIComponent(code)}&sub=${encodeURIComponent(sub)}`;
export const inviteLink = (code: string) => `${window.location.origin}/i/${code}`;
