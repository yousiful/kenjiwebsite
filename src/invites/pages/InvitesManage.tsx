import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HOST_KEY_RE, setHostKey } from '../api';
import { Page } from '../ui';

/**
 * /invites/manage#k=<key>: the host's private link. The key is read from the URL
 * fragment (never sent to the server or analytics), saved on this device, and
 * removed from the address bar before going to My invitations.
 */
export default function InvitesManage() {
  const navigate = useNavigate();
  // read once, so a re-run of the effect can't see the already-cleaned address bar
  const [key] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get('k') || '');
  const bad = !HOST_KEY_RE.test(key);
  useEffect(() => {
    window.history.replaceState(null, '', '/invites/manage');
    if (bad) return;
    setHostKey(key);
    navigate('/invites/dashboard', { replace: true });
  }, [key, bad, navigate]);
  return (
    <Page title="Opening your invitations | Kenji Invites">
      <div className="kv-wrap">
        <div className="kv-narrow kv-card">
          {bad ? (
            <>
              <h1 style={{ marginBottom: 12 }}>This link didn't work</h1>
              <p style={{ marginBottom: 20 }}>Part of the link may be missing. Please open the full private link you saved, or copy it again from the phone or computer where you made your invitation.</p>
              <Link to="/invites" className="kv-btn kv-btn--secondary">Go to Kenji Invites</Link>
            </>
          ) : <p role="status">Opening your invitations...</p>}
        </div>
      </div>
    </Page>
  );
}
