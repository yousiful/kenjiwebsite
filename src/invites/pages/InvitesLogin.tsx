import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, getEmail, getToken, setSession } from '../api';
import { Page, Field, ErrorBox } from '../ui';
import { isEmail } from '../shared';

const RESEND_SECONDS = 30;

export default function InvitesLogin() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get('next') || '/invites/dashboard';
  const safeNext = next.startsWith('/invites') ? next : '/invites/dashboard';

  const [step, setStep] = useState<'email' | 'code'>('email');
  const [email, setEmail] = useState(getEmail());
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [wait, setWait] = useState(0);
  const codeRef = useRef<HTMLInputElement>(null);

  useEffect(() => { if (getToken()) navigate(safeNext, { replace: true }); }, [navigate, safeNext]);
  useEffect(() => {
    if (wait <= 0) return;
    const t = setTimeout(() => setWait((w) => w - 1), 1000);
    return () => clearTimeout(t);
  }, [wait]);
  useEffect(() => { if (step === 'code') codeRef.current?.focus(); }, [step]);

  async function send(e?: FormEvent) {
    e?.preventDefault();
    setError('');
    const clean = email.trim().toLowerCase();
    if (!isEmail(clean)) { setError('Please check your email address. It should look like name@example.com.'); return; }
    setBusy(true);
    try {
      await api.sendCode(clean);
      setEmail(clean);
      setStep('code');
      setCode('');
      setWait(RESEND_SECONDS);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function verify(value = code) {
    const digits = value.replace(/\D/g, '');
    if (digits.length !== 6) { setError('The code is 6 numbers. Please type all 6.'); return; }
    setError('');
    setBusy(true);
    try {
      const r = await api.verifyCode(email, digits);
      setSession(r.token, r.email);
      navigate(safeNext, { replace: true });
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <Page title="Sign in | Kenji Invites" signedIn={false}>
      <div className="kv-wrap">
        <div className="kv-narrow kv-card" style={{ padding: 'clamp(22px, 5vw, 40px)' }}>
          {step === 'email' ? (
            <form onSubmit={send} noValidate>
              <h1 style={{ marginBottom: 12 }}>Sign in</h1>
              <p className="kv-muted" style={{ marginBottom: 26 }}>
                Type your email and we'll send you a 6-digit code. There's no password to remember.
              </p>
              <ErrorBox message={error} />
              <Field id="kv-email" label="Your email address">
                <input id="kv-email" className="kv-input" type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false}
                  value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
              </Field>
              <button type="submit" className="kv-btn kv-btn--primary kv-btn--big kv-btn--block" disabled={busy}>
                {busy ? 'Sending...' : 'Email me a code'}
              </button>
            </form>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); verify(); }} noValidate>
              <h1 style={{ marginBottom: 12 }}>Check your email</h1>
              <p className="kv-muted" style={{ marginBottom: 26 }}>
                We sent a 6-digit code to <strong style={{ color: 'var(--kv-ink)', overflowWrap: 'anywhere' }}>{email}</strong>. It can take a minute to arrive. If you don't see it, look in your spam folder.
              </p>
              <ErrorBox message={error} />
              <Field id="kv-code" label="Your 6-digit code">
                <input
                  id="kv-code"
                  ref={codeRef}
                  className="kv-input"
                  style={{ fontSize: 40, letterSpacing: '0.4em', textAlign: 'center', minHeight: 80, fontVariantNumeric: 'tabular-nums', paddingLeft: '0.4em' }}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]*"
                  maxLength={12}
                  value={code}
                  onChange={(e) => {
                    const v = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(v);
                    if (v.length === 6 && !busy) verify(v);
                  }}
                  aria-describedby="kv-code-hint"
                />
                <p id="kv-code-hint" className="kv-hint">You can paste the code. We'll sign you in when all 6 numbers are in.</p>
              </Field>
              <button type="submit" className="kv-btn kv-btn--primary kv-btn--big kv-btn--block" disabled={busy}>
                {busy ? 'Signing in...' : 'Sign in'}
              </button>
              <div className="kv-btn-row" style={{ marginTop: 18, justifyContent: 'space-between' }}>
                <button type="button" className="kv-btn kv-btn--secondary" disabled={wait > 0 || busy} onClick={() => send()}>
                  {wait > 0 ? `Send a new code in ${wait}s` : 'Send a new code'}
                </button>
                <button type="button" className="kv-btn kv-btn--quiet" onClick={() => { setStep('email'); setError(''); }}>
                  Use a different email
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Page>
  );
}
