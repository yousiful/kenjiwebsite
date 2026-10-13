import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, getEmail, photoUrl, signOut, type HostEvent, type Summary } from '../api';
import { Page, useRequireAuth, ErrorBox } from '../ui';
import { Icon } from '../icons';
import InvitationCard from '../InvitationCard';
import { daysToGo, longDate, loadThemeFonts } from '../format';

type Row = HostEvent & { summary: Summary };

function daysLabel(ev: HostEvent): string {
  const n = daysToGo(ev.date, ev.timezone);
  if (n === null) return 'No date yet';
  if (n > 1) return `${n} days to go`;
  if (n === 1) return 'Tomorrow';
  if (n === 0) return 'Today';
  return 'Already happened';
}

export default function InvitesDashboard() {
  const ok = useRequireAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Row[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ok) return;
    api.events()
      .then((r) => { setEvents(r.events); loadThemeFonts([...new Set(r.events.map((e) => e.theme))]); })
      .catch((e) => setError(e.message));
  }, [ok]);

  return (
    <Page title="My invitations | Kenji Invites">
      <div className="kv-wrap">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <div>
            <h1>My invitations</h1>
            {getEmail() && <p className="kv-muted" style={{ marginTop: 6, overflowWrap: 'anywhere' }}>Signed in as {getEmail()}</p>}
          </div>
          <Link to="/invites/new" className="kv-btn kv-btn--primary kv-btn--big"><Icon name="plus" /> Make a new invitation</Link>
        </div>
        <ErrorBox message={error} />
        {events === null && !error && <p className="kv-muted" role="status">Loading your invitations...</p>}
        {events && events.length === 0 && (
          <div className="kv-card kv-empty">
            <h2 style={{ marginBottom: 10 }}>No invitations yet</h2>
            <p className="kv-muted" style={{ marginBottom: 22 }}>It takes about 10 minutes to make one. You can stop any time and come back; everything saves as you go.</p>
            <Link to="/invites/new" className="kv-btn kv-btn--primary kv-btn--big">Make my invitation</Link>
          </div>
        )}
        {events && events.length > 0 && (
          <ul className="kv-events" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {events.map((ev) => (
              <li key={ev.id} className="kv-card kv-event">
                <div className="kv-event-thumb" aria-hidden="true">
                  <InvitationCard data={{ ...ev, photoUrl: photoUrl(ev) }} />
                </div>
                <div>
                  <h3>{ev.title || 'Untitled'}</h3>
                  <p className="kv-muted" style={{ marginTop: 4 }}>{ev.date ? longDate(ev.date) : 'No date yet'}</p>
                  <p style={{ fontWeight: 700, marginTop: 4 }}>{daysLabel(ev)}</p>
                  <p style={{ marginTop: 8 }}>
                    <strong>{ev.summary.peopleComing}</strong> {ev.summary.peopleComing === 1 ? 'person' : 'people'} coming
                    {' '}<span className="kv-muted">/ {ev.summary.invited} invited</span>
                  </p>
                  <div className="kv-btn-row" style={{ marginTop: 14 }}>
                    <Link to={`/invites/e/${ev.id}`} className="kv-btn kv-btn--primary">See guest list</Link>
                    <Link to={`/invites/e/${ev.id}/edit?step=1`} className="kv-btn kv-btn--secondary">Edit</Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p style={{ marginTop: 40 }}>
          <button type="button" className="kv-btn kv-btn--secondary" onClick={() => { signOut(); navigate('/invites'); }}>Sign out</button>
        </p>
      </div>
    </Page>
  );
}
