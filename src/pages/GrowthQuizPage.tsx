import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/* Growth quiz: one question per screen, then contact details, then the server decides where
   they go. Qualified -> /growth-quiz/book (calendar). Not yet -> /growth-quiz/next-step ($7 offer). */

const CALENDAR_ID = 'jB82SG2CBq9Nh8103IfC'; // "#1 Client Attraction System Walkthrough", 15 min
const LOW_TICKET_URL = 'https://freedom.kenjiai.com/makemore';
const LEAD_KEY = 'kenji-growth-quiz-lead';

type Option = { value: string; label: string; detail?: string };
type Question = { id: string; title: string; help?: string; options: Option[] };

const QUESTIONS: Question[] = [
  {
    id: 'role', title: 'Which best describes you?',
    options: [
      { value: 'owner', label: 'I own a business that’s already making sales' },
      { value: 'agency', label: 'I run a marketing agency' },
      { value: 'launching', label: 'I’m about to launch a business' },
      { value: 'browsing', label: 'I’m just looking around' },
    ],
  },
  {
    id: 'industry', title: 'What kind of business is it?',
    options: [
      { value: 'home', label: 'Home services' },
      { value: 'health', label: 'Health, wellness or med spa' },
      { value: 'professional', label: 'Legal, tax or financial services' },
      { value: 'realestate', label: 'Real estate' },
      { value: 'coaching', label: 'Coaching, consulting or courses' },
      { value: 'ecommerce', label: 'Ecommerce' },
      { value: 'other', label: 'Something else' },
    ],
  },
  {
    id: 'revenue', title: 'Roughly how much does the business bring in each month?',
    options: [
      { value: 'under_10k', label: 'Under $10K' },
      { value: '10k_30k', label: '$10K to $30K' },
      { value: '30k_100k', label: '$30K to $100K' },
      { value: '100k_plus', label: '$100K or more' },
    ],
  },
  {
    id: 'bottleneck', title: 'What’s holding growth back the most right now?',
    options: [
      { value: 'leads', label: 'Not enough leads' },
      { value: 'conversion', label: 'Leads come in but don’t book or buy' },
      { value: 'followup', label: 'Missed calls and slow follow-up' },
      { value: 'time', label: 'I’m doing everything myself' },
      { value: 'ad_cost', label: 'Ads cost too much for what they bring in' },
    ],
  },
  {
    id: 'budget', title: 'How much can you put toward growth each month?', help: 'Ad spend plus done-for-you help, together.',
    options: [
      { value: 'under_1k', label: 'Under $1,000' },
      { value: '1k_3k', label: '$1,000 to $3,000' },
      { value: '3k_10k', label: '$3,000 to $10,000' },
      { value: '10k_plus', label: '$10,000 or more' },
    ],
  },
  {
    id: 'timeline', title: 'If it’s a fit, when do you want to start?',
    options: [
      { value: 'now', label: 'Right away' },
      { value: '30_days', label: 'Within 30 days' },
      { value: '1_3_months', label: 'In 1 to 3 months' },
      { value: 'researching', label: 'I’m just researching for now' },
    ],
  },
  {
    id: 'decision', title: 'Who makes the call on an investment like this?',
    options: [
      { value: 'me', label: 'Me' },
      { value: 'partner', label: 'Me and a business partner' },
      { value: 'someone_else', label: 'Someone else' },
    ],
  },
];

// Mirrors netlify/functions/growth-quiz.ts; only used if the server can't be reached.
const DISQUALIFY: Record<string, string[]> = {
  role: ['launching', 'browsing'], revenue: ['under_10k'], budget: ['under_1k'], timeline: ['researching'], decision: ['someone_else'],
};
const qualifiedLocally = (a: Record<string, string>) => Object.entries(DISQUALIFY).every(([q, bad]) => a[q] && !bad.includes(a[q]));

// The site-wide GTM container doesn't load the Meta pixel on these pages, so the funnel loads
// its own. "Client Attraction/Kenji" pixel, owned by the Media ADZ ad account the quiz ads run from.
const PIXEL_ID = '2406747486323295';
type Fbq = ((...args: unknown[]) => void) & { callMethod?: (...a: unknown[]) => void; queue?: unknown[]; push?: unknown; loaded?: boolean; version?: string };
type FbqWindow = Window & { fbq?: Fbq; _fbq?: Fbq };
function ensurePixel() {
  const w = window as FbqWindow;
  if (w.fbq) return;
  const n: Fbq = function (...args: unknown[]) { if (n.callMethod) n.callMethod(...args); else n.queue!.push(args); } as Fbq;
  n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
  w.fbq = n; w._fbq = n;
  const s = document.createElement('script');
  s.async = true; s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
  n('init', PIXEL_ID);
  n('track', 'PageView');
}
const cookie = (name: string) => document.cookie.split('; ').find((c) => c.startsWith(name + '='))?.split('=')[1];

/** Browser pixel + server-side CAPI with a shared event_id, so Meta counts it once even when the browser blocks the pixel. */
function track(event: string, standard: boolean, params: Record<string, unknown> = {}, user?: { email?: string; phone?: string }) {
  ensurePixel();
  const w = window as FbqWindow;
  const eventID = `gq-${event}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const data = { content_name: 'growth-quiz', ...params };
  try { w.fbq?.(standard ? 'track' : 'trackCustom', event, data, { eventID }); } catch { /* tracking is optional */ }
  if (!standard) return;
  fetch('/.netlify/functions/meta-capi', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
    body: JSON.stringify({
      event_name: event, event_id: eventID, event_source_url: window.location.href, custom_data: data,
      user_data: { em: user?.email, ph: user?.phone?.replace(/\D/g, ''), fbp: cookie('_fbp'), fbc: cookie('_fbc') },
    }),
  }).catch(() => null);
}

type Lead = { first_name: string; email: string; phone: string };
const saveLead = (l: Lead) => { try { sessionStorage.setItem(LEAD_KEY, JSON.stringify(l)); } catch { /* private mode */ } };
const readLead = (): Lead | null => { try { return JSON.parse(sessionStorage.getItem(LEAD_KEY) || 'null'); } catch { return null; } };
const QUALIFIED_KEY = 'kenji-growth-quiz-qualified';

/* ---------- shared shell ---------- */

const Shell: React.FC<{ title: string; description: string; children: React.ReactNode; wide?: boolean }> = ({ title, description, children, wide }) => (
  <>
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="noindex, nofollow" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&display=swap" rel="stylesheet" />
    </Helmet>
    <div className="gq min-h-screen text-[#F3EEE6]" style={{ background: 'radial-gradient(120% 70% at 50% -10%, #142133 0%, #0B0E14 55%)' }}>
      <style>{`
        .gq ::selection { background: rgba(94, 234, 212, 0.35); color: #fff; }
        .gq .display { font-family: 'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.02em; }
        .gq :focus-visible { outline: 2px solid #5EEAD4; outline-offset: 3px; border-radius: 14px; }
        .gq input { caret-color: #5EEAD4; }
      `}</style>
      <header className="px-5 pt-6 sm:pt-8 max-w-6xl mx-auto">
        <img src="/kenji-logo.webp" alt="KenjiAI" className="h-9 sm:h-10 w-auto object-contain" />
      </header>
      <main className={`px-5 pb-16 mx-auto ${wide ? 'max-w-3xl' : 'max-w-xl'}`}>{children}</main>
    </div>
  </>
);

const PROOF = '$3.35M generated for 500+ businesses';

/* ---------- quiz ---------- */

const GrowthQuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(-1); // -1 intro, 0..n-1 questions, n contact
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [lead, setLead] = useState<Lead>({ first_name: '', email: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dir, setDir] = useState(1);
  const advanceTimer = useRef<number | null>(null);
  const total = QUESTIONS.length;
  const q = step >= 0 && step < total ? QUESTIONS[step] : null;

  useEffect(() => { ensurePixel(); return () => { if (advanceTimer.current) window.clearTimeout(advanceTimer.current); }; }, []);

  const go = useCallback((n: number) => { setDir(n > step ? 1 : -1); setStep(n); setError(''); }, [step]);

  const choose = useCallback((qid: string, value: string) => {
    setAnswers((a) => ({ ...a, [qid]: value }));
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    // A short beat so the choice visibly lands before the next question slides in.
    advanceTimer.current = window.setTimeout(() => { setDir(1); setStep((s) => s + 1); }, 260);
  }, []);

  // Number keys pick an answer, Backspace goes back.
  useEffect(() => {
    if (!q) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      const n = Number(e.key);
      if (n >= 1 && n <= q.options.length) choose(q.id, q.options[n - 1].value);
      if (e.key === 'Backspace' && step > 0) go(step - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [q, step, choose, go]);

  const start = () => { track('QuizStarted', false); go(0); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    let qualified = qualifiedLocally(answers);
    try {
      const r = await fetch('/.netlify/functions/growth-quiz', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, answers }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.status === 400) { setError(data.error || 'Please check your details.'); setBusy(false); return; }
      if (typeof data.qualified === 'boolean') qualified = data.qualified;
    } catch { /* offline or server down: route on the local score */ }
    saveLead(lead);
    try { if (qualified) sessionStorage.setItem(QUALIFIED_KEY, 'pending'); else sessionStorage.removeItem(QUALIFIED_KEY); } catch { /* private mode */ }
    track('Lead', true, { qualified }, { email: lead.email, phone: lead.phone });
    track(qualified ? 'QualifiedLead' : 'UnqualifiedLead', false);
    navigate(qualified ? '/growth-quiz/book' : '/growth-quiz/next-step');
  };

  const progress = step < 0 ? 0 : Math.min(1, step / total);

  return (
    <Shell title="Growth Quiz | KenjiAI" description="Seven quick questions to see if done-for-you growth is the right move for your business right now.">
      {step >= 0 && (
        <div className="mt-8 sm:mt-12" aria-hidden="true">
          <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
            <motion.div className="h-full rounded-full bg-[#5EEAD4]" initial={false} animate={{ width: `${Math.max(4, progress * 100)}%` }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} />
          </div>
          <div className="mt-3 flex items-center justify-between text-[14px] text-[#A9B4C4]">
            {step > 0 ? (
              <button type="button" onClick={() => go(step - 1)} className="inline-flex items-center gap-1.5 font-medium hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Back
              </button>
            ) : <span />}
            <span>{step < total ? `Question ${step + 1} of ${total}` : 'Last step'}</span>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait" custom={dir} initial={false}>
        {step === -1 && (
          <motion.section key="intro" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="pt-16 sm:pt-24">
            <h1 className="display text-[40px] sm:text-[56px] leading-[1.02] font-extrabold text-balance">
              Is your business ready for done-for-you growth?
            </h1>
            <p className="mt-5 text-[18px] sm:text-[20px] leading-relaxed text-[#C9D2DE] max-w-[34ch]">
              Seven quick questions, about a minute. If it’s a fit, you’ll pick a time to talk with our team. If it’s not yet, we’ll point you to a better first step.
            </p>
            <button type="button" onClick={start} className="mt-9 inline-flex items-center gap-2.5 rounded-2xl bg-[#5EEAD4] text-[#06221E] font-bold text-[18px] px-7 py-4 shadow-[0_14px_34px_-14px_rgba(94,234,212,0.7)] hover:bg-[#7FF0DF] transition-colors">
              Start the quiz <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <p className="mt-8 text-[15px] text-[#A9B4C4]">{PROOF}, with ads, AI call answering and follow-up systems.</p>
          </motion.section>
        )}

        {q && (
          <motion.section
            key={q.id} custom={dir}
            initial={{ opacity: 0, x: 28 * dir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 * dir }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="pt-10 sm:pt-14" aria-labelledby={`q-${q.id}`}
          >
            <h1 id={`q-${q.id}`} className="display text-[30px] sm:text-[40px] leading-[1.08] font-extrabold text-balance">{q.title}</h1>
            {q.help && <p className="mt-3 text-[17px] text-[#A9B4C4]">{q.help}</p>}
            <ul className="mt-8 space-y-3" role="radiogroup" aria-labelledby={`q-${q.id}`}>
              {q.options.map((o, i) => {
                const on = answers[q.id] === o.value;
                return (
                  <li key={o.value}>
                    <button
                      type="button" role="radio" aria-checked={on} onClick={() => choose(q.id, o.value)}
                      className={`w-full flex items-center gap-4 rounded-2xl border px-4 sm:px-5 py-4 text-left text-[17px] sm:text-[18px] font-medium transition-colors ${on ? 'border-[#5EEAD4] bg-[#5EEAD4]/12 text-white' : 'border-white/12 bg-white/[0.035] hover:border-white/30 hover:bg-white/[0.06]'}`}
                    >
                      <span className={`shrink-0 w-8 h-8 rounded-lg grid place-items-center text-[14px] font-bold tabular-nums ${on ? 'bg-[#5EEAD4] text-[#06221E]' : 'bg-white/8 text-[#A9B4C4]'}`}>
                        {on ? <Check className="w-4 h-4" aria-hidden="true" /> : i + 1}
                      </span>
                      <span>{o.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.section>
        )}

        {step === total && (
          <motion.section key="contact" initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -28 }} transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }} className="pt-10 sm:pt-14">
            <h1 className="display text-[30px] sm:text-[40px] leading-[1.08] font-extrabold text-balance">Where should we send your results?</h1>
            <p className="mt-3 text-[17px] text-[#A9B4C4]">You’ll see your next step right after this.</p>
            <form onSubmit={submit} className="mt-8 space-y-4" noValidate>
              {([
                ['first_name', 'First name', 'text', 'given-name', ''],
                ['email', 'Email', 'email', 'email', 'you@business.com'],
                ['phone', 'Phone', 'tel', 'tel', '(555) 555-5555'],
              ] as const).map(([k, label, type, ac, ph]) => (
                <label key={k} className="block">
                  <span className="block mb-2 font-semibold text-[15px]">{label}</span>
                  <input
                    type={type} autoComplete={ac} placeholder={ph} required value={lead[k]}
                    inputMode={type === 'tel' ? 'tel' : type === 'email' ? 'email' : undefined}
                    onChange={(e) => setLead((l) => ({ ...l, [k]: e.target.value }))}
                    className="w-full rounded-2xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-[17px] text-white placeholder:text-[#7D8899] focus:border-[#5EEAD4] focus:outline-none"
                  />
                </label>
              ))}
              {error && <p role="alert" className="text-[15px] font-semibold text-[#FFB4A1]">{error}</p>}
              <button
                type="submit" disabled={busy || !lead.first_name.trim() || !lead.email.trim() || !lead.phone.trim()}
                className="w-full mt-2 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#5EEAD4] text-[#06221E] font-bold text-[18px] px-7 py-4 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#7FF0DF] transition-colors"
              >
                {busy ? <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Checking your answers</> : <>See my results <ArrowRight className="w-5 h-5" aria-hidden="true" /></>}
              </button>
              <p className="text-[13px] leading-relaxed text-[#7D8899]">
                By continuing you agree that KenjiAI can contact you by phone, text and email about your results. Message and data rates may apply. Reply STOP to opt out anytime.
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </Shell>
  );
};

export default GrowthQuizPage;

/* ---------- qualified: booking page ---------- */

export const GrowthQuizBookPage: React.FC = () => {
  const lead = useMemo(readLead, []);
  const src = useMemo(() => {
    const p = new URLSearchParams();
    if (lead?.first_name) p.set('first_name', lead.first_name);
    if (lead?.email) p.set('email', lead.email);
    if (lead?.phone) p.set('phone', lead.phone);
    const qs = p.toString();
    return `https://api.leadconnectorhq.com/widget/booking/${CALENDAR_ID}${qs ? `?${qs}` : ''}`;
  }, [lead]);

  useEffect(() => {
    // The qualified-lead event: fires once, only when they land here straight from a qualifying quiz.
    ensurePixel();
    try {
      if (sessionStorage.getItem(QUALIFIED_KEY) === 'pending') {
        sessionStorage.setItem(QUALIFIED_KEY, 'sent');
        track('SubmitApplication', true, { qualified: true }, { email: lead?.email, phone: lead?.phone });
      }
    } catch { /* private mode */ }
  }, [lead]);

  useEffect(() => {
    // Track the actual booking when the GHL widget reports it.
    const onMsg = (e: MessageEvent) => {
      if (typeof e.data === 'string' ? /booked|appointment/i.test(e.data) : /booked|appointment/i.test(JSON.stringify(e.data || ''))) track('Schedule', true);
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, []);

  return (
    <Shell title="Pick a time | KenjiAI" description="Book your growth call with the KenjiAI team." wide>
      <section className="pt-12 sm:pt-16">
        <h1 className="display text-[36px] sm:text-[52px] leading-[1.03] font-extrabold text-balance">
          {lead?.first_name ? `You’re a fit, ${lead.first_name}.` : 'You’re a fit.'} Pick a time that works.
        </h1>
        <p className="mt-4 text-[18px] leading-relaxed text-[#C9D2DE] max-w-[46ch]">
          It’s a 15-minute call with our team. Here’s what we’ll cover:
        </p>
        <ul className="mt-5 space-y-3 text-[17px]">
          {[
            'Where your leads are leaking right now, from the ad to the booked appointment.',
            'What we’d build for you: ads, AI call answering, and the follow-up that runs on its own.',
            'A clear plan you can use whether you work with us or not.',
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <Check className="w-5 h-5 mt-0.5 shrink-0 text-[#5EEAD4]" aria-hidden="true" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <div className="mt-9 rounded-3xl overflow-hidden bg-white shadow-[0_24px_60px_-28px_rgba(0,0,0,0.8)]">
          <iframe src={src} title="Book your growth call" className="w-full block border-0" style={{ minHeight: 900 }} scrolling="no" id={`${CALENDAR_ID}_booking`} />
        </div>
        <p className="mt-6 text-[15px] text-[#A9B4C4]">{PROOF}. Your answers are already with our team, so the call starts where you are.</p>
      </section>
    </Shell>
  );
};

/* ---------- not a fit yet: low-ticket page ---------- */

export const GrowthQuizNextStepPage: React.FC = () => {
  const lead = useMemo(readLead, []);
  useEffect(() => { ensurePixel(); }, []);
  return (
    <Shell title="Your next step | KenjiAI" description="A better first step for growing your business.">
      <section className="pt-12 sm:pt-16">
        <h1 className="display text-[34px] sm:text-[48px] leading-[1.04] font-extrabold text-balance">
          {lead?.first_name ? `Thanks, ${lead.first_name}.` : 'Thanks for taking the quiz.'} Done-for-you isn’t the right move just yet.
        </h1>
        <p className="mt-5 text-[18px] leading-relaxed text-[#C9D2DE]">
          Our done-for-you work is built for businesses already doing $10K+ a month with a budget to grow. You’re not quite there, and that’s a normal place to be. The better step right now is learning how to get customers yourself, so the business gets there faster.
        </p>

        <div className="mt-10 rounded-3xl border border-white/12 bg-white/[0.04] p-6 sm:p-8">
          <h2 className="display text-[26px] sm:text-[30px] leading-tight font-extrabold">The Ad Optimization Community, $7</h2>
          <p className="mt-2 text-[16px] text-[#A9B4C4]">Learn how ads, sales and follow-up work, so you can run them yourself.</p>
          <ul className="mt-6 space-y-3 text-[17px]">
            {[
              'Paid ads training from our media buyers',
              'Weekly live Q&As on sales, ads and AI systems',
              'High-ticket sales masterclass',
              'A private community of owners doing the same work',
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <Check className="w-5 h-5 mt-0.5 shrink-0 text-[#5EEAD4]" aria-hidden="true" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <a
            href={LOW_TICKET_URL} onClick={() => track('LowTicketClick', false)}
            className="mt-8 w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#5EEAD4] text-[#06221E] font-bold text-[18px] px-7 py-4 hover:bg-[#7FF0DF] transition-colors"
          >
            Join for $7 <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </a>
        </div>

        <p className="mt-8 text-[16px] text-[#A9B4C4]">
          Once the business is past $10K a month, <a href="/growth-quiz" className="text-[#5EEAD4] underline underline-offset-4">take the quiz again</a> and we’ll talk.
        </p>
      </section>
    </Shell>
  );
};
