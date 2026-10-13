import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { BrandMark, Icon } from './icons';
import { getToken, signOut } from './api';
import './app.css';

export function Page({ title, children, signedIn = true, noindex = true }: { title: string; children: ReactNode; signedIn?: boolean; noindex?: boolean }) {
  const navigate = useNavigate();
  const hasToken = !!getToken();
  return (
    <div className="kv">
      <Helmet>
        <title>{title}</title>
        {noindex && <meta name="robots" content="noindex, nofollow" />}
      </Helmet>
      <header className="kv-top">
        <div className="kv-top-in">
          <Link to={hasToken ? '/invites/dashboard' : '/invites'} className="kv-brand">
            <BrandMark />
            <span>Kenji Invites</span>
          </Link>
          {signedIn && hasToken && (
            <nav className="kv-top-links" aria-label="Account">
              <Link to="/invites/dashboard" className="kv-btn kv-btn--secondary">My invitations</Link>
              <button
                type="button"
                className="kv-btn kv-btn--quiet"
                onClick={() => { signOut(); navigate('/invites'); }}
              >
                Sign out
              </button>
            </nav>
          )}
        </div>
      </header>
      {children}
    </div>
  );
}

/** Sends people who aren't signed in to the sign-in page, then back here. */
export function useRequireAuth(): boolean {
  const navigate = useNavigate();
  const loc = useLocation();
  const ok = !!getToken();
  useEffect(() => {
    if (!ok) navigate(`/invites/login?next=${encodeURIComponent(loc.pathname + loc.search)}`, { replace: true });
  }, [ok, navigate, loc.pathname, loc.search]);
  return ok;
}

export function Field({ id, label, hint, children }: { id: string; label: string; hint?: string; children: ReactNode }) {
  return (
    <div className="kv-field">
      <label className="kv-label" htmlFor={id}>{label}</label>
      {hint && <p className="kv-hint" id={`${id}-hint`}>{hint}</p>}
      {children}
    </div>
  );
}

export function Stepper({ value, min, max, onChange, label }: { value: number; min: number; max: number; onChange: (n: number) => void; label: string }) {
  return (
    <div className="kv-stepper" role="group" aria-label={label}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label={`One fewer (${label})`}>&minus;</button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label={`One more (${label})`}>+</button>
    </div>
  );
}

export function SavedNote({ state }: { state: 'idle' | 'saving' | 'saved' | 'error' }) {
  return (
    <span className="kv-saved" role="status" aria-live="polite">
      {state === 'saving' && <span className="kv-muted">Saving...</span>}
      {state === 'saved' && <><Icon name="check" /> Saved</>}
      {state === 'error' && <span style={{ color: 'var(--kv-no)' }}>Not saved yet. We'll try again.</span>}
    </span>
  );
}

/** A button that asks "Are you sure?" inline before doing something destructive. */
export function ConfirmButton({ label, question, confirmLabel, onConfirm, className = 'kv-btn kv-btn--danger' }: { label: ReactNode; question: string; confirmLabel: string; onConfirm: () => void | Promise<void>; className?: string }) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!asking) return <button type="button" className={className} onClick={() => setAsking(true)}>{label}</button>;
  return (
    <div className="kv-confirm" role="alertdialog" aria-label={question}>
      <p style={{ fontWeight: 650, marginBottom: 12 }}>{question}</p>
      <div className="kv-btn-row">
        <button type="button" className="kv-btn kv-btn--danger" disabled={busy} onClick={async () => { setBusy(true); try { await onConfirm(); } finally { setBusy(false); setAsking(false); } }}>
          {busy ? 'One moment...' : confirmLabel}
        </button>
        <button type="button" className="kv-btn kv-btn--secondary" onClick={() => setAsking(false)}>No, keep it</button>
      </div>
    </div>
  );
}

export function ErrorBox({ message }: { message: string }) {
  if (!message) return null;
  return <div className="kv-error" role="alert">{message}</div>;
}

export const STATUS_LABEL: Record<string, string> = { invited: 'No answer yet', opened: 'Opened, no answer yet', yes: 'Coming', no: 'Not coming' };

export function StatusChip({ status }: { status: string }) {
  return <span className={`kv-chip kv-chip--${status}`}>{status === 'yes' && <Icon name="check" className="kv-ic16" />}{STATUS_LABEL[status] || status}</span>;
}
