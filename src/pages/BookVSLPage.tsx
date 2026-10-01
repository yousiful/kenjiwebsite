import React, { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Reviews } from '../components/Reviews';

type FbqWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

function track(event: string, variant: string, extra: Record<string, unknown> = {}) {
  const w = window as FbqWindow;
  const params = { variant, ...extra };
  if (w.gtag) w.gtag('event', event, params);
  if (w.fbq) {
    if (event === 'ViewContent' || event === 'Lead' || event === 'Schedule') {
      w.fbq('track', event, { content_name: `book-vsl-${variant}`, ...extra });
    } else {
      w.fbq('trackCustom', event, { content_name: `book-vsl-${variant}`, ...extra });
    }
  }
}

const PROOF = [
  { stat: '$3.35M', label: 'Generated For Clients' },
  { stat: '500+', label: 'Clients Served' },
  { stat: '$186K', label: 'From A Single Funnel' },
  { stat: '12+ Yrs', label: 'In Lead Gen' },
];

const FAQS = [
  {
    q: "What does this actually cost?",
    a: "There's no flat retainer and no setup fee you pay out of pocket upfront to find out if it works. We get paid on performance, tied to results we generate for you. You'll know the exact structure on the walkthrough call once we understand your business.",
  },
  {
    q: "I got burned by an agency before. Why would this be different?",
    a: "Most agencies get paid whether or not you get results. We don't. If the system doesn't make you money, we don't make money either. That's the whole structure, not a sales line.",
  },
  {
    q: "Will the AI calls sound robotic?",
    a: "No. The voice agent is built to sound like a real person on the phone, handles objections, and the goal is simple: get the lead on your calendar before they go cold. You can hear it for yourself before you decide anything.",
  },
  {
    q: "How fast does this actually move?",
    a: "The AI calls new leads back in seconds, not hours. That's the whole point. Most businesses lose leads because nobody calls back fast enough. We fix that first.",
  },
  {
    q: "What if it doesn't work for my business?",
    a: "Then you don't owe us for results we didn't get. We built the model this way on purpose, we only grow if you grow.",
  },
  {
    q: "Do I need a website already?",
    a: "No. We handle the ad, the funnel, and the follow-up system. If you've already got a site we can work with it, but it's not required to get started.",
  },
  {
    q: "What kind of businesses does this work for?",
    a: "Service businesses and coaches who already have an offer and want more booked calls without hiring and managing an in-house sales team.",
  },
  {
    q: "How much do I need to spend on ads?",
    a: "You need to be ready to invest a few hundred dollars a month in ad spend. We run the campaigns and the follow-up, but the ad spend itself is yours.",
  },
  {
    q: "Is this a magic button that runs itself with zero input from me?",
    a: "No. You still need an offer people want and you need to show up for booked calls. We build and run the system. We don't replace you.",
  },
  {
    q: "How long until I see a booked call?",
    a: "That depends on your offer and your market, but the AI call-back and follow-up starts working on leads from day one once your campaign is live.",
  },
  {
    q: "What's actually included?",
    a: "Done-for-you Meta ads, an AI voice agent that calls new leads back in seconds, and CRM follow-up that keeps working the lead until they book or opt out.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Since there's no monthly minimum or retainer, you're not locked into anything. This gets covered in detail on the walkthrough.",
  },
];

interface BookVSLPageProps {
  variant: 'book' | 'book2';
  videoSrc: string;
  posterSrc: string;
}

export const BookVSLPage: React.FC<BookVSLPageProps> = ({ variant, videoSrc, posterSrc }) => {
  const qualifierRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0); // 0 = not started, 1-3 = quiz steps, 4 = result
  const [answers, setAnswers] = useState<{ business?: string; revenue?: string; ready?: string }>({});
  const [outcome, setOutcome] = useState<'qualified' | 'not-fit' | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [calendarRevealed, setCalendarRevealed] = useState(false);

  useEffect(() => {
    track('ViewContent', variant);
  }, [variant]);

  useEffect(() => {
    if (calendarRevealed) {
      track('Schedule', variant);
      const w = window as FbqWindow;
      if (w.fbq) w.fbq('track', 'Lead', { content_name: `book-vsl-${variant}-calendar` });
    }
  }, [calendarRevealed, variant]);

  const scrollToQualifier = () => {
    qualifierRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (step === 0) setStep(1);
  };

  const progress = step === 0 ? 50 : Math.min(50 + step * 16.67, 100);

  function answer(key: 'business' | 'revenue' | 'ready', value: string) {
    const next = { ...answers, [key]: value };
    setAnswers(next);
    track('quiz_step', variant, { step: key, value });

    if (key === 'business' && value === 'none') {
      setOutcome('not-fit');
      setStep(4);
      return;
    }
    if (key === 'ready' && value === 'no') {
      setOutcome('not-fit');
      setStep(4);
      return;
    }
    if (key === 'ready' && value === 'yes') {
      setOutcome('qualified');
      setStep(4);
      return;
    }
    setStep((s) => s + 1);
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Book Your Client Attraction System Walkthrough | KenjiAI</title>
        <meta
          name="description"
          content="Done-for-you Meta ads, an AI voice agent that calls new leads back in seconds, and CRM follow-up. See if you qualify, then book your walkthrough."
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      {/* ── Hero ── */}
      <section className="px-4 pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-5xl font-black leading-tight"
          >
            For service businesses and coaches who want{' '}
            <span className="text-amber-400">more booked clients</span> without hiring a sales team
          </motion.h1>
          <p className="mt-4 text-gray-400 text-base sm:text-lg max-w-2xl mx-auto">
            We run your ads, our AI calls every lead back in seconds, and we work the follow-up until they book. You only pay when it makes you money.
          </p>
        </div>
      </section>

      {/* ── Video ── */}
      <section className="px-4 pb-8" ref={videoRef}>
        <div className="max-w-4xl mx-auto">
          <div className="aspect-video w-full rounded-xl overflow-hidden border border-white/10 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.8)] bg-black">
            <video
              className="w-full h-full"
              src={videoSrc}
              poster={posterSrc}
              controls
              playsInline
              preload="metadata"
            />
          </div>
          <div className="mt-6 flex justify-center">
            <button
              onClick={scrollToQualifier}
              className="px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-lg transition-colors"
            >
              See If You Qualify →
            </button>
          </div>
        </div>
      </section>

      {/* ── Proof bar #1 ── */}
      <section className="px-4 py-10 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {PROOF.map((p) => (
            <div key={p.label}>
              <div className="text-2xl sm:text-3xl font-black text-amber-400">{p.stat}</div>
              <div className="text-xs sm:text-sm text-gray-400 mt-1">{p.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Repeat proof #2 (mid-page callout) ── */}
      <section className="px-4 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl sm:text-2xl font-bold text-gray-200">
            We've generated <span className="text-amber-400 font-black">$3.35M</span> for clients across 500+ accounts. No retainer, no minimum, performance-based.
          </p>
        </div>
      </section>

      {/* ── Who this is for / not for ── */}
      <section className="px-4 py-12 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-4xl mx-auto grid sm:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-amber-400" /> This is for you if
            </h2>
            <ul className="space-y-3 text-gray-300">
              <li>You run a service business or coaching offer and already have paying clients</li>
              <li>You can invest a few hundred dollars a month in ad spend</li>
              <li>You want more booked calls without hiring and managing a sales team</li>
              <li>You're ready to act on this in the next 30 days</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-black mb-4 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-gray-500" /> This is not for you if
            </h2>
            <ul className="space-y-3 text-gray-400">
              <li>You don't have a business or offer yet</li>
              <li>You're not willing to spend a few hundred dollars a month on ads</li>
              <li>You're looking for a magic button with zero effort on your end</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── Repeat proof #3 ── */}
      <section className="px-4 py-8">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-400">
            Real number, not a round one: <span className="text-amber-400 font-black">$3.35M</span> generated for clients, 12+ years doing this.
          </p>
        </div>
      </section>

      {/* ── Qualifier ── */}
      <section ref={qualifierRef} className="px-4 py-14 border-y border-white/10">
        <div className="max-w-xl mx-auto">
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-8">
            <motion.div
              className="h-full bg-amber-400"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {step === 0 && (
            <div className="text-center">
              <h2 className="text-2xl font-black mb-4">Quick qualifier before you book</h2>
              <p className="text-gray-400 mb-6">3 questions, takes 20 seconds.</p>
              <button
                onClick={() => setStep(1)}
                className="px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-lg"
              >
                Start →
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-xl font-black mb-6 text-center">What type of business do you run?</h2>
              <div className="space-y-3">
                {[
                  { v: 'service', l: 'Service business' },
                  { v: 'coach', l: 'Coaching / consulting' },
                  { v: 'other', l: 'Something else with paying clients' },
                  { v: 'none', l: "I don't have a business yet" },
                ].map((o) => (
                  <button
                    key={o.v}
                    onClick={() => answer('business', o.v)}
                    className="w-full text-left px-5 py-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition-colors"
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-xl font-black mb-6 text-center">What's your current monthly revenue?</h2>
              <div className="space-y-3">
                {[
                  { v: 'under5k', l: 'Under $5K/mo' },
                  { v: '5k-20k', l: '$5K - $20K/mo' },
                  { v: '20k-50k', l: '$20K - $50K/mo' },
                  { v: '50kplus', l: '$50K+/mo' },
                ].map((o) => (
                  <button
                    key={o.v}
                    onClick={() => answer('revenue', o.v)}
                    className="w-full text-left px-5 py-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition-colors"
                  >
                    {o.l}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-xl font-black mb-6 text-center">
                Are you ready to invest in growth in the next 30 days?
              </h2>
              <div className="space-y-3">
                <button
                  onClick={() => answer('ready', 'yes')}
                  className="w-full text-left px-5 py-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition-colors"
                >
                  Yes, I'm ready to move
                </button>
                <button
                  onClick={() => answer('ready', 'no')}
                  className="w-full text-left px-5 py-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 font-semibold transition-colors"
                >
                  Not right now
                </button>
              </div>
            </div>
          )}

          {step === 4 && outcome === 'qualified' && (
            <div className="text-center">
              <h2 className="text-2xl font-black mb-2 text-amber-400">You qualify. Pick a time below.</h2>
              <p className="text-gray-400 mb-6">The Client Attraction System Walkthrough, 100% free.</p>
              {!calendarRevealed ? (
                <button
                  onClick={() => setCalendarRevealed(true)}
                  className="px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-lg"
                >
                  Show Me The Calendar →
                </button>
              ) : (
                <div className="rounded-xl overflow-hidden border border-white/10 bg-white">
                  <iframe
                    src="https://api.leadconnectorhq.com/widget/booking/jB82SG2CBq9Nh8103IfC"
                    style={{ width: '100%', border: 'none', overflow: 'hidden', minHeight: 820 }}
                    scrolling="no"
                    id="jB82SG2CBq9Nh8103IfC_booking"
                    title="Book The Client Attraction System Walkthrough"
                  />
                </div>
              )}
            </div>
          )}

          {step === 4 && outcome === 'not-fit' && (
            <div className="text-center bg-white/5 border border-white/10 rounded-xl p-8">
              <h2 className="text-xl font-black mb-3">Not quite the right fit yet, and that's fine.</h2>
              <p className="text-gray-400 mb-6">
                This program is built for businesses already running and ready to invest in ad spend. If
                that's not you yet, start here instead:
              </p>
              <a
                href="https://freedom.kenjiai.com/makemore"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('lead_not_fit_redirect', variant)}
                className="inline-block px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-lg"
              >
                Check Out The $7 Freedom Club →
              </a>
            </div>
          )}
        </div>
      </section>

      {/* ── Reviews ── */}
      <Reviews />

      {/* ── Repeat proof #4 ── */}
      <section className="px-4 py-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-400">
            $3.35M generated. 500+ clients. One client alone pulled <span className="text-amber-400 font-black">$186K</span> from a single funnel.
          </p>
        </div>
      </section>

      {/* ── Guarantee ── */}
      <section className="px-4 py-14 bg-white/[0.02] border-y border-white/10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-4">How I guarantee this</h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            I only get paid when it makes you money. No retainer, no monthly minimum, no fee for
            "strategy" that doesn't produce a result. If the system doesn't book you calls, I don't
            get paid. That's the whole guarantee, and it's the only one I'll make.
          </p>
          <p className="text-gray-500 mt-4">— Yousif Alias, Founder, KenjiAI</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-4 py-14">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black mb-8 text-center">Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <div key={f.q} className="border border-white/10 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-bold bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <span>{f.q}</span>
                  {openFaq === i ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-5 py-4 text-gray-400 bg-black/40">{f.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-4 py-14">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-black mb-4">
            $3.35M generated. Ready to see if you're a fit?
          </h2>
          <button
            onClick={scrollToQualifier}
            className="px-8 py-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-lg"
          >
            See If You Qualify →
          </button>
        </div>
      </section>
    </div>
  );
};

export default BookVSLPage;
