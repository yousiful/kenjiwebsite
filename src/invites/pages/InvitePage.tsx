import { useEffect, useRef, useState, type FormEvent } from 'react';
import { api, icsUrl, photoUrl, type GuestView, type PublicEvent } from '../api';
import InvitationCard from '../InvitationCard';
import { EnvelopeIntro, TiltCard } from '../Opening';
import { Icon } from '../icons';
import { buildIcs, googleCalendarUrl, cleanPhone, isEmail, type CalItem } from '../shared';
import { clockTime, countdownText, daysToGo, loadThemeFonts, longDate, mapsUrl, shortDate } from '../format';
import '../guest.css';

interface Data { event: PublicEvent; guest: GuestView | null; open: boolean; canChange: boolean; openSeats?: number }

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function CalendarButtons({ item, ics }: { item: CalItem; ics: string }) {
  const href = ics || `data:text/calendar;charset=utf-8,${encodeURIComponent(buildIcs(item))}`;
  return (
    <div className="kg-btns">
      <a className="kg-btn kg-btn--soft" href={href} download={ics ? undefined : 'event.ics'}><Icon name="calendar" /> Add to my calendar</a>
      <a className="kg-btn kg-btn--soft" href={googleCalendarUrl(item)} target="_blank" rel="noopener noreferrer"><Icon name="calendar" /> Google Calendar</a>
    </div>
  );
}

function Rsvp({ data, code, preview, onSaved }: { data: Data; code: string; preview: boolean; onSaved: (g: GuestView, newCode?: string) => void }) {
  const { event: ev, guest, open, canChange } = data;
  const seats = open ? data.openSeats || ev.defaultSeats || 1 : guest?.seats || 1;
  const answered = guest && (guest.status === 'yes' || guest.status === 'no');
  const [editing, setEditing] = useState(!answered);
  const [attending, setAttending] = useState<boolean | null>(answered ? guest!.status === 'yes' : null);
  const [party, setParty] = useState(Math.min(seats, guest?.partySize || seats));
  const [names, setNames] = useState(guest?.partyNames || '');
  const [note, setNote] = useState(guest?.note || '');
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { if (justSaved) doneRef.current?.focus(); }, [justSaved]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setErr('');
    if (attending === null) { setErr('Please tap Yes or No first.'); return; }
    if (preview) { setErr('This is a preview. Your guests will be able to answer here.'); return; }
    setBusy(true);
    try {
      if (open) {
        const c = contact.trim();
        const email = c.includes('@') ? c.toLowerCase() : '';
        const phone = email ? '' : c;
        if (!name.trim()) throw new Error('Please type your name.');
        if (!c || (email && !isEmail(email)) || (!email && !cleanPhone(phone))) throw new Error('Please add your phone number or email, so the couple can reach you.');
        const r = await api.openRsvp({ code, name: name.trim(), phone, email, attending, partySize: attending ? party : 0, partyNames: names, note });
        onSaved(r.guest, r.code);
      } else {
        const r = await api.rsvp({ code, attending, partySize: attending ? party : 0, partyNames: names, note });
        onSaved(r.guest);
      }
      setEditing(false);
      setJustSaved(true);
    } catch (x) {
      setErr((x as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (!editing && guest && answered) {
    const yes = guest.status === 'yes';
    return (
      <div className="kg-done" data-testid="rsvp-done">
        <h3 ref={doneRef} tabIndex={-1}>
          {yes ? `Thank you${guest.name ? `, ${guest.name}` : ''}! We can't wait to celebrate with you.` : `Thank you for letting us know${guest.name ? `, ${guest.name}` : ''}. You'll be missed.`}
        </h3>
        <p className="kg-answer">
          Your answer: <strong>{yes ? `Yes, ${guest.partySize} ${guest.partySize === 1 ? 'person' : 'people'} coming` : 'Not coming'}</strong>
        </p>
        {yes && guest.partyNames && <p>Coming: {guest.partyNames}</p>}
        {guest.note && <p>Your note: &ldquo;{guest.note}&rdquo;</p>}
        {canChange ? (
          <>
            <p className="kg-muted">Plans change. You can change your answer here any time before the wedding, using this same link.</p>
            <button type="button" className="kg-btn kg-btn--soft" onClick={() => { setEditing(true); setJustSaved(false); }}>Change my answer</button>
          </>
        ) : <p className="kg-muted">The celebration has passed, so answers are closed.</p>}
      </div>
    );
  }

  if (!canChange) return <p>The celebration has passed, so answers are closed.</p>;

  return (
    <form onSubmit={submit} noValidate>
      {open && (
        <>
          <div className="kg-field">
            <label htmlFor="kg-name">Your name</label>
            <input id="kg-name" className="kg-input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={60} />
          </div>
          <div className="kg-field">
            <label htmlFor="kg-contact">Your phone number or email</label>
            <p className="kg-hint">So the couple can reach you with any updates.</p>
            <input id="kg-contact" className="kg-input" value={contact} onChange={(e) => setContact(e.target.value)} autoComplete="email" inputMode="email" maxLength={120} />
          </div>
        </>
      )}
      <fieldset className="kg-fieldset">
        <legend className="kg-q">Will you be there?</legend>
        <div className="kg-yesno">
          <button type="button" className={`kg-choice${attending === true ? ' is-on' : ''}`} aria-pressed={attending === true} onClick={() => setAttending(true)} data-testid="rsvp-yes">
            <Icon name="heart" /> Yes, I'll be there
          </button>
          <button type="button" className={`kg-choice${attending === false ? ' is-on' : ''}`} aria-pressed={attending === false} onClick={() => setAttending(false)} data-testid="rsvp-no">
            No, I can't come
          </button>
        </div>
      </fieldset>
      {attending && (
        <>
          <div className="kg-field">
            <span className="kg-q" id="kg-party-label">How many people are coming, counting you?</span>
            <p className="kg-hint">Your invitation is for up to {seats} {seats === 1 ? 'person' : 'people'}.</p>
            {seats > 1 ? (
              <div className="kg-stepper" role="group" aria-labelledby="kg-party-label">
                <button type="button" onClick={() => setParty(Math.max(1, party - 1))} disabled={party <= 1} aria-label="One fewer person" data-testid="party-minus">&minus;</button>
                <output aria-live="polite" data-testid="party-count">{party}</output>
                <button type="button" onClick={() => setParty(Math.min(seats, party + 1))} disabled={party >= seats} aria-label="One more person" data-testid="party-plus">+</button>
              </div>
            ) : <p><strong>Just you.</strong></p>}
          </div>
          {party > 1 && (
            <div className="kg-field">
              <label htmlFor="kg-names">Who is coming with you? (you can skip this)</label>
              <input id="kg-names" className="kg-input" value={names} onChange={(e) => setNames(e.target.value)} maxLength={300} placeholder="For example: Tom and Emma" />
            </div>
          )}
        </>
      )}
      {attending !== null && (
        <div className="kg-field">
          <label htmlFor="kg-note">{attending ? 'Anything the couple should know? (you can skip this)' : 'A note for the couple (you can skip this)'}</label>
          {attending && <p className="kg-hint">For example, a food allergy.</p>}
          <textarea id="kg-note" className="kg-input kg-textarea" value={note} onChange={(e) => setNote(e.target.value)} maxLength={500} />
        </div>
      )}
      {err && <p className="kg-error" role="alert">{err}</p>}
      <button type="submit" className="kg-btn kg-btn--main" disabled={busy || attending === null} data-testid="rsvp-save">
        {busy ? 'Saving...' : 'Send my answer'}
      </button>
    </form>
  );
}

export default function InvitePage({ code: initialCode = '', previewEvent }: { code?: string; previewEvent?: PublicEvent }) {
  // inside the main site the page already has a <main>; the standalone invite.html does not
  const standalone = typeof document !== 'undefined' && !document.getElementById('main-content');
  const [code, setCode] = useState(initialCode);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState('');
  const [intro, setIntro] = useState(false);
  const preview = !!previewEvent || (typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('preview') === '1');

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!meta) { meta = document.createElement('meta'); meta.name = 'robots'; document.head.appendChild(meta); }
    meta.content = 'noindex, nofollow';
  }, []);

  useEffect(() => {
    if (previewEvent) {
      setData({ event: previewEvent, guest: { name: 'Aunt Linda', seats: Math.max(2, previewEvent.defaultSeats || 2), status: 'invited', partySize: 0, partyNames: '', note: '', respondedAt: '' }, open: false, canChange: true });
      return;
    }
    if (!initialCode) { setError("We couldn't find this invitation. Please check the link you were sent."); return; }
    api.invite(initialCode, preview)
      .then((d) => {
        setData(d);
        let seen = false;
        try { seen = sessionStorage.getItem(`kg-seen-${initialCode}`) === '1'; sessionStorage.setItem(`kg-seen-${initialCode}`, '1'); } catch { /* ignore */ }
        if (!seen && !reducedMotion() && d.event.opening !== 'fade') setIntro(true);
      })
      .catch((e) => setError(e.message));
  }, [initialCode, previewEvent, preview]);

  useEffect(() => {
    if (!data) return;
    loadThemeFonts([data.event.theme]);
    document.title = `${data.event.title} | Wedding invitation`;
  }, [data]);

  if (error) {
    return (
      <div className="kg kg--ivory">
        <div className="kg-main" role={standalone ? 'main' : undefined}><div className="kg-panel"><h1 className="kg-h">Invitation not found</h1><p>{error}</p></div></div>
      </div>
    );
  }
  if (!data) return <div className="kg kg--ivory" aria-busy="true"><p className="kg-loading" role="status">Opening your invitation...</p></div>;

  const ev = data.event;
  const motionOk = !reducedMotion();
  const fade = ev.opening === 'fade' || !motionOk;
  const theme = ev.theme;
  const pUrl = photoUrl(ev);
  const n = daysToGo(ev.date, ev.timezone);
  const place = [ev.venueName, ev.address].filter(Boolean).join(', ');
  const link = code ? `${window.location.origin}/i/${code}` : window.location.href;
  const mainItem: CalItem = { uid: ev.id, title: `Wedding of ${ev.title}`, date: ev.date, time: ev.time, timezone: ev.timezone, location: place, details: `Invitation: ${link}`, hours: 5 };

  const timeline = [
    ...ev.subEvents.map((s) => ({ key: s.id, sub: s, date: s.date, time: s.time, main: false })),
    { key: 'main', sub: null, date: ev.date, time: ev.time, main: true },
  ].sort((a, b) => (a.date || '9999') + (a.time || '') < (b.date || '9999') + (b.time || '') ? -1 : 1);

  const greeting = data.guest?.name ? `Dear ${data.guest.name},` : data.open ? "You're invited" : '';
  const initials = `${ev.coupleNames[0].charAt(0)}${ev.coupleNames[1].charAt(0)}`.toUpperCase();

  return (
    <div className={`kg kg--${theme}`}>
      {intro && <EnvelopeIntro data={{ ...ev, photoUrl: pUrl }} initials={initials} onDone={() => setIntro(false)} />}
      {preview && <p className="kg-previewbar">Preview: this is what your guests see. Answers here are not saved.</p>}
      <div className="kg-main" role={standalone ? 'main' : undefined}>
        {greeting && <p className="kg-greet">{greeting}</p>}
        <div className={`kg-card${!intro && fade ? ' kg-fadein' : ''}`}>
          <TiltCard enabled={motionOk}>
            <InvitationCard data={{ ...ev, photoUrl: pUrl }} minText={18} />
          </TiltCard>
        </div>

        {n !== null && (
          <p className="kg-count" data-testid="countdown">
            {n > 1 ? <><b>{n.toLocaleString()}</b> days to go</> : countdownText(ev.date, ev.timezone)}
          </p>
        )}

        <section className="kg-panel" aria-labelledby="kg-details">
          <h2 className="kg-h" id="kg-details">The details</h2>
          <div className="kg-detail">
            <Icon name="clock" className="kg-ic" />
            <div>
              <p className="kg-strong">{ev.date ? longDate(ev.date) : 'Date to come'}</p>
              {ev.time && <p>{clockTime(ev.time)}</p>}
              {ev.date && <CalendarButtons item={mainItem} ics={code && !preview ? icsUrl(code, 'main') : ''} />}
            </div>
          </div>
          {place && (
            <div className="kg-detail">
              <Icon name="map" className="kg-ic" />
              <div>
                {ev.venueName && <p className="kg-strong">{ev.venueName}</p>}
                {ev.address && <p>{ev.address}</p>}
                <div className="kg-btns">
                  <a className="kg-btn kg-btn--soft" href={mapsUrl(ev.venueName, ev.address)} target="_blank" rel="noopener noreferrer"><Icon name="map" /> Open in Maps</a>
                </div>
              </div>
            </div>
          )}
          {ev.rsvpBy && <p className="kg-note">Please let the couple know if you can come by <strong>{longDate(ev.rsvpBy)}</strong>.</p>}
        </section>

        {ev.subEvents.length > 0 && (
          <section className="kg-panel" aria-labelledby="kg-what">
            <h2 className="kg-h" id="kg-what">What's happening</h2>
            <ol className="kg-timeline">
              {timeline.map((t) => {
                const s = t.sub;
                const title = s ? s.title : 'The wedding';
                const venue = s ? s.venueName : ev.venueName;
                const address = s ? s.address : ev.address;
                const item: CalItem = s
                  ? { uid: `${ev.id}-${s.id}`, title: `${s.title}: ${ev.title}`, date: s.date || ev.date, time: s.time, timezone: ev.timezone, location: [s.venueName, s.address].filter(Boolean).join(', '), details: [s.notes, `Invitation: ${link}`].filter(Boolean).join('\n'), hours: 3 }
                  : mainItem;
                return (
                  <li key={t.key} className={`kg-step${t.main ? ' kg-step--main' : ''}`} data-testid="timeline-item">
                    <span className="kg-dot" aria-hidden="true" />
                    <p className="kg-when">{t.date ? shortDate(t.date) : 'Date to come'}{t.time ? ` · ${clockTime(t.time)}` : ''}</p>
                    <h3 className="kg-step-title">{title}</h3>
                    {(venue || address) && <p>{[venue, address].filter(Boolean).join(', ')}</p>}
                    {s?.notes && <p className="kg-muted">{s.notes}</p>}
                    <div className="kg-btns">
                      {t.date && <CalendarButtons item={item} ics={code && !preview ? icsUrl(code, s ? s.id : 'main') : ''} />}
                      {(venue || address) && <a className="kg-btn kg-btn--soft" href={mapsUrl(venue, address)} target="_blank" rel="noopener noreferrer"><Icon name="map" /> Map</a>}
                    </div>
                  </li>
                );
              })}
            </ol>
          </section>
        )}

        <section className="kg-panel kg-rsvp" id="reply" aria-labelledby="kg-reply">
          <h2 className="kg-h" id="kg-reply">Please reply</h2>
          <p className="kg-muted" style={{ marginBottom: 18 }}>Let the couple know if you can come. (This is your RSVP. It takes less than a minute.)</p>
          <Rsvp
            data={data}
            code={code}
            preview={preview}
            onSaved={(g, newCode) => {
              if (newCode) {
                setCode(newCode);
                window.history.replaceState(null, '', `/i/${newCode}`);
                setData({ ...data, guest: g, open: false });
              } else setData({ ...data, guest: g });
            }}
          />
          {data.open && !data.guest && <p className="kg-muted" style={{ marginTop: 16 }}>After you reply, you'll get your own link so you can change your answer later.</p>}
        </section>

        <p className="kg-foot">Made with <a href="/invites">Kenji Invites</a>, free wedding invitations.</p>
      </div>
    </div>
  );
}
