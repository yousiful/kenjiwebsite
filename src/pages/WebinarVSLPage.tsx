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
                                                  < div className="w-full max-w-4xl">
                                                                      < div className="flex flex-col sm:flex-row items-center justify-between bg-[#111822]/80 border border-white/10 backdrop-blur-md px-6 py-4 rounded-t-2xl">
                                                                      </div>
                                                  </Helmet>
