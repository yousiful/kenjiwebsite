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

  const categories = ['All', ...Array.from(new Set(allArticles.map(a => a.category)))];

  const filteredArticles = allArticles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const viralNews = allArticles.filter(a => a.category === 'Viral News').slice(0, 3);
  const regularArticles = filteredArticles.filter(a => !viralNews.find(v => v.slug === a.slug));

  return (
    <>
      <Helmet>
        <title>AI Viral News & Expert Insights | KenjiAI Blog</title>
        <meta name="description" content="Stay ahead of the curve with the latest AI viral news, automation guides, and lead generation strategies from the KenjiAI team." />
      </Helmet>

      <div className="pt-24 pb-20 bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero / Viral Section */}
          <section className="mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-cyan-400 font-bold mb-6"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="uppercase tracking-widest text-sm">Viral AI News</span>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {viralNews[0] && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="relative group cursor-pointer overflow-hidden rounded-3xl border border-cyan-500/20"
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
                {viralNews.slice(1, 3).map((article, idx) => (
                  <motion.div
                    key={article.slug}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden group hover:border-cyan-500/50 transition-all"
                  >
                    <Link to={`/blog/${article.slug}`} className="flex gap-4 p-4">
                      <div className="w-1/3 aspect-square rounded-xl overflow-hidden">
                        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="w-2/3 flex flex-col justify-center">
                        <span className="text-cyan-400 text-[10px] font-bold uppercase mb-1">{article.category}</span>
                        <h3 className="text-white font-bold leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 text-xs mt-2 line-clamp-2">{article.excerpt}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Controls */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
            <div className="flex flex-wrap justify-center gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-cyan-500 text-gray-900' 
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text"
                placeholder="Search viral news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-900 border border-gray-800 rounded-full py-2 pl-12 pr-4 text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          </div>

          {/* Grid Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {regularArticles.map((article, idx) => (
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
