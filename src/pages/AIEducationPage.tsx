import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Award, Zap, CheckCircle, Lock, Star, Trophy, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  category: string;
}

interface UserProgress {
  level: number;
  xp: number;
  completedLessons: number[];
  badges: string[];
  streak: number;
}

const lessons = [
  {
    id: 1,
    title: 'What is AI?',
    category: 'Basics',
    xpReward: 100,
    questions: [
      {
        id: 1,
        question: 'What does AI stand for?',
        options: ['Artificial Intelligence', 'Automated Internet', 'Advanced Integration', 'Applied Information'],
        correct: 0,
        explanation: 'AI stands for Artificial Intelligence - technology that enables machines to perform tasks that typically require human intelligence.',
        category: 'Basics'
      },
      {
        id: 2,
        question: 'Which of these is an example of AI in everyday life?',
        options: ['A calculator', 'Voice assistants like Siri or Alexa', 'A light switch', 'A paper notebook'],
        correct: 1,
        explanation: 'Voice assistants use AI to understand speech, process language, and respond to your commands naturally.',
        category: 'Basics'
      }
    ]
  },
  {
    id: 2,
    title: 'Machine Learning Basics',
    category: 'Intermediate',
    xpReward: 150,
    questions: [
      {
        id: 3,
        question: 'What is Machine Learning?',
        options: ['Teaching machines physically', 'AI that learns from data without explicit programming', 'Computer repair', 'Software installation'],
        correct: 1,
        explanation: 'Machine Learning is a subset of AI where systems learn and improve from experience without being explicitly programmed.',
        category: 'Intermediate'
      },
      {
        id: 4,
        question: 'What does a machine learning model need to learn?',
        options: ['Electricity only', 'Data and examples', 'Physical parts', 'Human supervision 24/7'],
        correct: 1,
        explanation: 'Machine learning models need data and examples to identify patterns and learn to make predictions or decisions.',
        category: 'Intermediate'
      }
    ]
  },
  {
    id: 3,
    title: 'AI in Business',
    category: 'Applied',
    xpReward: 200,
    questions: [
      {
        id: 5,
        question: 'How can AI help businesses?',
        options: ['Only by replacing all humans', 'Automating repetitive tasks and providing insights', 'Making coffee', 'Nothing useful'],
        correct: 1,
        explanation: 'AI helps businesses by automating repetitive tasks, analyzing data for insights, improving customer service, and increasing efficiency.',
        category: 'Applied'
      },
      {
        id: 6,
        question: 'What is a chatbot?',
        options: ['A robot that physically chats', 'AI software that can have conversations with users', 'A messaging app', 'A type of phone'],
        correct: 1,
        explanation: 'A chatbot is AI-powered software designed to simulate conversation with users, often used for customer support and engagement.',
        category: 'Applied'
      }
    ]
  },
  {
    id: 4,
    title: 'Natural Language Processing',
    category: 'Advanced',
    xpReward: 250,
    questions: [
      {
        id: 7,
        question: 'What is Natural Language Processing (NLP)?',
        options: ['Processing natural resources', 'AI that understands and generates human language', 'A programming language', 'Computer hardware'],
        correct: 1,
        explanation: 'NLP enables computers to understand, interpret, and generate human language, powering things like chatbots and translation services.',
        category: 'Advanced'
      },
      {
        id: 8,
        question: 'Which technology uses NLP?',
        options: ['Email spam filters', 'Light bulbs', 'Door locks', 'Car tires'],
        correct: 0,
        explanation: 'Email spam filters use NLP to analyze text content and determine if an email is spam, demonstrating practical AI application.',
        category: 'Advanced'
      }
    ]
  }
];

const badges = [
  { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯' },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Get all answers correct in a lesson', icon: '💯' },
  { id: 'streak_3', name: 'On Fire', description: 'Complete 3 lessons in a row', icon: '🔥' },
  { id: 'all_lessons', name: 'AI Master', description: 'Complete all lessons', icon: '👑' }
];

export default function AIEducationPage() {
  const [progress, setProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    completedLessons: [],
    badges: [],
    streak: 0
  });

  const [currentLesson, setCurrentLesson] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [newBadge, setNewBadge] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('aiEducationProgress');
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem('aiEducationProgress', JSON.stringify(newProgress));
  };

  const startLesson = (lessonId: number) => {
    setCurrentLesson(lessonId);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setShowCompletion(false);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (showExplanation) return;
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = () => {
    const lesson = lessons.find(l => l.id === currentLesson);
    if (!lesson) return;

    const currentQuestion = lesson.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct;

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowExplanation(true);
  };

  const nextQuestion = () => {
    const lesson = lessons.find(l => l.id === currentLesson);
    if (!lesson) return;

    if (currentQuestionIndex < lesson.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      completeLesson();
    }
  };

  const completeLesson = () => {
    const lesson = lessons.find(l => l.id === currentLesson);
    if (!lesson) return;

    const newProgress = { ...progress };

    if (!newProgress.completedLessons.includes(lesson.id)) {
      newProgress.completedLessons.push(lesson.id);
      newProgress.xp += lesson.xpReward;
      newProgress.streak += 1;

      if (newProgress.xp >= newProgress.level * 500) {
        newProgress.level += 1;
      }

      if (newProgress.completedLessons.length === 1 && !newProgress.badges.includes('first_lesson')) {
        newProgress.badges.push('first_lesson');
        setNewBadge('first_lesson');
      }

      if (score === lesson.questions.length && !newProgress.badges.includes('perfectionist')) {
        newProgress.badges.push('perfectionist');
        setNewBadge('perfectionist');
      }

      if (newProgress.streak >= 3 && !newProgress.badges.includes('streak_3')) {
        newProgress.badges.push('streak_3');
        setNewBadge('streak_3');
      }

      if (newProgress.completedLessons.length === lessons.length && !newProgress.badges.includes('all_lessons')) {
        newProgress.badges.push('all_lessons');
        setNewBadge('all_lessons');
      }

      saveProgress(newProgress);
    }

    setShowCompletion(true);
  };

  const exitLesson = () => {
    setCurrentLesson(null);
    setNewBadge(null);
  };

  const lesson = lessons.find(l => l.id === currentLesson);
  const currentQuestion = lesson?.questions[currentQuestionIndex];

  return (
    <>
      <Helmet>
        <title>AI Education - Learn AI Through Interactive Games | KenjiAI</title>
        <meta name="description" content="Master AI concepts through fun, interactive lessons. Earn badges, level up, and become an AI expert at your own pace." />
      </Helmet>

      <div className="min-h-screen bg-gray-900 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!currentLesson ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Brain className="w-12 h-12 text-blue-400" />
                  <h1 className="text-5xl font-bold text-white">AI Education</h1>
                </div>
                <p className="text-xl text-gray-400">Learn AI concepts through interactive lessons and earn rewards</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-800 border border-gray-700 rounded-2xl p-8 mb-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="w-6 h-6 text-yellow-400" />
                      <span className="text-3xl font-bold text-white">Level {progress.level}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Your Level</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Zap className="w-6 h-6 text-blue-400" />
                      <span className="text-3xl font-bold text-white">{progress.xp}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Total XP</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="w-6 h-6 text-green-400" />
                      <span className="text-3xl font-bold text-white">{progress.completedLessons.length}/{lessons.length}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Lessons Completed</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Award className="w-6 h-6 text-purple-400" />
                      <span className="text-3xl font-bold text-white">{progress.badges.length}</span>
                    </div>
                    <p className="text-gray-400 text-sm">Badges Earned</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Progress to Level {progress.level + 1}</span>
                    <span className="text-sm text-gray-400">{progress.xp % 500}/500 XP</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${((progress.xp % 500) / 500) * 100}%` }}
                    />
                  </div>
                </div>
              </motion.div>

              <div className="mb-12">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-blue-400" />
                  Available Lessons
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lessons.map((lesson, index) => {
                    const isCompleted = progress.completedLessons.includes(lesson.id);
                    const isLocked = index > 0 && !progress.completedLessons.includes(lessons[index - 1].id);

                    return (
                      <motion.div
                        key={lesson.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className={`bg-gray-800 border-2 rounded-xl p-6 transition-all ${
                          isLocked
                            ? 'border-gray-700 opacity-50'
                            : isCompleted
                            ? 'border-green-500'
                            : 'border-gray-700 hover:border-blue-500'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-semibold text-blue-400 uppercase">{lesson.category}</span>
                              {isCompleted && <CheckCircle className="w-5 h-5 text-green-400" />}
                              {isLocked && <Lock className="w-5 h-5 text-gray-500" />}
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{lesson.title}</h3>
                            <p className="text-gray-400 text-sm mb-4">{lesson.questions.length} questions • {lesson.xpReward} XP</p>
                          </div>
                        </div>

                        {!isLocked ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => startLesson(lesson.id)}
                            className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 ${
                              isCompleted
                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                            }`}
                          >
                            {isCompleted ? 'Review Lesson' : 'Start Lesson'}
                            <ArrowRight className="w-5 h-5" />
                          </motion.button>
                        ) : (
                          <div className="w-full py-3 rounded-xl font-semibold text-center bg-gray-700 text-gray-500">
                            Complete previous lesson to unlock
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Award className="w-8 h-8 text-purple-400" />
                  Badges
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {badges.map((badge) => {
                    const earned = progress.badges.includes(badge.id);
                    return (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`bg-gray-800 border-2 rounded-xl p-6 text-center ${
                          earned ? 'border-yellow-500' : 'border-gray-700 opacity-50'
                        }`}
                      >
                        <div className="text-5xl mb-3">{badge.icon}</div>
                        <h3 className="text-lg font-bold text-white mb-1">{badge.name}</h3>
                        <p className="text-sm text-gray-400">{badge.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <AnimatePresence mode="wait">
              {!showCompletion ? (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-3xl mx-auto"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <button
                      onClick={exitLesson}
                      className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Back to Lessons
                    </button>
                    <div className="text-gray-400">
                      Question {currentQuestionIndex + 1} of {lesson?.questions.length}
                    </div>
                  </div>

                  <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8">
                    <div className="mb-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-blue-400 uppercase">{lesson?.category}</span>
                        <span className="text-sm text-gray-400">Score: {score}/{lesson?.questions.length}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion?.question}</h2>
                    </div>

                    <div className="space-y-4 mb-8">
                      {currentQuestion?.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        const isCorrect = index === currentQuestion.correct;
                        const showResult = showExplanation;

                        return (
                          <motion.button
                            key={index}
                            whileHover={!showExplanation ? { scale: 1.02 } : {}}
                            whileTap={!showExplanation ? { scale: 0.98 } : {}}
                            onClick={() => handleAnswerSelect(index)}
                            className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                              showResult
                                ? isCorrect
                                  ? 'bg-green-500/20 border-2 border-green-500 text-white'
                                  : isSelected
                                  ? 'bg-red-500/20 border-2 border-red-500 text-white'
                                  : 'bg-gray-700 border border-gray-600 text-gray-400'
                                : isSelected
                                ? 'bg-blue-500/30 border-2 border-blue-500 text-white'
                                : 'bg-gray-700 border border-gray-600 text-white hover:border-blue-500'
                            }`}
                            disabled={showExplanation}
                          >
                            {option}
                          </motion.button>
                        );
                      })}
                    </div>

                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mb-6"
                      >
                        <div className="flex items-start gap-3">
                          <Brain className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="text-lg font-bold text-white mb-2">Explanation</h3>
                            <p className="text-gray-300">{currentQuestion?.explanation}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="flex gap-4">
                      {!showExplanation ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={submitAnswer}
                          disabled={selectedAnswer === null}
                          className={`w-full py-4 rounded-xl font-bold text-lg ${
                            selectedAnswer !== null
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Submit Answer
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={nextQuestion}
                          className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                        >
                          {currentQuestionIndex < (lesson?.questions.length || 0) - 1 ? 'Next Question' : 'Complete Lesson'}
                          <ArrowRight className="w-5 h-5 inline ml-2" />
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="completion"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="max-w-2xl mx-auto text-center"
                >
                  <div className="bg-gray-800 border-2 border-green-500 rounded-2xl p-12">
                    <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                    <h2 className="text-4xl font-bold text-white mb-4">Lesson Complete!</h2>
                    <p className="text-xl text-gray-400 mb-8">
                      You scored {score} out of {lesson?.questions.length}
                    </p>

                    <div className="bg-gray-700/50 rounded-xl p-6 mb-8">
                      <div className="text-3xl font-bold text-green-400 mb-2">+{lesson?.xpReward} XP</div>
                      <p className="text-gray-400">Experience Points Earned</p>
                    </div>

                    {newBadge && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-yellow-500/10 border-2 border-yellow-500 rounded-xl p-6 mb-8"
                      >
                        <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">New Badge Unlocked!</h3>
                        <p className="text-gray-300">{badges.find(b => b.id === newBadge)?.name}</p>
                      </motion.div>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={exitLesson}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-bold text-lg"
                    >
                      Continue Learning
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
}
