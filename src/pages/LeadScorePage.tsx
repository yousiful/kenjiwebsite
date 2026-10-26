import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, animate, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Shell, ensurePixel, track } from './GrowthQuizPage';
import { Answers, isQualified, scoreAnswers, visibleQuestions } from '../data/leadScore';

/* Lead Leak Score (Yousif 2026-10-25): a longer, branched version of /growth-quiz that pays people back
   with a personal score. Tested for 3 weeks against the Perf Base instant lead form on lead quality
   (bookings and closes, not cost per lead). Qualified -> /growth-quiz/book, everyone else -> $7 offer. */

const LOW_TICKET_URL = 'https://freedom.kenjiai.com/makemore';
// Same keys as /growth-quiz, so the booking page prefills and fires SubmitApplication the same way.
const LEAD_KEY = 'kenji-growth-quiz-lead';
const QUALIFIED_KEY = 'kenji-growth-quiz-qualified';
const ACCENT = '#5EEAD4';

const HEADLINE: Record<string, string> = {
  Tight: 'your system is tight.',
  'A few leaks': 'you have a few leaks.',
  Leaking: 'you’re leaking customers.',
  'Leaking badly': 'you’re leaking a lot of customers.',
};

type Lead = { first_name: string; email: string; phone: string };
type Result = { score: number; grade: string; qualified: boolean };

function utmParams() {
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'adset', 'ad'].forEach((k) => { const v = p.get(k); if (v) out[k] = v; });
  return out;
}

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const c = animate(0, score, { duration: 1.6, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
  }, [score]);
  const r = 84, len = 2 * Math.PI * r;
  const color = score >= 80 ? ACCENT : score >= 60 ? '#FCD34D' : score >= 40 ? '#FDBA74' : '#FCA5A5';
  return (
    <div className="relative w-[200px] h-[200px] sm:w-[220px] sm:h-[220px]" role="img" aria-label={`Lead Leak Score ${score} out of 100`}>
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90">
        <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="14" />
        <motion.circle
          cx="100" cy="100" r={r} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round" strokeDasharray={len}
          initial={{ strokeDashoffset: len }} animate={{ strokeDashoffset: len * (1 - score / 100) }} transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="display text-[60px] sm:text-[66px] font-extrabold leading-none tabular-nums">{shown}</div>
          <div className="mt-1 text-[14px] text-[#A9B4C4]">out of 100</div>
        </div>
      </div>
    </div>
  );
};

const LeadScorePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(-1); // -1 intro, 0..n-1 questions, n contact, n+1 results
  const [answers, setAnswers] = useState<Answers>({});
  const [lead, setLead] = useState<Lead>({ first_name: '', email: '', phone: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dir, setDir] = useState(1);
  const [result, setResult] = useState<Result | null>(null);
  const startedAt = useRef(0);
  const advanceTimer = useRef<number | null>(null);

  // The path depends on the answers so far, so the question list is recomputed as they go.
  const path = useMemo(() => visibleQuestions(answers), [answers]);
  const total = path.length;
  const q = step >= 0 && step < total ? path[step] : null;
  const local = useMemo(() => scoreAnswers(answers), [answers]);

  useEffect(() => { ensurePixel(); return () => { if (advanceTimer.current) window.clearTimeout(advanceTimer.current); }; }, []);

  const go = useCallback((n: number) => { setDir(n > step ? 1 : -1); setStep(n); setError(''); }, [step]);

  const choose = useCallback((qid: string, value: string) => {
    setAnswers((a) => {
      const next = { ...a, [qid]: value };
      // Changing the first answer switches paths; drop answers that no longer apply.
      const keep = new Set(visibleQuestions(next).map((x) => x.id));
      Object.keys(next).forEach((k) => { if (!keep.has(k)) delete next[k]; });
      return next;
    });
    if (advanceTimer.current) window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => { setDir(1); setStep((s) => s + 1); }, 260);
  }, []);

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

  const start = () => { startedAt.current = Date.now(); track('QuizStarted', false, { content_name: 'lead-score' }); go(0); };

  const submit = async () => {
    if (busy || !lead.first_name.trim() || !lead.email.trim() || !lead.phone.trim()) return;
    setBusy(true); setError('');
    let res: Result = { score: local.score, grade: local.grade, qualified: isQualified(answers) };
    const seconds = startedAt.current ? (Date.now() - startedAt.current) / 1000 : 0;
    try {
      const r = await fetch('/.netlify/functions/lead-score', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...lead, answers, utm: utmParams(), seconds }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.status === 400) { setError(data.error || 'Please check your details.'); setBusy(false); return; }
      if (typeof data.qualified === 'boolean') res = { score: data.score, grade: data.grade, qualified: data.qualified };
    } catch { /* offline or server down: show the local score */ }
    try {
      sessionStorage.setItem(LEAD_KEY, JSON.stringify(lead));
      if (res.qualified) sessionStorage.setItem(QUALIFIED_KEY, 'pending'); else sessionStorage.removeItem(QUALIFIED_KEY);
    } catch { /* private mode */ }
    track('Lead', true, { content_name: 'lead-score', qualified: res.qualified, score: res.score, revenue_tier: answers.revenue }, { email: lead.email, phone: lead.phone });
    track(res.qualified ? 'QualifiedLead' : 'UnqualifiedLead', false, { content_name: 'lead-score' });
    setResult(res);
    setBusy(false);
    setDir(1); setStep(total + 1);
    window.scrollTo({ top: 0 });
  };

  const progress = step < 0 ? 0 : Math.min(1, step / total);
  const inQuiz = step >= 0 && step <= total;

  return (
    <Shell title="Lead Leak Score | KenjiAI" description="Find out where your business is losing leads and customers, with a personal score and the fixes that matter most." wide={step > total}>
      {inQuiz && (
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
            <p className="text-[15px] font-semibold tracking-wide text-[#5EEAD4]">LEAD LEAK SCORE</p>
            <h1 className="mt-3 display text-[40px] sm:text-[56px] leading-[1.02] font-extrabold text-balance">
              Where is your business losing customers?
            </h1>
            <p className="mt-5 text-[18px] sm:text-[20px] leading-relaxed text-[#C9D2DE] max-w-[38ch]">
              About 3 minutes. Answer honestly and you’ll get a score out of 100, the three biggest leaks between your ads and your bank account, and what to fix first.
            </p>
            <button type="button" onClick={start} className="mt-9 inline-flex items-center gap-2.5 rounded-2xl bg-[#5EEAD4] text-[#06221E] font-bold text-[18px] px-7 py-4 shadow-[0_14px_34px_-14px_rgba(94,234,212,0.7)] hover:bg-[#7FF0DF] transition-colors">
              Get my score <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
            <p className="mt-8 text-[15px] text-[#A9B4C4]">Built from what we see running ads and follow-up for 500+ businesses since 2013.</p>
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
            <h1 className="display text-[30px] sm:text-[40px] leading-[1.08] font-extrabold text-balance">Your score is ready. Where should we send it?</h1>
            <p className="mt-3 text-[17px] text-[#A9B4C4]">You’ll see it on the next screen, and we’ll email you a copy with the fixes.</p>
            {/* Not a <form>: GHL's site-wide tracking script saves every form submit as its own contact. */}
            <div role="form" aria-label="Your details" className="mt-8 space-y-4" onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}>
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
                type="button" onClick={submit} disabled={busy || !lead.first_name.trim() || !lead.email.trim() || !lead.phone.trim()}
                className="w-full mt-2 inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#5EEAD4] text-[#06221E] font-bold text-[18px] px-7 py-4 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#7FF0DF] transition-colors"
              >
                {busy ? <><Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Scoring your answers</> : <>Show my score <ArrowRight className="w-5 h-5" aria-hidden="true" /></>}
              </button>
              <p className="text-[13px] leading-relaxed text-[#7D8899]">
                By continuing you agree that KenjiAI can contact you by phone, text and email about your results. Message and data rates may apply. Reply STOP to opt out anytime.
              </p>
            </div>
          </motion.section>
        )}

        {step === total + 1 && result && (
          <motion.section key="results" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="pt-10 sm:pt-14">
            <p className="text-[15px] font-semibold tracking-wide text-[#5EEAD4]">YOUR LEAD LEAK SCORE</p>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-7 sm:gap-10">
              <ScoreRing score={result.score} />
              <div>
                <h1 className="display text-[34px] sm:text-[44px] leading-[1.04] font-extrabold text-balance">
                  {lead.first_name ? `${lead.first_name}, ` : ''}{HEADLINE[result.grade] || 'here’s your score.'}
                </h1>
                <p className="mt-3 text-[17px] leading-relaxed text-[#C9D2DE] max-w-[40ch]">
                  {local.leaks.length
                    ? 'Here’s where customers are slipping away, biggest first. A copy is on its way to your inbox.'
                    : 'No big leaks showed up. Your next gains come from putting more budget behind what already works.'}
                </p>
              </div>
            </div>

            <ol className="mt-10 space-y-4">
              {local.leaks.slice(0, 3).map((l, i) => (
                <li key={l.id} className="rounded-3xl border border-white/12 bg-white/[0.04] p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <span className="shrink-0 w-9 h-9 rounded-xl grid place-items-center bg-white/8 font-bold tabular-nums">{i + 1}</span>
                    <div>
                      <h2 className="display text-[22px] sm:text-[24px] leading-tight font-extrabold">{l.title}</h2>
                      <p className="mt-2 text-[16px] leading-relaxed text-[#C9D2DE]">{l.why}</p>
                      <p className="mt-3 text-[16px] leading-relaxed"><span className="font-semibold text-[#5EEAD4]">The fix: </span>{l.fix}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            {local.yearlyPerCustomer > 0 && local.leaks.length > 0 && (
              <p className="mt-8 text-[18px] leading-relaxed text-[#C9D2DE]">
                At your numbers, closing just one more customer a month is worth about <span className="font-bold text-white">${local.yearlyPerCustomer.toLocaleString()} a year</span>.
              </p>
            )}

            {result.qualified ? (
              <div className="mt-10 rounded-3xl border border-[#5EEAD4]/40 bg-[#5EEAD4]/[0.07] p-6 sm:p-8">
                <h2 className="display text-[26px] sm:text-[30px] leading-tight font-extrabold">You qualify for a free leak review</h2>
                <p className="mt-3 text-[17px] leading-relaxed text-[#C9D2DE]">
                  15 minutes with our team. We already have your answers, so we’ll go straight to these leaks with your numbers and show you what we’d fix first. You keep the plan either way.
                </p>
                <button
                  type="button" onClick={() => navigate('/growth-quiz/book')}
                  className="mt-7 w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#5EEAD4] text-[#06221E] font-bold text-[18px] px-7 py-4 hover:bg-[#7FF0DF] transition-colors"
                >
                  Pick a time <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <div className="mt-10 rounded-3xl border border-white/12 bg-white/[0.04] p-6 sm:p-8">
                <h2 className="display text-[26px] sm:text-[30px] leading-tight font-extrabold">Fix these yourself for $7</h2>
                <p className="mt-3 text-[17px] leading-relaxed text-[#C9D2DE]">
                  Our done-for-you work is built for businesses past $10K a month with a budget to grow. Until then, the Ad Optimization Community shows you how we run ads, follow-up and sales for our clients, so you can fix these leaks on your own.
                </p>
                <a
                  href={LOW_TICKET_URL} onClick={() => track('LowTicketClick', false, { content_name: 'lead-score' })}
                  className="mt-7 w-full inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#5EEAD4] text-[#06221E] font-bold text-[18px] px-7 py-4 hover:bg-[#7FF0DF] transition-colors"
                >
                  Join for $7 <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </a>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </Shell>
  );
};

export default LeadScorePage;
