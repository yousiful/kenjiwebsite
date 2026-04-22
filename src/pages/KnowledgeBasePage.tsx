import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, TrendingUp, Target, GraduationCap, Star, Clock, ArrowRight, Trophy } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { getAllArticles } from '../data/articles';
import EnrollmentNotification from '../components/EnrollmentNotification';

const KnowledgeBasePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const allArticles = getAllArticles();
  
  // Courses are articles with isCourse: true
  const courses = allArticles.filter(a => a.isCourse);
  
  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  const stats = [
    { label: "Active Students", value: "15,247+", color: "text-blue-400" },
    { label: "Course Graduates", value: "8,934", color: "text-cyan-400" },
    { label: "Expert Instructors", value: "12", color: "text-purple-400" },
    { label: "Community Rating", value: "4.9/5", color: "text-yellow-400" }
  ];

  const categoryIcons = [
    { name: "Automation", count: courses.filter(c => c.category === 'Automation').length, icon: Brain, color: "text-blue-400" },
    { name: "Marketing", count: courses.filter(c => c.category === 'Marketing').length, icon: Target, color: "text-purple-400" },
    { name: "Investment AI", count: courses.filter(c => c.category === 'Investment AI').length, icon: TrendingUp, color: "text-cyan-400" }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>KenjiAI Academy - Elite AI & Business Mastery</title>
        <meta name="description" content="Access premium AI automation courses, sales mastery tracks, and technical guides designed for 8-figure growth." />
      </Helmet>

      <EnrollmentNotification />

      <div className="pt-24 pb-20 bg-gray-950 min-h-screen relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header Section */}
          <section className="mb-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                <GraduationCap className="w-4 h-4" /> University Portal
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                KenjiAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Academy</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                The definitive curriculum for AI-Driven business growth. Master neural workflows, agentic frameworks, and high-performance sales automation.
              </p>
            </motion.div>
          </section>

          <section className="mb-20 grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-blue-600/20 border-2 border-blue-500/40 rounded-3xl p-8 text-center backdrop-blur-xl relative overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.15)] group"
            >
              <div className="absolute top-0 right-0 p-4">
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
              <div className="text-4xl font-black text-white mb-2 group-hover:scale-110 transition-transform">1,248</div>
              <div className="text-[10px] text-blue-400 uppercase tracking-[0.3em] font-black">STUDENTS LIVE NOW</div>
            </motion.div>
            {stats.slice(1).map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-gray-900/50 border border-white/5 rounded-3xl p-8 text-center backdrop-blur-sm hover:border-blue-500/30 transition-colors"
              >
                <div className={`text-3xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-black">{stat.label}</div>
              </motion.div>
            ))}
          </section>

          {/* Interactive Lab Link */}
          <section className="mb-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-1 rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 shadow-[0_0_40px_rgba(37,99,235,0.2)]"
            >
              <div className="bg-gray-950 rounded-[2.4rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-3xl font-bold text-white mb-4">Interactive AI Skills Lab</h2>
                  <p className="text-gray-400">Test your knowledge, earn badges, and track your certification progress in real-time.</p>
                </div>
                <Link to="/ai-education" className="px-8 py-4 bg-white text-gray-900 rounded-2xl font-black hover:scale-105 transition-all flex items-center gap-2 shadow-xl shrink-0">
                  <Trophy className="w-5 h-5 text-blue-600" /> Start Lab Test
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Categories Filter */}
          <section className="mb-12">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-6 py-3 rounded-xl border text-sm font-bold transition-all ${
                    selectedCategory === cat 
                      ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' 
                      : 'bg-gray-900 border-white/5 text-gray-400 hover:border-white/20'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, idx) => (
                <motion.div
                  key={course.slug}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="group relative h-full"
                >
                  <div className="absolute inset-0 bg-blue-500/5 blur-2xl group-hover:bg-blue-500/10 transition-all rounded-[2rem]" />
                  <Link 
                    to={`/blog/${course.slug}`}
                    className="relative block h-full bg-gray-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden group-hover:border-blue-500/30 transition-all"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={course.image} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={course.title}
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg">Premium</span>
                        <span className="px-3 py-1 bg-gray-950/80 backdrop-blur-md text-blue-400 border border-blue-500/30 text-[10px] font-bold uppercase rounded-lg">
                          {course.level || 'Mastery'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent" />
                    </div>
                    
                    <div className="p-8">
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-500" /> {course.readTime || '4 hours'}</span>
                        <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4 text-blue-500" /> {course.lessons || '12'} Lessons</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                        {course.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-3 mb-8">
                        {course.excerpt}
                      </p>
                      
                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white font-bold">{course.rating || '5.0'}</span>
                          <span className="text-gray-500 text-xs">({course.students || '1.2k'})</span>
                        </div>
                        <span className="flex items-center gap-2 text-blue-400 font-bold text-sm group/btn">
                          Enroll Now <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-all" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default KnowledgeBasePage;