import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function WebinarVSLPage() {
        const [viewers, setViewers] = useState(214);

  useEffect(() => {
            // Start realism
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

  return (
            <>
                  <Helmet>
                          <title>Exclusive Overview | KenjiAI</title>
                          <meta name="robots" content="noindex, nofollow" />
                  </Helmet>
                  {/* Standalone Background forcing dark mode specifically for this page */}
                        <div className="min-h-screen bg-[#0B0E14] text-white flex justify-center py-12 px-4 font-sans">
                                
                                <div className="w-full max-w-4xl">

                                      {/* Header Bar */}
                                                <div className="flex flex-col sm:flex-row items-center justify-between bg-[#111822]/80 border border-white/10 backdrop-blur-md px-6 py-4 rounded-t-2xl">
                                                            <div className="text-center sm:text-left mb-4 sm:mb-0">
                                                                          <span className="text-blue-500 text-xs font-extrabold uppercase tracking-widest block mb-1">
                                                                                          Exclusive Briefing
                                                                          </span>
                                <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                                                How To Automate Leads & Scale Without More Work
                                </h1>
                                                            </div>
                                                            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                                                                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                                          <span className="text-xs font-medium text-white/90">
                                                                                {viewers} Live
                                                                          </span>
                                                            </div>
                                                </div>

                                      {/* Main Video Section */}
                                                <div className="relative aspect-video bg-black/40 border-x border-white/10 overflow-hidden group">
                                                      {/* Fake Video Player Placeholder */}
                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                          <div className="text-center">
                                                                                          <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
                                                                                                            <div className="w-0 h-0 border-y-[12px] border-y-transparent border-l-[20px] border-l-white ml-1" />
                                                                                                </div>
                                                                                          <p className="text-white/60 text-sm font-medium">Click to Resume Presentation</p>
                                                                          </div>
                                                            </div>
                                                      {/* Progress Bar (Fake) */}
                                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                                                          <div className="h-full bg-blue-500 w-1/3" />
                                                            </div>
                                                </div>
                                </div>
                              {/* Action Bar / Form */}
                                        <div className="bg-[#111822]/90 border border-white/10 border-t-0 backdrop-blur-md p-8 rounded-b-2xl shadow-2xl relative">
                                                    <div className="max-w-xl mx-auto text-center">
                                                                  <h2 className="text-2xl font-bold mb-3 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                                                                  Ready to transform your business?
                                                                  </h2>
                                                                  <p className="text-white/60 mb-8 text-sm leading-relaxed">
                                                                                  Enter your details below to schedule your AI Strategy Session and receive our custom automation roadmap.
                                                                  </p>
                                                                  
                                                                  <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                                                                                  <input 
                                                                                                          type="email" 
                                                                                    placeholder="Business Email Address"
                                                                                                          className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder:text-white/20"
                                                                                                        />
                                                                                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                                                                                                    Schedule Strategy Session
                                                                                  </button>
                                                                  </form>
                                                    
                                                                  <div className="mt-6 flex items-center justify-center gap-6 opacity-40 grayscale">
                                                                                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Trusted By</span>
                                                                                  <div className="h-4 w-1px bg-white/20" />
                                                                                  <span className="text-xs font-serif italic">KenjiAI Enterprise</span>
                                                                  </div>
                                                    </div>
                                        </div>
                        
                                  <footer className="mt-12 text-center text-white/20 text-xs">
                                              <p>&copy; {new Date().getFullYear()} KenjiAI. All rights reserved.</p>
                                  </footer>
                        </div>
            </>div>
        </>
                );
              }
              
