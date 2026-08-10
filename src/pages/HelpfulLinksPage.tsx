import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Zap, DollarSign, Play, ArrowUpRight } from 'lucide-react';

const LINKS = [
  {
    icon: Zap,
    title: 'Start Learning',
    subtitle: 'Run profitable ad campaigns for a very low monthly investment.',
    href: 'https://startlearning.kenjiai.com',
    color: 'from-amber-500 to-orange-500',
    glow: 'rgba(245,158,11,0.18)',
  },
  {
    icon: DollarSign,
    title: 'KenjiAI Pricing',
    subtitle: 'See plans and what it costs to have KenjiAI run your ads and follow-up.',
    href: 'https://kenjiai.com/pricing',
    color: 'from-emerald-500 to-teal-500',
    glow: 'rgba(16,185,129,0.18)',
  },
  {
    icon: Play,
    title: 'Watch the Free Overview',
    subtitle: 'The full walkthrough before you decide anything.',
    href: 'https://kenjiai.com/overview',
    color: 'from-cyan-500 to-blue-500',
    glow: 'rgba(0,255,255,0.18)',
  },
];

const HelpfulLinksPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Helpful Links | KenjiAI</title>
        <meta name="description" content="The most useful KenjiAI links in one place: pricing, the free overview, and the ad-training program." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen flex flex-col items-center px-4 py-16 sm:py-20" style={{ backgroundColor: '#0B0E14' }}>
        {/* ambient glow */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(0,255,255,0.08) 0%, transparent 70%)' }}
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
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 120 }}
          className="relative z-10 mb-5"
        >
          <div
            className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1"
            style={{
              background: 'conic-gradient(from 0deg, rgba(0,255,255,0.9), rgba(59,130,246,0.4), rgba(0,255,255,0.9))',
              boxShadow: '0 0 40px rgba(0,255,255,0.25)',
            }}
          >
            <img
              src="/webinar1/presenter-yousif.jpg"
              alt="Yousif Alias"
              className="w-full h-full rounded-full object-cover border-2 border-[#0B0E14]"
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="relative z-10 text-center mb-10"
        >
          <h1 className="text-white text-xl sm:text-2xl font-bold mb-1">Yousif Alias</h1>
          <p className="text-gray-400 text-sm">Founder, KenjiAI. Everything you need, right here.</p>
        </motion.div>

        <div className="relative z-10 w-full max-w-md flex flex-col gap-4">
          {LINKS.map((link, i) => (
            <motion.a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="group relative flex items-center gap-4 bg-gray-900/60 backdrop-blur-sm border border-gray-800 hover:border-gray-600 rounded-2xl p-4 sm:p-5 transition-colors duration-300"
              style={{ boxShadow: `0 0 24px ${link.glow}` }}
            >
              <div className={`flex-shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center shadow-lg`}>
                <link.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm sm:text-base leading-tight">{link.title}</div>
                <div className="text-gray-400 text-xs sm:text-sm leading-snug mt-0.5">{link.subtitle}</div>
              </div>
              <ArrowUpRight className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 text-gray-600 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
            </motion.a>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="relative z-10 text-gray-600 text-xs mt-12"
        >
          &copy; {new Date().getFullYear()} KenjiAI. All rights reserved.
        </motion.p>
      </div>
    </>
  );
};

export default HelpfulLinksPage;
