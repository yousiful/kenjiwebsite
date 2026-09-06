import React, { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, X, Lock, ArrowRight, Calculator } from 'lucide-react';

const CHECKOUT_URL = 'https://freedom.kenjiai.com/28';

const CURRICULUM = [
  'Why we stopped taking retainers, and what happened to close rate once the money was on us instead of the client.',
  'The exact guarantee we put in writing, word for word, and why most agencies will never touch it.',
  'The filter we run in under 5 minutes that tells us if this will even work for a business, before we agree to anything.',
  'The pricing structure itself, implementation fee plus a cut of spend, and why it’s built that way instead of a flat monthly rate.',
  'What we actually track to know an account is working, and why cost-per-lead is the wrong number to chase.',
  'The one thing that has to already be true about a business before we’ll take the call.',
];

const FOR_POINTS = [
  "You're spending real money on ads, or getting ready to.",
  'You want to see the mechanics before you ever talk to us.',
  "You'd rather pay $27 to know for sure than waste an hour on a call that isn't a fit.",
];

const NOT_FOR_POINTS = [
  'You want a free webinar with a pitch at the end.',
  "You're not spending anything on ads yet and aren't planning to.",
  "You just want the highlight reel, not the actual numbers.",
];

const FAQS = [
  {
    q: 'Is there a pitch at the end?',
    a: 'Yes. At the end I’ll invite you to apply for the Partner Program if it looks like a fit. The workshop stands on its own either way, you’ll see the full structure whether you apply or not.',
  },
  {
    q: 'Do I need experience running ads?',
    a: 'You need to be spending real money on ads already, or be close to it. This isn’t a beginner course on how to launch your first campaign, it’s the structure behind how we take over an existing ad account.',
  },
  {
    q: 'What if I’m not at $20K+/month yet?',
    a: 'The Partner Program itself is built for businesses spending $20K+/month. If you’re not there yet but you’re on your way, the workshop still shows you exactly what to build toward.',
  },
  {
    q: 'What happens right after I pay?',
    a: 'You get access details by email immediately after checkout.',
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-white font-semibold text-sm sm:text-base">{q}</span>
        <span className="text-cyan-400 text-xl flex-shrink-0">{open ? '–' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-4">
          <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

function RoiCalculator() {
  const [spend, setSpend] = useState(20000);
  const [customers, setCustomers] = useState(40);

  const extraCustomers = useMemo(() => {
    if (!customers || customers <= 0) return 0;
    return Math.round(customers * 0.25);
  }, [customers]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.55 }}
      className="relative z-10 w-full max-w-xl bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 mb-12"
    >
      <div className="flex items-center gap-2 mb-1">
        <Calculator className="w-4 h-4 text-cyan-400" />
        <h2 className="text-white font-bold text-lg">What a 20% CPA cut is worth to you</h2>
      </div>
      <p className="text-gray-500 text-xs mb-6">
        Based on the same 20-percent cost-per-acquisition guarantee stated on our Partner Program page.
        Illustrative only, not a promise for your specific business.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <label className="block">
          <span className="text-gray-400 text-xs uppercase tracking-wide mb-1.5 block">Monthly ad spend ($)</span>
          <input
            type="number"
            min={0}
            value={spend}
            onChange={(e) => setSpend(Number(e.target.value))}
            className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
          />
        </label>
        <label className="block">
          <span className="text-gray-400 text-xs uppercase tracking-wide mb-1.5 block">Customers/month from that spend</span>
          <input
            type="number"
            min={0}
            value={customers}
            onChange={(e) => setCustomers(Number(e.target.value))}
            className="w-full bg-black/40 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
          />
        </label>
      </div>

      <div className="bg-cyan-950/30 border border-cyan-900/40 rounded-xl p-4 text-center">
        <p className="text-gray-300 text-sm">
          Cut CPA by 20% on the same ${spend.toLocaleString()}/month budget and that’s roughly
        </p>
        <p className="text-cyan-400 text-2xl font-bold my-1">+{extraCustomers} customers/month</p>
        <p className="text-gray-500 text-xs">for money you’re already spending.</p>
      </div>
    </motion.div>
  );
}

const WorkshopPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>The Partner System Workshop | KenjiAI</title>
        <meta
          name="description"
          content="A paid, 90-minute workshop breaking down the exact performance-based ad structure behind the KenjiAI Partner Program. $27, capped seats."
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
          className="relative z-10 mb-8"
        >
          <img src="/kenji-logo.webp" alt="KenjiAI" className="h-12 sm:h-14 w-auto object-contain" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative z-10 flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-wide uppercase mb-6"
        >
          <Lock className="w-3.5 h-3.5" />
          Paid Workshop, Not a Free Webinar
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="relative z-10 max-w-2xl text-center mb-10"
        >
          <h1 className="text-white text-3xl sm:text-5xl font-bold leading-tight mb-5">
            We Stopped Charging Retainers.
            <br />
            Here&apos;s Exactly Why.
          </h1>
          <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
            One CPA firm has paid us $186,000 since we started working together, on a purely performance basis,
            because the structure brought them over $50 million in revenue. Same audience. Same ad spend.
            Just a different way of getting paid.
          </p>
        </motion.div>

        {/* problem: the retainer trap */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="relative z-10 w-full max-w-2xl bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 mb-12 text-left"
        >
          <h2 className="text-white font-bold text-xl mb-3">The Retainer Trap</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            Most agencies get paid the same amount whether your ads work or not. That means their job isn&apos;t
            to make you money, it&apos;s to keep the invoice going out every month. Reports get prettier. Results
            don&apos;t.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">
            We ran into this from the other side, as the agency. Once we switched to only getting paid when it
            worked, the incentive flipped completely. A client&apos;s win became the only way we got paid too.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            That&apos;s the whole mechanism behind the Partner Program. In this workshop I show you exactly how
            it&apos;s structured: the guarantee, the math, the filter, so you can see whether the same thing would
            work in your business.
          </p>
        </motion.div>

        {/* what you'll see */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="relative z-10 w-full max-w-2xl mb-12"
        >
          <h2 className="text-white font-bold text-lg mb-4 text-center">In 90 minutes, you&apos;ll see</h2>
          <div className="flex flex-col gap-3">
            {CURRICULUM.map((point, i) => (
              <div
                key={point}
                className="flex items-start gap-4 bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-5"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-cyan-400 text-[#0B0E14] font-bold flex items-center justify-center text-sm">
                  {i + 1}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* for / not for */}
        <div className="relative z-10 w-full max-w-3xl grid sm:grid-cols-2 gap-5 mb-12">
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

        <RoiCalculator />

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="relative z-10 w-full max-w-2xl mb-12"
        >
          <h2 className="text-white font-bold text-lg mb-4 text-center">Before you grab a seat</h2>
          <div className="flex flex-col gap-3">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </motion.div>

        {/* offer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.65 }}
          className="relative z-10 w-full max-w-lg bg-gray-900/60 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 mb-8 text-center"
          style={{ boxShadow: '0 0 40px rgba(0,255,255,0.08)' }}
        >
          <div className="text-white text-4xl font-bold mb-2">$27</div>
          <p className="text-gray-500 text-xs uppercase tracking-wide">One time. Seats capped.</p>
        </motion.div>

        <motion.a
          href={CHECKOUT_URL}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.75 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative z-10 group inline-flex items-center gap-2 bg-cyan-400 hover:bg-cyan-300 text-[#0B0E14] font-bold text-base sm:text-lg px-8 py-4 rounded-full transition-colors duration-300"
          style={{ boxShadow: '0 0 40px rgba(0,255,255,0.25)' }}
        >
          Get My Seat, $27
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="relative z-10 text-gray-600 text-xs mt-6 text-center max-w-sm"
        >
          Either your current numbers stay the same next quarter, or you spend 90 minutes and $27 finding out
          what changes them. Show up and decide for yourself.
        </motion.p>

        <p className="relative z-10 text-gray-700 text-[11px] mt-4 text-center max-w-sm">
          Results vary and are not guaranteed. This page is not part of, or endorsed by, Facebook/Meta or Google.
        </p>
      </div>
    </>
  );
};

export default WorkshopPage;
