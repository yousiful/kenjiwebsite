import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, GraduationCap, Star, Clock, ArrowRight, Trophy, Users, Award, Flame } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { getAllArticles } from '../data/articles';
import EnrollmentNotification from '../components/EnrollmentNotification';

const KnowledgeBasePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const allArticles = getAllArticles();
  
  const courses = allArticles.filter(a => a.isCourse);
  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  const stats = [
    { label: "Active Students", value: "15,247+", icon: Users, color: "text-amber-400" },
    { label: "Course Graduates", value: "8,934", icon: Award, color: "text-amber-300" },
    { label: "Expert Instructors", value: "12", icon: Brain, color: "text-purple-400" },
    { label: "Community Rating", value: "4.9/5", icon: Star, color: "text-yellow-400" }
  ];

  const filteredCourses = courses.filter(course => {
    return selectedCategory === 'All' || course.category === selectedCategory;
  });

  return (
    <>
      <Helmet>
        <title>KenjiAI Academy — Elite AI & Business Mastery</title>
        <meta name="description" content="Access premium AI automation courses, sales mastery tracks, and technical guides designed for 8-figure growth." />
      </Helmet>

      <EnrollmentNotification />

      {/* Warm University Background */}
      <div className="pt-24 pb-20 min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0c0a15 0%, #110e1d 40%, #0f0d18 100%)' }}>
        {/* Warm ambient glow */}
        <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-amber-500/5 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-40 right-1/4 w-[400px] h-[400px] bg-purple-500/8 blur-[150px] pointer-events-none" />
        <div className="absolute top-20 right-10 w-[200px] h-[200px] bg-yellow-500/5 blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Hero */}
          <section className="mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                <GraduationCap className="w-4 h-4" /> ACADEMY
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none">
                KenjiAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400">Academy</span>
              </h1>
              <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                The definitive curriculum for AI-driven business growth. Master neural workflows, agentic frameworks, and high-performance sales automation.
              </p>
            </motion.div>
          </section>

          {/* Stats */}
          <section className="mb-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 text-center backdrop-blur-sm hover:border-amber-500/20 transition-all group"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-3 opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className={`text-3xl font-black text-white mb-1`}>{stat.value}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </section>

          {/* Interactive Lab CTA */}
          <section className="mb-16">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-purple-950/20 to-amber-950/30"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(251,191,36,0.06),transparent_60%)]" />
              <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest mb-4">
                    <Flame className="w-3 h-3" /> NEW
                  </div>
                  <h2 className="text-3xl font-black text-white mb-3 tracking-tight">Interactive AI Skills Lab</h2>
                  <p className="text-gray-400 text-sm">Test your knowledge, earn badges, and track your certification progress in real-time.</p>
                </div>
                <Link to="/ai-education" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black rounded-xl font-black hover:scale-105 transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(251,191,36,0.2)] shrink-0 text-sm uppercase tracking-wider">
                  <Trophy className="w-4 h-4" /> Take Quiz
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Categories */}
          <section className="mb-10">
            <div className="flex flex-wrap gap-3 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === cat 
                      ? 'bg-amber-500 border-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.2)]' 
                      : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:border-amber-500/20 hover:text-amber-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </section>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <Link 
                    to={`/blog/${course.slug}`}
                    className="relative block h-full bg-white/[0.02] backdrop-blur-sm border border-white/[0.06] rounded-2xl overflow-hidden group-hover:border-amber-500/30 transition-all"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img 
                        src={course.image} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        alt={course.title}
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black uppercase rounded-md shadow-lg">Premium</span>
                        <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase rounded-md">
                          {course.level || 'Mastery'}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#110e1d] via-[#110e1d]/30 to-transparent" />
                    </div>
                    
                    <div className="p-7">
                      <div className="flex items-center gap-4 text-[10px] text-gray-500 mb-4 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-500/60" /> {course.readTime || '4 hours'}</span>
                        <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-amber-500/60" /> {course.lessons || '12'} Lessons</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-400 transition-colors leading-tight tracking-tight">
                        {course.title}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                        {course.excerpt}
                      </p>
                      
                      <div className="pt-5 border-t border-white/[0.04] flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-white font-bold text-sm">{course.rating || '5.0'}</span>
                          <span className="text-gray-600 text-xs">({course.students || '1.2k'})</span>
                        </div>
                        <span className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                          Enroll <ArrowRight className="w-3.5 h-3.5" />
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