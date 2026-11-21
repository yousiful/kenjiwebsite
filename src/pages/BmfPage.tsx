import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Download } from 'lucide-react';

// Client funnel for Brenten Fortner / BMF Fitness (2026-11-20), Launch Time pattern.
// Step 1 (11/20 v2): 6-question BMF Protein Score quiz + opt-in -> lead tagged "bmf quiz lead" in his
// GHL (bmf-lead.ts). Step 2: score + $9 BMF 7-Day Protein Fix + optional bumps ($27 14-Day Kickstart, $47 30-Day Starter), paid on
// our Stripe with honest BMF labels (netlify/functions/bmf-checkout.ts). /bmf/welcome confirms
// payment (bmf-confirm.ts), hands over the PDF and runs the 90-Day Grind application.
// Buyers and applicants are tagged in HIS GHL location. Pixel: his 2263283320889296, initialised
// in index.html instead of ours on /bmf routes. Funnel steps: cta_bmf-pay, cta_bmf-paid,
// cta_bmf-apply, cta_bmf-book, cta_bmf-notready (kenjiai.com/funnel-stats/).

const PIXEL = '2263283320889296';
const LOGO = 'https://storage.googleapis.com/funnel-ai-production/chat/xwyjNA3VkE69wsLl7eIE/bmf-logo-master.png';
const GUIDE = '/bmf/7-day-protein-fix.pdf';
const INSTAGRAM = 'https://www.instagram.com/fortnerb45/';
const CALENDAR = 'https://api.leadconnectorhq.com/widget/booking/dW59XWrf7oj7SrtnTQJI';
const DESCRIPTOR = 'MEDIA-TRAF* BMFFITNESS';
const SUPPORT = 'support@mediatraffics.com';
const FONTS = 'https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Barlow:wght@400;500;600&display=swap';

const ft = (step: string) => (window as unknown as { __ft?: { send: (s: string) => void } }).__ft?.send(step);
const fbq = (...args: unknown[]) => (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.(...args);
const cookie = (name: string) => document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))?.split('=')[1] || '';

const BUMPS = [
  {
    id: 'kickstart',
    price: 27,
    title: 'Add the 14-Day Kickstart',
    body: 'Two weeks of workouts and meals built for you by Brenten, inside his coaching app. He texts you within 24 hours to set it up.',
  },
  {
    id: 'starter',
    price: 47,
    title: 'Add the 30-Day Starter',
    body: 'Your first month in the app with a custom plan and 1 group check-in. If you move up to the 90-Day Grind later, the $47 counts toward it.',
  },
] as const;
type BumpId = (typeof BUMPS)[number]['id'];

const display = 'font-["Barlow_Condensed",sans-serif]';

function Shell({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className={'min-h-screen bg-white text-[#111] antialiased font-["Barlow",system-ui,sans-serif]'}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content="A 7-day high-protein eating guide from BMF Fitness coach Brenten Fortner. $9." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="stylesheet" href={FONTS} />
      </Helmet>
      <header className="bg-black">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center gap-3">
          <img src={LOGO} alt="BMF Fitness" className="h-9 w-auto" width={90} height={36} />
          <span className="ml-auto text-sm text-[#BFBFBF]">Train hard. Fuel right. Be better.</span>
        </div>
      </header>
      {children}
      <footer className="border-t border-[#E5E5E5] mt-16">
        <div className="max-w-2xl mx-auto px-4 py-6 text-xs text-[#6B6B6B] leading-relaxed">
          BMF Fitness, Princeton, Indiana. <a className="underline" href="https://bmffitness.org">bmffitness.org</a>.
          {' '}Checkout is run by KenjiAI, BMF Fitness's marketing partner. Order questions: <a className="underline" href={`mailto:${SUPPORT}`}>{SUPPORT}</a>.
        </div>
      </footer>
    </div>
  );
}

// ---------- /bmf : step 1 quiz + opt-in (lead in his GHL), step 2 score + $9 offer ----------

const PHOTO = '/bmf/brenten.jpg';

type Answers = { goal?: string; weight?: string; meals?: string; plan?: string; days?: string; blocker?: string };
type Lead = { name: string; email: string; phone: string };
type Result = { score: number; band: 'Guessing' | 'Close' | 'Dialed in'; protein: number; perMeal: number };

const QUIZ: { key: keyof Answers; label: string; hint?: string; options?: string[] }[] = [
  { key: 'goal', label: "What's your main goal right now?", options: ['Lose fat', 'Build muscle', 'Get stronger', 'Get back in shape'] },
  { key: 'weight', label: "What's your goal bodyweight?", hint: 'In pounds. Your protein number is built from your goal weight, not your current weight.' },
  { key: 'meals', label: 'How many of your meals a day have a real protein source?', hint: 'Chicken, eggs, fish, lean beef, Greek yogurt, cottage cheese, a shake.', options: ['0 to 1', '2', '3 or more'] },
  { key: 'plan', label: 'How often do you plan your food ahead?', options: ['Rarely, I eat what is closest', 'Some days', 'Most days'] },
  { key: 'days', label: 'How many days a week do you train?', options: ['0', '1 to 2', '3 to 4', '5 or more'] },
  { key: 'blocker', label: 'What gets in the way most?', options: ['No time to cook', "I don't know what to eat", 'Cravings and snacking', 'Staying consistent'] },
];

const PTS: Record<string, Record<string, number>> = {
  meals: { '0 to 1': 8, '2': 22, '3 or more': 38 },
  plan: { 'Rarely, I eat what is closest': 6, 'Some days': 17, 'Most days': 30 },
  days: { '0': 6, '1 to 2': 14, '3 to 4': 24, '5 or more': 32 },
};

function scoreOf(a: Answers): Result {
  const score = Math.min(100, (PTS.meals[a.meals || ''] || 0) + (PTS.plan[a.plan || ''] || 0) + (PTS.days[a.days || ''] || 0));
  const band: Result['band'] = score < 45 ? 'Guessing' : score < 75 ? 'Close' : 'Dialed in';
  const protein = Math.round((Number(a.weight) || 0) * 0.8);
  return { score, band, protein, perMeal: Math.round(protein / 3) };
}

const BAND_COPY: Record<Result['band'], string> = {
  Guessing: "You're training on guesswork. Most of your meals are light on protein and nothing is planned, so the work you put in doesn't show the way it should. This is the easiest place to make fast progress.",
  Close: "You've got some of it, but there are gaps. A couple of meals a day carry your protein and the rest is whatever's around. Closing that gap is usually what gets people unstuck.",
  'Dialed in': "You're ahead of most people. Your habits are solid, so the next step is hitting your number every day on purpose instead of most days by accident.",
};

const BLOCKER_TIP: Record<string, string> = {
  'No time to cook': 'The 45-minute prep plan covers the whole week, so weeknights are heat and eat.',
  "I don't know what to eat": 'Every meal is written out for you, with the protein listed, plus the grocery list.',
  'Cravings and snacking': 'Protein at every meal keeps you full, and there are 5 easy swaps for the snacks you reach for.',
  'Staying consistent': 'A 7-day checklist so you can see every day you hit your number.',
};

const PLAN_ITEMS = [
  'How to find and hit your daily protein number',
  '7 days of breakfast, lunch, dinner and a snack, protein listed for each',
  'A 45-minute prep plan, grocery list and 5 easy swaps',
  'A 7-day checklist to keep you honest',
];

const ss = {
  get: (k: string) => {
    try { return JSON.parse(sessionStorage.getItem(k) || 'null'); } catch { return null; }
  },
  set: (k: string, v: unknown) => {
    try { sessionStorage.setItem(k, JSON.stringify(v)); } catch { /* private mode */ }
  },
};

function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-[#E5E5E5]" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={step}>
      <div className="h-1.5 rounded-full bg-[#ff3b1f] transition-all" style={{ width: `${(step / total) * 100}%` }} />
    </div>
  );
}

function OrderBox({ email }: { email: string }) {
  const [bumps, setBumps] = useState<BumpId[]>([]);
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const total = 9 + BUMPS.filter((b) => bumps.includes(b.id)).reduce((s, b) => s + b.price, 0);
  const toggle = (id: BumpId) => setBumps((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  const pay = async () => {
    setState('loading');
    ft('cta_bmf-pay');
    fbq('trackSingle', PIXEL, 'InitiateCheckout', { value: total, currency: 'USD', content_name: 'BMF 7-Day Protein Fix', num_items: 1 + bumps.length });
    try {
      const r = await fetch('/.netlify/functions/bmf-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bumps, email, fbp: cookie('_fbp'), fbc: cookie('_fbc') }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.url) throw new Error(d.error || 'checkout');
      window.location.href = d.url;
    } catch {
      setState('error');
    }
  };

  const label = state === 'loading' ? 'Opening secure checkout...' : `Pay $${total} and get the guide`;

  return (
    <section id="order" className="mt-10 scroll-mt-6 rounded-xl border-2 border-black p-5 sm:p-6" data-track-section="bmf_order">
      <h2 className={`${display} text-[30px] font-bold`}>Your order</h2>
      <div className="mt-3 flex items-baseline justify-between text-[17px]">
        <span>BMF 7-Day Protein Fix (PDF)</span>
        <span className="font-semibold tabular-nums">$9</span>
      </div>
      <div className="mt-5 space-y-3">
        {BUMPS.map((b) => {
          const on = bumps.includes(b.id);
          return (
            <label key={b.id} className={`flex gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${on ? 'border-black bg-[#F4F4F4]' : 'border-[#D4D4D4] hover:border-[#888]'}`}>
              <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-black" checked={on} onChange={() => toggle(b.id)} data-bump={b.id} />
              <span>
                <span className="flex items-baseline justify-between gap-3">
                  <span className="font-semibold">{b.title}</span>
                  <span className="font-semibold tabular-nums">+${b.price}</span>
                </span>
                <span className="mt-1 block text-[15px] text-[#444] leading-relaxed">{b.body}</span>
              </span>
            </label>
          );
        })}
      </div>
      <div className="mt-5 flex items-baseline justify-between border-t border-[#E5E5E5] pt-4 text-[18px]">
        <span className="font-semibold">Total today</span>
        <span className="font-bold tabular-nums" data-testid="bmf-total">${total}</span>
      </div>
      <button
        type="button"
        onClick={pay}
        disabled={state === 'loading'}
        className={`${display} mt-5 w-full rounded-lg bg-black text-white text-[22px] font-bold tracking-wide py-4 hover:bg-[#222] disabled:opacity-70 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-black/30`}
      >
        {label}
      </button>
      {state === 'error' && (
        <p className="mt-3 text-sm text-[#B42318] text-center" role="alert">
          Checkout didn't open. Try again, or email <a className="underline" href={`mailto:${SUPPORT}`}>{SUPPORT}</a> and we'll sort it out.
        </p>
      )}
      <p className="mt-4 text-[13px] text-[#555] leading-relaxed text-center">
        One-time payment, no subscription. Secure checkout processed by KenjiAI, BMF Fitness's marketing partner. Your statement will show {DESCRIPTOR}.
      </p>
    </section>
  );
}

function Results({ lead, answers }: { lead: Lead; answers: Answers }) {
  const r = scoreOf(answers);
  const first = lead.name.trim().split(/\s+/)[0];
  const tip = BLOCKER_TIP[answers.blocker || ''];
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <main className="max-w-2xl mx-auto px-4 pt-8 sm:pt-12" aria-live="polite">
      <p className="text-sm font-semibold tracking-wide text-[#6B6B6B]">{first ? `${first}, here's` : "Here's"} your BMF Protein Score</p>
      <div className="mt-3 rounded-2xl bg-black text-white p-6 sm:p-8">
        <div className="flex items-end gap-4">
          <span className={`${display} text-[88px] leading-[.85] font-extrabold tabular-nums`} data-testid="bmf-score">{r.score}</span>
          <span className="pb-2 text-[#BFBFBF]">out of 100</span>
          <span className={`${display} ml-auto mb-2 rounded-full bg-[#ff3b1f] px-4 py-1 text-[20px] font-bold uppercase tracking-wide`}>{r.band}</span>
        </div>
        <div className="mt-5 h-2 rounded-full bg-[#333]"><div className="h-2 rounded-full bg-[#ff3b1f]" style={{ width: `${r.score}%` }} /></div>
        <p className="mt-5 text-[17px] leading-relaxed text-[#E5E5E5]">{BAND_COPY[r.band]}</p>
      </div>

      {r.protein > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-[#D4D4D4] p-4">
            <p className="text-sm text-[#555]">Your daily protein number</p>
            <p className={`${display} text-[40px] font-extrabold tabular-nums`}>{r.protein} g</p>
            <p className="text-[13px] text-[#555]">0.8 g per pound of your {answers.weight} lb goal</p>
          </div>
          <div className="rounded-xl border border-[#D4D4D4] p-4">
            <p className="text-sm text-[#555]">That's about</p>
            <p className={`${display} text-[40px] font-extrabold tabular-nums`}>{r.perMeal} g</p>
            <p className="text-[13px] text-[#555]">per meal, over 3 meals</p>
          </div>
        </div>
      )}

      <section className="mt-10">
        <p className="text-sm font-semibold tracking-wide text-[#ff3b1f] uppercase">Your plan</p>
        <h1 className={`${display} mt-1 text-[38px] sm:text-[46px] leading-[1.02] font-extrabold`}>Start with the BMF 7-Day Protein Fix</h1>
        <p className="mt-3 text-[17px] leading-relaxed text-[#333]">
          It's the first thing Brenten fixes with every client he coaches. One week, every meal laid out, built so you hit your number without
          guessing. $9, instant PDF.
        </p>
        <ul className="mt-5 space-y-3 text-[17px]">
          {PLAN_ITEMS.map((t) => (
            <li key={t} className="flex gap-3"><Check className="w-5 h-5 mt-1 shrink-0" aria-hidden="true" /><span>{t}</span></li>
          ))}
        </ul>
        {tip && <p className="mt-4 rounded-lg bg-[#F4F4F4] p-4 text-[16px]"><b>You said "{answers.blocker}".</b> {tip}</p>}
      </section>

      <section className="mt-10 rounded-xl bg-[#F4F4F4] p-5 sm:p-6 grid grid-cols-[96px_1fr] sm:grid-cols-[130px_1fr] gap-4 items-start" data-track-section="bmf_note">
        <img src={PHOTO} alt="Brenten Fortner" width={130} height={173} className="w-full rounded-lg object-cover" />
        <div className="text-[16px] leading-relaxed">
          <p>Most people I talk to are busy and guessing on food. They train hard, then eat whatever is closest, so the work doesn't show.</p>
          <p className="mt-3">Follow this for seven days and pay attention to how you feel. If you want me to build the rest of your plan after that, I'll show you how on the next page.</p>
          <p className="mt-3 font-semibold">Brenten Fortner</p>
          <p className="text-sm text-[#555]">ISSA certified personal trainer, BMF Fitness</p>
        </div>
      </section>

      <OrderBox email={lead.email} />
    </main>
  );
}

export default function BmfPage() {
  const [saved] = useState(() => ss.get('bmf_quiz') as { lead: Lead; answers: Answers } | null);
  const n = QUIZ.length;
  const [answers, setAnswers] = useState<Answers>(saved?.answers || {});
  // -1 intro, 0..n-1 questions, n opt-in, n+1 results
  const [step, setStep] = useState<number>(saved?.lead ? n + 1 : -1);
  const [lead, setLead] = useState<Lead>(saved?.lead || { name: '', email: '', phone: '' });
  const [hp, setHp] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'error'>('idle');
  const [err, setErr] = useState('');

  const pick = (key: keyof Answers, v: string) => {
    setAnswers((a) => ({ ...a, [key]: v }));
    setTimeout(() => setStep((s) => s + 1), 180);
  };

  const optIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    const r = scoreOf(answers);
    const eventId = `bmflead_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
    try {
      const res = await fetch('/.netlify/functions/bmf-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, answers, score: r.score, band: r.band, protein: r.protein, event_id: eventId, fbp: cookie('_fbp'), fbc: cookie('_fbc'), company: hp }),
      });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(d.error || '');
        throw new Error('lead');
      }
      fbq('trackSingle', PIXEL, 'Lead', { content_name: 'BMF Protein Score quiz' }, { eventID: eventId });
      ft('cta_bmf-lead');
      ss.set('bmf_quiz', { lead, answers });
      setState('idle');
      setStep(n + 1);
    } catch {
      setState('error');
    }
  };

  if (step === n + 1) {
    return (
      <Shell title="Your BMF Protein Score | BMF Fitness">
        <Results lead={lead} answers={answers} />
      </Shell>
    );
  }

  const q = step >= 0 && step < n ? QUIZ[step] : null;
  const weightOk = Number(answers.weight) >= 90 && Number(answers.weight) <= 400;
  const back = (
    <button type="button" onClick={() => setStep((s) => s - 1)} className="underline">Back</button>
  );

  return (
    <Shell title="What's your BMF Protein Score? | BMF Fitness">
      <main className="max-w-xl mx-auto px-4 pt-8 sm:pt-12">
        {step === -1 && (
          <section>
            <div className="grid grid-cols-[1fr_112px] sm:grid-cols-[1fr_150px] gap-4 items-center">
              <div>
                <p className="text-sm font-semibold tracking-wide text-[#ff3b1f] uppercase">Free 60-second quiz</p>
                <h1 className={`${display} mt-1 text-[40px] sm:text-[50px] leading-[1.0] font-extrabold tracking-tight`}>What's your BMF Protein Score?</h1>
              </div>
              <img src={PHOTO} alt="Coach Brenten Fortner" width={150} height={200} className="w-full rounded-xl object-cover" />
            </div>
            <p className="mt-4 text-[18px] leading-relaxed text-[#333]">
              Answer 6 quick questions. You'll get your score, your daily protein number, and the $9 plan coach Brenten Fortner starts every client on.
            </p>
            <button
              type="button"
              onClick={() => { ft('cta_bmf-quiz-start'); setStep(0); }}
              className={`${display} mt-6 w-full rounded-lg bg-black text-white text-[22px] font-bold tracking-wide py-4 hover:bg-[#222]`}
            >
              Get my score
            </button>
            <p className="mt-3 text-center text-sm text-[#6B6B6B]">ISSA certified personal trainer · Princeton, Indiana</p>
          </section>
        )}

        {q && (
          <section>
            <div className="flex items-center gap-3 text-sm text-[#6B6B6B]">
              {back}
              <span className="ml-auto">{step + 1} of {n}</span>
            </div>
            <div className="mt-2"><Progress step={step + 1} total={n + 1} /></div>
            <h1 className={`${display} mt-6 text-[32px] sm:text-[38px] leading-[1.05] font-extrabold`}>{q.label}</h1>
            {q.hint && <p className="mt-2 text-[15px] text-[#555]">{q.hint}</p>}
            {q.options ? (
              <div className="mt-6 grid gap-3">
                {q.options.map((o) => {
                  const on = answers[q.key] === o;
                  return (
                    <button
                      key={o}
                      type="button"
                      onClick={() => pick(q.key, o)}
                      className={`text-left rounded-xl border-2 px-5 py-4 text-[18px] font-semibold transition-colors ${on ? 'border-black bg-black text-white' : 'border-[#D4D4D4] hover:border-black'}`}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (weightOk) setStep((s) => s + 1); }} className="mt-6">
                <label className="block">
                  <span className="sr-only">Goal bodyweight in pounds</span>
                  <div className="flex items-center rounded-xl border-2 border-[#D4D4D4] focus-within:border-black px-5">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={90}
                      max={400}
                      autoFocus
                      value={answers.weight || ''}
                      onChange={(e) => setAnswers((a) => ({ ...a, weight: e.target.value }))}
                      className="w-full py-4 text-[24px] font-semibold outline-none bg-transparent"
                      placeholder="180"
                    />
                    <span className="text-[18px] text-[#555]">lb</span>
                  </div>
                </label>
                <button type="submit" disabled={!weightOk} className={`${display} mt-4 w-full rounded-lg bg-black text-white text-[22px] font-bold py-4 disabled:opacity-40`}>
                  Next
                </button>
              </form>
            )}
          </section>
        )}

        {step === n && (
          <section>
            <div className="flex items-center gap-3 text-sm text-[#6B6B6B]">
              {back}
              <span className="ml-auto">Last step</span>
            </div>
            <div className="mt-2"><Progress step={n} total={n + 1} /></div>
            <h1 className={`${display} mt-6 text-[32px] sm:text-[38px] leading-[1.05] font-extrabold`}>Your score is ready. Where should we send it?</h1>
            <p className="mt-2 text-[16px] text-[#555]">You'll see your results on the next screen, and we'll send a copy so you have your protein number saved.</p>
            <form onSubmit={optIn} className="mt-6 grid gap-3">
              {([
                ['name', 'First and last name', 'text', 'name'],
                ['email', 'Email', 'email', 'email'],
                ['phone', 'Mobile number', 'tel', 'tel'],
              ] as const).map(([k, label, type, auto]) => (
                <label key={k} className="block">
                  <span className="text-sm text-[#555]">{label}</span>
                  <input
                    type={type}
                    autoComplete={auto}
                    required
                    value={lead[k]}
                    onChange={(e) => setLead((c) => ({ ...c, [k]: e.target.value }))}
                    className="mt-1 w-full rounded-lg border-2 border-[#D4D4D4] px-4 py-3 text-[17px] focus:outline-none focus:border-black"
                  />
                </label>
              ))}
              <input type="text" name="company" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} className="hidden" aria-hidden="true" />
              <button
                type="submit"
                disabled={state === 'sending'}
                className={`${display} mt-2 w-full rounded-lg bg-[#ff3b1f] text-white text-[22px] font-bold tracking-wide py-4 hover:brightness-95 disabled:opacity-60`}
              >
                {state === 'sending' ? 'Scoring...' : 'Show my score'}
              </button>
              {state === 'error' && (
                <p className="text-sm text-[#B42318] text-center" role="alert">{err || "That didn't go through. Check your info and try again."}</p>
              )}
              <p className="text-[12px] text-[#6B6B6B] leading-relaxed">
                By submitting, you agree that BMF Fitness can contact you by email, call or text about your results and coaching. Message and data
                rates may apply. Reply STOP to opt out at any time. We never sell your information.
              </p>
            </form>
          </section>
        )}
      </main>
    </Shell>
  );
}

// ---------- /bmf/welcome ----------

type Buyer = { value: number; bumps: string[]; first_name: string; last_name: string; email: string; phone: string };

const QUESTIONS = [
  { key: 'goal', label: "What's your main goal?", options: ['Lose fat', 'Build muscle', 'Get stronger', 'Get back in shape', 'Stay consistent'] },
  { key: 'age', label: 'How old are you?', options: ['Under 25', '25-34', '35-45', 'Over 45'] },
  { key: 'days', label: 'How many days a week can you realistically train?', options: ['1-2', '3-4', '5+'] },
  { key: 'where', label: 'Where will you train?', options: ['Commercial gym', 'Home gym', 'Mostly bodyweight'] },
  { key: 'blocker', label: "What's gotten in the way before?", options: ['No time', 'No plan', 'Nutrition', 'Motivation', 'Injury'] },
  { key: 'soon', label: 'How soon do you want to start?', options: ['This week', 'This month', 'Just looking'] },
  {
    key: 'invest',
    label: 'Coaching starts at $500/month, or $750 for the full 90 days. If we are a fit, are you ready to invest at that level?',
    options: ['Yes', "I'd need to think about it", 'Not right now'],
  },
] as const;

const GRIND = [
  'A custom workout plan built for your body and schedule',
  'A custom nutrition plan',
  'An app that reminds you about your workouts',
  'A direct DM line to Brenten for questions',
  'A weekly online session with Brenten',
  'Form review on your lift videos, with weights adjusted every week',
];

function Application({ sessionId, buyer }: { sessionId: string; buyer: Buyer }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState({ name: `${buyer.first_name} ${buyer.last_name}`.trim(), email: buyer.email, phone: buyer.phone });
  const [state, setState] = useState<'form' | 'sending' | 'error' | 'book' | 'notready'>('form');

  const complete = QUESTIONS.every((q) => answers[q.key]) && contact.name && contact.email && contact.phone;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complete) return;
    const notReady = answers.invest === 'Not right now' || answers.soon === 'Just looking';
    setState('sending');
    ft('cta_bmf-apply');
    try {
      const r = await fetch('/.netlify/functions/bmf-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, answers, ...contact, notReady }),
      });
      if (!r.ok) throw new Error('apply');
      fbq('trackSingle', PIXEL, notReady ? 'Lead' : 'SubmitApplication', { content_name: '90-Day BMF Grind application' });
      ft(notReady ? 'cta_bmf-notready' : 'cta_bmf-book');
      setState(notReady ? 'notready' : 'book');
    } catch {
      setState('error');
    }
  };

  useEffect(() => {
    if (state !== 'book') return;
    const src = 'https://link.msgsndr.com/js/form_embed.js';
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    document.body.appendChild(s);
  }, [state]);

  if (state === 'notready') {
    return (
      <section className="mt-10 rounded-xl bg-[#F4F4F4] p-6" aria-live="polite">
        <h2 className={`${display} text-[30px] font-bold`}>Thanks, {contact.name.split(' ')[0] || 'friend'}. Got it.</h2>
        <p className="mt-3 text-[17px] leading-relaxed">
          No pressure. Work through the Protein Fix this week. When you're ready for a full plan, apply again or send Brenten a
          message. He posts training and food tips on Instagram in the meantime.
        </p>
        <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-lg bg-black text-white font-semibold px-6 py-3.5 hover:bg-[#222]">
          Follow Brenten on Instagram
        </a>
      </section>
    );
  }

  if (state === 'book') {
    const [first, ...last] = contact.name.trim().split(/\s+/);
    const params = new URLSearchParams({ first_name: first || '', last_name: last.join(' '), email: contact.email, phone: contact.phone });
    return (
      <section className="mt-10" aria-live="polite">
        <h2 className={`${display} text-[32px] font-bold leading-tight`}>Pick a time for your game plan call</h2>
        <p className="mt-3 text-[17px] leading-relaxed">
          We go over your history, your schedule and your 90-day goal. If it's a fit, I'll show you how the program works. If
          it's not, I'll tell you.
        </p>
        <div className="mt-6 rounded-xl overflow-hidden border border-[#E5E5E5]">
          <iframe
            src={`${CALENDAR}?${params.toString()}`}
            title="Book your BMF Fitness game plan call"
            id="dW59XWrf7oj7SrtnTQJI_bmf"
            scrolling="no"
            style={{ width: '100%', minHeight: 900, border: 'none', overflow: 'hidden' }}
          />
        </div>
      </section>
    );
  }

  return (
    <form onSubmit={submit} className="mt-10" data-track-section="bmf_apply">
      <h2 className={`${display} text-[32px] font-bold leading-tight`}>Apply for one of this month's coaching spots</h2>
      <p className="mt-2 text-[17px] text-[#333]">I take 4 to 6 new clients a month. Answer 8 quick questions so I know if I can help.</p>

      <ol className="mt-6 space-y-7">
        {QUESTIONS.map((q, i) => (
          <li key={q.key}>
            <fieldset>
              <legend className="font-semibold text-[17px]">{i + 1}. {q.label}</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {q.options.map((o) => {
                  const on = answers[q.key] === o;
                  return (
                    <label key={o} className={`cursor-pointer rounded-full border px-4 py-2 text-[15px] transition-colors ${on ? 'bg-black text-white border-black' : 'border-[#CFCFCF] hover:border-black'}`}>
                      <input type="radio" name={q.key} value={o} checked={on} onChange={() => setAnswers((a) => ({ ...a, [q.key]: o }))} className="sr-only" />
                      {o}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </li>
        ))}
        <li>
          <fieldset>
            <legend className="font-semibold text-[17px]">8. Your name, email and mobile number</legend>
            <div className="mt-3 grid gap-3">
              {([
                ['name', 'Full name', 'text', 'name'],
                ['email', 'Email', 'email', 'email'],
                ['phone', 'Mobile number', 'tel', 'tel'],
              ] as const).map(([k, label, type, auto]) => (
                <label key={k} className="block">
                  <span className="text-sm text-[#555]">{label}</span>
                  <input
                    type={type}
                    autoComplete={auto}
                    required
                    value={contact[k]}
                    onChange={(e) => setContact((c) => ({ ...c, [k]: e.target.value }))}
                    className="mt-1 w-full rounded-lg border border-[#CFCFCF] px-3 py-2.5 text-[16px] focus:outline-none focus:border-black"
                  />
                </label>
              ))}
            </div>
          </fieldset>
        </li>
      </ol>

      <button
        type="submit"
        disabled={!complete || state === 'sending'}
        className={`${display} mt-8 w-full rounded-lg bg-black text-white text-[22px] font-bold tracking-wide py-4 hover:bg-[#222] disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        {state === 'sending' ? 'Sending...' : 'Send my application'}
      </button>
      {state === 'error' && (
        <p className="mt-3 text-sm text-[#B42318] text-center" role="alert">
          That didn't go through. Try again in a moment, or DM Brenten on <a className="underline" href={INSTAGRAM}>Instagram</a>.
        </p>
      )}
    </form>
  );
}

export function BmfWelcomePage() {
  const [sessionId] = useState(() => new URLSearchParams(window.location.search).get('session_id') || '');
  const [state, setState] = useState<{ status: 'loading' | 'paid' | 'unpaid'; buyer?: Buyer }>({ status: 'loading' });

  useEffect(() => {
    if (!sessionId) { setState({ status: 'unpaid' }); return; }
    let tries = 0;
    const check = async () => {
      try {
        const r = await fetch(`/.netlify/functions/bmf-confirm?session_id=${encodeURIComponent(sessionId)}`);
        const d = await r.json();
        if (d.paid) {
          setState({ status: 'paid', buyer: d });
          ft('cta_bmf-paid');
          fbq('trackSingle', PIXEL, 'Purchase', { value: d.value, currency: 'USD', content_name: 'BMF 7-Day Protein Fix' }, { eventID: sessionId });
          return;
        }
      } catch { /* retried below */ }
      // A just-finished checkout can take a few seconds to show as paid.
      if (++tries < 4) setTimeout(check, 2500);
      else setState({ status: 'unpaid' });
    };
    check();
  }, [sessionId]);

  const buyer = state.buyer;
  const boughtBump = !!buyer?.bumps?.length;

  return (
    <Shell title="Your BMF 7-Day Protein Fix | BMF Fitness">
      <main className="max-w-2xl mx-auto px-4 pt-10 sm:pt-14 text-[17px] leading-relaxed" aria-live="polite">
        {state.status === 'loading' && <p className="text-[#6B6B6B]">Confirming your order...</p>}

        {state.status === 'unpaid' && !sessionId && (
          <>
            <h1 className={`${display} text-[38px] font-extrabold leading-tight`}>Ready for the 90-Day BMF Grind?</h1>
            <p className="mt-4">
              Brenten takes 4 to 6 new clients a month. Pick a time for a game plan call and he'll go over your schedule, your history and
              your 90-day goal. If it's a fit, he'll show you how the program works. If it's not, he'll tell you.
            </p>
            <a
              href={CALENDAR}
              className={`${display} mt-6 flex items-center justify-center w-full rounded-lg bg-black text-white text-[22px] font-bold py-4 hover:bg-[#222]`}
            >
              Book your game plan call
            </a>
          </>
        )}

        {state.status === 'unpaid' && sessionId && (
          <>
            <h1 className={`${display} text-[38px] font-extrabold leading-tight`}>We couldn't confirm your payment yet.</h1>
            <p className="mt-4">
              If you were charged, email <a className="underline" href={`mailto:${SUPPORT}`}>{SUPPORT}</a> and we'll send your guide today.
              If checkout didn't finish, you can <a href="/bmf" className="underline">go back and order here</a>.
            </p>
          </>
        )}

        {state.status === 'paid' && buyer && (
          <>
            <h1 className={`${display} text-[42px] sm:text-[50px] font-extrabold leading-[1.02]`}>
              You're in{buyer.first_name ? `, ${buyer.first_name}` : ''}.
            </h1>
            <p className="mt-4">Your BMF 7-Day Protein Fix is ready. Download it now and save it to your phone.</p>
            <a
              href={GUIDE}
              download
              className={`${display} mt-6 flex items-center justify-center gap-2 w-full rounded-lg bg-black text-white text-[22px] font-bold py-4 hover:bg-[#222]`}
            >
              <Download className="w-5 h-5" aria-hidden="true" /> Download the guide (PDF)
            </a>

            {boughtBump && (
              <div className="mt-8 rounded-xl border-2 border-black p-5">
                <h2 className={`${display} text-[26px] font-bold`}>What happens next</h2>
                <ul className="mt-2 space-y-1">
                  {buyer.bumps.includes('kickstart') && <li>14-Day Kickstart: your custom workouts and meals, set up in the app.</li>}
                  {buyer.bumps.includes('starter') && <li>30-Day Starter: your first month in the app, a custom plan and a group check-in.</li>}
                </ul>
                <p className="mt-3 font-semibold">Brenten will text you within 24 hours to set up your app.</p>
              </div>
            )}

            <section className="mt-12 border-t-4 border-black pt-8">
              <p className="text-sm font-semibold tracking-wide text-[#6B6B6B]">Want Brenten to coach you?</p>
              <h2 className={`${display} mt-1 text-[36px] font-extrabold leading-tight`}>The 90-Day BMF Grind Transformation</h2>
              <p className="mt-3">
                Leaner and stronger with a plan built around your schedule, without living in the gym or guessing what to eat. You work
                at your own pace, the app reminds you, and Brenten coaches you.
              </p>
              <ul className="mt-4 space-y-2.5">
                {GRIND.map((t) => (
                  <li key={t} className="flex gap-3"><Check className="w-5 h-5 mt-1 shrink-0" aria-hidden="true" /><span>{t}</span></li>
                ))}
              </ul>
              <div className="mt-6 grid sm:grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#CFCFCF] p-4 text-center">
                  <p className="text-sm text-[#555]">Month to month</p>
                  <p className={`${display} text-[34px] font-extrabold`}>$500/mo</p>
                  <p className="text-sm text-[#555]">$1,500 over 90 days</p>
                </div>
                <div className="rounded-xl bg-black text-white p-4 text-center">
                  <p className="text-sm text-[#BFBFBF]">90 days, paid up front</p>
                  <p className={`${display} text-[34px] font-extrabold`}>$750</p>
                  <p className="text-sm text-[#BFBFBF]">Same coaching, $750 less</p>
                </div>
              </div>
              <p className="mt-5">
                Brenten takes 4 to 6 new clients a month. Right now he's opening 5 Founding Client spots at his normal $750 price. When a
                month fills up, new people go on the waitlist for the next one.
              </p>
              <p className="mt-4 rounded-lg bg-[#F4F4F4] p-4 text-[16px]">
                Follow the plan for 90 days: log at least 90% of your workouts and show up to your weekly sessions. If you haven't made
                measurable progress in your weight, measurements or lifts, Brenten keeps coaching you free for another 30 days.
              </p>

              <Application sessionId={sessionId} buyer={buyer} />
            </section>
          </>
        )}
      </main>
    </Shell>
  );
}
