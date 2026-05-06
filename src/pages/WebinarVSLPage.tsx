import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

export default function WebinarVSLPage() {
              const [viewers, setViewers] = useState(247);

  useEffect(() => {
                  const interval = setInterval(() => {
                                    setViewers(prev => {
                                                        const change = Math.floor(Math.random() * 5) - 2;
                                                        const next = prev + change;
                                                        return next < 220 ? 220 : next > 280 ? 280 : next;
                                    });
                  }, 5000);
                  return () => clearInterval(interval);
  }, []);

  return (
                  < >
                        < Helmet>
                                < title>Exclusive Overview | KenjiAI< /title>
                                        < meta name="robots" content="noindex, nofollow" />
                                      < /Helmet>

                                                        < div className="min-h-screen bg-[#0B0E14] text-white flex justify-center py-12 px-4 font-sans">
                                                                < div className="w-full max-w-
                                                                                      < div className="flex flex-col sm:flex-row items-center justify-between bg-[#111822]/80 border border-white/10 backdrop-blur-md px-6 py-4 rounded-t-2xl">
                                                                                < div className="text-center sm:text-left mb-4 sm:mb-0">
                                                                                              < span className="text-blue-500 text-xs font-extrabold uppercase tracking-widest block mb-1">Exclusive Briefing< /span>
                                                                                                            < h1 className="text-lg sm:text-xl font-bold tracking-tight">How To Automate Leads & Scale Without More Work< /h1>
                                                                                                                        < /div>
                                                                                                                                    < div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 px-4 py-2 rounded-full h-fit">
                                                                                                                                                  < div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                                                                                                                                                  < div className="font-semibold text-sm tracking-wide">Live: < span className="font-mono">{viewers}< /span>< /div>
                                                                                                                                                              < /div>
                                                                                                                                                                        < /div>
                                                                                                                                                                        </div>4xl">
                                                                </div>
