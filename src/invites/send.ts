import { longDate } from './format';

// Invitations go out from the host's own phone and email: these build the
// prefilled links. Nothing here sends anything through our servers.

export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

/** iOS wants `sms:NUMBER&body=`, Android and others `sms:NUMBER?body=`. */
export function smsHref(phone: string, body: string): string {
  return `sms:${phone || ''}${isIOS() ? '&' : '?'}body=${encodeURIComponent(body)}`;
}

export function mailtoHref(email: string, subject: string, body: string): string {
  return `mailto:${encodeURIComponent(email || '').replace(/%40/g, '@')}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const firstName = (name: string) => name.trim().split(/\s+/)[0] || name;

interface EvLike { title: string; date: string; rsvpBy: string }

export function inviteText(ev: EvLike, guestName: string, link: string): string {
  const hi = guestName ? `Hi ${firstName(guestName)}, ` : 'Hi, ';
  const when = ev.date ? ` on ${longDate(ev.date)}` : '';
  return `${hi}you're invited to the wedding of ${ev.title}${when}. Here is your invitation, where you can also tell us if you can come: ${link}`;
}

export function inviteSubject(ev: EvLike): string {
  return `You're invited: the wedding of ${ev.title}`;
}

export function inviteEmailBody(ev: EvLike, guestName: string, link: string): string {
  const hi = guestName ? `Dear ${firstName(guestName)},` : 'Hello,';
  const when = ev.date ? ` on ${longDate(ev.date)}` : '';
  const by = ev.rsvpBy ? `\n\nPlease let us know if you can come by ${longDate(ev.rsvpBy)}.` : '';
  return `${hi}\n\nYou're invited to the wedding of ${ev.title}${when}.\n\nYour invitation, with all the details and a simple way to tell us if you can come, is here:\n${link}${by}\n\nWith love`;
}

export function reminderText(ev: EvLike, guestName: string, link: string): string {
  const hi = guestName ? `Hi ${firstName(guestName)}, ` : 'Hi, ';
  const by = ev.rsvpBy ? ` by ${longDate(ev.rsvpBy)}` : '';
  return `${hi}a gentle reminder about the wedding of ${ev.title}${ev.date ? ` on ${longDate(ev.date)}` : ''}. We'd love to know if you can come${by}. You can answer here in a minute: ${link}`;
}

export function reminderSubject(ev: EvLike): string {
  return `A gentle reminder: the wedding of ${ev.title}`;
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

export const canShare = () => typeof navigator !== 'undefined' && typeof navigator.share === 'function';
