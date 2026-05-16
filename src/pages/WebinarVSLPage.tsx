import { useState, useEffect, useCallback, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

export default function WebinarVSLPage() {
    const [viewers, setViewers] = useState(214);
    const [showExitPopup, setShowExitPopup] = useState(false);
    const [countdown, setCountdown] = useState(300); // 5 minutes
  const exitShownRef = useRef(false);
    const pageLoadedRef = useRef(false);

  // -- Viewer count realism --------------------------------------
  useEffect(() => {
        setViewers(Math.floor(Math.random() * (240 - 180 + 1) + 180));

                let timer: any;
        const updateViewers = () => {
                setViewers(prev => {
                          let next = prev + (Math.floor(Math.random() * 5) - 2);
                          if (next > 290) next -= 5;
                          if (next < 160) next += 8;
                          return next;
                });
                timer = setTimeout(updateViewers, Math.floor(Math.random() * 5000) + 3000);
        };

                timer = setTimeout(updateViewers, 4000);
        return () => clearTimeout(timer);
  }, []);

  // -- Exit-intent trigger ---------------------------------------
  const triggerExitPopup = useCallback(() => {
        if (exitShownRef.current) return;
        if (sessionStorage.getItem('vsl_exit_shown')) return;
        if (!pageLoadedRef.current) return;

                                           exitShownRef.current = true;
        sessionStorage.setItem('vsl_exit_shown', 'true');
        setShowExitPopup(true);
  }, []);

  useEffect(() => {
        // Don't arm exit-intent for 5 seconds
                const armTimer = setTimeout(() => {
                        pageLoadedRef.current = true;
                }, 5000);

                const handleMouseLeave = (e: MouseEvent) => {
                        if (e.clientY <= 0) triggerExitPopup();
                };

                const handleVisibilityChange = () => {
                        if (document.visibilityState === 'hidden') triggerExitPopup();
                };

                window.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('visibilitychange', handleVisibilityChange);

                return () => {
                        clearTimeout(armTimer);
                        window.removeEventListener('mouseleave', handleMouseLeave);
                        document.removeEventListener('visibilitychange', handleVisibilityChange);
                };
  }, [triggerExitPopup]);
}, [triggerExitPopup]);

  // -- Countdown logic -------------------------------------------
  useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
                setCountdown(prev => Math.max(0, prev - 1));
        }, 1000);
        return () => clearInterval(timer);
  }, [countdown]);

  const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handlePartnerRedirect = () => {
        window.location.href = 'https://pay.kenji.com/checkout';
  };

  return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">
              <Helmet>
                      <title>Exclusive Webinar: The Future of AI Agents | Kenji</title>title>
                      <meta name="description" content="Watch this exclusive VSL to learn how Kenji's AI agents are revolutionizing business automation." />
              </Helmet>Helmet>
        
          {/* Top Banner - Urgency */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-2 px-4 text-center text-sm font-medium animate-pulse">
                      <p>LIMITED TIME: Special Performance Partnership Opportunity Ends in {formatTime(countdown)}</p>p>
              </div>div>
        
          {/* Main Content */}
              <main className="max-w-6xl mx-auto px-4 py-8 md:py-16">
              
                {/* Headline Section */}
                      <div className="text-center mb-12 md:mb-20">
                                <motion.div
                                              initial={{ opacity: 0, y: 20 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              transition={{ duration: 0.6 }}
                                            >
                                            <span className="inline-block px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-semibold mb-4 border border-blue-500/20">
                                                          Free Training Workshop
                                            </span>span>
                                            <h1 className="text-4xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-tight">
                                                          The AI Agent Revolution: <br />
                                                          <span className="text-blue-500">Scale Your Business to $100k/mo</span>span>
                                            </h1>h1>
                                            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
                                                          Discover how our "Performance Partnership" model allows you to deploy elite AI agents with zero upfront cost and 100% ROI guarantee.
                                            </p>p>
                                </motion.div>motion.div>
                      </div>div>
              
                {/* Video Placeholder (VSL) */}
                      <div className="relative aspect-video mb-12 rounded-2xl overflow-hidden border border-white/10 bg-zinc-900 group shadow-2xl">
                                <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform cursor-pointer">
                                                                          <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2" />
                                                          </div>div>
                                                          <p className="text-xl font-medium">Click to Play Training</p>p>
                                            </div>div>
                                </div>div>
                                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                            <div className="h-full bg-blue-600 w-1/3" />
                                </div>div>
                      </div>div>
              
                {/* Real-time Status */}
                      <div className="flex flex-wrap justify-center gap-8 mb-16 text-center">
                                <div>
                                            <p className="text-blue-400 font-bold text-2xl">{viewers}</p>p>
                                            <p className="text-gray-500 text-sm">Watching Now</p>p>
                                </div>div>
                                <div>
                                            <p className="text-white font-bold text-2xl">Phase 1</p>p>
                                            <p className="text-gray-500 text-sm">Onboarding Live</p>p>
                                </div>div>
                                <div>
                                            <p className="text-red-500 font-bold text-2xl">Limited</p>p>
                                            <p className="text-gray-500 text-sm">Partner Slots Left</p>p>
                                </div>div>
                      </div>div>
              
                {/* Call to Action */}
                      <div className="text-center">
                                <motion.button
                                              whileHover={{ scale: 1.05 }}
                                              whileTap={{ scale: 0.95 }}
                                              onClick={handlePartnerRedirect}
                                              className="px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xl shadow-lg shadow-blue-500/20 transition-all mb-4"
                                            >
                                            Apply for Performance Partnership
                                </motion.button>motion.button>
                                <p className="text-gray-500 text-sm">No credit card required to apply. Only 3 slots available this week.</p>p>
                      </div>div>
              </main>main>
        
          {/* Exit Popup Overlay */}
              <AnimatePresence>
                {showExitPopup && (
                    <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                  className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                                >
                    
                                <motion.div
                                                initial={{ scale: 0.9, y: 20 }}
                                                animate={{ scale: 1, y: 0 }}
                                                className="bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md w-full text-center relative overflow-hidden"
                                              >
                                              <div className="absolute top-0 left-0 w-full h-1 bg-blue-600" />
                                              <h2 className="text-3xl font-bold mb-4">WAIT! Don't Miss Out...</h2>h2>
                                              <p className="text-gray-400 mb-8 text-lg">
                                                              You're about to leave without seeing how we guarantee $10k profit in 30 days or we pay you $1,000.
                                              </p>p>
                                              <div className="space-y-4">
                                                              <button
                                                                                  onClick={() => setShowExitPopup(false)}
                                                                                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
                                                                                >
                                                                                Stay & Watch (Ends in {formatTime(countdown)})
                                                              </button>button>
                                                              <button
                                                                                  onClick={() => setShowExitPopup(false)}
                                                                                  className="w-full py-2 text-gray-500 hover:text-white transition-colors"
                                                                                >
                                                                                I'm not interested in scaling with AI
                                                              </button>button>
                                              </div>div>
                                </motion.div>motion.div>
                    </motion.div>motion.div>
                  )}
              </AnimatePresence>AnimatePresence>
        
          {/* Footer */}
              <footer className="border-t border-white/5 py-12 mt-20">
                      <div className="max-w-6xl mx-auto px-4 text-center">
                                <p className="text-gray-500 text-sm mb-4"></div>
