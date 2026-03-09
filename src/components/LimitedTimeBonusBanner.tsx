import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gift, Clock, Zap, ArrowRight } from 'lucide-react';

export function LimitedTimeBonusBanner() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Calculate time until end of month (simplified to 30 days from now)
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 30);

      const difference = endDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, []);

  const bonuses = [
    { icon: '📱', title: 'AI Voice Agent Setup', value: '$2,000' },
    { icon: '📧', title: 'Email Automation Flow', value: '$1,500' },
    { icon: '🎓', title: 'VIP Training Session', value: '$1,000' },
    { icon: '📊', title: 'Custom Dashboard Setup', value: '$500' }
  ];

  const totalBonusValue = 5000;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-900/20 via-orange-900/30 to-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Main Banner */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="bg-gradient-to-r from-amber-950/60 to-orange-950/60 backdrop-blur-xl border border-amber-500/40 rounded-3xl overflow-hidden"
        >
          {/* Animated Border Light */}
          <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ boxShadow: 'inset 0 0 30px rgba(217, 119, 6, 0.2)' }}
          ></div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Content */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Top Badge */}
                <motion.div
                  animate={{ y: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 rounded-full px-4 py-2 mb-6"
                >
                  <Gift className="w-5 h-5 text-amber-400" />
                  <span className="text-amber-300 font-bold text-sm uppercase tracking-widest">
                    Limited Time Offer
                  </span>
                </motion.div>

                {/* Main Heading */}
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                  Lock in Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">$5,000</span> Bonus
                </h2>

                {/* Subheading */}
                <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                  Sign up this month and get premium bonuses worth $5,000 absolutely free.
                </p>

                {/* Bonus Items */}
                <div className="space-y-3 mb-10">
                  {bonuses.map((bonus, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-lg px-4 py-3 hover:bg-white/10 transition-all"
                    >
                      <span className="text-2xl">{bonus.icon}</span>
                      <div className="flex-1">
                        <span className="text-white font-semibold">{bonus.title}</span>
                        <span className="text-gray-400 text-sm ml-auto float-right">{bonus.value}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Total Value */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="bg-gradient-to-r from-amber-500/30 to-orange-500/30 border border-amber-500/60 rounded-xl p-4 mb-8"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-200 font-semibold">Total Bonus Value</span>
                    <span className="text-3xl font-black text-amber-300">${totalBonusValue.toLocaleString()}</span>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <motion.a
                  href="https://go.mediatraffics.com/leads"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05, x: 4 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl px-8 py-4 shadow-2xl shadow-amber-600/30 hover:shadow-amber-600/50 transition-all duration-300 group"
                >
                  <Zap className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Claim Your $5,000 Bonus
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </motion.a>
              </motion.div>

              {/* Right Side - Countdown Timer & Urgency */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex flex-col items-center gap-8"
              >
                {/* Countdown Timer */}
                <div className="w-full bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-gray-700/50 rounded-2xl p-8">
                  <p className="text-gray-300 text-sm font-bold uppercase tracking-widest text-center mb-6">
                    Offer Expires In
                  </p>

                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                      { value: timeLeft.days, label: 'Days' },
                      { value: timeLeft.hours, label: 'Hours' },
                      { value: timeLeft.minutes, label: 'Mins' },
                      { value: timeLeft.seconds, label: 'Secs' }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: idx * 0.1 }}
                        className="bg-gradient-to-br from-orange-600 to-red-600 rounded-lg p-4 text-center shadow-lg shadow-orange-600/30"
                      >
                        <div className="text-2xl sm:text-3xl font-black text-white">
                          {String(item.value).padStart(2, '0')}
                        </div>
                        <div className="text-xs text-orange-100 font-bold uppercase tracking-wider mt-1">
                          {item.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-gray-400 text-xs text-center font-semibold">
                    ⚡ Spots fill up fast. 12 spots claimed this week.
                  </p>
                </div>

                {/* Urgency Cards */}
                <div className="w-full space-y-3">
                  {[
                    { emoji: '🎁', text: 'Bonus expires at month end', highlight: true },
                    { emoji: '🚀', text: 'Only 13 spots left this month' },
                    { emoji: '✨', text: 'Pricing increases next month' }
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      animate={item.highlight ? { boxShadow: ['0 0 20px rgba(234, 179, 8, 0)', '0 0 20px rgba(234, 179, 8, 0.3)', '0 0 20px rgba(234, 179, 8, 0)'] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`flex items-center gap-3 rounded-lg px-4 py-3 font-semibold text-sm border ${
                        item.highlight
                          ? 'bg-yellow-950/40 border-yellow-500/60 text-yellow-200'
                          : 'bg-white/5 border-white/10 text-gray-200'
                      }`}
                    >
                      <span className="text-lg">{item.emoji}</span>
                      {item.text}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Animated Corner Decorations */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/20 to-transparent rounded-full blur-3xl -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-3xl -ml-20 -mb-20"></div>
        </motion.div>

        {/* Fine Print */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-gray-500 text-xs mt-8 max-w-2xl mx-auto"
        >
          * Bonus offer valid for new customers only. Bonus valued at $5,000 includes AI Voice Agent setup ($2,000), Email Automation Flow ($1,500), VIP Training Session ($1,000), and Custom Dashboard Setup ($500). Offer expires at end of month. Not applicable with other promotions.
        </motion.p>
      </div>
    </motion.div>
  );
}
