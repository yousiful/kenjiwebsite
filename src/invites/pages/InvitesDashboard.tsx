import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, getToken, cardOf, type HostEvent, type Summary } from '../api';
import { Page, ErrorBox } from '../ui';
import ManageLinkCard from '../ManageLinkCard';
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
  const ok = !!getToken();
  const [events, setEvents] = useState<Row[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ok) { setEvents([]); return; }
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
          </div>
          <Link to="/invites/new" className="kv-btn kv-btn--primary kv-btn--big"><Icon name="plus" /> Make a new invitation</Link>
        </div>
        <ErrorBox message={error} />
        {events === null && !error && <p className="kv-muted" role="status">Loading your invitations...</p>}
        {events && events.length === 0 && (
          <div className="kv-card kv-empty">
            <h2 style={{ marginBottom: 10 }}>No invitations on this device yet</h2>
            <p className="kv-muted" style={{ marginBottom: 22 }}>It takes about 10 minutes to make one. You can stop any time and come back; everything saves as you go.</p>
            <Link to="/invites/new" className="kv-btn kv-btn--primary kv-btn--big">Make my invitation</Link>
            {!ok && <p style={{ marginTop: 18 }}><Link to="/invites/find">Lost your invitations? Here's how to find them</Link></p>}
          </div>
        )}
        {events && events.length > 0 && (
          <ul className="kv-events" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {events.map((ev) => (
              <li key={ev.id} className="kv-card kv-event">
                <div className="kv-event-thumb" aria-hidden="true">
                  <InvitationCard data={cardOf(ev)} />
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
        {ok && events && events.length > 0 && <div style={{ marginTop: 32 }}><ManageLinkCard /></div>}
        {!ok && (
          <div className="kv-card" style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: 24, marginBottom: 8 }}>Made an invitation on another phone or computer?</h2>
            <p style={{ marginBottom: 16 }}>Open the private link you saved there (from your texts or email) on this device, and your invitations will show up here.</p>
            <Link to="/invites/find" className="kv-btn kv-btn--secondary">Lost your link? Here's how to get it back</Link>
          </div>
        )}
      </div>
    </Page>
  );
}
