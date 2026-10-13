import { useState } from 'react';
import { api, inviteLink, type HostEvent } from './api';
import type { Guest } from './shared';
import { Icon } from './icons';
import { longDate } from './format';
import { smsHref, mailtoHref, inviteText, inviteSubject, inviteEmailBody, reminderText, reminderSubject, copyText, canShare } from './send';

/** Text / Email / Copy link / Share for one guest. Opens the host's own apps; marks the guest as sent. */
export default function SendButtons({ ev, guest, onSent, reminder = false }: { ev: HostEvent; guest: Guest; onSent: (g: Guest) => void; reminder?: boolean }) {
  const [copied, setCopied] = useState(false);
  const link = inviteLink(guest.code);
  const mark = (via: string) => { api.markSent(ev.id, guest.id, via).then((r) => onSent(r.guest)).catch(() => {}); };
  const smsBody = reminder ? reminderText(ev, guest.name, link) : inviteText(ev, guest.name, link);
  const subject = reminder ? reminderSubject(ev) : inviteSubject(ev);
  const mailBody = reminder ? reminderText(ev, guest.name, link) : inviteEmailBody(ev, guest.name, link);
  return (
    <div className="kv-guest-actions">
      <a className="kv-btn kv-btn--primary" href={smsHref(guest.phone, smsBody)} onClick={() => mark('text')}><Icon name="message" /> Text</a>
      <a className="kv-btn kv-btn--secondary" href={mailtoHref(guest.email, subject, mailBody)} onClick={() => mark('email')}><Icon name="mail" /> Email</a>
      <button type="button" className="kv-btn kv-btn--secondary" onClick={async () => { if (await copyText(link)) { setCopied(true); mark('copy'); window.setTimeout(() => setCopied(false), 2500); } }}>
        <Icon name={copied ? 'check' : 'copy'} /> {copied ? 'Copied' : 'Copy link'}
      </button>
      {canShare() && (
        <button type="button" className="kv-btn kv-btn--secondary" onClick={() => navigator.share({ title: subject, text: smsBody }).then(() => mark('share')).catch(() => {})}>
          <Icon name="share" /> Share
        </button>
      )}
    </div>
  );
}

export function sentLabel(g: Guest): string {
  if (!g.sentAt) return 'Not sent yet';
  const via = g.sentVia === 'text' ? 'by text' : g.sentVia === 'email' ? 'by email' : g.sentVia === 'copy' ? '(link copied)' : g.sentVia === 'share' ? '(shared)' : '';
  return `Sent ${via} on ${longDate(g.sentAt.slice(0, 10)).replace(/^\w+, /, '')}`;
}

