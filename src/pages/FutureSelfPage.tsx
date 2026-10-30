import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Loader2, RotateCcw, Send } from 'lucide-react';
import { Shell, ensurePixel, track } from './GrowthQuizPage';

/* Future You, kenjiai.com/futureyou (Yousif 2026-10-30): paste a few things you wrote, answer a few questions,
   then text with yourself 3 years from now, after hitting the goal, in your own voice.
   Engine: netlify/functions/future-self.ts. The persona stays in this browser tab (sessionStorage). */

const STORE = 'kenji-future-self';
const ACCENT = '#5EEAD4';

type Msg = { role: 'user' | 'assistant'; content: string };
type Form = { firstName: string; email: string; age: string; business: string; now: string; goal: string; obstacle: string; fear: string; samples: string };
const EMPTY: Form = { firstName: '', email: '', age: '', business: '', now: '', goal: '', obstacle: '', fear: '', samples: '' };

function utmParams() {
  const p = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach((k) => { const v = p.get(k); if (v) out[k] = v; });
  return out;
}

const Field: React.FC<{ id: keyof Form; label: string; hint?: string; value: string; onChange: (v: string) => void; area?: boolean; rows?: number; placeholder?: string; type?: string }> =
  ({ id, label, hint, value, onChange, area, rows = 3, placeholder, type = 'text' }) => (
    <label htmlFor={`fs-${id}`} className="block">
      <span className="block text-[15px] font-semibold">{label}</span>
      {hint && <span className="block text-[13px] text-[#A9B4C4] mt-0.5">{hint}</span>}
      {area ? (
        <textarea id={`fs-${id}`} rows={rows} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3 text-[15px] leading-relaxed outline-none focus:border-[#5EEAD4] placeholder:text-white/30" />
      ) : (
        <input id={`fs-${id}`} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full rounded-xl bg-white/[0.06] border border-white/10 px-4 py-3 text-[15px] outline-none focus:border-[#5EEAD4] placeholder:text-white/30" />
      )}
    </label>
  );

const FutureSelfPage: React.FC = () => {
  const [stage, setStage] = useState<'intro' | 'form' | 'chat'>('intro');
  const [form, setForm] = useState<Form>(EMPTY);
  const [persona, setPersona] = useState<any>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensurePixel();
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORE) || 'null');
      if (saved?.persona && Array.isArray(saved.msgs)) { setPersona(saved.persona); setMsgs(saved.msgs); setStage('chat'); }
    } catch { /* private mode */ }
  }, []);
  useEffect(() => {
    if (stage !== 'chat') return;
    try { sessionStorage.setItem(STORE, JSON.stringify({ persona, msgs })); } catch { /* private mode */ }
    bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [stage, persona, msgs]);

  const set = (k: keyof Form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const build = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      const r = await fetch('/.netlify/functions/future-self', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'build', ...form, utm: utmParams() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setError(d.error || 'Something went wrong. Try again.'); return; }
      track('FutureSelfBuilt', false, { content_name: 'futureyou' }, { email: form.email });
      setPersona(d.persona);
      setMsgs([{ role: 'assistant', content: d.opener }]);
      setStage('chat');
      window.scrollTo({ top: 0 });
    } catch {
      setError('Couldn’t reach Future You. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  };

  const send = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = draft.trim();
    if (!text || busy) return;
    const next: Msg[] = [...msgs, { role: 'user', content: text }];
    setMsgs(next); setDraft(''); setBusy(true); setError('');
    try {
      const r = await fetch('/.netlify/functions/future-self', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'chat', persona, messages: next }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setError(d.error || 'Something went wrong. Send that again.'); return; }
      setMsgs([...next, { role: 'assistant', content: d.reply }]);
    } catch {
      setError('Couldn’t reach Future You. Send that again.');
    } finally {
      setBusy(false);
    }
  };

  const restart = () => {
    try { sessionStorage.removeItem(STORE); } catch { /* private mode */ }
    setPersona(null); setMsgs([]); setForm(EMPTY); setStage('intro');
  };

  const userTurns = msgs.filter((m) => m.role === 'user').length;

  return (
    <Shell title="Future You | KenjiAI" description="Text with yourself 3 years from now, after you hit your goal. Built from your own words.">
      <main className="mx-auto w-full max-w-[680px] px-4 sm:px-6 py-10 sm:py-16">
        {stage === 'intro' && (
          <section className="space-y-7">
            <p className="text-[13px] font-semibold tracking-[0.18em] uppercase" style={{ color: ACCENT }}>Future You</p>
            <h1 className="display text-[44px] sm:text-[60px] font-extrabold leading-[1.02]" style={{ textWrap: 'balance' } as React.CSSProperties}>
              Text the version of you who already made it.
            </h1>
            <p className="text-[18px] leading-relaxed text-[#C9D2DE] max-w-[56ch]">
              Paste a few things you’ve written, tell us where you are and where you want to be. We build you, 3 years from now, after hitting
              that goal, talking the way you talk. Then ask them anything: what they did first, what almost stopped them, what you should do this week.
            </p>
            <ul className="space-y-2 text-[15px] text-[#A9B4C4]">
              <li>Takes about 4 minutes</li>
              <li>Uses only what you give it, and only your own words</li>
              <li>Free</li>
            </ul>
            <button type="button" onClick={() => { setStage('form'); track('FutureSelfStarted', false, { content_name: 'futureyou' }); }}
              className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-[17px] font-bold text-[#0B0E14]" style={{ background: ACCENT }}>
              Meet Future You <ArrowRight className="w-5 h-5" />
            </button>
          </section>
        )}

        {stage === 'form' && (
          <form onSubmit={build} className="space-y-6">
            <h2 className="display text-[34px] sm:text-[42px] font-extrabold leading-tight">Tell Future You who you are today</h2>
            <div className="grid sm:grid-cols-[1fr_1fr_110px] gap-4">
              <Field id="firstName" label="First name" value={form.firstName} onChange={set('firstName')} />
              <Field id="email" label="Email" type="email" value={form.email} onChange={set('email')} />
              <Field id="age" label="Age" type="number" value={form.age} onChange={set('age')} />
            </div>
            <Field id="business" label="What’s your business?" value={form.business} onChange={set('business')} placeholder="Roofing company in Dallas, 3 crews" />
            <Field id="now" label="Where are you right now?" area value={form.now} onChange={set('now')} placeholder="About $25K a month, mostly referrals, I still do the estimates myself" />
            <Field id="goal" label="Where do you want to be in 3 years?" area value={form.goal} onChange={set('goal')} placeholder="$100K a month, a sales guy doing estimates, me home by 6" />
            <Field id="obstacle" label="What’s in the way?" area rows={2} value={form.obstacle} onChange={set('obstacle')} />
            <Field id="fear" label="What are you afraid of?" hint="Optional, but it makes the conversation real." area rows={2} value={form.fear} onChange={set('fear')} />
            <Field id="samples" label="Paste some of your own writing" area rows={8} value={form.samples} onChange={set('samples')}
              hint="3 or 4 emails or texts you sent, or a part of a call where you’re talking. Only your words; delete other people’s names and replies."
              placeholder={'hey man, got your msg. we can start monday if that works, just need the deposit by friday...'} />
            <p className="text-[13px] text-[#8C97A8]">{form.samples.trim().length < 200 ? `${200 - form.samples.trim().length} more characters` : 'That’s enough to work with.'}</p>
            {error && <p role="alert" className="text-[15px] text-[#FCA5A5]">{error}</p>}
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" disabled={busy}
                className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-[17px] font-bold text-[#0B0E14] disabled:opacity-60" style={{ background: ACCENT }}>
                {busy ? <><Loader2 className="w-5 h-5 animate-spin" /> Building Future You…</> : <>Build Future You <ArrowRight className="w-5 h-5" /></>}
              </button>
              <p className="text-[13px] text-[#8C97A8] max-w-[40ch]">We save your name, email and answers. What you paste is used once and not stored.</p>
            </div>
          </form>
        )}

        {stage === 'chat' && persona && (
          <section className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[13px] font-semibold tracking-[0.18em] uppercase" style={{ color: ACCENT }}>Future You</p>
                <h2 className="display text-[26px] sm:text-[30px] font-extrabold leading-tight">{persona.firstName}, 3 years from now</h2>
              </div>
              <button type="button" onClick={restart} className="inline-flex items-center gap-1.5 text-[13px] text-[#A9B4C4] hover:text-white">
                <RotateCcw className="w-4 h-4" /> Start over
              </button>
            </div>
            <div className="flex flex-col gap-3" aria-live="polite">
              {msgs.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'self-end max-w-[85%]' : 'self-start max-w-[85%]'}>
                  <div className={m.role === 'user'
                    ? 'rounded-2xl rounded-br-md px-4 py-3 text-[16px] leading-relaxed text-[#0B0E14] whitespace-pre-wrap'
                    : 'rounded-2xl rounded-bl-md px-4 py-3 text-[16px] leading-relaxed bg-white/[0.08] border border-white/10 whitespace-pre-wrap'}
                    style={m.role === 'user' ? { background: ACCENT } : undefined}>
                    {m.content}
                  </div>
                </div>
              ))}
              {busy && <div className="self-start text-[14px] text-[#A9B4C4] inline-flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> typing…</div>}
              <div ref={bottom} />
            </div>
            {error && <p role="alert" className="text-[15px] text-[#FCA5A5]">{error}</p>}
            {userTurns >= 4 && (
              <a href="/findtheleak?utm_source=futureyou" className="block rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-[15px] text-[#C9D2DE] hover:border-[#5EEAD4]">
                <b className="text-white">Want to see the gap between today and that goal?</b> Take the free 3-minute growth audit and get your numbers.
              </a>
            )}
            <form onSubmit={send} className="sticky bottom-0 flex gap-2 pt-2 pb-3" style={{ background: 'linear-gradient(to top, #0B0E14 70%, transparent)' }}>
              <label htmlFor="fs-draft" className="sr-only">Message Future You</label>
              <textarea id="fs-draft" rows={1} value={draft} onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Ask Future You anything…"
                className="flex-1 resize-none rounded-2xl bg-white/[0.08] border border-white/10 px-4 py-3 text-[16px] outline-none focus:border-[#5EEAD4]" />
              <button type="submit" disabled={busy || !draft.trim()} aria-label="Send"
                className="rounded-2xl px-4 text-[#0B0E14] disabled:opacity-50" style={{ background: ACCENT }}>
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-[12px] text-[#6F7A8C]">Future You is an AI built from your own words and goals. It’s a reflection, not a prediction or advice.</p>
          </section>
        )}
      </main>
    </Shell>
  );
};

export default FutureSelfPage;
