import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  const [showReload, setShowReload] = useState(false);
  const [loadingText, setLoadingText] = useState('Preparing your AI automation platform...');

  useEffect(() => {
    const texts = [
      'Preparing your AI automation platform...',
      'Loading intelligent features...',
      'Optimizing your experience...',
      'Almost ready...'
    ];
    let index = 0;

    const textInterval = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 2000);

    const timeout = setTimeout(() => {
      setShowReload(true);
    }, 10000);

    return () => {
      clearInterval(textInterval);
      clearTimeout(timeout);
    };
  }, []);

  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-4"
        >
          <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-blue-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">Loading KenjiAI</h2>
          <AnimatePresence mode="wait">
            <motion.p
              key={loadingText}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className="text-gray-400 text-sm sm:text-base"
            >
              {loadingText}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 3, ease: "easeInOut", repeat: Infinity }}
          className="mt-6 h-1 bg-gradient-to-r from-blue-500 to-green-400 rounded-full mx-auto max-w-xs"
        />

        <AnimatePresence>
          {showReload && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8"
            >
              <p className="text-gray-500 text-sm mb-3">Taking longer than usual?</p>
              <button
                onClick={handleReload}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors touch-manipulation min-h-[44px]"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;