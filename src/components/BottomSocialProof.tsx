import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Users, TrendingUp, Shield, Award, Star, Zap } from 'lucide-react';

interface ProofItem {
  icon: React.ReactNode;
  text: string;
  subtext: string;
  color: string;
}

export function BottomSocialProof() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const proofItems: ProofItem[] = [
    {
      icon: <Users className="w-5 h-5" />,
      text: "500+ businesses automated this week",
      subtext: "Join the AI revolution",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      text: "Average ROI: 425% in first 90 days",
      subtext: "Proven results",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Bank-level security & 99.97% uptime",
      subtext: "Enterprise-grade reliability",
      color: "from-purple-500 to-indigo-500"
    },
    {
      icon: <Award className="w-5 h-5" />,
      text: "50,000+ active users worldwide",
      subtext: "Trusted by entrepreneurs",
      color: "from-amber-500 to-orange-500"
    },
    {
      icon: <Star className="w-5 h-5" />,
      text: "4.9/5 average customer rating",
      subtext: "Rated excellent",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: <Zap className="w-5 h-5" />,
      text: "40+ hours saved per week average",
      subtext: "Instant productivity boost",
      color: "from-pink-500 to-rose-500"
    }
  ];

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % proofItems.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(cycleInterval);
  }, [proofItems.length]);

  const currentProof = proofItems[currentIndex];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none"
    >
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentIndex}
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className={`bg-gradient-to-r ${currentProof.color} p-[2px] rounded-2xl shadow-2xl pointer-events-auto`}
          >
            <div className="bg-gray-900 rounded-2xl px-6 py-4 backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className={`bg-gradient-to-r ${currentProof.color} p-3 rounded-full text-white`}
                >
                  {currentProof.icon}
                </motion.div>

                <div className="text-left">
                  <div className="text-white font-semibold text-sm sm:text-base flex items-center gap-2">
                    {currentProof.text}
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div className="text-gray-400 text-xs sm:text-sm">{currentProof.subtext}</div>
                </div>
              </div>

              <div className="mt-3 flex justify-center gap-1.5">
                {proofItems.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-8 bg-gradient-to-r ' + currentProof.color
                        : 'w-1 bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
