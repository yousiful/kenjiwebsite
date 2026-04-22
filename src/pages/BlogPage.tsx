import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search, TrendingUp, Zap } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { getAllArticles } from '../data/articles';

const BlogPage: React.FC = () => {
  const allArticles = getAllArticles();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Array.from(new Set(allArticles.filter(a => !a.isCourse).map(a => a.category)))];

  const viralNews = allArticles.filter(a => !a.isCourse && a.category === 'Viral News').slice(0, 3);
  const regularArticles = allArticles.filter(a => !a.isCourse && !viralNews.find(v => v.slug === a.slug));

  const filteredArticles = regularArticles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>AI Viral News & Expert Insights | KenjiAI Blog</title>
        <meta name="description" content="Stay ahead of the curve with the latest AI viral news, automation guides, and lead generation strategies from the KenjiAI team." />
      </Helmet>

      <style>{`
        .cyber-scanline {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 150px;
          background: linear-gradient(180deg, transparent, rgba(6, 182, 212, 0.1), rgba(6, 182, 212, 0.2), rgba(6, 182, 212, 0.1), transparent);
          animation: scanline 4s linear infinite;
          pointer-events: none;
          z-index: 50;
        }
        @keyframes scanline {
          0% { transform: translateY(-150px); }
          100% { transform: translateY(100vh); }
        }
      `}</style>

      <div className="pt-24 pb-20 bg-gray-950 min-h-screen relative overflow-hidden">
        {/* Cyber News Scanline */}
        <div className="cyber-scanline z-50 opacity-[0.03]" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="mb-12 bg-gray-900 border-y-2 border-red-500/20 py-4 overflow-hidden whitespace-nowrap flex items-center gap-8 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
            <span className="flex items-center gap-3 text-red-500 font-black text-sm uppercase px-6 border-r-2 border-gray-800 shrink-0 italic tracking-tighter">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              BREAKING NEWS
            </span>
            <div className="flex animate-marquee items-center gap-16 text-white text-sm font-bold tracking-tight">
              {viralNews.map(v => (
                <span key={v.slug} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-cyan-500 rounded-full"></span>
                  {v.title}
                </span>
              ))}
              {viralNews.map(v => (
                <span key={v.slug + '-dup'} className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-cyan-500 rounded-full"></span>
                  {v.title}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-8 mb-12 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-500 border-b border-white/10 pb-6">
            <span className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]"></span> 
              AI ADOPTION INDEX: 84.2 (EXTREME GREED)
            </span>
            <span className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"></span> 
              GPU LIQUIDITY: CRITICAL HIGH
            </span>
            <span className="flex items-center gap-3 text-cyan-400">
              <TrendingUp className="w-4 h-4 animate-bounce" /> AGENTIC SWARMS: TRENDING #1
            </span>
          </div>

          {/* Hero / Viral Section */}
          <section className="mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-cyan-400 font-bold mb-6"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="uppercase tracking-widest text-sm text-cyan-400/80">Viral AI Insights</span>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {viralNews[0] && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative group cursor-pointer overflow-hidden rounded-[2.5rem] border border-cyan-500/20"
                >
                  <Link to={`/blog/${viralNews[0].slug}`}>
                    <div className="aspect-[16/9] relative">
                      <img 
                        src={viralNews[0].image} 
                        alt={viralNews[0].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="bg-cyan-500 text-gray-950 px-3 py-1 rounded-full text-xs font-black uppercase">Trending</span>
                        <span className="text-gray-300 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {viralNews[0].readTime}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-4xl font-black text-white mb-4 group-hover:text-cyan-400 transition-colors">
                        {viralNews[0].title}
                      </h2>
                      <p className="text-gray-300 line-clamp-2 text-lg">
                        {viralNews[0].excerpt}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              )}

              <div className="flex flex-col gap-6">
                {viralNews.slice(1, 3).map((news, idx) => (
                  <motion.div
                    key={news.slug}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    className="bg-gray-900/50 border border-white/10 rounded-3xl overflow-hidden group hover:border-cyan-500/50 transition-all flex h-full"
                  >
                    <Link to={`/blog/${news.slug}`} className="flex p-4 w-full gap-6">
                      <div className="w-1/3 aspect-square rounded-2xl overflow-hidden shrink-0">
                        <img src={news.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={news.title} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-0.5 rounded-lg bg-cyan-600/20 text-[10px] font-bold text-cyan-400 uppercase">{news.category}</span>
                        </div>
                        <h3 className="text-white font-bold leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2 text-lg">
                          {news.title}
                        </h3>
                        <p className="text-gray-400 text-xs mt-3 line-clamp-2">{news.excerpt}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Search and Category Filter */}
          <section className="mb-16">
            <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-6 py-3 rounded-xl border text-sm font-bold transition-all ${
                      selectedCategory === cat 
                        ? 'bg-cyan-600 border-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                        : 'bg-gray-900 border-white/5 text-gray-400 hover:border-white/20'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search viral reports..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-white/5 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-all font-medium shadow-2xl"
                />
              </div>
            </div>
          </section>

          {/* Trending Topics Cloud */}
          <section className="mb-20 p-8 rounded-[2rem] bg-gray-900/50 border border-white/5 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <Zap className="w-32 h-32 text-cyan-400" />
            </div>
            <h4 className="text-white font-bold mb-6 flex items-center gap-2 uppercase tracking-widest text-xs">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Hot Topics This Week
            </h4>
            <div className="flex flex-wrap gap-4">
              {['Project Strawberry', 'AGI Timeline', 'Nvidia Blackwell', 'Autonomous Sales', 'Agent Swarms', 'OpenSource AI', 'Neural Logic'].map((topic) => (
                <span key={topic} className="px-4 py-2 rounded-lg bg-gray-800 border border-white/5 text-gray-400 text-sm font-medium hover:border-cyan-500/30 hover:text-cyan-400 transition-all cursor-pointer">
                  #{topic.replace(' ', '')}
                </span>
              ))}
            </div>
          </section>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article, idx) => (
                <motion.div
                  key={article.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all flex flex-col group"
                >
                  <Link to={`/blog/${article.slug}`} className="flex flex-col h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-gray-950/80 backdrop-blur-md text-cyan-400 border border-cyan-500/30 px-3 py-1 rounded-lg text-[10px] font-bold uppercase">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-[10px] text-gray-500 mb-3 font-semibold uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(article.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-6">
                        {article.excerpt}
                      </p>
                      <div className="mt-auto flex items-center text-cyan-400 text-sm font-bold group-hover:gap-2 transition-all">
                        Read Story
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <Zap className="w-12 h-12 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No viral stories found for your search.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
