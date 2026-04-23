import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Search, User, Tag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { getAllArticles } from '../data/articles';

const BlogPage: React.FC = () => {
  const allArticles = getAllArticles();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const blogArticles = allArticles.filter(a => !a.isCourse);
  const categories = ['All', ...Array.from(new Set(blogArticles.map(a => a.category)))];

  const filteredArticles = blogArticles.filter(article => {
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Featured = first article
  const featured = filteredArticles[0];
  const rest = filteredArticles.slice(1);

  return (
    <>
      <Helmet>
        <title>Blog — AI Insights, Guides & Industry News | KenjiAI</title>
        <meta name="description" content="Read the latest AI automation guides, lead generation strategies, voice agent breakdowns, and industry analysis from the KenjiAI team." />
      </Helmet>

      <div className="pt-24 pb-20 min-h-screen" style={{ background: 'linear-gradient(180deg, #030712 0%, #0a0f1a 50%, #030712 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <section className="mb-14 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4">
                The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Blog</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                AI automation guides, industry analysis, and actionable strategies to scale your business with intelligence.
              </p>
            </motion.div>
          </section>

          {/* Search + Filters */}
          <section className="mb-12">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                      selectedCategory === cat 
                        ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' 
                        : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white border border-gray-700/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-600"
                />
              </div>
            </div>
          </section>

          {/* Featured Article */}
          {featured && (
            <section className="mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Link to={`/blog/${featured.slug}`} className="group block">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-gray-800/30 rounded-2xl overflow-hidden border border-gray-700/30 hover:border-cyan-500/30 transition-all">
                    <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                      <img 
                        src={featured.image} 
                        alt={featured.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-8 md:p-10 flex flex-col justify-center">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-semibold rounded-md border border-cyan-500/20">
                          {featured.category}
                        </span>
                        <span className="text-gray-500 text-xs flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {new Date(featured.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 group-hover:text-cyan-400 transition-colors leading-tight">
                        {featured.title}
                      </h2>
                      <p className="text-gray-400 mb-6 line-clamp-3 leading-relaxed">
                        {featured.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center gap-1"><User className="w-3 h-3" /> {featured.author}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {featured.readTime}</span>
                        </div>
                        <span className="text-cyan-400 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                          Read <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            </section>
          )}

          {/* Articles Grid */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {rest.map((article, idx) => (
                  <motion.article
                    key={article.slug}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className="group"
                  >
                    <Link to={`/blog/${article.slug}`} className="block h-full bg-gray-800/20 border border-gray-700/30 rounded-xl overflow-hidden hover:border-cyan-500/30 transition-all">
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md text-gray-300 px-2.5 py-1 rounded-md text-[10px] font-semibold">
                            <Tag className="w-2.5 h-2.5" /> {article.category}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-3 text-[11px] text-gray-500 mb-3">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors line-clamp-2 leading-snug">
                          {article.title}
                        </h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 leading-relaxed">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-700/30">
                          <span className="text-xs text-gray-500 flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                          <span className="text-cyan-400 text-xs font-semibold flex items-center gap-1">
                            Read <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          </section>

          {filteredArticles.length === 0 && (
            <div className="text-center py-20">
              <Search className="w-10 h-10 text-gray-700 mx-auto mb-4" />
              <p className="text-gray-500">No articles found. Try a different search or category.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
