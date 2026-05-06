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
                        <title>Exclusive Overview | KenjiAI</title>title>
                        <meta name="robots" content="noindex, nofollow" />
                </Helmet>Helmet>
          
              {/* Standalone Background forcing dark mode specifically for this page */}
                <div className="min-h-screen bg-[#0B0E14] text-white flex justify-center py-12 px-4 font-sans">
                
                        <div className="w-full max-w-4xl">
                                  
                            {/* Header Bar */}
                                  <div className="flex flex-col sm:flex-row items-center justify-between bg-[#111822]/80 border border-white/10 backdrop-blur-md px-6 py-4 rounded-t-2xl">
                                  
                                              <div className="text-center sm:text-left mb-4 sm:mb-0">
                                                            <span className="text-blue-500 text-xs font-extrabold uppercase tracking-widest block mb-1">
                                                                            Exclusive Briefing
                                                            </span>span>
                                                            <h1 className="text-lg sm:text-xl font-bold tracking-tight">
                                                                            How To Automate Leads & Scale Without More Work
                                                            </h1>h1>
                                              </div>div>
                                  
                                              <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full h-fit">
                                                            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                                                            <div className="font-semibold text-sm tracking-wide">
                                                                            Live: <span className="font-mono">{viewers}</span>span>
                                                            </div>div>
                                              </div>div>
                                  </div>div>
                        
                            {/* Video Container */}
                                  <div className="relative w-full aspect-video bg-black rounded-b-2xl overflow-hidden shadow-[0_20px_40px_-10px_rgba(59,130,246,0.5)] border border-white/10 border-t-0 z-10">
                                      {/* Overlay to block youtube title clicks */}
                                              <div className="absolute top-0 left-0 w-full h-[70px] z-20 bg-transparent pointer-events-auto" />
                                              
                                              <iframe 
                                                                  src="https://www.youtube.com/embed/J-AURUyzSks?si=tQ2wmu_OYYE0IMnP&controls=0&autoplay=1&rel=0&modestbranding=1&disablekb=1" 
                                                  title="YouTube overview" 
                                                  className="absolute top-0 left-0 w-full h-full border-0 pointer-events-auto"
                                                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                                  referrerPolicy="strict-origin-when-cross-origin" 
                                                  allowFullScreen
                                                              />
                                  </div>div>
                        </>
