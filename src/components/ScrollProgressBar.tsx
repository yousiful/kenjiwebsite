import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Star, Trophy } from 'lucide-react';

const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getMilestoneIcon = (milestone: number) => {
    if (milestone >= 90) return Trophy;
    if (milestone >= 50) return Star;
    return Zap;
  };

  const milestonePoints = [25, 50, 75, 90];

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Progress Bar */}
      <div className="h-1 bg-gray-800/30 backdrop-blur-sm">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-green-400"
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Milestone Indicators */}
      <div className="absolute top-0 left-0 right-0 h-1">
        {milestonePoints.map(milestone => {
          const Icon = getMilestoneIcon(milestone);
          const isReached = scrollProgress >= milestone;
          
          return (
            <motion.div
              key={milestone}
              className="absolute top-0 transform -translate-x-1/2"
              style={{ left: `${milestone}%` }}
              initial={{ scale: 0 }}
              animate={{ 
                scale: isReached ? 1 : 0.6,
                y: isReached ? -4 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              <div className={`w-3 h-3 rounded-full flex items-center justify-center ${
                isReached 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 shadow-md' 
                  : 'bg-gray-600'
              }`}>
                <Icon className={`w-1.5 h-1.5 ${isReached ? 'text-white' : 'text-gray-400'}`} />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Percentage - Only show when scrolling */}
      <motion.div
        className="absolute top-2 left-4 bg-gray-900/90 backdrop-blur-sm border border-blue-400/30 rounded-lg px-2 py-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollProgress > 5 && scrollProgress < 95 ? 1 : 0 }}
      >
        <span className="text-blue-400 font-semibold text-xs">
          {Math.round(scrollProgress)}%
        </span>
      </motion.div>
    </div>
  );
};

export default ScrollProgressBar;