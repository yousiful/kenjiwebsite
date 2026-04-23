import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, Brain, GraduationCap, Star, Clock, ArrowRight, Trophy, Users, Award, Flame, CheckCircle, Lock, Zap, Sparkles, ArrowLeft } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { getAllArticles } from '../data/articles';
import EnrollmentNotification from '../components/EnrollmentNotification';

// ─── Quiz Data ───────────────────────────────────────────────
const quizLessons = [
  {
    id: 1, title: 'What is AI?', category: 'Basics', xpReward: 100,
    questions: [
      { id: 1, question: 'What does AI stand for?', options: ['Artificial Intelligence', 'Automated Internet', 'Advanced Integration', 'Applied Information'], correct: 0, explanation: 'AI stands for Artificial Intelligence - technology that enables machines to perform tasks that typically require human intelligence.' },
      { id: 2, question: 'Which is an example of AI in everyday life?', options: ['A calculator', 'Voice assistants like Siri', 'A light switch', 'A notebook'], correct: 1, explanation: 'Voice assistants use AI to understand speech, process language, and respond naturally.' }
    ]
  },
  {
    id: 2, title: 'Machine Learning Basics', category: 'Intermediate', xpReward: 150,
    questions: [
      { id: 3, question: 'What is Machine Learning?', options: ['Teaching machines physically', 'AI that learns from data without explicit programming', 'Computer repair', 'Software installation'], correct: 1, explanation: 'ML is a subset of AI where systems learn from experience without explicit programming.' },
      { id: 4, question: 'What does an ML model need to learn?', options: ['Electricity only', 'Data and examples', 'Physical parts', 'Human supervision 24/7'], correct: 1, explanation: 'ML models need data to identify patterns and make predictions.' }
    ]
  },
  {
    id: 3, title: 'AI in Business', category: 'Applied', xpReward: 200,
    questions: [
      { id: 5, question: 'How can AI help businesses?', options: ['Only replacing humans', 'Automating tasks and providing insights', 'Making coffee', 'Nothing useful'], correct: 1, explanation: 'AI automates repetitive tasks, analyzes data, improves customer service, and increases efficiency.' },
      { id: 6, question: 'What is a chatbot?', options: ['A robot that chats', 'AI software that converses with users', 'A messaging app', 'A phone'], correct: 1, explanation: 'A chatbot is AI-powered software designed to simulate conversation with users.' }
    ]
  },
  {
    id: 4, title: 'Natural Language Processing', category: 'Advanced', xpReward: 250,
    questions: [
      { id: 7, question: 'What is NLP?', options: ['Processing natural resources', 'AI that understands human language', 'A programming language', 'Computer hardware'], correct: 1, explanation: 'NLP enables computers to understand, interpret, and generate human language.' },
      { id: 8, question: 'Which technology uses NLP?', options: ['Email spam filters', 'Light bulbs', 'Door locks', 'Car tires'], correct: 0, explanation: 'Email spam filters use NLP to analyze text and detect spam.' }
    ]
  }
];

const quizBadges = [
  { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯' },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Get all answers correct', icon: '💯' },
  { id: 'streak_3', name: 'On Fire', description: '3 lessons in a row', icon: '🔥' },
  { id: 'all_lessons', name: 'AI Master', description: 'Complete all lessons', icon: '👑' }
];

interface UserProgress {
  level: number;
  xp: number;
  completedLessons: number[];
  badges: string[];
  streak: number;
}

// ─── Main Component ──────────────────────────────────────────
const KnowledgeBasePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'courses' | 'quiz'>('courses');
  const allArticles = getAllArticles();
  
  const courses = allArticles.filter(a => a.isCourse);
  const categories = ['All', ...Array.from(new Set(courses.map(c => c.category)))];

  // Quiz state
  const [progress, setProgress] = useState<UserProgress>({ level: 1, xp: 0, completedLessons: [], badges: [], streak: 0 });
  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('aiEducationProgress');
    if (saved) setProgress(JSON.parse(saved));
  }, []);

  const saveProgress = (p: UserProgress) => { setProgress(p); localStorage.setItem('aiEducationProgress', JSON.stringify(p)); };

  const startLesson = (id: number) => { setCurrentLesson(id); setCurrentQuestionIndex(0); setSelectedAnswer(null); setShowExplanation(false); setScore(0); setShowCompletion(false); };

  const handleAnswerSelect = (idx: number) => { if (!showExplanation) setSelectedAnswer(idx); };

  const submitAnswer = () => {
    const lesson = quizLessons.find(l => l.id === currentLesson);
    if (!lesson) return;
    if (selectedAnswer === lesson.questions[currentQuestionIndex].correct) setScore(s => s + 1);
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    const lesson = quizLessons.find(l => l.id === currentLesson);
    if (!lesson) return;
    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1); setSelectedAnswer(null); setShowExplanation(false);
    } else completeLesson();
  };

  const completeLesson = () => {
    const lesson = quizLessons.find(l => l.id === currentLesson);
    if (!lesson) return;
    const np = { ...progress };
    if (!np.completedLessons.includes(lesson.id)) {
      np.completedLessons.push(lesson.id); np.xp += lesson.xpReward; np.streak += 1;
      if (np.xp >= np.level * 500) np.level += 1;
      if (np.completedLessons.length === 1 && !np.badges.includes('first_lesson')) { np.badges.push('first_lesson'); setNewBadge('first_lesson'); }
      if (score === lesson.questions.length && !np.badges.includes('perfectionist')) { np.badges.push('perfectionist'); setNewBadge('perfectionist'); }
      if (np.streak >= 3 && !np.badges.includes('streak_3')) { np.badges.push('streak_3'); setNewBadge('streak_3'); }
      if (np.completedLessons.length === quizLessons.length && !np.badges.includes('all_lessons')) { np.badges.push('all_lessons'); setNewBadge('all_lessons'); }
      saveProgress(np);
    }
    setShowCompletion(true);
  };

  const exitLesson = () => { setCurrentLesson(null); setNewBadge(null); };

  const stats = [
    { label: "Active Students", value: "15,247+", icon: Users, color: "text-amber-400" },
    { label: "Course Graduates", value: "8,934", icon: Award, color: "text-amber-300" },
    { label: "Expert Instructors", value: "12", icon: Brain, color: "text-purple-400" },
    { label: "Community Rating", value: "4.9/5", icon: Star, color: "text-yellow-400" }
  ];

  const filteredCourses = courses.filter(c => selectedCategory === 'All' || c.category === selectedCategory);
  const lesson = quizLessons.find(l => l.id === currentLesson);
  const currentQuestion = lesson?.questions[currentQuestionIndex];

  return (
    <>
      <Helmet>
        <title>KenjiAI Academy — Elite AI & Business Mastery</title>
        <meta name="description" content="Access premium AI automation courses, sales mastery tracks, and the interactive AI knowledge assessment." />
      </Helmet>

      <EnrollmentNotification />

      <div className="pt-24 pb-20 min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #0c0a15 0%, #110e1d 40%, #0f0d18 100%)' }}>
        <div className="absolute top-0 left-1/3 w-[500px] h-[400px] bg-amber-500/5 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-40 right-1/4 w-[400px] h-[400px] bg-purple-500/8 blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Hero */}
          <section className="mb-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                <GraduationCap className="w-4 h-4" /> ACADEMY
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-none">
                KenjiAI <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400">Academy</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
                Master neural workflows, agentic frameworks, and high-performance sales automation.
              </p>
            </motion.div>
          </section>

          {/* Stats */}
          <section className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * idx }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center hover:border-amber-500/20 transition-all group"
              >
                <stat.icon className={`w-5 h-5 ${stat.color} mx-auto mb-2 opacity-60 group-hover:opacity-100 transition-opacity`} />
                <div className="text-2xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold">{stat.label}</div>
              </motion.div>
            ))}
          </section>

          {/* Tab Switcher */}
          <section className="mb-10">
            <div className="flex gap-2 justify-center p-1.5 bg-white/[0.03] rounded-2xl border border-white/[0.06] max-w-md mx-auto">
              <button
                onClick={() => { setActiveTab('courses'); setCurrentLesson(null); }}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                  activeTab === 'courses' ? 'bg-amber-500 text-black shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" /> Courses
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                  activeTab === 'quiz' ? 'bg-purple-500 text-white shadow-lg' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Brain className="w-4 h-4" /> AI Assessment
              </button>
            </div>
          </section>

          {/* ═══ COURSES TAB ═══ */}
          {activeTab === 'courses' && (
            <>
              <section className="mb-10">
                <div className="flex flex-wrap gap-3 justify-center">
                  {categories.map((cat) => (
                    <button key={cat} onClick={() => setSelectedCategory(cat)}
                      className={`px-5 py-2.5 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all ${
                        selectedCategory === cat 
                          ? 'bg-amber-500 border-amber-400 text-black shadow-[0_0_20px_rgba(251,191,36,0.2)]' 
                          : 'bg-white/[0.02] border-white/[0.06] text-gray-400 hover:border-amber-500/20'
                      }`}
                    >{cat}</button>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredCourses.map((course, idx) => (
                    <motion.div key={course.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: idx * 0.05 }} className="group relative h-full">
                      <Link to={`/blog/${course.slug}`} className="relative block h-full bg-white/[0.02] border border-white/[0.06] rounded-2xl overflow-hidden group-hover:border-amber-500/30 transition-all">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          <img src={course.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={course.title} />
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className="px-3 py-1 bg-amber-500 text-black text-[10px] font-black uppercase rounded-md">Premium</span>
                            <span className="px-3 py-1 bg-black/70 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase rounded-md">{course.level || 'Mastery'}</span>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#110e1d] via-[#110e1d]/30 to-transparent" />
                        </div>
                        <div className="p-6">
                          <div className="flex items-center gap-4 text-[10px] text-gray-500 mb-3 font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-500/60" /> {course.readTime || '4 hours'}</span>
                            <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-amber-500/60" /> {course.lessons || '12'} Lessons</span>
                          </div>
                          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-400 transition-colors leading-tight">{course.title}</h3>
                          <p className="text-gray-500 text-sm line-clamp-2 mb-5">{course.excerpt}</p>
                          <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                              <span className="text-white font-bold text-sm">{course.rating || '5.0'}</span>
                              <span className="text-gray-600 text-xs">({course.students || '1.2k'})</span>
                            </div>
                            <span className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase">Enroll <ArrowRight className="w-3.5 h-3.5" /></span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </>
          )}

          {/* ═══ AI ASSESSMENT TAB ═══ */}
          {activeTab === 'quiz' && (
            <div className="max-w-4xl mx-auto">
              {!currentLesson ? (
                <>
                  {/* Progress Card */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8 mb-10"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                        <span className="text-2xl font-bold text-white block">Level {progress.level}</span>
                        <p className="text-gray-500 text-xs">Your Level</p>
                      </div>
                      <div className="text-center">
                        <Zap className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                        <span className="text-2xl font-bold text-white block">{progress.xp}</span>
                        <p className="text-gray-500 text-xs">Total XP</p>
                      </div>
                      <div className="text-center">
                        <Trophy className="w-6 h-6 text-green-400 mx-auto mb-2" />
                        <span className="text-2xl font-bold text-white block">{progress.completedLessons.length}/{quizLessons.length}</span>
                        <p className="text-gray-500 text-xs">Completed</p>
                      </div>
                      <div className="text-center">
                        <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                        <span className="text-2xl font-bold text-white block">{progress.badges.length}</span>
                        <p className="text-gray-500 text-xs">Badges</p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-gray-400">Progress to Level {progress.level + 1}</span>
                        <span className="text-gray-400">{progress.xp % 500}/500 XP</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-purple-500 to-amber-500 h-2.5 rounded-full transition-all" style={{ width: `${((progress.xp % 500) / 500) * 100}%` }} />
                      </div>
                    </div>
                  </motion.div>

                  {/* Lessons */}
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                    <Sparkles className="w-6 h-6 text-purple-400" /> Available Lessons
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
                    {quizLessons.map((ql, index) => {
                      const isCompleted = progress.completedLessons.includes(ql.id);
                      const isLocked = index > 0 && !progress.completedLessons.includes(quizLessons[index - 1].id);
                      return (
                        <motion.div key={ql.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index }}
                          className={`bg-white/[0.03] border-2 rounded-2xl p-6 transition-all ${isLocked ? 'border-gray-800 opacity-40' : isCompleted ? 'border-green-500/50' : 'border-white/[0.06] hover:border-purple-500/40'}`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-purple-400 uppercase">{ql.category}</span>
                            {isCompleted && <CheckCircle className="w-4 h-4 text-green-400" />}
                            {isLocked && <Lock className="w-4 h-4 text-gray-600" />}
                          </div>
                          <h3 className="text-xl font-bold text-white mb-1">{ql.title}</h3>
                          <p className="text-gray-500 text-xs mb-5">{ql.questions.length} questions • {ql.xpReward} XP</p>
                          {!isLocked ? (
                            <button onClick={() => startLesson(ql.id)}
                              className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                isCompleted ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gradient-to-r from-purple-500 to-amber-500 text-white'
                              }`}
                            >{isCompleted ? 'Review' : 'Start'} <ArrowRight className="w-4 h-4" /></button>
                          ) : (
                            <div className="w-full py-3 rounded-xl text-center bg-gray-800 text-gray-600 text-sm font-semibold">Complete previous to unlock</div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Badges */}
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3"><Award className="w-6 h-6 text-yellow-400" /> Badges</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {quizBadges.map(b => {
                      const earned = progress.badges.includes(b.id);
                      return (
                        <div key={b.id} className={`bg-white/[0.03] border-2 rounded-2xl p-5 text-center ${earned ? 'border-yellow-500/50' : 'border-gray-800 opacity-40'}`}>
                          <div className="text-4xl mb-2">{b.icon}</div>
                          <h3 className="text-sm font-bold text-white mb-0.5">{b.name}</h3>
                          <p className="text-[10px] text-gray-500">{b.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <AnimatePresence mode="wait">
                  {!showCompletion ? (
                    <motion.div key="quiz" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                      <div className="mb-6 flex items-center justify-between">
                        <button onClick={exitLesson} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
                          <ArrowLeft className="w-4 h-4" /> Back
                        </button>
                        <div className="text-gray-500 text-sm">Q{currentQuestionIndex + 1}/{lesson?.questions.length}</div>
                      </div>

                      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-8">
                        <div className="flex items-center justify-between mb-6">
                          <span className="text-xs font-bold text-purple-400 uppercase">{lesson?.category}</span>
                          <span className="text-xs text-gray-500">Score: {score}/{lesson?.questions.length}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-8">{currentQuestion?.question}</h2>

                        <div className="space-y-3 mb-8">
                          {currentQuestion?.options.map((opt, idx) => {
                            const isSelected = selectedAnswer === idx;
                            const isCorrect = idx === currentQuestion.correct;
                            const show = showExplanation;
                            return (
                              <button key={idx} onClick={() => handleAnswerSelect(idx)} disabled={showExplanation}
                                className={`w-full p-4 rounded-xl text-left font-medium transition-all border ${
                                  show ? (isCorrect ? 'bg-green-500/10 border-green-500 text-white' : isSelected ? 'bg-red-500/10 border-red-500 text-white' : 'bg-gray-800/50 border-gray-800 text-gray-500')
                                  : isSelected ? 'bg-purple-500/10 border-purple-500 text-white' : 'bg-gray-800/50 border-gray-700 text-white hover:border-purple-500/50'
                                }`}
                              >{opt}</button>
                            );
                          })}
                        </div>

                        {showExplanation && (
                          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-5 mb-6">
                            <div className="flex items-start gap-3">
                              <Brain className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                              <div>
                                <h4 className="font-bold text-white mb-1 text-sm">Explanation</h4>
                                <p className="text-gray-300 text-sm">{currentQuestion?.explanation}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}

                        {!showExplanation ? (
                          <button onClick={submitAnswer} disabled={selectedAnswer === null}
                            className={`w-full py-4 rounded-xl font-bold text-lg ${selectedAnswer !== null ? 'bg-gradient-to-r from-purple-500 to-amber-500 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'}`}
                          >Submit Answer</button>
                        ) : (
                          <button onClick={nextQuestion} className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-purple-500 to-amber-500 text-white">
                            {currentQuestionIndex < (lesson?.questions.length || 0) - 1 ? 'Next Question →' : 'Complete Lesson →'}
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div key="completion" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
                      {/* Results */}
                      <div className="bg-white/[0.03] border-2 border-green-500/50 rounded-2xl p-10 mb-8">
                        <Trophy className="w-14 h-14 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-white mb-2 text-center">Lesson Complete!</h2>
                        <p className="text-gray-400 text-center mb-8">Here are your results</p>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                          <div className="bg-gray-800/50 rounded-xl p-5 text-center">
                            <div className="text-3xl font-bold text-white mb-1">{score}/{lesson?.questions.length}</div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Correct</p>
                          </div>
                          <div className="bg-gray-800/50 rounded-xl p-5 text-center">
                            <div className="text-3xl font-bold text-green-400 mb-1">+{lesson?.xpReward}</div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">XP</p>
                          </div>
                          <div className="bg-gray-800/50 rounded-xl p-5 text-center">
                            <div className="text-3xl font-bold text-purple-400 mb-1">Lv.{progress.level}</div>
                            <p className="text-gray-500 text-[10px] uppercase tracking-wider font-bold">Level</p>
                          </div>
                        </div>
                        <div className="mb-6">
                          <div className="flex justify-between text-xs mb-2">
                            <span className="text-gray-400">Accuracy</span>
                            <span className="text-white font-bold">{lesson ? Math.round((score / lesson.questions.length) * 100) : 0}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-400 h-2.5 rounded-full transition-all duration-1000" style={{ width: `${lesson ? (score / lesson.questions.length) * 100 : 0}%` }} />
                          </div>
                        </div>
                        {newBadge && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-yellow-500/10 border-2 border-yellow-500/50 rounded-xl p-5 mb-4">
                            <Award className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
                            <h3 className="text-lg font-bold text-white text-center mb-0.5">Badge Unlocked!</h3>
                            <p className="text-gray-300 text-center text-sm">{quizBadges.find(b => b.id === newBadge)?.name}</p>
                          </motion.div>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="bg-gradient-to-r from-purple-900/30 to-amber-900/20 border border-purple-500/30 rounded-2xl p-8 mb-6 text-center">
                        <h3 className="text-2xl font-bold text-white mb-3">Ready to Go Deeper?</h3>
                        <p className="text-gray-400 mb-6 text-sm max-w-md mx-auto">Unlock the full KenjiAI curriculum with advanced modules, live mentorship, and certification.</p>
                        <a href="https://startlearning.kenjiai.com/" target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-amber-500 text-white px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all"
                        >Unlock Full Course <ArrowRight className="w-5 h-5" /></a>
                      </div>

                      <div className="text-center">
                        <button onClick={exitLesson} className="text-gray-400 hover:text-white text-sm font-semibold underline underline-offset-4">← Back to Lessons</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default KnowledgeBasePage;