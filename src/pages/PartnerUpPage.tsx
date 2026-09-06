import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Check, X, ShieldCheck, ArrowRight } from 'lucide-react';

const APPLICATION_URL = 'https://freedom.kenjiai.com/qualify';

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

const PartnerUpPage: React.FC = () => {
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

        {/* filtering headline */}
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

        {/* credibility line */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="relative z-10 text-cyan-400 text-sm font-semibold tracking-wide uppercase mb-16"
        >
          13 years running ads &middot; $3.35M+ managed &middot; 500+ businesses
        </motion.p>

        {/* for / not for */}
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

        {/* the offer */}
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
                <div className="text-white text-2xl font-bold">$25,000 <span className="text-gray-500 text-sm font-normal">one time, when we start</span></div>
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
                <div className="text-white text-2xl font-bold">15% <span className="text-gray-500 text-sm font-normal">of ad spend, every month after</span></div>
                <p className="text-gray-400 text-sm leading-relaxed mt-1.5">
                  This is on top of what you already pay Meta or Google directly, not instead of it, it&apos;s
                  how we get paid to run your account. No flat retainer: if your spend grows because it&apos;s
                  working, ours grows with it. If it&apos;s not, you&apos;re not paying a percentage on nothing,
                  that&apos;s the point of this structure.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-cyan-950/30 border border-cyan-900/40 rounded-xl p-4 text-left">
            <ShieldCheck className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-0.5" />
            <p className="text-gray-300 text-sm leading-relaxed">
              <span className="text-white font-semibold">How I get paid:</span> revenue-share, not retainer. I
              take a percentage of what I actually add to your ad performance, on top of your existing spend, not
              a flat fee regardless of what happens.
            </p>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.a
          href={APPLICATION_URL}
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
        </motion.a>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
          className="relative z-10 text-gray-600 text-xs mt-6 text-center max-w-sm"
        >
          A short application, not a checkout. We only take on a handful of new partners each quarter.
        </motion.p>

        <p className="relative z-10 text-gray-700 text-[11px] mt-4 text-center max-w-sm">
          Results vary and are not guaranteed. This page is not part of, or endorsed by, Facebook/Meta or Google.
        </p>
      </div>
    </>
  );
};

export default PartnerUpPage;
