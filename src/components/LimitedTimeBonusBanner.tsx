import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Zap, ArrowRight, Star, TrendingUp, Lock } from 'lucide-react';

const HOLIDAY_BONUSES = [
  { icon: '🤖', title: 'AI Voice Agent — Done-For-You Setup', value: '$2,000' },
  { icon: '📧', title: 'Holiday Email Automation Flow', value: '$1,500' },
  { icon: '🎓', title: 'VIP Strategy & Onboarding Session', value: '$1,000' },
  { icon: '📊', title: 'Custom Revenue Dashboard Build-Out', value: '$500' },
];

const URGENCY_TRIGGERS = [
  {
    icon: Lock,
    color: 'text-red-400',
    bg: 'bg-red-950/40 border-red-500/40',
    text: 'Holiday pricing ends this season — won\'t return until next year',
    highlight: true,
  },
  {
    icon: Star,
    color: 'text-amber-400',
    bg: 'bg-amber-950/40 border-amber-500/40',
    text: 'Only businesses that act in Q4 capture the January head-start',
    highlight: false,
  },
  {
    icon: TrendingUp,
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40 border-emerald-500/40',
    text: 'Spots for Done-For-You onboarding are limited this quarter',
    highlight: false,
  },
];

export function LimitedTimeBonusBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-gradient-to-r from-amber-950/60 to-orange-950/60 backdrop-blur-xl border border-amber-500/40 rounded-3xl overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl -ml-20 -mb-20"></div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left Side */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-2 mb-6"
                >
                  <Gift className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-300 font-bold text-sm uppercase tracking-widest">
                    Holiday Season Exclusive
                  </span>
                </motion.div>

                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                  Your Business Deserves to Start the New Year at{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                    Full Power
                  </span>
                </h2>

                <p className="text-xl text-gray-200 mb-4 leading-relaxed">
                  Most business owners wait until January to get serious. The ones who win are already running in December.
                </p>

                <p className="text-base text-gray-400 mb-8 leading-relaxed italic border-l-2 border-amber-500/50 pl-4">
                  "The season of the year doesn't change the opportunity — but it does change who's paying attention."
                </p>

                <div className="space-y-3 mb-8">
                  {HOLIDAY_BONUSES.map((bonus, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3 hover:bg-white/10 transition-all"
                    >
                      <span className="text-2xl">{bonus.icon}</span>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-white font-semibold">{bonus.title}</span>
                        <span className="text-amber-300 font-bold text-sm ml-2 shrink-0">{bonus.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-500/60 rounded-xl p-4 mb-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200 font-semibold">Total Holiday Bonus Value</span>
                    <span className="text-3xl font-black text-amber-300">$5,000</span>
                  </div>
                  <p className="text-amber-400/70 text-xs mt-1">Included free when you join before this season ends</p>
                </motion.div>

                <motion.a
                  href="https://go.mediatraffics.com/leads"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl px-8 py-4 shadow-2xl shadow-amber-600/30 hover:shadow-amber-600/50 transition-all duration-300 group"
                >
                  <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Claim Your Holiday Bonus Package
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </motion.a>
              </motion.div>

              {/* Right Side - Holiday Urgency Panel */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center gap-8"
              >
                {/* Seasonal Urgency Block */}
                <div className="w-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-2xl p-8">
                  <p className="text-gray-300 text-sm font-bold uppercase tracking-widest text-center mb-2">
                    Why This Season Matters
                  </p>
                  <p className="text-gray-400 text-xs text-center mb-6 leading-relaxed">
                    January 1st is 90 days away. The businesses closing Q1 strong are the ones that set up their systems now — not after the holidays.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-white/5 rounded-lg px-4 py-3">
                      <span className="text-2xl mt-0.5">📈</span>
                      <div>
                        <p className="text-white font-semibold text-sm">Q4 Buyers Close Q1 Deals</p>
                        <p className="text-gray-400 text-xs mt-0.5">Businesses who automate in November and December report 3x faster pipeline velocity in January.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/5 rounded-lg px-4 py-3">
                      <span className="text-2xl mt-0.5">🎯</span>
                      <div>
                        <p className="text-white font-semibold text-sm">Holiday Pricing Is Rare</p>
                        <p className="text-gray-400 text-xs mt-0.5">We offer these bundle bonuses once per year. When this season closes, so does this package.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white/5 rounded-lg px-4 py-3">
                      <span className="text-2xl mt-0.5">🔒</span>
                      <div>
                        <p className="text-white font-semibold text-sm">Lock In Before Rates Rise</p>
                        <p className="text-gray-400 text-xs mt-0.5">Pricing adjusts in the new year. Everyone who joins now is grandfathered at today's rate.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Urgency Trigger Cards */}
                <div className="w-full space-y-3">
                  {URGENCY_TRIGGERS.map((item, idx) => (
                    <motion.div
                      key={idx}
                      animate={item.highlight ? {
                        boxShadow: [
                          '0 0 20px rgba(239, 68, 68, 0)',
                          '0 0 20px rgba(239, 68, 68, 0.25)',
                          '0 0 20px rgba(239, 68, 68, 0)'
                        ]
                      } : {}}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-sm border ${item.bg}`}
                    >
                      <item.icon className={`w-5 h-5 shrink-0 ${item.color}`} />
                      <span className="text-gray-200">{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Social Proof Micro-stat */}
                <div className="w-full bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border border-emerald-500/30 rounded-xl px-6 py-4 text-center">
                  <p className="text-emerald-300 font-bold text-sm mb-1">8 of our last 10 Q4 clients</p>
                  <p className="text-gray-300 text-xs leading-relaxed">hit $100K+ in monthly revenue within their first 90 days of going live with KenjiAI.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-gray-500 text-xs mt-8 max-w-2xl mx-auto"
        >
          * Holiday bonus offer valid for new customers only. Bonus package valued at $5,000 includes AI Voice Agent Setup ($2,000), Holiday Email Automation Flow ($1,500), VIP Strategy Session ($1,000), and Custom Revenue Dashboard ($500). Offer expires at end of this season. Not combinable with other promotions. Revenue results represent exceptional cases and are not guaranteed.
        </motion.p>
      </div>
    </motion.div>
  );
}
