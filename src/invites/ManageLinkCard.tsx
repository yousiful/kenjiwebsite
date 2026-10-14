import { useState, type FormEvent } from 'react';
import { api, getLeadEmail, getToken, manageLink } from './api';
import { cleanPhone } from './shared';
import { Icon } from './icons';
import { copyText, mailtoHref, smsHref } from './send';
import QrCode from './QrCode';

/**
 * The host's private link (/invites/manage#k=<key>). The key sits in the URL fragment,
 * so it never reaches server logs or analytics. Opening it on another phone or computer
 * brings the same invitations there.
 */
export default function ManageLinkCard({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(!compact);
  const [phone, setPhone] = useState('');
  const [updates, setUpdates] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [opened, setOpened] = useState(false);
  if (!getToken()) return null;
  const link = manageLink();
  const body = `Kenji Invites: my private link to manage my wedding invitations. Open it on any phone or computer: ${link}`;
  // "Text me my link" saves the number inside Kenji Invites, then opens the host's own
  // messages app addressed to themselves, with the link ready to send.
  async function textMe(e: FormEvent) {
    e.preventDefault();
    setErr('');
    const num = cleanPhone(phone);
    if (!num) { setErr('Please type your mobile number, like (555) 123-4567.'); return; }
    setBusy(true);
    try {
      await api.saveProfile({ phone: num, consentSms: updates, source: 'private-link' });
      setOpened(true);
      window.location.href = smsHref(num, body);
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="kv-card kv-manage" aria-labelledby="kv-manage-title" data-testid="manage-card">
      <h2 id="kv-manage-title" style={{ fontSize: 26, marginBottom: 8 }}>Your private link to manage your invitations</h2>
      <p style={{ marginBottom: 10 }}>Save it so you can come back from any phone or computer. There is no password: this link is how you get back in.</p>
      <p className="kv-warn" style={{ marginBottom: 16 }}>
        <strong>Anyone with this link can manage your invitations</strong>, so only share it with people you trust.
      </p>
      <div className="kv-btn-row">
        <a className="kv-btn kv-btn--primary" href={smsHref('', body)}><Icon name="message" /> Text it to myself</a>
        <a className="kv-btn kv-btn--secondary" href={mailtoHref(getLeadEmail(), 'Kenji Invites: my private link', `${body}\n\nAnyone with this link can manage these invitations, so keep it to yourself and people you trust.`)}><Icon name="mail" /> Email it to myself</a>
        <button type="button" className="kv-btn kv-btn--secondary" onClick={async () => { if (await copyText(link)) { setCopied(true); window.setTimeout(() => setCopied(false), 2500); } }}>
          <Icon name={copied ? 'check' : 'copy'} /> {copied ? 'Copied' : 'Copy link'}
        </button>
        {!showQr && <button type="button" className="kv-btn kv-btn--secondary" onClick={() => setShowQr(true)}><Icon name="qr" /> Show QR code</button>}
      </div>
      <form className="kv-textme" onSubmit={textMe} noValidate data-testid="text-me-form">
        <h3 style={{ fontSize: 22, marginBottom: 6 }}>Get my link by text, so you never lose it</h3>
        <p className="kv-hint" style={{ marginBottom: 12 }}>Type your number and tap the button. Your phone opens a text to yourself with the link in it. Press send, and it stays in your messages.</p>
        {err && <p className="kv-error" role="alert">{err}</p>}
        {opened && <p className="kv-note" role="status" data-testid="text-me-done" style={{ marginBottom: 12 }}>Your messages app should now be open with your link in it. Press send to keep it in your texts.</p>}
        <label className="kv-label" htmlFor="kv-save-phone" style={{ display: 'block', marginBottom: 8 }}>Your mobile number</label>
        <div className="kv-textme-row">
          <input id="kv-save-phone" className="kv-input" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" aria-describedby="kv-consent" />
          <button type="submit" className="kv-btn kv-btn--primary kv-btn--big" disabled={busy || !phone.trim()}>{busy ? 'One moment...' : 'Text me my link'}</button>
        </div>
        <label className="kv-check" style={{ marginTop: 12 }}>
          <input type="checkbox" checked={updates} onChange={(e) => setUpdates(e.target.checked)} data-testid="sms-updates" />
          <span>Also send me tips and updates from Kenji Invites by text (you can skip this)</span>
        </label>
        <p id="kv-consent" className="kv-consent">We keep your number with your invitations. We only text you tips and updates if you tick the box. Msg &amp; data rates may apply. Reply STOP to opt out.</p>
      </form>
      <p className="kv-linkbox kv-sr" data-testid="manage-link">{link}</p>
      {showQr && (
        <div style={{ marginTop: 18 }}>
          <p className="kv-hint" style={{ marginBottom: 10 }}>Or scan this with another phone's camera to open your invitations there.</p>
          <QrCode text={link} label="Scan code that opens your invitations on another device" />
        </div>
      )}
    </section>
  );
}
