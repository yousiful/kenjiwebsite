import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Page, ErrorBox } from '../ui';

/** /invites/find: text the private link(s) saved to a phone number. Never says whether a number exists. */
export default function InvitesFind() {
  const [phone, setPhone] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const r = await api.findByPhone(phone);
      setDone(r.message);
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page title="Find my invitations | Kenji Invites">
      <div className="kv-wrap">
        <div className="kv-narrow kv-card" style={{ padding: 'clamp(22px, 5vw, 40px)' }}>
          <h1 style={{ marginBottom: 12 }}>Lost your invitations?</h1>
          {done ? (
            <div role="status" data-testid="find-done">
              <p className="kv-note" style={{ marginBottom: 18, fontWeight: 650 }}>{done}</p>
              <p style={{ marginBottom: 22 }}>Open the link in that text on this phone or computer, and your invitations will be right there.</p>
              <div className="kv-btn-row">
                <button type="button" className="kv-btn kv-btn--secondary" onClick={() => setDone('')}>Try another number</button>
                <Link to="/invites" className="kv-btn kv-btn--quiet">Back to Kenji Invites</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate>
              <p className="kv-muted" style={{ marginBottom: 24 }}>Enter the phone number you saved and we'll text you your private link.</p>
              <ErrorBox message={err} />
              <div className="kv-field">
                <label className="kv-label" htmlFor="kv-find-phone">Your mobile number</label>
                <input id="kv-find-phone" className="kv-input" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" aria-describedby="kv-find-consent" />
              </div>
              <button type="submit" className="kv-btn kv-btn--primary kv-btn--big kv-btn--block" disabled={busy || !phone.trim()}>{busy ? 'Sending...' : 'Text me my link'}</button>
              <p id="kv-find-consent" className="kv-consent">By tapping Text me my link, you agree to receive this text from Kenji Invites. Msg &amp; data rates may apply. Reply STOP to opt out.</p>
              <p className="kv-muted" style={{ marginTop: 22 }}>Didn't save a number? Look for the private link you texted or emailed to yourself, and open it on this device.</p>
            </form>
          )}
        </div>
      </div>
    </Page>
  );
}
