import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing AI...');

  useEffect(() => {
    const steps = [
      { progress: 20, text: 'Loading components...' },
      { progress: 40, text: 'Preparing automation...' },
      { progress: 60, text: 'Optimizing experience...' },
      { progress: 80, text: 'Almost ready...' },
      { progress: 100, text: 'Welcome!' }
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      if (currentStep < steps.length) {
        setProgress(steps[currentStep].progress);
        setLoadingText(steps[currentStep].text);
        currentStep++;
      } else {
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 flex items-center justify-center z-50">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 text-center px-4"
      >
        <motion.div
          className="relative inline-flex items-center justify-center mb-8"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50" />
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-full">
            <Zap className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          KenjiAI
        </motion.h2>

        <motion.p
          key={loadingText}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="text-gray-300 mb-8 text-lg"
        >
          {loadingText}
        </motion.p>

        <div className="w-80 max-w-full mx-auto">
          <div className="relative h-2 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-green-400 rounded-full"
              initial={{ x: '-100%' }}
              animate={{ x: `${progress - 100}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{ x: ['0%', '200%'] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-sm text-gray-400"
          >
            {progress}%
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;