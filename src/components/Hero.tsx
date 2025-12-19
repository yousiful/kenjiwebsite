import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Zap, Sparkles } from 'lucide-react';
import { useHolidayTheme } from '../contexts/HolidayThemeContext';

const Hero: React.FC = () => {
  const { textGradientClass, currentHoliday } = useHolidayTheme();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{backgroundColor: '#0B0E14'}} aria-labelledby="hero-heading">
      {/* Starfield Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(2px 2px at 20px 30px, #ffffff, transparent), radial-gradient(2px 2px at 60px 70px, #ffffff, transparent), radial-gradient(1px 1px at 50px 50px, #ffffff, transparent), radial-gradient(1px 1px at 130px 80px, #ffffff, transparent), radial-gradient(2px 2px at 90px 10px, #ffffff, transparent)',
          backgroundSize: '200px 200px'
        }}></div>
        {/* Radial glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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

        {/* Headline with Gradient */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-6 leading-tight"
          style={{fontFamily: 'Inter, Montserrat, sans-serif'}}
        >
          <span style={{
            background: 'linear-gradient(90deg, #ff6b9d 0%, #ffa69e 20%, #ffd97d 40%, #f9ed69 60%, #c9f0ff 80%, #a1c4fd 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.02em'
          }}>
            Automate Your Sales, 10X Your Revenue
          </span>
          <span className="text-pink-500">|</span>
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
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 1.2 + index * 0.05 }}
              className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl px-4 py-3 text-center"
              style={{backgroundColor: 'rgba(31, 41, 55, 0.6)'}}
            >
              <span className="text-gray-300 font-medium text-sm">{feature}</span>
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
          <motion.a
            href="/pricing"
            whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(233, 51, 142, 0.5)" }}
            whileTap={{ scale: 0.95 }}
            className="group relative text-white px-10 py-5 rounded-xl font-bold text-lg flex items-center gap-3 shadow-2xl overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, #E9338E 0%, #4B52FF 100%)'
            }}
          >
            <span>Start Growing with Kenji</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;