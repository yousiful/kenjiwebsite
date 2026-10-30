import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, Copy, ExternalLink, Loader2, MousePointer2 } from 'lucide-react';
import { Shell } from './GrowthQuizPage';

/* Client onboarding, kenjiai.com/onboarding (Yousif 2026-10-30): a short intake, then one step at a time to give
   Media Traffics access to their Meta ads (support@mediatraffics.com as a person, plus partner access once
   MT_BUSINESS_ID is set). Each step has a looping click-path demo and a Mark complete button.
   Progress stays in this browser (localStorage). Saves to GHL via netlify/functions/onboarding.ts. */

const STORE = 'kenji-onboarding';
const ACCENT = '#5EEAD4';
const SUPPORT_EMAIL = 'support@mediatraffics.com';
// Media Traffics Business Portfolio ID (Business settings > Business info). Empty hides the partner step.
const MT_BUSINESS_ID = '';

type Form = { firstName: string; email: string; phone: string; business: string; website: string; ads: 'yes' | 'no' | ''; budget: string; goal: string; contact: string };
const EMPTY: Form = { firstName: '', email: '', phone: '', business: '', website: '', ads: '', budget: '', goal: '', contact: 'Text' };

type Step = { id: string; title: string; why: string; link?: { href: string; label: string }; how: React.ReactNode[]; path: string[]; optional?: boolean };

const CopyChip: React.FC<{ text: string }> = ({ text }) => {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" onClick={() => { navigator.clipboard?.writeText(text).then(() => { setOk(true); setTimeout(() => setOk(false), 1500); }).catch(() => {}); }}
      className="inline-flex items-center gap-1.5 rounded-lg bg-white/[0.08] border border-white/10 px-2 py-0.5 font-mono text-[13px] hover:border-[#5EEAD4] align-middle">
      {text} {ok ? <Check className="w-3.5 h-3.5 text-[#5EEAD4]" /> : <Copy className="w-3.5 h-3.5 opacity-60" />}
    </button>
  );
};

const STEPS: Step[] = [
  {
    id: 'portfolio',
    title: 'Open your Business Settings',
    why: 'Everything we need lives in your Meta Business Portfolio. This is the same login you use for Ads Manager.',
    link: { href: 'https://business.facebook.com/settings', label: 'Open Business Settings' },
    how: [
      'Click the button below and log in with the Facebook account that runs your ads.',
      'If it asks you to pick a business, pick the one that owns your ad account.',
      <>No business portfolio yet? Make one at <a className="underline" href="https://business.facebook.com/overview" target="_blank" rel="noreferrer">business.facebook.com/overview</a>. It takes 2 minutes and it's free.</>,
    ],
    path: ['Log in', 'Pick your business', 'Business settings'],
  },
  {
    id: 'people',
    title: 'Add us to your ad account',
    why: 'This lets our team build, launch and watch your ads. You stay the owner and can remove us any time.',
    link: { href: 'https://business.facebook.com/settings/people', label: 'Open People' },
    how: [
      <>In Business Settings, go to <b>Users</b> then <b>People</b> and click <b>Add</b>.</>,
      <>Type our email: <CopyChip text={SUPPORT_EMAIL} /></>,
      <>Leave the role on <b>Business access only</b> (not admin) and click <b>Next</b>.</>,
      <>Under <b>Ad accounts</b>, check your ad account and turn on <b>Full control</b> (or Manage campaigns).</>,
      <>Under <b>Pages</b>, check your Facebook page. Under <b>Datasets</b>, check your pixel if you have one.</>,
      <>Click <b>Send request</b>. We accept it on our side.</>,
    ],
    path: ['Users › People', 'Add', SUPPORT_EMAIL, 'Ad account › Full control', 'Page + Pixel', 'Send request'],
  },
  ...(MT_BUSINESS_ID ? [{
    id: 'partner',
    title: 'Give Media Traffics partner access',
    why: 'Partner access connects your ad account to our business, so our reporting and automation can read your results.',
    link: { href: 'https://business.facebook.com/settings/partners', label: 'Open Partners' },
    how: [
      <>In Business Settings, go to <b>Users</b> then <b>Partners</b> and click <b>Add</b>.</>,
      <>Pick <b>Give a partner access to your assets</b>.</>,
      <>Paste our Business ID: <CopyChip text={MT_BUSINESS_ID} /></>,
      <>Pick your <b>ad account</b> and turn on <b>Manage campaigns</b>. Add your <b>page</b> and <b>pixel</b> the same way.</>,
      <>Click <b>Save changes</b>.</>,
    ],
    path: ['Users › Partners', 'Add', 'Give a partner access', `Business ID ${MT_BUSINESS_ID}`, 'Ad account › Manage campaigns', 'Save changes'],
  } as Step] : []),
  {
    id: 'adaccount',
    title: 'Send us your ad account ID',
    why: 'So we know which account to open first, especially if you have more than one.',
    link: { href: 'https://adsmanager.facebook.com/adsmanager/manage/campaigns', label: 'Open Ads Manager' },
    how: [
      'Open Ads Manager.',
      <>Look at the top left, under your account name, or in the web address after <b>act=</b>. It's a long number.</>,
      'Paste it in the box below, along with your Facebook page name.',
    ],
    path: ['Ads Manager', 'Account name (top left)', 'Copy the number'],
  },
  {
    id: 'app',
    title: 'Developer app (only if we ask)',
    optional: true,
    why: 'Most clients skip this. We only need it for custom reporting or tracking set ups, and we will tell you on your kickoff call.',
    link: { href: 'https://developers.facebook.com/apps', label: 'Open Meta for Developers' },
    how: [
      <>Go to Meta for Developers, click <b>My Apps</b> then <b>Create app</b>.</>,
      <>Pick <b>Other</b>, then app type <b>Business</b>.</>,
      <>Name it after your business (for example "Your Business Ads"), add your email, and connect your <b>business portfolio</b>.</>,
      <>Once it's made, go to <b>App roles</b> then <b>Roles</b>, click <b>Add people</b>, and add us as <b>Developer</b>. We'll send you the name to search on your call.</>,
    ],
    path: ['My Apps', 'Create app', 'Other › Business', 'Name + portfolio', 'App roles › Add people'],
  },
];

/* Looping click-path demo: the pointer walks down the path one click at a time. */
const ClickPath: React.FC<{ path: string[] }> = ({ path }) => {
  const [i, setI] = useState(0);
  useEffect(() => {
    setI(0);
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setI(path.length - 1); return; }
    const t = setInterval(() => setI((n) => (n + 1) % (path.length + 1)), 1100);
    return () => clearInterval(t);
  }, [path]);
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0E141D] overflow-hidden" aria-hidden="true">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-white/10 bg-white/[0.03]">
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" /><span className="w-2.5 h-2.5 rounded-full bg-white/15" /><span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="ml-2 text-[11px] text-white/40 font-mono truncate">Meta Business</span>
      </div>
      <ol className="p-3 space-y-1.5">
        {path.map((p, n) => {
          const state = n < i ? 'done' : n === i ? 'now' : 'next';
          return (
            <li key={p + n} className={`relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-all duration-300 ${state === 'now' ? 'bg-[#5EEAD4]/15 text-white ring-1 ring-[#5EEAD4]/60' : state === 'done' ? 'text-white/70' : 'text-white/35'}`}>
              <span className={`w-5 h-5 shrink-0 rounded-full grid place-items-center text-[11px] font-bold ${state === 'done' ? 'bg-[#5EEAD4] text-[#0B0E14]' : 'border border-white/20'}`}>
                {state === 'done' ? <Check className="w-3 h-3" /> : n + 1}
              </span>
              <span className="truncate">{p}</span>
              {state === 'now' && <MousePointer2 className="absolute right-3 w-4 h-4 text-[#5EEAD4] animate-bounce" fill="#5EEAD4" />}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

const Input: React.FC<{ label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; area?: boolean; required?: boolean }> =
  ({ label, value, onChange, type = 'text', placeholder, area, required }) => (
    <label className="block">
      <span className="block text-[15px] font-semibold">{label}{required && <span className="text-[#5EEAD4]"> *</span>}</span>
      {area ? (
        <textarea rows={3} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3 text-[15px] outline-none focus:border-[#5EEAD4] placeholder:text-white/30" />
      ) : (
        <input type={type} value={value} placeholder={placeholder} required={required} onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3 text-[15px] outline-none focus:border-[#5EEAD4] placeholder:text-white/30" />
      )}
    </label>
  );

const Choice: React.FC<{ value: string; options: string[]; onChange: (v: string) => void }> = ({ value, options, onChange }) => (
  <div className="mt-2 flex flex-wrap gap-2">
    {options.map((o) => (
      <button key={o} type="button" onClick={() => onChange(o)}
        className={`rounded-xl px-4 py-2.5 text-[14px] border transition ${value === o ? 'border-[#5EEAD4] bg-[#5EEAD4]/15 text-white' : 'border-white/10 bg-white/[0.04] text-white/80 hover:border-white/30'}`}>{o}</button>
    ))}
  </div>
);

type Saved = { form: Form; started: boolean; step: number; completed: string[]; adAccountId: string; pageName: string; finished: boolean };
const load = (): Saved | null => { try { return JSON.parse(localStorage.getItem(STORE) || 'null'); } catch { return null; } };

const OnboardingPage: React.FC = () => {
  const saved = typeof window !== 'undefined' ? load() : null;
  const [form, setForm] = useState<Form>(saved?.form || EMPTY);
  const [started, setStarted] = useState(saved?.started || false);
  const [step, setStep] = useState(saved?.step || 0);
  const [completed, setCompleted] = useState<string[]>(saved?.completed || []);
  const [adAccountId, setAdAccountId] = useState(saved?.adAccountId || '');
  const [pageName, setPageName] = useState(saved?.pageName || '');
  const [finished, setFinished] = useState(saved?.finished || false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    try { localStorage.setItem(STORE, JSON.stringify({ form, started, step, completed, adAccountId, pageName, finished })); } catch { /* private mode */ }
  }, [form, started, step, completed, adAccountId, pageName, finished]);
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }); }, [step, started, finished]);

  const set = (k: keyof Form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));
  const post = (body: object) => fetch('/.netlify/functions/onboarding', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

  const start = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.business || !form.ads) { setErr('Fill in the starred fields and pick yes or no on ads.'); return; }
    setErr(''); setBusy(true);
    try { const r = await post({ stage: 'start', form }); if (!r.ok) throw new Error(); } catch { /* still let them continue, we follow up by email */ }
    setBusy(false);
    if (form.ads === 'no') { setFinished(true); setStarted(true); return; }
    setStarted(true); setStep(0);
  };

  const finish = async (list: string[]) => {
    setBusy(true);
    try { await post({ stage: 'done', form, completed: list, adAccountId, pageName }); } catch { /* ignore */ }
    setBusy(false); setFinished(true);
  };

  const s = STEPS[step];
  const isDone = s && completed.includes(s.id);
  const required = STEPS.filter((x) => !x.optional);
  const doneCount = required.filter((x) => completed.includes(x.id)).length;
  const markAndNext = () => {
    const list = completed.includes(s.id) ? completed : [...completed, s.id];
    setCompleted(list);
    if (step < STEPS.length - 1) setStep(step + 1); else finish(list);
  };

  return (
    <Shell title="Onboarding | KenjiAI" description="Get set up with Media Traffics and KenjiAI, one step at a time." wide>
      {!started && (
        <section className="pt-10 sm:pt-14">
          <p className="text-[13px] uppercase tracking-[0.14em] text-[#5EEAD4] font-semibold">Welcome aboard</p>
          <h1 className="display text-[34px] sm:text-[44px] font-extrabold leading-[1.05] mt-3">Let's get you set up.</h1>
          <p className="text-[#A9B4C4] text-[16px] mt-4 max-w-[58ch]">About 10 minutes. First a few questions about your business, then we walk you through giving our team access to your ads, one click at a time.</p>
          <form onSubmit={start} className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-7">
            <div className="grid sm:grid-cols-2 gap-5">
              <Input label="First name" value={form.firstName} onChange={set('firstName')} required />
              <Input label="Email" type="email" value={form.email} onChange={set('email')} required />
              <Input label="Phone" type="tel" value={form.phone} onChange={set('phone')} />
              <Input label="Business name" value={form.business} onChange={set('business')} required />
            </div>
            <Input label="Website" value={form.website} onChange={set('website')} placeholder="yourbusiness.com" />
            <div>
              <span className="block text-[15px] font-semibold">Are we running your Facebook and Instagram ads?<span className="text-[#5EEAD4]"> *</span></span>
              <Choice value={form.ads === 'yes' ? 'Yes' : form.ads === 'no' ? 'No' : ''} options={['Yes', 'No']} onChange={(v) => set('ads')(v === 'Yes' ? 'yes' : 'no')} />
            </div>
            {form.ads === 'yes' && (
              <div>
                <span className="block text-[15px] font-semibold">Monthly ad budget</span>
                <Choice value={form.budget} options={['Under $500', '$500 to $1,500', '$1,500 to $5,000', '$5,000+']} onChange={set('budget')} />
              </div>
            )}
            <Input label="What's the one thing you want from working with us?" area value={form.goal} onChange={set('goal')} placeholder="Example: 20 booked estimates a month" />
            <div>
              <span className="block text-[15px] font-semibold">Best way to reach you</span>
              <Choice value={form.contact} options={['Text', 'Call', 'Email']} onChange={set('contact')} />
            </div>
            {err && <p className="text-[14px] text-[#FCA5A5]">{err}</p>}
            <button type="submit" disabled={busy} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-bold text-[#0B0E14]" style={{ background: ACCENT }}>
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Start setup <ArrowRight className="w-5 h-5" /></>}
            </button>
          </form>
        </section>
      )}

      {started && !finished && s && (
        <section className="pt-8 sm:pt-12">
          <div className="flex items-center justify-between text-[13px] text-[#A9B4C4]">
            <span>Step {step + 1} of {STEPS.length}{s.optional ? ' (optional)' : ''}</span>
            <span>{doneCount} of {required.length} done</span>
          </div>
          <div className="mt-2 flex gap-1.5" role="progressbar" aria-valuemin={0} aria-valuemax={STEPS.length} aria-valuenow={step + 1}>
            {STEPS.map((x, n) => (
              <button key={x.id} type="button" aria-label={`Go to step ${n + 1}: ${x.title}`} onClick={() => setStep(n)}
                style={{ minHeight: 0 }} className="flex-1 py-2 -my-2">
                <span className={`block h-1.5 rounded-full transition ${completed.includes(x.id) ? 'bg-[#5EEAD4]' : n === step ? 'bg-white/60' : 'bg-white/15'}`} />
              </button>
            ))}
          </div>

          <h2 className="display text-[28px] sm:text-[36px] font-extrabold leading-tight mt-7">{s.title}</h2>
          <p className="text-[#A9B4C4] text-[16px] mt-3 max-w-[60ch]">{s.why}</p>

          <div className="mt-7 grid md:grid-cols-[1fr_0.9fr] gap-6 items-start">
            <ol className="space-y-3.5 min-w-0">
              {s.how.map((h, n) => (
                <li key={n} className="flex gap-3 text-[15px] leading-relaxed">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-white/[0.07] border border-white/10 grid place-items-center text-[13px] font-bold text-[#5EEAD4]">{n + 1}</span>
                  <span className="pt-0.5 min-w-0">{h}</span>
                </li>
              ))}
            </ol>
            <div className="min-w-0">
              <p className="text-[12px] uppercase tracking-[0.12em] text-white/40 mb-2">Where to click</p>
              <ClickPath path={s.path} />
            </div>
          </div>

          {s.link && (
            <a href={s.link.href} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-[15px] font-semibold hover:border-[#5EEAD4]">
              {s.link.label} <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {s.id === 'adaccount' && (
            <div className="mt-6 grid sm:grid-cols-2 gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Input label="Ad account ID" value={adAccountId} onChange={setAdAccountId} placeholder="1234567890123456" />
              <Input label="Facebook page name" value={pageName} onChange={setPageName} />
            </div>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <button type="button" onClick={markAndNext} disabled={busy}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3.5 font-bold text-[#0B0E14]" style={{ background: ACCENT }}>
              {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Check className="w-5 h-5" /> {isDone ? 'Done, next step' : s.optional ? 'Done (or skip), finish' : 'Mark complete'}</>}
            </button>
            {step > 0 && (
              <button type="button" onClick={() => setStep(step - 1)} className="inline-flex items-center gap-2 rounded-xl px-4 py-3.5 text-[15px] text-white/70 hover:text-white">
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
            )}
          </div>
          <p className="mt-6 text-[14px] text-[#A9B4C4]">Stuck? Email <CopyChip text={SUPPORT_EMAIL} /> or reply to our last text and we'll walk you through it on a quick screen share.</p>
        </section>
      )}

      {finished && (
        <section className="pt-12 sm:pt-16">
          <div className="w-14 h-14 rounded-full grid place-items-center" style={{ background: ACCENT }}><Check className="w-7 h-7 text-[#0B0E14]" /></div>
          <h2 className="display text-[32px] sm:text-[40px] font-extrabold leading-tight mt-6">You're all set, {form.firstName || 'friend'}.</h2>
          <p className="text-[#A9B4C4] text-[16px] mt-4 max-w-[58ch]">
            {form.ads === 'no'
              ? "We got your answers. Your onboarding specialist will reach out within one business day with your next steps."
              : "We'll accept your access request and check everything on our side within one business day. If anything is missing, we'll text you the exact step."}
          </p>
          {form.ads === 'yes' && (
            <button type="button" onClick={() => { setFinished(false); setStep(0); }} className="mt-8 inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-[15px] font-semibold hover:border-[#5EEAD4]">
              <ArrowLeft className="w-4 h-4" /> Review the steps
            </button>
          )}
        </section>
      )}
    </Shell>
  );
};

export default OnboardingPage;
