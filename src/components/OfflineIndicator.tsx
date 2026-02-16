import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';
import { detectUserLanguage } from '../utils/languageDetection';

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);
  const language = detectUserLanguage();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const messages = {
    offline: {
      en: 'No internet connection',
      es: 'Sin conexión a internet',
      fr: 'Pas de connexion Internet',
      de: 'Keine Internetverbindung',
      pt: 'Sem conexão com a internet',
    },
    reconnected: {
      en: 'Back online',
      es: 'Conectado de nuevo',
      fr: 'De retour en ligne',
      de: 'Wieder online',
      pt: 'Online novamente',
    }
  };

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[200] bg-red-600 text-white px-4 py-3 text-center font-medium shadow-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <WifiOff className="w-5 h-5" />
            <span>{messages.offline[language as keyof typeof messages.offline] || messages.offline.en}</span>
          </div>
        </motion.div>
      )}

      {showReconnected && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-[200] bg-green-600 text-white px-4 py-3 text-center font-medium shadow-lg"
        >
          <div className="flex items-center justify-center gap-2">
            <Wifi className="w-5 h-5" />
            <span>{messages.reconnected[language as keyof typeof messages.reconnected] || messages.reconnected.en}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
