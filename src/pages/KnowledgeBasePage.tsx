import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Brain, TrendingUp, Target, Calculator, GraduationCap, Star, Clock, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { getAllArticles } from '../data/articles';

const KnowledgeBasePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const allArticles = getAllArticles();
  
  // Courses are articles with isCourse: true
  const courses = allArticles.filter(a => a.isCourse);
  const nonCourseArticles = allArticles.filter(a => !a.isCourse);

  const categories = [
    { name: "All", count: courses.length, icon: BookOpen, color: "text-blue-400" },
    { name: "AI Mastery", count: courses.filter(c => c.category === 'AI Mastery').length, icon: Brain, color: "text-purple-400" },
    { name: "AI Sales", count: courses.filter(c => c.category === 'AI Sales').length, icon: Target, color: "text-green-400" },
    { name: "Tax Strategy", count: courses.filter(c => c.category === 'Tax Strategy').length, icon: Calculator, color: "text-yellow-400" },
    { name: "Investment AI", count: courses.filter(c => c.category === 'Investment AI').length, icon: TrendingUp, color: "text-cyan-400" }
  ];

  const filteredCourses = selectedCategory === 'All' 
    ? courses 
    : courses.filter(c => c.category === selectedCategory);

  const finalCourses = searchQuery 
    ? filteredCourses.filter(c => 
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredCourses;

  return (
    <>
      <Helmet>
        <title>KenjiAI Academy | Free Expert Courses & Knowledge Base</title>
        <meta name="description" content="Master AI automation, tax strategies, and business growth with our free, expert-led courses." />
      </Helmet>

      <div className="pt-24 pb-20 bg-gray-950 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Academy Hero */}
          <section className="relative py-20 mb-16 rounded-[2rem] overflow-hidden border border-white/5 bg-gradient-to-br from-blue-900/20 via-gray-900 to-purple-900/20">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative z-10 text-center px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-400 font-medium mb-8"
              >
                <GraduationCap className="w-4 h-4" />
                <span>KenjiAI Premium Academy</span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight"
              >
                Knowledge is <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Lethal.</span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed"
              >
                Access the proprietary frameworks we use to build 7-figure AI automated businesses. 
                100% Free. No gatekeeping. Just pure execution.
              </motion.p>

              <div className="max-w-2xl mx-auto relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input 
                  type="text" 
                  placeholder="What do you want to master today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-16 pl-16 pr-6 bg-gray-900/50 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-400/50 transition-all shadow-2xl"
                />
              </div>
            </div>
          </section>

          {/* Categories Grid */}
          <section className="mb-16">
            <div className="flex flex-wrap gap-4 justify-center">
              {categories.map((cat, idx) => (
                <motion.button
                  key={cat.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all ${
                    selectedCategory === cat.name 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]' 
                    : 'bg-gray-900 border-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  <cat.icon className={`w-5 h-5 ${selectedCategory === cat.name ? 'text-white' : cat.color}`} />
                  <span className="font-semibold">{cat.name}</span>
                  <span className={`text-xs ml-2 opacity-50 ${selectedCategory === cat.name ? 'text-white' : 'text-gray-500'}`}>
                    {cat.count}
                  </span>
                </motion.button>
              ))}
            </div>
          </section>

          {/* Courses Feed */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {finalCourses.map((course, idx) => (
                <motion.div
                  key={course.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link to={`/blog/${course.slug}`} className="group block h-full">
                    <div className="relative h-full bg-gray-900/50 border border-white/5 rounded-[2rem] overflow-hidden hover:border-blue-400/30 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
                      {/* Image Area */}
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img 
                          src={course.image} 
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent opacity-60"></div>
                        <div className="absolute top-6 left-6 px-4 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold backdrop-blur-sm shadow-lg">
                          {course.category}
                        </div>
                        <div className="absolute bottom-6 right-6 flex items-center gap-2 text-yellow-400 font-bold bg-gray-950/80 px-3 py-1 rounded-full backdrop-blur-sm text-sm">
                          <Star className="w-4 h-4 fill-current" />
                          {course.rating}
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="p-8">
                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 uppercase tracking-widest font-bold">
                          <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                          <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> {course.lessons} Lessons</span>
                        </div>
                        
                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                          {course.title}
                        </h3>
                        
                        <p className="text-gray-400 text-sm mb-8 line-clamp-2 leading-relaxed">
                          {course.excerpt}
                        </p>

                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white">
                              {course.instructor?.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="text-xs text-gray-500 font-medium">{course.instructor}</span>
                          </div>
                          <div className="flex items-center gap-2 text-blue-400 font-bold text-sm group-hover:gap-4 transition-all">
                            Join Free <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </section>

          {/* Articles Bottom Section */}
          <section className="mt-32 pt-32 border-t border-white/5">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Technical Insights</h2>
                <p className="text-gray-400">Deep dives into the mechanics of AI and business.</p>
              </div>
              <Link to="/blog" className="text-blue-400 hover:text-blue-300 font-bold flex items-center gap-2">
                View Viral News <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nonCourseArticles.slice(0, 4).map((article) => (
                <Link key={article.slug} to={`/blog/${article.slug}`} className="flex gap-6 p-4 rounded-3xl bg-gray-900/30 border border-white/5 hover:border-white/10 transition-all group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                    <img src={article.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold mb-2 group-hover:text-blue-400 transition-colors">{article.title}</h4>
                    <p className="text-gray-500 text-xs line-clamp-1 mb-3">{article.excerpt}</p>
                    <span className="text-[10px] uppercase tracking-tighter text-gray-400 font-bold bg-white/5 px-2 py-1 rounded-md">
                      {article.category} • {article.readTime}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default KnowledgeBasePage;