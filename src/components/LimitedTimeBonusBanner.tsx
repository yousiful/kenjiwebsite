import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Zap, ArrowRight, Lock, Star, TrendingUp } from 'lucide-react';
import { getSeasonCopy } from '../utils/seasonCopy';

export function LimitedTimeBonusBanner() {
  const season = getSeasonCopy();

  const bonuses = [
    { icon: '🎙️', title: 'Voice Agent — Done-For-You Setup', value: '$2,000' },
    { icon: '📧', title: season.emailBonus, value: '$1,500' },
    { icon: '🎓', title: 'VIP Onboarding & Strategy Session', value: '$1,000' },
    { icon: '📊', title: 'Custom Revenue Dashboard', value: '$500' },
  ];

  const urgencyItems = [
    { icon: Lock, color: 'text-red-400', bg: 'bg-red-950/40 border-red-500/40', text: `${season.stripLabel} pricing ends soon`, highlight: true },
    { icon: Star, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-500/40', text: season.stripUrgency, highlight: false },
    { icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-500/40', text: 'Done-For-You onboarding spots are limited', highlight: false },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="bg-gradient-to-r from-amber-950/60 to-orange-950/60 backdrop-blur-xl border border-amber-500/40 rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl -ml-20 -mb-20"></div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

              {/* Left */}
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-2 mb-6">
                  <Gift className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-300 font-bold text-sm uppercase tracking-widest">
                    {season.stripLabel}
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                  {season.bonusTitle.split(' ').slice(0, -1).join(' ')}{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">
                    {season.bonusTitle.split(' ').slice(-1)[0]}
                  </span>
                </h2>

                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  {season.bonusSubtitle}
                </p>

                <div className="space-y-3 mb-8">
                  {bonuses.map((bonus, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3"
                    >
                      <span className="text-xl">{bonus.icon}</span>
                      <span className="text-white font-semibold flex-1">{bonus.title}</span>
                      <span className="text-amber-300 font-bold text-sm shrink-0">{bonus.value}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-500/60 rounded-xl p-4 mb-8 flex items-center justify-between">
                  <span className="text-gray-200 font-semibold">Total Bonus Value</span>
                  <span className="text-3xl font-black text-amber-300">$5,000</span>
                </div>

                <motion.a
                  href="https://go.mediatraffics.com/leads"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl px-8 py-4 shadow-xl transition-all duration-300 group"
                >
                  <Zap className="w-5 h-5" />
                  Claim Your Bonus Package
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.a>
              </div>

              {/* Right */}
              <div className="flex flex-col gap-6">
                <div className="bg-gray-900/80 border border-gray-700/50 rounded-2xl p-6">
                  <p className="text-white font-bold text-sm mb-4">{season.whyNowTitle}</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">📅</span>
                      <div>
                        <p className="text-white font-semibold text-sm">{season.whyNowBody}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">🎁</span>
                      <div>
                        <p className="text-white font-semibold text-sm">These bonuses are limited</p>
                        <p className="text-gray-400 text-xs mt-0.5">We bundle this package for the current promotion only. Once it closes, so does this offer.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-xl mt-0.5">🔒</span>
                      <div>
                        <p className="text-white font-semibold text-sm">Today's rate is locked in</p>
                        <p className="text-gray-400 text-xs mt-0.5">{season.rateNote}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {urgencyItems.map((item, idx) => (
                    <motion.div
                      key={idx}
                      animate={item.highlight ? {
                        boxShadow: ['0 0 0px rgba(239,68,68,0)', '0 0 16px rgba(239,68,68,0.2)', '0 0 0px rgba(239,68,68,0)']
                      } : {}}
                      transition={{ duration: 2.5, repeat: Infinity }}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm border ${item.bg}`}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                      <span className="text-gray-200 font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="bg-emerald-950/50 border border-emerald-500/30 rounded-xl px-6 py-4 text-center">
                  <p className="text-emerald-300 font-bold text-sm">8 of our last 10 clients</p>
                  <p className="text-gray-300 text-xs mt-1">now generate $100K+ per month.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs mt-8 max-w-2xl mx-auto">
          Bonus offer valid for new customers only. Includes Voice Agent Setup ($2,000), {season.emailBonus} ($1,500), VIP Onboarding Session ($1,000), and Custom Dashboard ($500). {season.bonusClosing} Not combinable with other promotions. Revenue figures represent exceptional results and are not typical.
        </p>
      </div>
    </motion.div>
  );
}
