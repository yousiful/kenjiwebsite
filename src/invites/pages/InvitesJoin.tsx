import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ensureHostKey } from '../api';
import { Page } from '../ui';

/**
 * /invites/join#t=<token>: a one-time co-host link. This device gets its own private
 * host key (created if needed) and is added as a host of the event.
 */
export default function InvitesJoin() {
  const navigate = useNavigate();
  const [token] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get('t') || '');
  const [error, setError] = useState('');
  useEffect(() => {
    window.history.replaceState(null, '', '/invites/join');
    let alive = true;
    (async () => {
      try {
        if (!token) throw new Error("This co-host link doesn't look complete. Please open the whole link you were sent.");
        await ensureHostKey();
        const r = await api.joinAsCohost(token);
        if (alive) navigate(`/invites/e/${r.eventId}`, { replace: true });
      } catch (e) {
        if (alive) setError((e as Error).message);
      }
    })();
    return () => { alive = false; };
  }, [token, navigate]);
  return (
    <Page title="Joining as a co-host | Kenji Invites">
      <div className="kv-wrap">
        <div className="kv-narrow kv-card">
          {error ? (
            <>
              <h1 style={{ marginBottom: 12 }}>This link didn't work</h1>
              <p style={{ marginBottom: 20 }} role="alert">{error}</p>
              <Link to="/invites/dashboard" className="kv-btn kv-btn--secondary">Go to my invitations</Link>
            </>
          ) : <p role="status">Adding you as a host of this invitation...</p>}
        </div>
      </div>
    </Page>
  );
}
