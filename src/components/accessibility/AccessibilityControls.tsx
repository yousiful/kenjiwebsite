import React, { useState, useEffect } from 'react';
import { Settings, ZoomIn, ZoomOut, Contrast, Type, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccessibilityPreferences {
  fontSize: number;
  highContrast: boolean;
  reduceMotion: boolean;
  dyslexicFont: boolean;
}

const AccessibilityControls: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [preferences, setPreferences] = useState<AccessibilityPreferences>({
    fontSize: 16,
    highContrast: false,
    reduceMotion: false,
    dyslexicFont: false
  });

  useEffect(() => {
    const savedPrefs = localStorage.getItem('accessibility-preferences');
    if (savedPrefs) {
      const parsed = JSON.parse(savedPrefs);
      setPreferences(parsed);
      applyPreferences(parsed);
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches && !savedPrefs) {
      updatePreference('reduceMotion', true);
    }
  }, []);

  const applyPreferences = (prefs: AccessibilityPreferences) => {
    document.documentElement.style.fontSize = `${prefs.fontSize}px`;
    document.documentElement.classList.toggle('high-contrast', prefs.highContrast);
    document.documentElement.classList.toggle('reduce-motion', prefs.reduceMotion);
    document.documentElement.classList.toggle('dyslexic-font', prefs.dyslexicFont);
  };

  const updatePreference = <K extends keyof AccessibilityPreferences>(
    key: K,
    value: AccessibilityPreferences[K]
  ) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    applyPreferences(newPrefs);
    localStorage.setItem('accessibility-preferences', JSON.stringify(newPrefs));
  };

  const increaseFontSize = () => {
    if (preferences.fontSize < 24) {
      updatePreference('fontSize', preferences.fontSize + 2);
    }
  };

  const decreaseFontSize = () => {
    if (preferences.fontSize > 12) {
      updatePreference('fontSize', preferences.fontSize - 2);
    }
  };

  const resetPreferences = () => {
    const defaultPrefs: AccessibilityPreferences = {
      fontSize: 16,
      highContrast: false,
      reduceMotion: false,
      dyslexicFont: false
    };
    setPreferences(defaultPrefs);
    applyPreferences(defaultPrefs);
    localStorage.removeItem('accessibility-preferences');
  };

  return (
    <>
      <style jsx global>{`
        .high-contrast {
          filter: contrast(1.5);
        }

        .high-contrast * {
          background-color: #000 !important;
          color: #fff !important;
          border-color: #fff !important;
        }

        .high-contrast a {
          color: #ffff00 !important;
        }

        .high-contrast button {
          background-color: #333 !important;
          border: 2px solid #fff !important;
        }

        .reduce-motion *,
        .reduce-motion *::before,
        .reduce-motion *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }

        .dyslexic-font * {
          font-family: 'OpenDyslexic', 'Comic Sans MS', sans-serif !important;
        }
      `}</style>

      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          aria-label="Accessibility settings"
          aria-expanded={isOpen}
          aria-controls="accessibility-panel"
        >
          <Settings className="w-6 h-6" aria-hidden="true" />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="accessibility-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full right-0 mb-2 w-80 bg-gray-800 border-2 border-gray-700 rounded-xl shadow-2xl p-6"
              role="dialog"
              aria-label="Accessibility settings panel"
            >
              <h2 className="text-xl font-bold text-white mb-4">
                Accessibility Settings
              </h2>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 block">
                    Font Size: {preferences.fontSize}px
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={decreaseFontSize}
                      disabled={preferences.fontSize <= 12}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Decrease font size"
                    >
                      <ZoomOut className="w-5 h-5 mx-auto" aria-hidden="true" />
                    </button>
                    <button
                      onClick={increaseFontSize}
                      disabled={preferences.fontSize >= 24}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Increase font size"
                    >
                      <ZoomIn className="w-5 h-5 mx-auto" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.highContrast}
                    onChange={(e) => updatePreference('highContrast', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    aria-describedby="high-contrast-desc"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Contrast className="w-5 h-5" aria-hidden="true" />
                      <span>High Contrast</span>
                    </div>
                    <p id="high-contrast-desc" className="text-sm text-gray-400">
                      Enhance color contrast for better visibility
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.reduceMotion}
                    onChange={(e) => updatePreference('reduceMotion', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    aria-describedby="reduce-motion-desc"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-white font-medium">
                      {preferences.reduceMotion ? (
                        <Pause className="w-5 h-5" aria-hidden="true" />
                      ) : (
                        <Play className="w-5 h-5" aria-hidden="true" />
                      )}
                      <span>Reduce Motion</span>
                    </div>
                    <p id="reduce-motion-desc" className="text-sm text-gray-400">
                      Minimize animations and transitions
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.dyslexicFont}
                    onChange={(e) => updatePreference('dyslexicFont', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                    aria-describedby="dyslexic-font-desc"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Type className="w-5 h-5" aria-hidden="true" />
                      <span>Dyslexia-Friendly Font</span>
                    </div>
                    <p id="dyslexic-font-desc" className="text-sm text-gray-400">
                      Use OpenDyslexic font for easier reading
                    </p>
                  </div>
                </label>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-700">
                <button
                  onClick={resetPreferences}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Reset to Defaults
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AccessibilityControls;
