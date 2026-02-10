import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Zap, Sparkles, Phone } from 'lucide-react';
import { useHolidayTheme } from '../contexts/HolidayThemeContext';
import { TypingHeadline } from './TypingHeadline';
import { LuxuryButton } from './LuxuryButton';
import { AmbientBackground } from './AmbientBackground';
import { DynamicDateTime } from './DynamicDateTime';

const Hero: React.FC = () => {
  const { textGradientClass, currentHoliday } = useHolidayTheme();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 sm:pt-8" style={{backgroundColor: '#0B0E14'}} aria-labelledby="hero-heading">
      <AmbientBackground />

      {/* Starfield Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(2px 2px at 20px 30px, #ffffff, transparent), radial-gradient(2px 2px at 60px 70px, #ffffff, transparent), radial-gradient(1px 1px at 50px 50px, #ffffff, transparent), radial-gradient(1px 1px at 130px 80px, #ffffff, transparent), radial-gradient(2px 2px at 90px 10px, #ffffff, transparent)',
          backgroundSize: '200px 200px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pb-12 sm:pb-16">
        {/* Live Date/Time Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="pt-6 sm:pt-8 mb-3 sm:mb-2 flex justify-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2.5 sm:py-2 bg-gray-800/60 backdrop-blur-sm border border-blue-500/30 rounded-full touch-manipulation">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <DynamicDateTime format="short" className="text-gray-300 text-xs sm:text-xs font-medium" />
            <span className="text-gray-500 text-xs">EST</span>
          </div>
        </motion.div>

        {/* Headline with Typing Animation */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="pt-4 sm:pt-8"
        >
          <TypingHeadline />
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-2"
        >
          The only all-in-one AI partner that automates your lead generation, sales calls, and client delivery. Get a proven ROI in under 30 days.
        </motion.p>

        {/* Benefit Tags - 8 pills */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 mb-10 sm:mb-12 max-w-5xl mx-auto"
        >
          {[
            "24/7 Operations",
            "Scalable Infrastructure",
            "85% Cost Efficiency",
            "Zero Downtime",
            "Rapid Deployment",
            "Enterprise Security",
            "Unlimited Capacity",
            "Predictable ROI"
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
                delay: 1.0 + index * 0.05,
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
              className="relative bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-lg sm:rounded-xl px-3 sm:px-4 py-3 sm:py-3 text-center overflow-hidden cursor-pointer group touch-manipulation min-h-[44px] flex items-center justify-center"
              style={{
                backgroundColor: 'rgba(31, 41, 55, 0.6)',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 group-hover:via-blue-500/20 transition-all duration-500" />
              <span className="relative z-10 text-gray-300 font-medium text-xs sm:text-sm">{feature}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex justify-center mb-10 sm:mb-16 px-4"
        >
          <div className="relative w-full sm:w-auto">
            <LuxuryButton href="/pricing" variant="primary" size="xl">
              {currentHoliday && (
                <motion.span
                  animate={{ rotate: [0, 15, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-xl sm:text-2xl"
                >
                  {currentHoliday.emoji}
                </motion.span>
              )}
              <span className="text-base sm:text-lg">Explore Solutions</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
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

        {/* Contact Option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center px-4"
        >
          <p className="text-gray-400 text-sm mb-2">Prefer to speak with our team?</p>
          <a
            href="tel:+18286772148"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors font-medium group touch-manipulation min-h-[44px]"
          >
            <Phone className="w-5 h-5 sm:w-4 sm:h-4 group-hover:animate-pulse" />
            <span className="text-base sm:text-base">(828) 677-2148</span>
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;