import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api, type HostEvent } from '../api';
import { Page, Field, Stepper, ConfirmButton, ErrorBox, useHostKey, StatusChip } from '../ui';
import { Icon } from '../icons';
import { formatPhone, LIMITS, type Guest } from '../shared';
import { countdownText, longDate } from '../format';
import SendButtons, { sentLabel } from '../SendButtons';

type Filter = 'all' | 'yes' | 'no' | 'none';

function summarize(guests: Guest[]) {
  const s = { invited: guests.length, opened: 0, coming: 0, notComing: 0, noAnswer: 0, peopleComing: 0 };
  for (const g of guests) {
    if (g.openedAt || g.status === 'yes' || g.status === 'no') s.opened++;
    if (g.status === 'yes') { s.coming++; s.peopleComing += g.partySize || 1; } else if (g.status === 'no') s.notComing++; else s.noAnswer++;
  }
  return s;
}

const shortStamp = (iso: string) => (iso ? longDate(iso.slice(0, 10)).replace(/^\w+, /, '') : '');

function GuestEdit({ ev, guest, onSaved, onCancel }: { ev: HostEvent; guest: Guest; onSaved: (g: Guest) => void; onCancel: () => void }) {
  const [name, setName] = useState(guest.name);
  const [phone, setPhone] = useState(formatPhone(guest.phone));
  const [email, setEmail] = useState(guest.email);
  const [seats, setSeats] = useState(guest.seats);
  const [answer, setAnswer] = useState<'yes' | 'no' | 'none'>(guest.status === 'yes' ? 'yes' : guest.status === 'no' ? 'no' : 'none');
  const [party, setParty] = useState(Math.max(1, guest.partySize || 1));
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const p = `kv-ge-${guest.id}`;
  return (
    <form className="kv-card" style={{ gridColumn: '1 / -1' }} onSubmit={async (e) => {
      e.preventDefault();
      setBusy(true); setErr('');
      try {
        const r = await api.updateGuest(ev.id, guest.id, { name, phone, email, seats, answer, partySize: Math.min(party, seats) });
        onSaved(r.guest);
      } catch (x) { setErr((x as Error).message); setBusy(false); }
    }}>
      <h3 style={{ marginBottom: 16 }}>Edit {guest.name}</h3>
      <ErrorBox message={err} />
      <Field id={`${p}-name`} label="Name"><input id={`${p}-name`} className="kv-input" value={name} maxLength={LIMITS.name} onChange={(e) => setName(e.target.value)} /></Field>
      <div className="kv-row2">
        <Field id={`${p}-phone`} label="Mobile phone"><input id={`${p}-phone`} className="kv-input" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
        <Field id={`${p}-email`} label="Email"><input id={`${p}-email`} className="kv-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      </div>
      <div className="kv-field">
        <span className="kv-label">How many people is this invitation for?</span>
        <div><Stepper value={seats} min={1} max={LIMITS.maxSeats} onChange={setSeats} label="People on this invitation" /></div>
      </div>
      <div className="kv-field">
        <span className="kv-label" id={`${p}-ans`}>Their answer</span>
        <p className="kv-hint">Did they tell you by phone or in person? You can record it here.</p>
        <div className="kv-btn-row" role="group" aria-labelledby={`${p}-ans`}>
          {([['yes', 'Coming'], ['no', 'Not coming'], ['none', 'No answer yet']] as const).map(([v, l]) => (
            <button key={v} type="button" className={`kv-btn ${answer === v ? 'kv-btn--primary' : 'kv-btn--secondary'}`} aria-pressed={answer === v} onClick={() => setAnswer(v)}>{l}</button>
          ))}
        </div>
      </div>
      {answer === 'yes' && (
        <div className="kv-field">
          <span className="kv-label">How many people are coming?</span>
          <div><Stepper value={Math.min(party, seats)} min={1} max={seats} onChange={setParty} label="People coming" /></div>
        </div>
      )}
      <div className="kv-btn-row">
        <button type="submit" className="kv-btn kv-btn--primary" disabled={busy}>{busy ? 'Saving...' : 'Save changes'}</button>
        <button type="button" className="kv-btn kv-btn--secondary" onClick={onCancel}>Cancel</button>
      </div>
    </form>
  );
}

export default function InvitesEvent() {
  const { ok } = useHostKey();
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const [ev, setEv] = useState<HostEvent | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [editing, setEditing] = useState('');
  const [remind, setRemind] = useState('');

  useEffect(() => {
    if (!ok) return;
    api.event(id).then((r) => { setEv(r.event); setGuests(r.guests); }).catch((e) => setError(e.message));
  }, [ok, id]);

  const s = useMemo(() => summarize(guests), [guests]);
  const shown = guests.filter((g) => filter === 'all' || (filter === 'yes' && g.status === 'yes') || (filter === 'no' && g.status === 'no') || (filter === 'none' && g.status !== 'yes' && g.status !== 'no'));
  const replace = (g: Guest) => setGuests((cur) => cur.map((x) => (x.id === g.id ? g : x)));

  if (!ok) return null;
  if (!ev) return <Page title="Guest list | Kenji Invites"><div className="kv-wrap"><ErrorBox message={error} />{!error && <p role="status">Loading...</p>}</div></Page>;

  const stats: [string, number, boolean?][] = [
    ['People coming', s.peopleComing, true], ['Invited', s.invited], ['Opened', s.opened], ['Coming', s.coming], ['Not coming', s.notComing], ['No answer yet', s.noAnswer],
  ];
  const tabs: [Filter, string, number][] = [['all', 'Everyone', s.invited], ['yes', 'Coming', s.coming], ['no', 'Not coming', s.notComing], ['none', 'No answer yet', s.noAnswer]];

  return (
    <Page title={`${ev.title} | Kenji Invites`}>
      <div className="kv-wrap">
        <p style={{ marginBottom: 14 }}><Link to="/invites/dashboard">&larr; My invitations</Link></p>
        <h1 style={{ overflowWrap: 'anywhere' }}>{ev.title}</h1>
        <p className="kv-muted" style={{ marginTop: 6 }}>{ev.date ? `${longDate(ev.date)} · ${countdownText(ev.date, ev.timezone)}` : 'No date yet'}</p>
        <div className="kv-btn-row" style={{ margin: '20px 0 28px' }}>
          <Link to={`/invites/e/${id}/edit?step=6`} className="kv-btn kv-btn--primary"><Icon name="message" /> Send invitations</Link>
          <Link to={`/invites/e/${id}/edit?step=5`} className="kv-btn kv-btn--secondary"><Icon name="plus" /> Add guests</Link>
          <Link to={`/invites/e/${id}/edit?step=1`} className="kv-btn kv-btn--secondary"><Icon name="edit" /> Edit invitation</Link>
          <Link to={`/invites/e/${id}/preview`} className="kv-btn kv-btn--secondary"><Icon name="eye" /> See it as a guest</Link>
          <button type="button" className="kv-btn kv-btn--secondary" onClick={() => api.downloadCsv(id, `${ev.title.replace(/[^\w]+/g, '-').toLowerCase()}-guests.csv`).catch((e) => setError(e.message))}>
            <Icon name="download" /> Download the list
          </button>
        </div>
        <ErrorBox message={error} />

        <h2 className="kv-sr">Numbers</h2>
        <div className="kv-stats" data-testid="stats">
          {stats.map(([label, n, key]) => (
            <div key={label} className={`kv-stat${key ? ' kv-stat--key' : ''}`} data-stat={label}>
              <b>{n}</b><span>{label}</span>
            </div>
          ))}
        </div>

        <section className="kv-card" style={{ marginTop: 28 }} aria-labelledby="kv-gl">
          <h2 id="kv-gl" style={{ marginBottom: 8 }}>Guest list</h2>
          <div className="kv-tabs" role="tablist" aria-label="Show">
            {tabs.map(([f, label, n]) => (
              <button key={f} type="button" role="tab" className="kv-tab" aria-selected={filter === f} onClick={() => setFilter(f)}>{label} ({n})</button>
            ))}
          </div>
          {shown.length === 0 && <p className="kv-muted" style={{ padding: '20px 0' }}>{guests.length === 0 ? 'No guests yet.' : 'Nobody here right now.'}</p>}
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {shown.map((g) => (
              <li key={g.id} className="kv-guest" data-testid="host-guest" data-guest={g.name}>
                {editing === g.id ? (
                  <GuestEdit ev={ev} guest={g} onCancel={() => setEditing('')} onSaved={(n) => { replace(n); setEditing(''); }} />
                ) : (
                  <>
                    <div>
                      <p className="kv-guest-name">{g.name} <StatusChip status={g.status} /></p>
                      {g.status === 'yes' && <p style={{ fontWeight: 650, marginTop: 4 }}>{g.partySize} {g.partySize === 1 ? 'person' : 'people'} coming{g.partyNames ? `: ${g.partyNames}` : ''}</p>}
                      {g.note && <p style={{ marginTop: 4 }}>Note: &ldquo;{g.note}&rdquo;</p>}
                      <p className="kv-guest-meta" style={{ marginTop: 4 }}>
                        Invited for up to {g.seats} · {g.openedAt ? `Opened ${shortStamp(g.openedAt)}` : 'Not opened yet'} · {sentLabel(g)}
                      </p>
                      <p className="kv-guest-meta">{[formatPhone(g.phone), g.email].filter(Boolean).join(' · ')}</p>
                    </div>
                    <div className="kv-guest-actions">
                      {g.status !== 'yes' && g.status !== 'no' && (
                        <button type="button" className="kv-btn kv-btn--secondary" aria-expanded={remind === g.id} onClick={() => setRemind(remind === g.id ? '' : g.id)}>
                          <Icon name="bell" /> Send a reminder
                        </button>
                      )}
                      <button type="button" className="kv-btn kv-btn--secondary" onClick={() => setEditing(g.id)}><Icon name="edit" /> Edit</button>
                      <ConfirmButton label={<><Icon name="trash" /> Remove</>} question={`Remove ${g.name}? Their link will stop working.`} confirmLabel="Yes, remove"
                        onConfirm={async () => { await api.deleteGuest(id, g.id); setGuests((cur) => cur.filter((x) => x.id !== g.id)); }} />
                    </div>
                    {remind === g.id && (
                      <div className="kv-walk" style={{ gridColumn: '1 / -1', padding: 16 }}>
                        <p style={{ marginBottom: 12 }}>A gentle reminder, ready to send from your phone or email:</p>
                        <SendButtons ev={ev} guest={g} onSent={replace} reminder />
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>

        <div style={{ marginTop: 40 }}>
          <ConfirmButton
            label={<><Icon name="trash" /> Delete this invitation</>}
            question="Delete this invitation and the whole guest list? Guests' links will stop working. This can't be undone."
            confirmLabel="Yes, delete everything"
            onConfirm={async () => { await api.deleteEvent(id); navigate('/invites/dashboard'); }}
          />
        </div>
      </div>
    </Page>
  );
}
