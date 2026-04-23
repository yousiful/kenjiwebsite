import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search, TrendingUp, Zap, Radio, BarChart3 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { getAllArticles } from '../data/articles';

const BlogPage: React.FC = () => {
  const allArticles = getAllArticles();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const blogArticles = allArticles.filter(a => !a.isCourse);
  const categories = ['All', ...Array.from(new Set(blogArticles.map(a => a.category)))];

  const viralNews = blogArticles.filter(a => a.category === 'Viral News').slice(0, 3);
  const regularArticles = blogArticles.filter(a => !viralNews.find(v => v.slug === a.slug));

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

      {/* Cyber-Terminal Background */}
      <div className="pt-24 pb-20 bg-black min-h-screen relative overflow-hidden">
        {/* Animated Grid Background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        {/* Scanline */}
        <div className="absolute top-0 left-0 w-full h-[100px] pointer-events-none z-20 opacity-30"
          style={{
            background: 'linear-gradient(180deg, transparent, rgba(6,182,212,0.15), transparent)',
            animation: 'scanline 4s linear infinite'
          }}
        />
        {/* Top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Terminal Header */}
          <section className="mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6"
            >
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                  <Radio className="w-3 h-3 animate-pulse" /> LIVE INTELLIGENCE FEED
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                  KenjiAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Intel</span>
                </h1>
                <p className="text-gray-500 mt-3 text-sm font-mono max-w-xl">
                  // Real-time AI industry intelligence. Curated analysis from the frontier of autonomous systems.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-600">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                  SYSTEM ONLINE
                </span>
              </div>
            </motion.div>
          </section>

          {/* Breaking News Ticker */}
          <div className="mb-8 bg-gray-950 border-2 border-red-500/30 py-3 overflow-hidden whitespace-nowrap flex items-center gap-8 rounded-xl shadow-[0_0_40px_rgba(239,68,68,0.08)]">
            <span className="flex items-center gap-3 text-red-500 font-black text-xs uppercase px-6 border-r-2 border-red-500/20 shrink-0 tracking-tighter">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
              BREAKING
            </span>
            <div className="flex animate-marquee items-center gap-16 text-gray-300 text-sm font-semibold tracking-tight">
              {viralNews.map(v => (
                <span key={v.slug} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                  {v.title}
                </span>
              ))}
              {viralNews.map(v => (
                <span key={v.slug + '-dup'} className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                  {v.title}
                </span>
              ))}
            </div>
          </div>

          {/* Market Sentiment Bar */}
          <div className="flex flex-wrap items-center gap-8 mb-12 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-gray-600 border-b border-cyan-500/10 pb-5">
            <span className="flex items-center gap-3">
              <BarChart3 className="w-3.5 h-3.5 text-green-500" />
              AI ADOPTION: 84.2 <span className="text-green-500">(EXTREME GREED)</span>
            </span>
            <span className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]"></span> 
              GPU LIQUIDITY: CRITICAL
            </span>
            <span className="flex items-center gap-3 text-cyan-500">
              <TrendingUp className="w-3.5 h-3.5" /> AGENTIC SWARMS: #1
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
              <span className="uppercase tracking-widest text-sm">Top Intelligence</span>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {viralNews[0] && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative group cursor-pointer overflow-hidden rounded-2xl border-2 border-cyan-500/20 bg-gray-950 hover:border-cyan-500/50 transition-all"
                >
                  <Link to={`/blog/${viralNews[0].slug}`}>
                    <div className="aspect-[16/9] relative">
                      <img 
                        src={viralNews[0].image} 
                        alt={viralNews[0].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="bg-cyan-500 text-black px-3 py-1 rounded-md text-[10px] font-black uppercase">TRENDING</span>
                        <span className="text-gray-400 text-xs flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" /> {viralNews[0].readTime}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-4xl font-black text-white mb-3 group-hover:text-cyan-400 transition-colors leading-tight tracking-tight">
                        {viralNews[0].title}
                      </h2>
                      <p className="text-gray-400 line-clamp-2 text-sm">{viralNews[0].excerpt}</p>
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
                    className="bg-gray-950 border-2 border-gray-800 rounded-2xl overflow-hidden group hover:border-cyan-500/40 transition-all flex h-full"
                  >
                    <Link to={`/blog/${news.slug}`} className="flex p-4 w-full gap-6">
                      <div className="w-1/3 aspect-square rounded-xl overflow-hidden shrink-0">
                        <img src={news.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80" alt={news.title} />
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-0.5 rounded bg-cyan-600/20 text-[10px] font-bold text-cyan-400 uppercase font-mono">{news.category}</span>
                        </div>
                        <h3 className="text-white font-bold leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2 text-lg tracking-tight">
                          {news.title}
                        </h3>
                        <p className="text-gray-500 text-xs mt-3 line-clamp-2 font-mono">{news.excerpt}</p>
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
                    className={`px-5 py-2.5 rounded-lg border text-xs font-black uppercase tracking-wider transition-all ${
                      selectedCategory === cat 
                        ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]' 
                        : 'bg-gray-950 border-gray-800 text-gray-500 hover:border-cyan-500/30 hover:text-cyan-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full lg:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                <input
                  type="text"
                  placeholder="// Search intel..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-950 border-2 border-gray-800 rounded-xl text-white focus:outline-none focus:border-cyan-500/50 transition-all font-mono text-sm"
                />
              </div>
            </div>
          </section>

          {/* Hot Topics */}
          <section className="mb-16 p-6 rounded-2xl bg-gray-950 border-2 border-gray-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none">
              <Zap className="w-40 h-40 text-cyan-400" />
            </div>
            <h4 className="text-cyan-400 font-black mb-4 flex items-center gap-2 uppercase tracking-[0.2em] text-[10px]">
              <TrendingUp className="w-3.5 h-3.5" /> TRENDING SIGNALS
            </h4>
            <div className="flex flex-wrap gap-3">
              {['Project Strawberry', 'AGI Timeline', 'Nvidia Blackwell', 'Autonomous Sales', 'Agent Swarms', 'OpenSource AI', 'Neural Logic'].map((topic) => (
                <span key={topic} className="px-3 py-1.5 rounded-md bg-black border border-gray-800 text-gray-500 text-xs font-mono hover:border-cyan-500/40 hover:text-cyan-400 transition-all cursor-pointer">
                  #{topic.replace(' ', '')}
                </span>
              ))}
            </div>
          </section>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredArticles.map((article, idx) => (
                <motion.div
                  key={article.slug}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="bg-gray-950 border-2 border-gray-800 rounded-2xl overflow-hidden hover:border-cyan-500/40 transition-all flex flex-col group"
                >
                  <Link to={`/blog/${article.slug}`} className="flex flex-col h-full">
                    <div className="relative aspect-video overflow-hidden">
                      <img 
                        src={article.image} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-90"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/80 backdrop-blur-md text-cyan-400 border border-cyan-500/30 px-2.5 py-1 rounded text-[10px] font-black uppercase font-mono">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      <div className="flex items-center gap-4 text-[10px] text-gray-600 mb-3 font-mono uppercase tracking-wider">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(article.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2 tracking-tight">
                        {article.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-5 font-mono leading-relaxed">
                        {article.excerpt}
                      </p>
                      <div className="mt-auto flex items-center text-cyan-400 text-xs font-black uppercase tracking-widest group-hover:gap-2 transition-all">
                        Read Intel
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <Zap className="w-12 h-12 text-gray-800 mx-auto mb-4" />
              <p className="text-gray-600 text-lg font-mono">// No intel found for this query.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100px); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </>
  );
};

export default BlogPage;
