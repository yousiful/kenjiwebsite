// Optional weekly match email for the Funding Finder. Never needed to browse.
// Posts to netlify/functions/funding-alerts.ts (Blobs + KenjiAI GHL contact, tag "funding finder").
import { useState, type FormEvent } from 'react';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { STATES, TYPE_LABEL, TYPE_ORDER, type FundType } from './logic';

const BUSINESS_TYPES = ['Startup (not launched yet)', 'Service business', 'Ecommerce or retail', 'Technology or software', 'Health or life sciences', 'Food, farm or agriculture', 'Manufacturing', 'Creative or media', 'Nonprofit-adjacent or social enterprise', 'Other'];

export default function AlertsForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [biz, setBiz] = useState('');
  const [state, setState] = useState('');
  const [types, setTypes] = useState<FundType[]>(['grant']);
  const [hp, setHp] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const toggle = (t: FundType) => setTypes(types.includes(t) ? types.filter((x) => x !== t) : [...types, t]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email.trim())) { setError('Add your name and a valid email.'); return; }
    if (!types.length) { setError('Pick at least one kind of funding.'); return; }
    setBusy(true);
    try {
      const r = await fetch('/.netlify/functions/funding-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, businessType: biz, state, types, website: hp }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) setError(d?.error || 'That did not go through. Try again in a minute.');
      else setDone(true);
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <section className="mt-16 bg-emerald-500/10 border border-emerald-400/30 rounded-2xl p-6 sm:p-8 max-w-3xl" data-no-snapshot>
        <p className="text-white font-semibold flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> You are on the list.</p>
        <p className="text-gray-300 mt-2">When new opportunities that fit your answers open up, we will email you once a week. Every email has a one-click unsubscribe.</p>
      </section>
    );
  }

  const input = 'w-full bg-gray-900 border border-gray-700 rounded-xl px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-400';
  return (
    <section className="mt-16 bg-gray-800/50 border border-gray-700 rounded-2xl p-5 sm:p-8 max-w-3xl" aria-labelledby="ff-alerts" data-no-snapshot>
      <h2 id="ff-alerts" className="text-2xl font-bold text-white flex items-center gap-2"><Mail className="w-5 h-5 text-blue-300" /> Get new matches by email</h2>
      <p className="text-gray-400 mt-2 mb-6 text-sm">Optional. Once a week, only when something new fits what you pick here. Unsubscribe any time.</p>
      <form onSubmit={submit} noValidate className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="fa-name" className="block text-sm font-semibold text-gray-300 mb-1.5">Name</label>
          <input id="fa-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="fa-email" className="block text-sm font-semibold text-gray-300 mb-1.5">Email</label>
          <input id="fa-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="fa-phone" className="block text-sm font-semibold text-gray-300 mb-1.5">Phone <span className="text-gray-500 font-normal">(optional)</span></label>
          <input id="fa-phone" type="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={input} />
        </div>
        <div>
          <label htmlFor="fa-state" className="block text-sm font-semibold text-gray-300 mb-1.5">State</label>
          <select id="fa-state" value={state} onChange={(e) => setState(e.target.value)} className={input}>
            <option value="">Choose your state</option>
            {STATES.map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="fa-biz" className="block text-sm font-semibold text-gray-300 mb-1.5">Business type</label>
          <select id="fa-biz" value={biz} onChange={(e) => setBiz(e.target.value)} className={input}>
            <option value="">Choose one</option>
            {BUSINESS_TYPES.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        <fieldset className="sm:col-span-2">
          <legend className="block text-sm font-semibold text-gray-300 mb-2">Which kinds of funding do you want?</legend>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {TYPE_ORDER.map((t) => (
              <label key={t} className="inline-flex items-center gap-2 text-gray-300 text-sm"><input type="checkbox" checked={types.includes(t)} onChange={() => toggle(t)} className="w-4 h-4 accent-blue-500" /> {TYPE_LABEL[t]}</label>
            ))}
          </div>
        </fieldset>
        <div className="hidden" aria-hidden="true">
          <label htmlFor="fa-website">Website</label>
          <input id="fa-website" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
        </div>
        {error && <p className="sm:col-span-2 text-sm text-red-300">{error}</p>}
        <div className="sm:col-span-2">
          <button type="submit" disabled={busy} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white font-bold px-6 py-3 rounded-xl disabled:opacity-60">
            {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving</> : 'Email me new matches'}
          </button>
          <p className="text-xs text-gray-500 mt-3">By signing up you agree that KenjiAI can email you funding matches and, if you add a phone number, contact you about them. We do not sell your details.</p>
        </div>
      </form>
    </section>
  );
}
