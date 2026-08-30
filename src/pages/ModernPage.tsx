import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ShieldCheck, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

const FOR_POINTS = [
  'You’re already spending real money on ads, or you’re ready to.',
  'You want direct access to the person running your account, not a junior hire.',
  'You care more about cost-per-acquisition than a pretty dashboard.',
  'You’re the one who signs off on marketing spend.',
];

const NOT_FOR_POINTS = [
  'You’re looking for a $500/month retainer.',
  'You want someone else to make the final call on your budget.',
  'You’re still deciding if ads are worth trying at all.',
  'You want a course. This is a partnership, not a lesson.',
];

type SpendOption = 'under_5k' | '5k_20k' | '20k_50k' | '50k_plus';
type TimelineOption = 'immediately' | '30_days' | 'exploring';

interface FormState {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  business_type: string;
  monthly_ad_spend: SpendOption | '';
  decision_maker: 'yes' | 'no' | '';
  timeline: TimelineOption | '';
}

const EMPTY_FORM: FormState = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  business_type: '',
  monthly_ad_spend: '',
  decision_maker: '',
  timeline: '',
};

const SPEND_OPTIONS: { value: SpendOption; label: string }[] = [
  { value: 'under_5k', label: 'Under $5K/month' },
  { value: '5k_20k', label: '$5K - $20K/month' },
  { value: '20k_50k', label: '$20K - $50K/month' },
  { value: '50k_plus', label: '$50K+/month' },
];

const TIMELINE_OPTIONS: { value: TimelineOption; label: string }[] = [
  { value: 'immediately', label: "I'm ready to start now" },
  { value: '30_days', label: 'Within the next 30 days' },
  { value: 'exploring', label: "I'm just exploring for now" },
];

const TOTAL_STEPS = 3;

const ModernPage: React.FC = () => {
  const [step, setStep] = useState(0); // 0 = not started, 1-3 = survey steps, 4 = done
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const canAdvanceFromStep1 = form.monthly_ad_spend !== '' && form.decision_maker !== '' && form.timeline !== '';
  const canAdvanceFromStep2 = form.first_name.trim() !== '' && (form.email.trim() !== '' || form.phone.trim() !== '');

  const submit = async () => {
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/.netlify/functions/modern-qualify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('submit failed');
      setStep(3);
    } catch {
      setError("Something didn't go through. Try again, or email support@kenjiai.com directly.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Partner Program | KenjiAI</title>
        <meta
          name="description"
          content="A done-for-you ad partnership for businesses spending $20K+/month. Revenue-share, not a flat retainer: I only get paid a percentage of what I actually grow."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center px-4 py-16 sm:py-24" style={{ backgroundColor: '#0B0E14' }}>
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(0,255,255,0.07) 0%, transparent 70%)' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 mb-10"
        >
          <img src="/kenji-logo.webp" alt="KenjiAI" className="h-12 sm:h-14 w-auto object-contain" />
        </motion.div>

        {step === 0 && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative z-10 max-w-2xl text-center mb-4"
            >
              <h1 className="text-white text-3xl sm:text-5xl font-bold leading-tight mb-4">
                This isn&apos;t for everyone.
              </h1>
              <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
                If you&apos;re not spending $20K+ a month on ads, or getting ready to, this page isn&apos;t for you.
                Close the tab, no hard feelings.
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="relative z-10 text-cyan-400 text-sm font-semibold tracking-wide uppercase mb-16"
            >
              13 years running ads &middot; $3.35M+ managed &middot; 500+ businesses
            </motion.p>

            <div className="relative z-10 w-full max-w-3xl grid sm:grid-cols-2 gap-5 mb-16">
              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bg-gray-900/60 backdrop-blur-sm border border-emerald-900/50 rounded-2xl p-6"
              >
                <h2 className="text-white font-bold text-lg mb-4">This is for you if</h2>
                <ul className="flex flex-col gap-3">
                  {FOR_POINTS.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-300 text-sm leading-snug">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6"
              >
                <h2 className="text-white font-bold text-lg mb-4">This isn&apos;t for you if</h2>
                <ul className="flex flex-col gap-3">
                  {NOT_FOR_POINTS.map((point) => (
                    <li key={point} className="flex items-start gap-3">
                      <X className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-500 text-sm leading-snug">{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="relative z-10 w-full max-w-2xl bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 mb-8"
              style={{ boxShadow: '0 0 40px rgba(0,255,255,0.08)' }}
            >
              <h2 className="text-white font-bold text-2xl mb-2 text-center">The Partner Program</h2>
              <p className="text-gray-400 text-sm mb-8 text-center">
                A rebuild of your entire paid acquisition engine, run by me directly. Two numbers, paid at two
                different times, for two different things.
              </p>

              <div className="flex flex-col gap-4 mb-6">
                <div className="flex items-start gap-4 bg-black/30 border border-gray-800 rounded-xl p-5">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-cyan-400 text-[#0B0E14] font-bold flex items-center justify-center text-sm">
                    1
                  </div>
                  <div>
                    <div className="text-white text-2xl font-bold">
                      $25,000 <span className="text-gray-500 text-sm font-normal">one time, when we start</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mt-1.5">
                      Covers the full rebuild: your ad accounts, tracking, and creative system, before we run a
                      single dollar of spend. This is the setup fee, not a monthly charge.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 bg-black/30 border border-gray-800 rounded-xl p-5">
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-cyan-400 text-[#0B0E14] font-bold flex items-center justify-center text-sm">
                    2
                  </div>
                  <div>
                    <div className="text-white text-2xl font-bold">
                      15% <span className="text-gray-500 text-sm font-normal">of ad spend, every month after</span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mt-1.5">
                      This is on top of what you already pay Meta or Google directly, not instead of it, it&apos;s
                      how we get paid to run your account. No flat retainer: if your spend grows because it&apos;s
                      working, ours grows with it. If it&apos;s not, you&apos;re not paying a percentage on
                      nothing, that&apos;s the point of this structure.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-cyan-950/30 border border-cyan-900/40 rounded-xl p-4 text-left">
                <ShieldCheck className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
                <p className="text-gray-300 text-sm leading-relaxed">
                  <span className="text-white font-semibold">How I get paid:</span> revenue-share, not retainer. I
                  take a percentage of what I actually add to your ad performance, on top of your existing spend,
                  not a flat fee regardless of what happens.
                </p>
              </div>
            </motion.div>

            <motion.button
              onClick={() => setStep(1)}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.75 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="relative z-10 group inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-[#0B0E14] font-bold text-base sm:text-lg px-8 py-4 rounded-full transition-colors duration-300"
              style={{ boxShadow: '0 0 40px rgba(0,255,255,0.25)' }}
            >
              Apply for the Partner Program
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.9 }}
              className="relative z-10 text-gray-600 text-xs mt-6 text-center max-w-sm"
            >
              A short application, not a checkout. We only take on a handful of new partners each quarter.
            </motion.p>
          </>
        )}

        {step >= 1 && step <= 3 && (
          <div className="relative z-10 w-full max-w-lg">
            {step < 3 && (
              <div className="flex items-center gap-2 mb-8">
                {Array.from({ length: TOTAL_STEPS - 1 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < step ? 'bg-cyan-400' : 'bg-gray-800'
                    }`}
                  />
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8"
                >
                  <h2 className="text-white font-bold text-xl mb-6">A few quick questions first</h2>

                  <div className="mb-6">
                    <label className="block text-gray-300 text-sm font-semibold mb-3">
                      What's your current monthly ad spend?
                    </label>
                    <div className="flex flex-col gap-2">
                      {SPEND_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update('monthly_ad_spend', opt.value)}
                          className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                            form.monthly_ad_spend === opt.value
                              ? 'border-cyan-400 bg-cyan-950/40 text-white'
                              : 'border-gray-800 bg-black/30 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-300 text-sm font-semibold mb-3">
                      Are you the one who signs off on that budget?
                    </label>
                    <div className="flex gap-2">
                      {(['yes', 'no'] as const).map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => update('decision_maker', v)}
                          className={`flex-1 px-4 py-3 rounded-xl border text-sm font-semibold transition-colors capitalize ${
                            form.decision_maker === v
                              ? 'border-cyan-400 bg-cyan-950/40 text-white'
                              : 'border-gray-800 bg-black/30 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="block text-gray-300 text-sm font-semibold mb-3">How soon do you want to start?</label>
                    <div className="flex flex-col gap-2">
                      {TIMELINE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => update('timeline', opt.value)}
                          className={`text-left px-4 py-3 rounded-xl border text-sm transition-colors ${
                            form.timeline === opt.value
                              ? 'border-cyan-400 bg-cyan-950/40 text-white'
                              : 'border-gray-800 bg-black/30 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(0)}
                      className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-300 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      disabled={!canAdvanceFromStep1}
                      onClick={() => setStep(2)}
                      className="inline-flex items-center gap-2 bg-cyan-400 disabled:bg-gray-800 disabled:text-gray-600 hover:bg-cyan-300 text-[#0B0E14] font-bold text-sm px-6 py-3 rounded-full transition-colors"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8"
                >
                  <h2 className="text-white font-bold text-xl mb-1">Where should we send our decision?</h2>
                  <p className="text-gray-500 text-sm mb-6">We review every application personally. No spam, no lists.</p>

                  <div className="flex flex-col gap-3 mb-8">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="First name"
                        value={form.first_name}
                        onChange={(e) => update('first_name', e.target.value)}
                        className="flex-1 bg-black/30 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400"
                      />
                      <input
                        type="text"
                        placeholder="Last name"
                        value={form.last_name}
                        onChange={(e) => update('last_name', e.target.value)}
                        className="flex-1 bg-black/30 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      className="bg-black/30 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      className="bg-black/30 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400"
                    />
                    <input
                      type="text"
                      placeholder="What's your business? (optional)"
                      value={form.business_type}
                      onChange={(e) => update('business_type', e.target.value)}
                      className="bg-black/30 border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1.5 text-gray-500 text-sm hover:text-gray-300 transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                      type="button"
                      disabled={!canAdvanceFromStep2 || submitting}
                      onClick={submit}
                      className="inline-flex items-center gap-2 bg-cyan-400 disabled:bg-gray-800 disabled:text-gray-600 hover:bg-cyan-300 text-[#0B0E14] font-bold text-sm px-6 py-3 rounded-full transition-colors"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" /> Submitting
                        </>
                      ) : (
                        <>
                          Submit Application <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="bg-gray-900/60 backdrop-blur-sm border border-emerald-900/50 rounded-2xl p-8 text-center"
                >
                  <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                  <h2 className="text-white font-bold text-2xl mb-2">Application received.</h2>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    We review every application personally, we don't take on many partners at a time. If it's a
                    fit, you'll hear from us directly, not an automated sequence.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </>
  );
};

export default ModernPage;
