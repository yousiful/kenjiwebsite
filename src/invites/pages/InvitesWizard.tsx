import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api, photoUrl, inviteLink, getLeadEmail, type HostEvent } from '../api';
import ManageLinkCard from '../ManageLinkCard';
import { Page, Field, Stepper, SavedNote, ConfirmButton, ErrorBox, useHostKey, StatusChip } from '../ui';
import { Icon } from '../icons';
import InvitationCard, { THEMES, ACCENTS } from '../InvitationCard';
import { THEME_IDS, SUB_EVENT_PRESETS, LIMITS, formatPhone, isEmail, type Guest, type SubEvent, type ThemeId } from '../shared';
import { browserTimezone, loadThemeFonts } from '../format';
import { smsHref, inviteText, copyText } from '../send';
import QrCode from '../QrCode';
import SendButtons, { sentLabel } from '../SendButtons';

// Every step is a plain question with one sentence of help, so nobody wonders whose names
// or which people a step is about.
const STEPS = ['Whose wedding is it?', 'When and where is the wedding?', 'How should your invitation look?', 'Any other events around the wedding?', 'Who are you inviting?', 'How do you want to send it?'];
const HELP = [
  'Type the names of the two people getting married. These go at the top of the invitation.',
  'Pick the wedding date and start time, and tell your guests where to go.',
  'Tap a design to try it. You can also add a photo, a short note and how it opens.',
  "Having a rehearsal dinner, a party or a brunch? Add it and guests will see it with the dates. You can skip this step.",
  "Add your guests (the people you're inviting), one at a time or as a list.",
  "Each guest gets their own link. Send it by text or email from your own phone.",
];

const blankEvent = (): HostEvent => ({
  id: '', coupleNames: ['', ''], title: '', date: '', time: '', timezone: browserTimezone(), venueName: '', address: '',
  theme: 'ivory', accent: '', photo: false, photoVersion: 0, personalMessage: '', opening: 'envelope', rsvpBy: '', defaultSeats: 2,
  openLinkEnabled: false, openCode: '', subEvents: [], createdAt: '', updatedAt: '',
});

const US_ZONES = [
  ['America/New_York', 'Eastern time (New York)'],
  ['America/Chicago', 'Central time (Chicago)'],
  ['America/Denver', 'Mountain time (Denver)'],
  ['America/Phoenix', 'Arizona'],
  ['America/Los_Angeles', 'Pacific time (Los Angeles)'],
  ['America/Anchorage', 'Alaska'],
  ['Pacific/Honolulu', 'Hawaii'],
  ['Europe/London', 'London'],
  ['Europe/Paris', 'Central Europe (Paris)'],
  ['Asia/Dubai', 'Dubai'],
  ['Asia/Kolkata', 'India'],
  ['Australia/Sydney', 'Sydney'],
];

async function resizePhoto(file: File): Promise<string> {
  if (!file.type.startsWith('image/')) throw new Error('Please choose a photo.');
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    const max = 1600;
    const s = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.naturalWidth * s);
    canvas.height = Math.round(img.naturalHeight * s);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('This browser could not prepare the photo.');
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    let q = 0.8;
    let data = canvas.toDataURL('image/jpeg', q);
    while (data.length * 0.75 > 2.8 * 1024 * 1024 && q > 0.4) {
      q -= 0.15;
      data = canvas.toDataURL('image/jpeg', q);
    }
    return data.split(',')[1];
  } catch (e) {
    throw new Error((e as Error).message?.startsWith('Please') ? (e as Error).message : "We couldn't open that photo. Please try a different one.");
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function InvitesWizard() {
  const { ok, error: keyError } = useHostKey(true);
  const [leadEmail, setLeadEmail] = useState(getLeadEmail());
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const step = Math.min(6, Math.max(1, Number(params.get('step')) || 1));

  const [ev, setEv] = useState<HostEvent>(blankEvent);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loaded, setLoaded] = useState(!id);
  const [save, setSave] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');
  const pending = useRef<Partial<HostEvent>>({});
  const timer = useRef<number | undefined>(undefined);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const evIdRef = useRef(ev.id);
  evIdRef.current = ev.id;
  useEffect(() => {
    if (!ok || !id) return;
    // Just created on step 1: this component stays mounted, so keep what's on screen.
    if (evIdRef.current === id) { setLoaded(true); return; }
    api.event(id)
      // anything typed while loading wins over the stored copy
      .then((r) => { setEv({ ...r.event, ...pending.current }); setGuests(r.guests); setLoaded(true); })
      .catch((e) => { setError(e.message); setLoaded(true); });
  }, [ok, id]);

  useEffect(() => {
    loadThemeFonts(step === 3 ? [...THEME_IDS] : [ev.theme]);
  }, [step, ev.theme]);

  useEffect(() => { headingRef.current?.focus(); window.scrollTo(0, 0); }, [step]);

  const flush = useCallback(async (): Promise<boolean> => {
    window.clearTimeout(timer.current);
    const fields = pending.current;
    if (!id || !Object.keys(fields).length) return true;
    pending.current = {};
    setSave('saving');
    try {
      const r = await api.updateEvent(id, fields);
      setEv((cur) => ({ ...cur, openCode: r.event.openCode, updatedAt: r.event.updatedAt }));
      setSave('saved');
      return true;
    } catch (e) {
      pending.current = { ...fields, ...pending.current };
      setSave('error');
      setError((e as Error).message);
      return false;
    }
  }, [id]);

  const patch = useCallback((fields: Partial<HostEvent>) => {
    setEv((cur) => ({ ...cur, ...fields, title: fields.coupleNames ? `${fields.coupleNames[0]} & ${fields.coupleNames[1]}` : cur.title }));
    pending.current = { ...pending.current, ...fields };
    window.clearTimeout(timer.current);
    if (id) timer.current = window.setTimeout(() => { flush(); }, 1200);
  }, [id, flush]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function validate(): string {
    if (step === 1 && (!ev.coupleNames[0].trim() || !ev.coupleNames[1].trim())) return 'Please type both names.';
    if (step === 2 && !ev.date) return 'Please pick the wedding date. You can change it later.';
    if (step === 1 && leadEmail.trim() && !isEmail(leadEmail.trim().toLowerCase())) return 'Please check your email address, or leave it empty. It is optional.';
    return '';
  }

  async function goNext() {
    const v = validate();
    if (v) { setError(v); return; }
    setError('');
    // optional lead capture: saved once, never required, never blocks the next step
    const le = leadEmail.trim().toLowerCase();
    if (step === 1 && le && le !== getLeadEmail()) api.saveLead(le).catch(() => {});
    if (!id) {
      setSave('saving');
      try {
        const r = await api.createEvent({ coupleNames: [ev.coupleNames[0].trim(), ev.coupleNames[1].trim()], timezone: ev.timezone, theme: ev.theme });
        pending.current = {};
        evIdRef.current = r.event.id;
        setEv(r.event);
        setSave('saved');
        navigate(`/invites/e/${r.event.id}/edit?step=2`, { replace: true });
      } catch (e) {
        setSave('error');
        setError((e as Error).message);
      }
      return;
    }
    if (!(await flush())) return;
    if (step === 6) navigate(`/invites/e/${id}`);
    else setParams({ step: String(step + 1) });
  }

  async function goBack() {
    setError('');
    if (step === 1) { navigate(id ? `/invites/e/${id}` : '/invites/dashboard'); return; }
    await flush();
    setParams({ step: String(step - 1) });
  }

  if (!ok) return <Page title="Kenji Invites"><div className="kv-wrap">{keyError ? <ErrorBox message={keyError} /> : <p role="status">Getting things ready...</p>}</div></Page>;
  if (!loaded) return <Page title="Kenji Invites"><div className="kv-wrap"><p role="status">Loading...</p></div></Page>;

  const preview = (
    <div className="kv-preview-card">
      <InvitationCard data={{ ...ev, photoUrl: photoUrl(ev) }} />
    </div>
  );

  let body: ReactNode = null;
  if (step === 1) body = <StepNames ev={ev} patch={patch} leadEmail={leadEmail} setLeadEmail={setLeadEmail} />;
  if (step === 2) body = <StepWhen ev={ev} patch={patch} />;
  if (step === 3) body = <StepDesign ev={ev} patch={patch} setEv={setEv} />;
  if (step === 4) body = <StepEvents ev={ev} patch={patch} />;
  if (step === 5) body = <StepGuests ev={ev} patch={patch} guests={guests} setGuests={setGuests} />;
  if (step === 6) body = <StepSend ev={ev} guests={guests} setGuests={setGuests} goGuests={() => setParams({ step: '5' })} />;

  return (
    <Page title={`${STEPS[step - 1]} | Kenji Invites`}>
      <div className="kv-wrap">
        <div className="kv-wiz">
          <section aria-labelledby="kv-step-title">
            <div className="kv-progress">
              <div className="kv-progress-top">
                <span className="kv-progress-step">Step {step} of 6</span>
                <SavedNote state={save} />
              </div>
              <div className="kv-bar" aria-hidden="true"><span style={{ width: `${(step / 6) * 100}%` }} /></div>
            </div>
            <h1 id="kv-step-title" ref={headingRef} tabIndex={-1} style={{ marginBottom: 10, outline: 'none' }}>{STEPS[step - 1]}</h1>
            <p className="kv-step-help" style={{ marginBottom: 24 }}>{HELP[step - 1]}</p>
            <ErrorBox message={error} />
            {body}
            <div className="kv-only-phone" style={{ marginTop: 32 }}>
              <h2 className="kv-preview-label" style={{ fontSize: 20 }}>How your invitation looks</h2>
              {preview}
            </div>
            <nav className="kv-wiz-nav" aria-label="Steps">
              <button type="button" className="kv-btn kv-btn--secondary kv-btn--big" onClick={goBack}>
                <Icon name="back" /> Back
              </button>
              <button type="button" className="kv-btn kv-btn--primary kv-btn--big" onClick={goNext} data-testid="wizard-next">
                {step === 6 ? 'Finish' : 'Next'} {step < 6 && <Icon name="next" />}
              </button>
            </nav>
          </section>
          <aside className="kv-preview kv-only-desktop" aria-label="Live preview">
            <p className="kv-preview-label">How your invitation looks</p>
            {preview}
          </aside>
        </div>
      </div>
    </Page>
  );
}

type StepProps = { ev: HostEvent; patch: (f: Partial<HostEvent>) => void };

function StepNames({ ev, patch, leadEmail, setLeadEmail }: StepProps & { leadEmail: string; setLeadEmail: (v: string) => void }) {
  return (
    <div>
      <Field id="kv-n1" label="First person getting married">
        <input id="kv-n1" className="kv-input" value={ev.coupleNames[0]} maxLength={LIMITS.name} autoComplete="off" placeholder="e.g. Sarah Johnson"
          onChange={(e) => patch({ coupleNames: [e.target.value, ev.coupleNames[1]] })} />
      </Field>
      <Field id="kv-n2" label="Second person getting married">
        <input id="kv-n2" className="kv-input" value={ev.coupleNames[1]} maxLength={LIMITS.name} autoComplete="off" placeholder="e.g. James Smith"
          onChange={(e) => patch({ coupleNames: [ev.coupleNames[0], e.target.value] })} />
      </Field>
      <p className="kv-says" aria-live="polite" data-testid="names-line">
        Your invitation will say: <strong>{ev.coupleNames[0].trim() || 'Sarah Johnson'} &amp; {ev.coupleNames[1].trim() || 'James Smith'}</strong>
      </p>
      <p className="kv-hint" style={{ marginBottom: 26 }}>You'll add your guests (the people you're inviting) later, in step 5.</p>
      <Field id="kv-lead" label="Your email (optional, so we can send you tips and updates)" hint="You can leave this empty. You don't need it to make or send your invitation.">
        <input id="kv-lead" className="kv-input" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false}
          value={leadEmail} maxLength={200} onChange={(e) => setLeadEmail(e.target.value)} placeholder="name@example.com" />
      </Field>
    </div>
  );
}

function StepWhen({ ev, patch }: StepProps) {
  const zones = US_ZONES.some(([z]) => z === ev.timezone) ? US_ZONES : [[ev.timezone, ev.timezone], ...US_ZONES];
  return (
    <div>
      <div className="kv-row2">
        <Field id="kv-date" label="Wedding date">
          <input id="kv-date" type="date" className="kv-input" value={ev.date} onChange={(e) => patch({ date: e.target.value })} />
        </Field>
        <Field id="kv-time" label="Start time">
          <input id="kv-time" type="time" className="kv-input" value={ev.time} onChange={(e) => patch({ time: e.target.value })} />
        </Field>
      </div>
      <Field id="kv-venue" label="Name of the place" hint="For example: St. Mary's Church, or The Rose Garden">
        <input id="kv-venue" className="kv-input" value={ev.venueName} maxLength={LIMITS.venue} onChange={(e) => patch({ venueName: e.target.value })} />
      </Field>
      <Field id="kv-address" label="Address" hint="Guests get a button that opens this in their maps app.">
        <textarea id="kv-address" className="kv-textarea" style={{ minHeight: 96 }} value={ev.address} maxLength={LIMITS.address} onChange={(e) => patch({ address: e.target.value })} />
      </Field>
      <Field id="kv-tz" label="Time zone of the wedding">
        <select id="kv-tz" className="kv-select" value={ev.timezone} onChange={(e) => patch({ timezone: e.target.value })}>
          {zones.map(([z, label]) => <option key={z} value={z}>{label}</option>)}
        </select>
      </Field>
    </div>
  );
}

function StepDesign({ ev, patch, setEv }: StepProps & { setEv: (f: (e: HostEvent) => HostEvent) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const sample = { ...ev, photoUrl: photoUrl(ev) };

  async function onFile(file: File | undefined) {
    if (!file) return;
    setErr('');
    setBusy(true);
    try {
      const data = await resizePhoto(file);
      const r = await api.uploadPhoto(ev.id, data);
      setEv((cur) => ({ ...cur, photo: r.event.photo, photoVersion: r.event.photoVersion }));
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

  return (
    <div className="kv-stack">
      <div className="kv-themes" role="group" aria-label="Designs">
        {THEME_IDS.map((t: ThemeId) => (
          <button key={t} type="button" className="kv-theme" aria-pressed={ev.theme === t} onClick={() => patch({ theme: t })} data-theme={t}>
            <span aria-hidden="true"><InvitationCard data={{ ...sample, theme: t, accent: '', personalMessage: '' }} /></span>
            <span>{THEMES[t].name}</span>
            {ev.theme === t && <span className="kv-theme-check">Chosen</span>}
          </button>
        ))}
      </div>

      <div className="kv-card" style={{ marginTop: 28 }}>
        <h2 style={{ fontSize: 24, marginBottom: 8 }}>Your photo <span className="kv-muted" style={{ fontWeight: 400, fontSize: 19 }}>(you can skip this)</span></h2>
        <p className="kv-muted" style={{ marginBottom: 16 }}>A photo of the two of you looks lovely at the top of the invitation.</p>
        <ErrorBox message={err} />
        <div className="kv-photo-row">
          {ev.photo && <img className="kv-photo-thumb" src={photoUrl(ev)} alt="Your photo" />}
          <input ref={fileRef} id="kv-photo" type="file" accept="image/*" className="kv-sr" onChange={(e) => onFile(e.target.files?.[0])} data-testid="photo-input" />
          <label htmlFor="kv-photo" className="kv-btn kv-btn--secondary" aria-disabled={busy}>
            <Icon name="photo" /> {busy ? 'Adding photo...' : ev.photo ? 'Choose a different photo' : 'Add a photo'}
          </label>
          {ev.photo && !busy && (
            <ConfirmButton label={<><Icon name="trash" /> Remove photo</>} question="Remove this photo from the invitation?" confirmLabel="Yes, remove it"
              onConfirm={async () => { const r = await api.deletePhoto(ev.id); setEv((cur) => ({ ...cur, photo: r.event.photo })); }} />
          )}
        </div>
      </div>

      <div className="kv-card">
        <p className="kv-label" id="kv-open-label" style={{ marginBottom: 6 }}>Opening effect</p>
        <p className="kv-hint" style={{ marginBottom: 14 }}>What your guests see first when they open their link.</p>
        <div className="kv-choice-row" role="group" aria-labelledby="kv-open-label">
          <button type="button" className="kv-choice" aria-pressed={ev.opening !== 'fade'} onClick={() => patch({ opening: 'envelope' })} data-testid="opening-envelope">
            <strong>3D envelope (recommended)</strong>
            <span>They tap a wax seal, the envelope opens and the card rises out.</span>
          </button>
          <button type="button" className="kv-choice" aria-pressed={ev.opening === 'fade'} onClick={() => patch({ opening: 'fade' })} data-testid="opening-fade">
            <strong>Simple fade</strong>
            <span>The invitation just appears, softly.</span>
          </button>
        </div>
      </div>

      <div className="kv-card">
        <Field id="kv-msg" label="A short message (you can skip this)" hint="For example: Dinner and dancing to follow. We can't wait to celebrate with you.">
          <textarea id="kv-msg" className="kv-textarea" value={ev.personalMessage} maxLength={LIMITS.message} onChange={(e) => patch({ personalMessage: e.target.value })} />
        </Field>
        <p className="kv-hint">{ev.personalMessage.length} of {LIMITS.message} letters used</p>
      </div>

      <div className="kv-card">
        <p className="kv-label" id="kv-color-label" style={{ marginBottom: 6 }}>Color of the names (you can skip this)</p>
        <p className="kv-hint" style={{ marginBottom: 14 }}>Each design has its own color. Pick one here only if you want to change it.</p>
        <div className="kv-swatches" role="group" aria-labelledby="kv-color-label">
          <button type="button" className="kv-swatch" aria-pressed={!ev.accent} onClick={() => patch({ accent: '' })}>
            <i style={{ background: `linear-gradient(135deg, ${THEMES[ev.theme].swatch[0]} 50%, ${THEMES[ev.theme].swatch[1]} 50%)` }} /> Design's own
          </button>
          {ACCENTS.map((a) => (
            <button key={a.value} type="button" className="kv-swatch" aria-pressed={ev.accent === a.value} onClick={() => patch({ accent: a.value })}>
              <i style={{ background: a.value }} /> {a.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepEvents({ ev, patch }: StepProps) {
  const update = (i: number, f: Partial<SubEvent>) => patch({ subEvents: ev.subEvents.map((s, j) => (j === i ? { ...s, ...f } : s)) });
  const add = (title: string) => {
    if (ev.subEvents.length >= LIMITS.subEvents) return;
    const id = Math.random().toString(36).slice(2, 10);
    patch({ subEvents: [...ev.subEvents, { id, title, date: '', time: '', venueName: '', address: '', notes: '' }] });
    window.setTimeout(() => document.getElementById(`kv-se-date-${id}`)?.focus(), 50);
  };
  return (
    <div className="kv-stack">
      <div>
        <p className="kv-label" style={{ marginBottom: 10 }}>Tap to add one</p>
        <div className="kv-presets">
          {SUB_EVENT_PRESETS.map((p) => (
            <button key={p} type="button" className="kv-btn kv-btn--secondary" onClick={() => add(p)}><Icon name="plus" /> {p}</button>
          ))}
          <button type="button" className="kv-btn kv-btn--secondary" onClick={() => add('')}><Icon name="plus" /> Something else</button>
        </div>
      </div>
      {ev.subEvents.map((s, i) => (
        <div key={s.id} className="kv-card" data-testid="sub-event">
          <h2 style={{ fontSize: 23, marginBottom: 16 }}>{s.title || 'New event'}</h2>
          <Field id={`kv-se-title-${s.id}`} label="What is it called?">
            <input id={`kv-se-title-${s.id}`} className="kv-input" value={s.title} maxLength={LIMITS.name} onChange={(e) => update(i, { title: e.target.value })} />
          </Field>
          <div className="kv-row2">
            <Field id={`kv-se-date-${s.id}`} label="Date">
              <input id={`kv-se-date-${s.id}`} type="date" className="kv-input" value={s.date} onChange={(e) => update(i, { date: e.target.value })} />
            </Field>
            <Field id={`kv-se-time-${s.id}`} label="Start time">
              <input id={`kv-se-time-${s.id}`} type="time" className="kv-input" value={s.time} onChange={(e) => update(i, { time: e.target.value })} />
            </Field>
          </div>
          <Field id={`kv-se-venue-${s.id}`} label="Name of the place">
            <input id={`kv-se-venue-${s.id}`} className="kv-input" value={s.venueName} maxLength={LIMITS.venue} onChange={(e) => update(i, { venueName: e.target.value })} />
          </Field>
          <Field id={`kv-se-addr-${s.id}`} label="Address">
            <input id={`kv-se-addr-${s.id}`} className="kv-input" value={s.address} maxLength={LIMITS.address} onChange={(e) => update(i, { address: e.target.value })} />
          </Field>
          <Field id={`kv-se-notes-${s.id}`} label="Notes for guests (you can skip this)" hint="For example: Casual clothes. Kids welcome.">
            <textarea id={`kv-se-notes-${s.id}`} className="kv-textarea" style={{ minHeight: 90 }} value={s.notes} maxLength={LIMITS.notes} onChange={(e) => update(i, { notes: e.target.value })} />
          </Field>
          <ConfirmButton label={<><Icon name="trash" /> Remove this event</>} question={`Remove "${s.title || 'this event'}"?`} confirmLabel="Yes, remove it"
            onConfirm={() => patch({ subEvents: ev.subEvents.filter((x) => x.id !== s.id) })} />
        </div>
      ))}
    </div>
  );
}

function GuestEditor({ initial, seatsDefault, submitLabel, onSubmit, onCancel }: {
  initial?: Partial<Guest>; seatsDefault: number; submitLabel: string;
  onSubmit: (g: { name: string; phone: string; email: string; seats: number }) => Promise<boolean>; onCancel?: () => void;
}) {
  const [name, setName] = useState(initial?.name || '');
  const [phone, setPhone] = useState(initial?.phone ? formatPhone(initial.phone) : '');
  const [email, setEmail] = useState(initial?.email || '');
  const [seats, setSeats] = useState(initial?.seats || seatsDefault);
  const [busy, setBusy] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);
  const uid = useRef(Math.random().toString(36).slice(2, 7)).current;
  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      setBusy(true);
      const done = await onSubmit({ name: name.trim(), phone: phone.trim(), email: email.trim(), seats });
      setBusy(false);
      if (done && !initial) { setName(''); setPhone(''); setEmail(''); setSeats(seatsDefault); nameRef.current?.focus(); }
    }}>
      <Field id={`kv-g-name-${uid}`} label="Guest's name" hint="Write it the way you'd greet them, like Aunt Linda or The Garcia Family">
        <input ref={nameRef} id={`kv-g-name-${uid}`} className="kv-input" value={name} maxLength={LIMITS.name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
      </Field>
      <div className="kv-row2">
        <Field id={`kv-g-phone-${uid}`} label="Mobile phone (for texting)">
          <input id={`kv-g-phone-${uid}`} className="kv-input" type="tel" inputMode="tel" autoComplete="off" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 123-4567" />
        </Field>
        <Field id={`kv-g-email-${uid}`} label="Email">
          <input id={`kv-g-email-${uid}`} className="kv-input" type="email" inputMode="email" autoComplete="off" autoCapitalize="none" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
        </Field>
      </div>
      <div className="kv-field">
        <span className="kv-label" id={`kv-g-seats-${uid}`}>How many people is this invitation for?</span>
        <p className="kv-hint">Count the guest too. For a couple, choose 2.</p>
        <div><Stepper value={seats} min={1} max={LIMITS.maxSeats} onChange={setSeats} label="People on this invitation" /></div>
      </div>
      <div className="kv-btn-row">
        <button type="submit" className="kv-btn kv-btn--primary" disabled={busy}>{busy ? 'Saving...' : submitLabel}</button>
        {onCancel && <button type="button" className="kv-btn kv-btn--secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

function StepGuests({ ev, patch, guests, setGuests }: StepProps & { guests: Guest[]; setGuests: (f: (g: Guest[]) => Guest[]) => void }) {
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const [paste, setPaste] = useState('');
  const [showPaste, setShowPaste] = useState(false);
  const [editing, setEditing] = useState('');

  async function addOne(g: { name: string; phone: string; email: string; seats: number }) {
    setErr(''); setMsg('');
    if (!g.name) { setErr("Please type the guest's name."); return false; }
    try {
      const r = await api.addGuests(ev.id, { guests: [g] });
      setGuests((cur) => [...cur, ...r.added]);
      setMsg(`Added ${g.name}.`);
      return true;
    } catch (e) { setErr((e as Error).message); return false; }
  }
  async function addPasted() {
    setErr(''); setMsg('');
    try {
      const r = await api.addGuests(ev.id, { text: paste });
      setGuests((cur) => [...cur, ...r.added]);
      setPaste('');
      setMsg(`Added ${r.added.length} ${r.added.length === 1 ? 'guest' : 'guests'}.${r.problems.length ? ` We skipped ${r.problems.length}: ${r.problems.join(' ')}` : ''}`);
    } catch (e) { setErr((e as Error).message); }
  }

  return (
    <div className="kv-stack">
      <div className="kv-card">
        <Field id="kv-rsvpby" label="Please reply by (you can skip this)" hint="The date you'd like everyone to answer by.">
          <input id="kv-rsvpby" type="date" className="kv-input" value={ev.rsvpBy} onChange={(e) => patch({ rsvpBy: e.target.value })} />
        </Field>
        <label className="kv-check">
          <input type="checkbox" checked={ev.openLinkEnabled} onChange={(e) => patch({ openLinkEnabled: e.target.checked })} data-testid="open-link-toggle" />
          <span>
            <strong>Also make one shared link for everyone</strong>
            <span className="kv-hint" style={{ display: 'block', marginTop: 4 }}>Handy for a group chat or a printed card. People who use it type their own name. Personal links are still best, so you know who opened theirs.</span>
          </span>
        </label>
        {ev.openLinkEnabled && (
          <div className="kv-field" style={{ marginTop: 18, marginBottom: 0 }}>
            <span className="kv-label">How many people can someone bring with the shared link? (counting themselves)</span>
            <div><Stepper value={ev.defaultSeats} min={1} max={10} onChange={(n) => patch({ defaultSeats: n })} label="People per shared-link reply" /></div>
          </div>
        )}
      </div>

      <div className="kv-card">
        <h2 style={{ fontSize: 24, marginBottom: 16 }}>Add a guest (someone you're inviting)</h2>
        <ErrorBox message={err} />
        {msg && <p className="kv-note" role="status" style={{ marginBottom: 16 }}>{msg}</p>}
        <GuestEditor seatsDefault={2} submitLabel="Add this guest" onSubmit={addOne} />
        <div style={{ marginTop: 22 }}>
          <button type="button" className="kv-btn kv-btn--quiet" aria-expanded={showPaste} onClick={() => setShowPaste((v) => !v)} style={{ paddingLeft: 0 }}>
            {showPaste ? 'Hide the list box' : 'Have a list already? Paste it here'}
          </button>
          {showPaste && (
            <div style={{ marginTop: 12 }}>
              <Field id="kv-paste" label="Paste your list, one guest per line" hint='Like this: Aunt Linda, (555) 123-4567, 2. Phone or email, then how many people. The number is optional.'>
                <textarea id="kv-paste" className="kv-textarea" style={{ minHeight: 160 }} value={paste} onChange={(e) => setPaste(e.target.value)} />
              </Field>
              <button type="button" className="kv-btn kv-btn--primary" disabled={!paste.trim()} onClick={addPasted}>Add these guests</button>
            </div>
          )}
        </div>
      </div>

      <div className="kv-card">
        <h2 style={{ fontSize: 24, marginBottom: 6 }}>Your guests (the people you're inviting)</h2>
        <p className="kv-muted" style={{ marginBottom: 8 }}>{guests.length} {guests.length === 1 ? 'guest' : 'guests'}, up to {guests.reduce((n, g) => n + g.seats, 0)} people</p>
        {guests.length === 0 && <p className="kv-muted">No guests yet. Add the first one above.</p>}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {guests.map((g) => (
            <li key={g.id} className="kv-guest" data-testid="guest-row">
              {editing === g.id ? (
                <GuestEditor initial={g} seatsDefault={g.seats} submitLabel="Save changes" onCancel={() => setEditing('')}
                  onSubmit={async (f) => {
                    try {
                      const r = await api.updateGuest(ev.id, g.id, f);
                      setGuests((cur) => cur.map((x) => (x.id === g.id ? r.guest : x)));
                      setEditing('');
                      return true;
                    } catch (e) { setErr((e as Error).message); return false; }
                  }} />
              ) : (
                <>
                  <div>
                    <p className="kv-guest-name">{g.name}</p>
                    <p className="kv-guest-meta">{[formatPhone(g.phone), g.email].filter(Boolean).join(' · ') || 'No phone or email (you can copy their link)'}</p>
                    <p className="kv-guest-meta">Up to {g.seats} {g.seats === 1 ? 'person' : 'people'} <StatusChip status={g.status} /></p>
                  </div>
                  <div className="kv-guest-actions">
                    <button type="button" className="kv-btn kv-btn--secondary" onClick={() => setEditing(g.id)}><Icon name="edit" /> Edit</button>
                    <ConfirmButton label={<><Icon name="trash" /> Remove</>} question={`Remove ${g.name} from the guest list? Their link will stop working.`} confirmLabel="Yes, remove"
                      onConfirm={async () => { await api.deleteGuest(ev.id, g.id); setGuests((cur) => cur.filter((x) => x.id !== g.id)); }} />
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StepSend({ ev, guests, setGuests, goGuests }: { ev: HostEvent; guests: Guest[]; setGuests: (f: (g: Guest[]) => Guest[]) => void; goGuests: () => void }) {
  const [walk, setWalk] = useState(-1);
  const [copiedOpen, setCopiedOpen] = useState(false);
  const onSent = (g: Guest) => setGuests((cur) => cur.map((x) => (x.id === g.id ? g : x)));
  const openLink = ev.openLinkEnabled && ev.openCode ? inviteLink(ev.openCode) : '';
  const cur = walk >= 0 ? guests[walk] : null;

  return (
    <div className="kv-stack">
      <p className="kv-muted">Tap <strong>Text</strong> or <strong>Email</strong> next to a guest and your phone opens a message with their invitation ready. It comes from you, so they'll know it's real. Then just press send.</p>
      {guests.length === 0 ? (
        <div className="kv-card kv-empty">
          <p style={{ marginBottom: 16 }}>You haven't added any guests yet.</p>
          <button type="button" className="kv-btn kv-btn--primary" onClick={goGuests}>Add guests</button>
        </div>
      ) : cur ? (
        <div className="kv-walk" aria-live="polite">
          <p className="kv-progress-step" style={{ marginBottom: 6 }}>Guest {walk + 1} of {guests.length}</p>
          <h2 style={{ marginBottom: 6 }}>{cur.name}</h2>
          <p className="kv-muted" style={{ marginBottom: 16 }}>{[formatPhone(cur.phone), cur.email].filter(Boolean).join(' · ') || 'No phone or email saved. You can copy the link.'} · {sentLabel(cur)}</p>
          <SendButtons ev={ev} guest={cur} onSent={onSent} />
          <div className="kv-btn-row" style={{ marginTop: 22, justifyContent: 'space-between' }}>
            <button type="button" className="kv-btn kv-btn--secondary" disabled={walk === 0} onClick={() => setWalk(walk - 1)}><Icon name="back" /> Previous guest</button>
            {walk < guests.length - 1
              ? <button type="button" className="kv-btn kv-btn--primary" onClick={() => setWalk(walk + 1)}>Next guest <Icon name="next" /></button>
              : <button type="button" className="kv-btn kv-btn--primary" onClick={() => setWalk(-1)}>All done</button>}
          </div>
          <button type="button" className="kv-btn kv-btn--quiet" style={{ marginTop: 10, paddingLeft: 0 }} onClick={() => setWalk(-1)}>Stop and see the whole list</button>
        </div>
      ) : (
        <>
          <button type="button" className="kv-btn kv-btn--primary kv-btn--big kv-btn--block" onClick={() => setWalk(Math.max(0, guests.findIndex((g) => !g.sentAt)))}>
            Send to everyone, one by one
          </button>
          <div className="kv-card">
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {guests.map((g) => (
                <li key={g.id} className="kv-guest" data-testid="send-row">
                  <div>
                    <p className="kv-guest-name">{g.name}</p>
                    <p className="kv-guest-meta">{sentLabel(g)}</p>
                  </div>
                  <SendButtons ev={ev} guest={g} onSent={onSent} />
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
      {openLink && (
        <div className="kv-card">
          <h2 style={{ fontSize: 24, marginBottom: 8 }}>Your shared link</h2>
          <p className="kv-muted" style={{ marginBottom: 14 }}>Anyone with this link can reply. Put it in a group chat, or print the code below so people can scan it with their phone camera.</p>
          <p className="kv-linkbox" data-testid="open-link">{openLink}</p>
          <div className="kv-btn-row" style={{ margin: '14px 0 18px' }}>
            <button type="button" className="kv-btn kv-btn--secondary" onClick={async () => { if (await copyText(openLink)) { setCopiedOpen(true); window.setTimeout(() => setCopiedOpen(false), 2500); } }}>
              <Icon name={copiedOpen ? 'check' : 'copy'} /> {copiedOpen ? 'Copied' : 'Copy link'}
            </button>
            <a className="kv-btn kv-btn--secondary" href={smsHref('', inviteText(ev, '', openLink))}><Icon name="message" /> Text it</a>
          </div>
          <QrCode text={openLink} label={`Scan code for the wedding invitation of ${ev.title}`} />
        </div>
      )}
      <ManageLinkCard compact />
      <p><Link to={`/invites/e/${ev.id}`}>Go to my guest list and see who's coming</Link></p>
    </div>
  );
}
