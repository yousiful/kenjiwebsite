import { useState } from 'react';
import { getLeadEmail, getToken, manageLink } from './api';
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
  if (!getToken()) return null;
  const link = manageLink();
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
