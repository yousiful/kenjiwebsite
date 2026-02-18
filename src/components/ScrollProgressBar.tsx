import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Progress Bar */}
      <div className="h-0.5 bg-gray-900/50">
        <motion.div
          className="h-full"
          initial={{ width: 0 }}
          animate={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
          style={{
            background: 'linear-gradient(90deg, #00FFFF, #39FF14)',
            boxShadow: '0 0 8px rgba(0,255,255,0.7), 0 0 3px rgba(57,255,20,0.5)'
          }}
        />
      </div>

    </div>
  );
};

export default ScrollProgressBar;