import React, { useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import PageSchema from '../components/PageSchema';
import { Check, Loader2, Lock, ShieldCheck, Users, GraduationCap } from 'lucide-react';

/* /agency: sign-up for Yousif's life insurance agency. Collects what the upline needs to add someone
   as a licensed or non-licensed associate, saves it to GHL (netlify/functions/agency-join.ts), then
   shows the "Life Insurance Agency Opportunity Call" calendar. No SSN or date of birth on this page;
   those go in the carrier's secure application after the Zoom. No income claims anywhere. */

const CALENDAR_ID = '2THiTyEJKI1brtcypqQg';

const STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY'];

type Form = Record<string, string>;
const empty: Form = { licensed: '' };

const input = 'w-full rounded-lg bg-gray-900 border border-gray-600 px-3 py-2.5 text-white placeholder-gray-500 focus:border-emerald-400 focus:outline-none';
const label = 'block text-sm font-medium text-gray-300 mb-1';

function Field({ id, text, children, hint }: { id: string; text: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className={label}>{text}</label>
      {children}
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function Choice({ name, value, current, onPick, children }: { name: string; value: string; current: string; onPick: (v: string) => void; children: React.ReactNode }) {
  const on = current === value;
  return (
    <button type="button" aria-pressed={on} onClick={() => onPick(value)} data-name={name}
      className={`flex-1 text-left rounded-xl border px-4 py-3 transition ${on ? 'border-emerald-400 bg-emerald-400/10 text-white' : 'border-gray-600 text-gray-300 hover:border-gray-400'}`}>
      {children}
    </button>
  );
}

export default function AgencyPage() {
  const [f, setF] = useState<Form>(empty);
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((x) => ({ ...x, [k]: e.target.value }));
  const pick = (k: string) => (v: string) => setF((x) => ({ ...x, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    if (!f.licensed) return setErr('Pick whether you are licensed yet.');
    if (!consent) return setErr('Check the box so we can call and text you about joining.');
    setBusy(true);
    try {
      const r = await fetch('/.netlify/functions/agency-join', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, consent: true }),
      });
      if (!r.ok) throw new Error();
      setDone(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setErr('That didn’t go through. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  const src = useMemo(() => {
    const p = new URLSearchParams();
    if (f.first_name) p.set('first_name', f.first_name);
    if (f.last_name) p.set('last_name', f.last_name);
    if (f.email) p.set('email', f.email);
    if (f.phone) p.set('phone', f.phone);
    return `https://api.leadconnectorhq.com/widget/booking/${CALENDAR_ID}?${p.toString()}`;
  }, [f.first_name, f.last_name, f.email, f.phone]);

  const [frameHeight, setFrameHeight] = useState(1100);
  useEffect(() => {
    if (!done) return;
    const onHeight = (e: MessageEvent) => {
      if (!/leadconnectorhq\.com|msgsndr\.com/.test(e.origin)) return;
      const d = e.data;
      const h = Array.isArray(d) && d[0] === 'highlevel.setHeight' ? Number(d[1]?.height)
        : typeof d === 'object' && d && 'height' in d ? Number((d as { height: unknown }).height) : NaN;
      if (h > 300 && h < 5000) setFrameHeight(Math.ceil(h) + 24);
    };
    window.addEventListener('message', onHeight);
    const s = document.createElement('script');
    s.src = 'https://link.msgsndr.com/js/form_embed.js'; s.async = true;
    document.body.appendChild(s);
    return () => { window.removeEventListener('message', onHeight); s.remove(); };
  }, [done]);

  const licensed = f.licensed === 'yes';

  return (
    <>
      <PageSchema path="/agency" name="Build Your Own Life Insurance Agency" description="Get licensed and build your own life insurance agency with Yousif Alias. Sign up and book a Zoom to see how it works." />
      <Helmet>
        <title>Build Your Own Life Insurance Agency | KenjiAI</title>
        <meta name="description" content="Get licensed and build your own life insurance agency with Yousif Alias. Sign up and book a Zoom to see how it works." />
        <link rel="canonical" href="https://kenjiai.com/agency" />
      </Helmet>

      <div className="min-h-screen bg-gray-900 pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {done ? (
            <section>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3"><Check className="w-5 h-5" /> You’re in, {f.first_name || 'welcome'}.</div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Pick a time for your Zoom with Yousif</h1>
              <p className="text-gray-300 mb-6">
                {licensed
                  ? 'On the call we go over your license, your states and getting you contracted.'
                  : 'On the call we map out your licensing steps for your state and how the agency works.'}{' '}
                After that, you’ll get the official secure application, which is where your Social Security number and date of birth go.
              </p>
              <div className="rounded-2xl overflow-hidden bg-white">
                <iframe src={src} title="Book your agency Zoom" className="w-full block border-0" style={{ height: frameHeight, minHeight: 700 }} scrolling="auto" id={`${CALENDAR_ID}_booking`} />
              </div>
            </section>
          ) : (
            <>
              <section className="text-center mb-10">
                <p className="text-emerald-400 font-semibold tracking-wide text-sm mb-3">LIFE INSURANCE AGENCY</p>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">Build your own life insurance agency</h1>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                  Most families are underinsured or have no coverage at all. Get licensed, help families in your area get protected, and build a team of your own, with Yousif and the KenjiAI marketing system behind you.
                </p>
              </section>

              <section className="grid sm:grid-cols-3 gap-4 mb-10">
                {[
                  { icon: GraduationCap, t: 'No experience needed', d: 'You do need a state license. We walk you through it step by step.' },
                  { icon: Users, t: 'Build your own team', d: 'Bring on and train your own agents as you grow.' },
                  { icon: ShieldCheck, t: 'Start part time', d: 'Work from your phone and laptop, on your schedule.' },
                ].map(({ icon: Icon, t, d }) => (
                  <div key={t} className="rounded-2xl bg-gray-800 border border-gray-700 p-5">
                    <Icon className="w-6 h-6 text-emerald-400 mb-2" />
                    <div className="text-white font-semibold">{t}</div>
                    <div className="text-sm text-gray-400 mt-1">{d}</div>
                  </div>
                ))}
              </section>

              <form onSubmit={submit} className="rounded-2xl bg-gray-800 border border-gray-700 p-6 md:p-8 space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-1">Join the agency</h2>
                  <p className="text-gray-400 text-sm">Takes about two minutes. Use your full legal name, the way it appears on your ID.</p>
                </div>

                <div>
                  <p className={label}>Are you licensed to sell life insurance right now?</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Choice name="licensed" value="yes" current={f.licensed} onPick={pick('licensed')}><div className="font-semibold">Yes, I’m licensed</div><div className="text-sm text-gray-400">I have a life license in at least one state</div></Choice>
                    <Choice name="licensed" value="no" current={f.licensed} onPick={pick('licensed')}><div className="font-semibold">Not yet</div><div className="text-sm text-gray-400">I’d get licensed after joining</div></Choice>
                  </div>
                </div>

                <fieldset className="space-y-4">
                  <legend className="text-lg font-semibold text-white mb-2">About you</legend>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field id="first_name" text="Legal first name *"><input id="first_name" required autoComplete="given-name" className={input} value={f.first_name || ''} onChange={set('first_name')} /></Field>
                    <Field id="middle_name" text="Middle name"><input id="middle_name" autoComplete="additional-name" className={input} value={f.middle_name || ''} onChange={set('middle_name')} /></Field>
                    <Field id="last_name" text="Legal last name *"><input id="last_name" required autoComplete="family-name" className={input} value={f.last_name || ''} onChange={set('last_name')} /></Field>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field id="suffix" text="Suffix"><input id="suffix" placeholder="Jr., III" className={input} value={f.suffix || ''} onChange={set('suffix')} /></Field>
                    <div className="sm:col-span-2"><Field id="preferred_name" text="Name you go by"><input id="preferred_name" autoComplete="nickname" className={input} value={f.preferred_name || ''} onChange={set('preferred_name')} /></Field></div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field id="email" text="Email *"><input id="email" type="email" required autoComplete="email" className={input} value={f.email || ''} onChange={set('email')} /></Field>
                    <Field id="phone" text="Mobile phone *"><input id="phone" type="tel" required autoComplete="tel" className={input} value={f.phone || ''} onChange={set('phone')} /></Field>
                  </div>
                </fieldset>

                <fieldset className="space-y-4">
                  <legend className="text-lg font-semibold text-white mb-2">Home address</legend>
                  <p className="text-xs text-gray-500 -mt-2">Your licensing state is where you live, so we need your home address, not a P.O. box.</p>
                  <Field id="address1" text="Street address *"><input id="address1" required autoComplete="address-line1" className={input} value={f.address1 || ''} onChange={set('address1')} /></Field>
                  <Field id="address2" text="Apt, suite, unit"><input id="address2" autoComplete="address-line2" className={input} value={f.address2 || ''} onChange={set('address2')} /></Field>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field id="city" text="City *"><input id="city" required autoComplete="address-level2" className={input} value={f.city || ''} onChange={set('city')} /></Field>
                    <Field id="state" text="State *">
                      <select id="state" required autoComplete="address-level1" className={input} value={f.state || ''} onChange={set('state')}>
                        <option value="">Select</option>{STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field id="zip" text="ZIP *"><input id="zip" required inputMode="numeric" autoComplete="postal-code" className={input} value={f.zip || ''} onChange={set('zip')} /></Field>
                  </div>
                </fieldset>

                {f.licensed === 'yes' && (
                  <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold text-white mb-2">Your license</legend>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field id="npn" text="NPN (National Producer Number) *" hint="Look it up free at nipr.com/help/look-up-your-npn">
                        <input id="npn" required inputMode="numeric" className={input} value={f.npn || ''} onChange={set('npn')} />
                      </Field>
                      <Field id="license_state" text="Resident license state *">
                        <select id="license_state" required className={input} value={f.license_state || ''} onChange={set('license_state')}>
                          <option value="">Select</option>{STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field id="license_number" text="Resident license number"><input id="license_number" className={input} value={f.license_number || ''} onChange={set('license_number')} /></Field>
                      <Field id="license_exp" text="License expiration date"><input id="license_exp" type="date" className={input} value={f.license_exp || ''} onChange={set('license_exp')} /></Field>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field id="other_states" text="Other states you’re licensed in"><input id="other_states" placeholder="TX, MI" className={input} value={f.other_states || ''} onChange={set('other_states')} /></Field>
                      <Field id="years_licensed" text="Years licensed"><input id="years_licensed" inputMode="numeric" className={input} value={f.years_licensed || ''} onChange={set('years_licensed')} /></Field>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-4">
                      <Field id="contracted" text="Contracted with another agency now?">
                        <select id="contracted" className={input} value={f.contracted || ''} onChange={set('contracted')}><option value="">Select</option><option>Yes</option><option>No</option></select>
                      </Field>
                      <Field id="eo" text="Have E&amp;O coverage?">
                        <select id="eo" className={input} value={f.eo || ''} onChange={set('eo')}><option value="">Select</option><option>Yes</option><option>No</option><option>Not sure</option></select>
                      </Field>
                      <Field id="aml" text="AML training done?">
                        <select id="aml" className={input} value={f.aml || ''} onChange={set('aml')}><option value="">Select</option><option>Yes</option><option>No</option><option>Not sure</option></select>
                      </Field>
                    </div>
                    {f.contracted === 'Yes' && (
                      <Field id="contracted_with" text="Which agency or carrier?" hint="Some carriers need a release from your current agency before you can move. We’ll go over it on the call.">
                        <input id="contracted_with" className={input} value={f.contracted_with || ''} onChange={set('contracted_with')} />
                      </Field>
                    )}
                  </fieldset>
                )}

                {f.licensed === 'no' && (
                  <fieldset className="space-y-4">
                    <legend className="text-lg font-semibold text-white mb-2">Getting licensed</legend>
                    <Field id="prelicense" text="Where are you with the pre-licensing course?">
                      <select id="prelicense" className={input} value={f.prelicense || ''} onChange={set('prelicense')}>
                        <option value="">Select</option><option>Haven’t started</option><option>In the course now</option><option>Finished the course</option><option>Exam scheduled</option><option>Passed the exam</option>
                      </select>
                    </Field>
                  </fieldset>
                )}

                <fieldset className="space-y-4">
                  <legend className="text-lg font-semibold text-white mb-2">A little more</legend>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field id="employment" text="Work right now">
                      <select id="employment" className={input} value={f.employment || ''} onChange={set('employment')}>
                        <option value="">Select</option><option>Full-time job</option><option>Part-time job</option><option>Self-employed</option><option>Between jobs</option><option>Student</option><option>Retired</option>
                      </select>
                    </Field>
                    <Field id="hours" text="Hours a week to start">
                      <select id="hours" className={input} value={f.hours || ''} onChange={set('hours')}>
                        <option value="">Select</option><option>Under 5</option><option>5 to 10</option><option>10 to 20</option><option>20+</option>
                      </select>
                    </Field>
                  </div>
                  <Field id="referred_by" text="Who referred you?" hint="So the right person gets credit for bringing you in."><input id="referred_by" className={input} value={f.referred_by || ''} onChange={set('referred_by')} /></Field>
                  <Field id="notes" text="Anything we should know?"><textarea id="notes" rows={3} className={input} value={f.notes || ''} onChange={set('notes')} /></Field>
                  <input type="text" name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" value={f.company || ''} onChange={set('company')} />
                </fieldset>

                <div className="rounded-xl bg-gray-900 border border-gray-700 p-4 flex gap-3 text-sm text-gray-400">
                  <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p>We never ask for your Social Security number or date of birth on this page. You’ll enter those only in the official secure application after your call.</p>
                </div>

                <label className="flex gap-3 items-start text-sm text-gray-400">
                  <input type="checkbox" className="mt-1 h-4 w-4 accent-emerald-500" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                  <span>I agree to receive calls and texts from Media Traffics LLC (KenjiAI) about joining the agency at the number I gave, including by automated technology and AI voice. Consent isn’t a condition of joining. Message and data rates may apply. Reply STOP to opt out.</span>
                </label>

                {err && <p className="text-red-400 text-sm" role="alert">{err}</p>}

                <button type="submit" disabled={busy} className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-gray-900 font-bold py-4 text-lg flex items-center justify-center gap-2">
                  {busy ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending</> : 'Join and pick my Zoom time'}
                </button>

                <p className="text-xs text-gray-500 leading-relaxed">
                  Joining doesn’t guarantee any income. Earnings depend on your own effort and results. You must hold a state life insurance license before you can sell or give advice on insurance products. See our <a href="/privacy" className="underline">Privacy Policy</a>.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
