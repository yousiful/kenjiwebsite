import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Users, Zap, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
  const headlines = [
    "Turn Every Lead Into Revenue With AI",
    "AI That Closes Deals While You Sleep",
    "Automate Your Sales, 10X Your Revenue",
    "Get Paid 24/7 With AI Voice Agents",
    "Stop Wasting Time, Start Making Money"
  ];

  const [currentHeadline, setCurrentHeadline] = useState(0);
  const [text, setText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const fullText = headlines[currentHeadline];
    let i = 0;

    const timer = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
        setIsTyping(false);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [currentHeadline]);

  useEffect(() => {
    const rotateTimer = setInterval(() => {
      setIsTyping(true);
      setText('');
      setCurrentHeadline((prev) => (prev + 1) % headlines.length);
    }, 5000);

    return () => clearInterval(rotateTimer);
  }, []);

  const valueProps = [
    {
      text: "Stop losing money to manual work. Our AI voice agents close deals 24/7, smart workflows run your business, and automated systems generate revenue while you focus on growth.",
      highlight: "Average ROI: 425% in first 90 days."
    },
    {
      text: "Your competitors are sleeping. Your AI isn't. Convert leads into customers automatically with voice agents that never take a day off.",
      highlight: "Close 10X more deals without hiring."
    },
    {
      text: "Every minute you spend on repetitive tasks costs you money. Let AI handle the boring stuff while you focus on what actually grows your business.",
      highlight: "Save 40+ hours per week instantly."
    },
    {
      text: "Small team? No problem. KenjiAI gives you the power of a 50-person team at a fraction of the cost. Scale without the overhead.",
      highlight: "Replace 10+ tools with one platform."
    },
    {
      text: "Stop chasing leads manually. AI voice agents qualify, nurture, and close deals while you sleep. Wake up to new revenue, every single day.",
      highlight: "Average customer saves $8,400/month."
    }
  ];

  const currentValue = valueProps[currentHeadline];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900/50 via-purple-900/30 to-gray-900" aria-labelledby="hero-heading">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-orange-500/20 via-yellow-500/20 via-green-500/20 via-blue-500/20 via-indigo-500/20 to-violet-500/20 animate-pulse"></div>
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
            <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent font-semibold">The AI Revolution That Pays You Back</span>
          </div>
        </motion.div>

        {/* Main Page Headline - H1 for SEO */}
        <motion.h1
          id="hero-heading"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-5xl sm:text-6xl lg:text-8xl font-bold text-white mb-8 leading-tight"
        >
          <span className="bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
            {text}
            <span className="animate-pulse text-pink-400">|</span>
          </span>
        </motion.h1>

        {/* Enhanced Subheadline */}
        <motion.div
          key={currentHeadline}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6 }}
          className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-6xl mx-auto leading-relaxed"
        >
          <p className="mb-4">
            {currentValue.text}
          </p>
          <p className="text-yellow-400 font-bold text-2xl">
            {currentValue.highlight}
          </p>
        </motion.div>

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
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(147, 51, 234, 0.8)" }}
            whileTap={{ scale: 0.95 }}
            className="group relative bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:from-pink-500 hover:via-purple-500 hover:to-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 flex items-center gap-3 shadow-2xl mobile-button focus-ring"
            data-caption="Get instant access to AI automation - 425% average ROI, 30-day money-back guarantee"
          >
            <span>Start Growing with Kenji</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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