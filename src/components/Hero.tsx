import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Zap, Sparkles } from 'lucide-react';
import { useHolidayTheme } from '../contexts/HolidayThemeContext';
import { TypingHeadline } from './TypingHeadline';
import { LuxuryButton } from './LuxuryButton';
import { AmbientBackground } from './AmbientBackground';

const Hero: React.FC = () => {
  const { textGradientClass, currentHoliday } = useHolidayTheme();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" style={{backgroundColor: '#0B0E14'}} aria-labelledby="hero-heading">
      <AmbientBackground />

      {/* Starfield Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(2px 2px at 20px 30px, #ffffff, transparent), radial-gradient(2px 2px at 60px 70px, #ffffff, transparent), radial-gradient(1px 1px at 50px 50px, #ffffff, transparent), radial-gradient(1px 1px at 130px 80px, #ffffff, transparent), radial-gradient(2px 2px at 90px 10px, #ffffff, transparent)',
          backgroundSize: '200px 200px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-16">
        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-cyan-400/40 rounded-full px-6 py-3">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <span className="text-cyan-300 font-semibold">The AI Revolution That Pays You Back</span>
          </div>
        </motion.div>

        {/* Headline with Typing Animation */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <TypingHeadline />
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg sm:text-xl text-gray-400 mb-8 max-w-4xl mx-auto"
        >
          Every minute you spend on repetitive tasks costs you money. Let AI handle the boring stuff while you focus on what actually grows your business.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-2xl font-bold mb-12"
          style={{color: '#FBBF24'}}
        >
          Save 40+ hours per week instantly.
        </motion.p>

        {/* Benefit Tags - 8 pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12 max-w-5xl mx-auto"
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: 1,
                scale: 1,
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.2)',
                  '0 0 30px rgba(59, 130, 246, 0.4)',
                  '0 0 20px rgba(59, 130, 246, 0.2)',
                ]
              }}
              transition={{
                duration: 0.4,
                delay: 1.2 + index * 0.05,
                boxShadow: {
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: index * 0.2,
                }
              }}
              whileHover={{
                scale: 1.05,
                y: -5,
                boxShadow: '0 10px 40px rgba(59, 130, 246, 0.5)',
              }}
              className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-3 text-center overflow-hidden cursor-pointer group"
              style={{
                backgroundColor: 'rgba(31, 41, 55, 0.6)',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 group-hover:via-blue-500/20 transition-all duration-500" />
              <span className="relative z-10 text-gray-300 font-medium text-sm">{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="flex justify-center mb-16"
        >
          <div className="relative">
            <LuxuryButton href="/pricing" variant="primary" size="xl">
              {currentHoliday && (
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-2xl"
                >
                  {currentHoliday.emoji}
                </motion.span>
              )}
              <span>Start Growing with Kenji</span>
              <ArrowRight className="w-6 h-6" />
            </LuxuryButton>
            {currentHoliday && (
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-black px-3 py-1 rounded-full uppercase shadow-lg z-20"
              >
                {currentHoliday.offer_badge}
              </motion.span>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;