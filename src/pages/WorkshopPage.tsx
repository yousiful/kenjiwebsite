import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, X, Lock, ArrowRight } from 'lucide-react';

const CHECKOUT_URL = 'https://freedom.kenjiai.com/28';

const SEE_POINTS = [
  'Why we stopped taking retainers, and what happened to close rate once the money was on us instead of the client.',
  'The exact guarantee we put in writing, word for word, and why most agencies will never touch it.',
  'The filter we run in under 5 minutes that tells us if this will even work for a business, before we agree to anything.',
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

        {/* what you'll see */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="relative z-10 w-full max-w-2xl mb-12"
        >
          <h2 className="text-white font-bold text-lg mb-4 text-center">In 90 minutes, you&apos;ll see</h2>
          <div className="flex flex-col gap-3">
            {SEE_POINTS.map((point, i) => (
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

        {/* offer */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
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
          No refunds once you're in, this isn't a course you'll sit on. Show up, take the 90 minutes, decide for yourself.
        </motion.p>
      </div>
    </>
  );
};

export default WorkshopPage;
