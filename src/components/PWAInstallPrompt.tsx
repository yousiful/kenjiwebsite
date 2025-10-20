import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInStandaloneMode = (window.navigator as any).standalone === true;

    if (isStandalone || isInStandaloneMode) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      const dismissed = localStorage.getItem('pwa-install-dismissed');
      const dismissedTime = dismissed ? parseInt(dismissed) : 0;
      const daysSinceDismiss = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);

      if (!dismissed || daysSinceDismiss > 7) {
        setTimeout(() => {
          setShowPrompt(true);
        }, 10000);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      localStorage.removeItem('pwa-install-dismissed');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('PWA installed');
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl border border-blue-400/30 p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/20 rounded-full blur-3xl"></div>

            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
              aria-label="Dismiss install prompt"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">Install KenjiAI</h3>
                  <p className="text-blue-100 text-sm">Get the full app experience</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-blue-100 text-sm">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Works offline with cached content</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100 text-sm">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Faster loading times</span>
                </div>
                <div className="flex items-center gap-2 text-blue-100 text-sm">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  <span>Quick access from home screen</span>
                </div>
              </div>

              <button
                onClick={handleInstall}
                className="w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-xl hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Download className="w-5 h-5" />
                Install App
              </button>

              <button
                onClick={handleDismiss}
                className="w-full mt-2 text-white/80 hover:text-white text-sm py-2 transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
