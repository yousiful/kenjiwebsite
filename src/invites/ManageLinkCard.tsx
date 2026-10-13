import { useState, type FormEvent } from 'react';
import { api, getLeadEmail, getToken, manageLink } from './api';
import { formatPhone } from './shared';
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
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [sentTo, setSentTo] = useState('');
  if (!getToken()) return null;
  const link = manageLink();
  async function textMe(e: FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await api.savePhone(phone);
      setSentTo(formatPhone(phone.replace(/[^\d+]/g, '')) || phone);
      setPhone('');
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const body = `My private link to manage my Kenji Invites wedding invitations. Open it on any phone or computer: ${link}`;
  return (
    <section className="kv-card kv-manage" aria-labelledby="kv-manage-title" data-testid="manage-card">
      <h2 id="kv-manage-title" style={{ fontSize: 26, marginBottom: 8 }}>Your private link to manage your invitations</h2>
      <p style={{ marginBottom: 10 }}>Save it so you can come back from any phone or computer. There is no password: this link is how you get back in.</p>
      <p className="kv-warn" style={{ marginBottom: 16 }}>
        <strong>Anyone with this link can manage your invitations</strong>, so only share it with people you trust.
      </p>
      <div className="kv-btn-row">
        <a className="kv-btn kv-btn--primary" href={smsHref('', body)}><Icon name="message" /> Text it to myself</a>
        <a className="kv-btn kv-btn--secondary" href={mailtoHref(getLeadEmail(), 'My Kenji Invites private link', `${body}\n\nAnyone with this link can manage these invitations, so keep it to yourself and people you trust.`)}><Icon name="mail" /> Email it to myself</a>
        <button type="button" className="kv-btn kv-btn--secondary" onClick={async () => { if (await copyText(link)) { setCopied(true); window.setTimeout(() => setCopied(false), 2500); } }}>
          <Icon name={copied ? 'check' : 'copy'} /> {copied ? 'Copied' : 'Copy link'}
        </button>
        {!showQr && <button type="button" className="kv-btn kv-btn--secondary" onClick={() => setShowQr(true)}><Icon name="qr" /> Show QR code</button>}
      </div>
      <form className="kv-textme" onSubmit={textMe} noValidate data-testid="text-me-form">
        <h3 style={{ fontSize: 22, marginBottom: 6 }}>Get my link by text, so you never lose it</h3>
        <p className="kv-hint" style={{ marginBottom: 12 }}>If you ever lose it, you can get it again at kenjiai.com/invites/find with the same number.</p>
        {sentTo ? (
          <p className="kv-note" role="status" data-testid="text-me-done">Done. We texted your private link to <strong>{sentTo}</strong>. Keep that text, it's your way back in.</p>
        ) : (
          <>
            {err && <p className="kv-error" role="alert">{err}</p>}
            <label className="kv-label" htmlFor="kv-save-phone" style={{ display: 'block', marginBottom: 8 }}>Your mobile number</label>
            <div className="kv-textme-row">
              <input id="kv-save-phone" className="kv-input" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" aria-describedby="kv-consent" />
              <button type="submit" className="kv-btn kv-btn--primary kv-btn--big" disabled={busy || !phone.trim()}>{busy ? 'Sending...' : 'Text me my link'}</button>
            </div>
            <p id="kv-consent" className="kv-consent">By tapping Text me my link, you agree to receive this text from Kenji Invites. Msg &amp; data rates may apply. Reply STOP to opt out.</p>
          </>
        )}
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
