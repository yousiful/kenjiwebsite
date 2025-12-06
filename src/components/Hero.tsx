import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Zap, Sparkles } from 'lucide-react';
import { useHolidayTheme } from '../contexts/HolidayThemeContext';

const Hero: React.FC = () => {
  const [text, setText] = useState('');
  const fullText = "AI That Closes Deals While You Sleep";
  const { textGradientClass, currentHoliday } = useHolidayTheme();

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" aria-labelledby="hero-heading">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-green-400/30 animate-pulse"></div>
        {[...Array(150)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              opacity: 0,
            }}
            animate={{
              y: [null, -100],
              opacity: [0, 1, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Enhanced Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/30 to-green-400/30 border border-blue-400/50 rounded-full px-6 py-3 mobile-hover">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span className="text-blue-300 font-semibold">The AI Revolution That Pays You Back</span>
          </div>
        </motion.div>

        {/* Enhanced Animated Headline */}
        <motion.h2
          id="hero-heading"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-8 leading-tight"
        >
          <span className={`bg-gradient-to-r ${textGradientClass} bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(59,130,246,0.5)]`}>
            {text}
            <span className={`animate-pulse bg-gradient-to-r ${textGradientClass} bg-clip-text text-transparent`}>|</span>
          </span>
        </motion.h2>

        {currentHoliday && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mb-6"
          >
            <span className="text-4xl">{currentHoliday.emoji}</span>
            {currentHoliday.banner_message && (
              <p className="text-xl text-gray-300 mt-2">{currentHoliday.banner_message}</p>
            )}
          </motion.div>
        )}

        {/* Enhanced Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-2xl sm:text-3xl text-gray-300 mb-12 max-w-6xl mx-auto leading-relaxed"
        >
          Stop losing money to manual work. Our <span className="text-blue-400 font-semibold">AI voice agents close deals 24/7</span>, 
          <span className="text-green-400 font-semibold"> smart workflows run your business</span>, and 
          <span className="text-purple-400 font-semibold"> automated systems generate revenue</span> while you focus on growth.
          <br />
          <span className="text-yellow-400 font-bold text-xl">Average ROI: 425% in first 90 days.</span>
        </motion.p>

        {/* Enhanced Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto"
        >
          {[
            "Closes Deals 24/7",
            "300% More Leads", 
            "85% Cost Reduction",
            "Zero Manual Work",
            "Instant ROI",
            "Never Sleeps",
            "Scales Infinitely",
            "Pays For Itself"
          ].map((feature, index) => (
            <motion.div
              key={feature}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.4 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-800/50 border border-gray-700 hover:border-blue-400/50 rounded-xl p-3 text-center mobile-hover investor-card-shadow touch-target"
            >
              <span className="text-white font-medium text-sm">{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16"
        >
          <motion.a
            href="/pricing"
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(59, 130, 246, 0.8)" }}
            whileTap={{ scale: 0.95 }}
            className="group relative investor-gradient-blue text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center gap-3 shadow-2xl mobile-button focus-ring"
            data-caption="Start making money with AI today - 16-day free trial, 425% average ROI"
          >
            <span>Start Making Money with AI</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400/20 to-green-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </motion.a>
        </motion.div>

        {/* Enhanced Secondary Buttons */}
        <motion.nav
          aria-label="Quick Links"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {[
            { href: "/free-tools", label: "Free AI Tools", icon: Zap, caption: "Try powerful AI tools completely free - no signup required" },
            { href: "/knowledge", label: "AI Success Stories", icon: Play, caption: "Learn how businesses achieve 425% ROI with AI automation" },
            { href: "/voice-agents", label: "See AI Close Deals", icon: Users, caption: "Watch AI voice agents close real deals 24/7" },
            { href: "https://support.kenjiai.com/", label: "Get Help", icon: Users, caption: "Expert support to maximize your AI ROI" },
          ].map((button, index) => (
            <motion.a
              key={button.label}
              href={button.href}
              target={button.href.startsWith('http') ? "_blank" : undefined}
              rel={button.href.startsWith('http') ? "noopener noreferrer" : undefined}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 hover:border-blue-400 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 backdrop-blur-sm mobile-hover investor-card-shadow touch-target focus-ring"
              data-caption={button.caption}
            >
              <button.icon className="w-4 h-4 text-blue-400 group-hover:text-green-400 transition-colors" />
              {button.label}
            </motion.a>
          ))}
        </motion.nav>

        {/* Enhanced Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="mt-16 flex items-center justify-center gap-8 text-gray-500 text-sm"
        >
          <div className="flex items-center gap-2 mobile-hover" data-caption="Bank-level security protecting your business data and revenue">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span>Bank-Level Security</span>
          </div>
          <div className="flex items-center gap-2 mobile-hover" data-caption="50,000+ businesses generating revenue with AI automation">
            <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
            <span>50K+ Profitable Businesses</span>
          </div>
          <div className="flex items-center gap-2 mobile-hover" data-caption="Average 425% return on investment within 90 days">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
            <span>425% Average ROI</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;