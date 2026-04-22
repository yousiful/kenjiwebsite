import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowLeft, ArrowRight, Share2, Tag, BookOpen, GraduationCap, Star, User } from 'lucide-react';
import { useAutoFormatting } from '../components/AutoFormattingProvider';
import { Helmet } from 'react-helmet-async';
import { getArticleBySlug, getAllArticles } from '../data/articles';

const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { fixFormatting } = useAutoFormatting();

  const article = slug ? getArticleBySlug(slug) : undefined;
  const allArticles = getAllArticles();

  // Redirect if no article found
  useEffect(() => {
    if (!slug || !article) {
      navigate('/knowledge', { replace: true });
    }
  }, [slug, article, navigate]);

  // Auto-fix formatting issues on load
  useEffect(() => {
    fixFormatting();
    const timer = setTimeout(() => fixFormatting(), 500);
    return () => clearTimeout(timer);
  }, [fixFormatting]);

  if (!article) return null;

  // Get related articles (same category or just other articles)
  const relatedArticles = allArticles
    .filter(a => a.slug !== article.slug)
    .slice(0, 3);

  return (
    <>
      <Helmet>
        <title>{article.title} | KenjiAI Blog</title>
        <meta name="description" content={article.excerpt} />
        <meta name="keywords" content={article.keywords.join(', ')} />
        <meta name="author" content={article.author} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:image" content={article.image} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={article.date} />
        <meta property="article:author" content={article.author} />
        <meta property="article:section" content={article.category} />
        {article.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <link rel="canonical" href={`https://kenjiai.com/blog/${article.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": article.title,
            "description": article.excerpt,
            "image": article.image,
            "author": {
              "@type": "Organization",
              "name": article.author
            },
            "publisher": {
              "@type": "Organization",
              "name": "KenjiAI",
              "url": "https://kenjiai.com"
            },
            "datePublished": article.date,
            "dateModified": article.date,
            "keywords": article.keywords.join(', '),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://kenjiai.com/blog/${article.slug}`
            }
          })}
        </script>
      </Helmet>
      
      <div className="pt-24 pb-16 bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link
              to="/blog"
              className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Articles
            </Link>
          </motion.div>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-10"
          >
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${article.isCourse ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                {article.category}
              </span>
              {article.isCourse && (
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-lg text-sm font-semibold flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Premium Course
                </span>
              )}
              <span className="text-gray-400 text-sm flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                {article.readTime}
              </span>
              <span className="text-gray-400 text-sm flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title}
            </h1>

            {article.isCourse && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8 bg-gray-800/40 border border-white/5 rounded-2xl p-6">
                <div>
                  <div className="text-gray-500 text-[10px] uppercase font-bold mb-1 tracking-wider">Instructor</div>
                  <div className="text-white font-semibold text-sm flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    {article.instructor}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] uppercase font-bold mb-1 tracking-wider">Lessons</div>
                  <div className="text-white font-semibold text-sm flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    {article.lessons} Chapters
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] uppercase font-bold mb-1 tracking-wider">Duration</div>
                  <div className="text-white font-semibold text-sm flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-green-400" />
                    {article.duration}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] uppercase font-bold mb-1 tracking-wider">Rating</div>
                  <div className="text-white font-semibold text-sm flex items-center gap-2 text-yellow-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {article.rating}
                  </div>
                </div>
              </div>
            )}

            <p className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-6">
              {article.excerpt}
            </p>

            {/* Author & Tags */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {article.author.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{article.author}</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="bg-gray-800 text-gray-400 px-2.5 py-1 rounded-lg text-xs flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.header>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-48 sm:h-64 md:h-80 object-cover rounded-2xl"
              loading="eager"
            />
          </motion.div>

          {/* Article Content */}
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="prose prose-lg prose-invert max-w-none mb-16"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Share */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 mb-12 pb-12 border-b border-gray-800"
          >
            <span className="text-gray-400 text-sm">Share this article:</span>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: article.title, url: window.location.href });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </motion.div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6">More Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedArticles.map((related) => (
                  <Link key={related.slug} to={`/blog/${related.slug}`}>
                    <motion.div
                      whileHover={{ scale: 1.02, y: -3 }}
                      className="bg-gray-800/50 border border-gray-700 hover:border-blue-400/50 rounded-xl overflow-hidden transition-all duration-300 group h-full"
                    >
                      <img
                        src={related.image}
                        alt={related.title}
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="p-4">
                        <span className="text-blue-400 text-xs font-semibold">{related.category}</span>
                        <h3 className="text-white font-semibold mt-1 mb-2 text-sm group-hover:text-blue-300 transition-colors line-clamp-2">
                          {related.title}
                        </h3>
                        <p className="text-gray-400 text-xs line-clamp-2 mb-3">{related.excerpt}</p>
                        <div className="flex items-center text-blue-400 text-xs font-semibold group-hover:text-blue-300 transition-colors">
                          Read More
                          <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="text-center bg-gradient-to-r from-blue-900/30 to-green-900/30 border border-blue-400/30 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-3">
              Want This Done for You?
            </h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              KenjiAI sets up your automations, CRM, follow-ups, and marketing so you can focus on running your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://go.mediatraffics.com/leads"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300"
              >
                Book a Free Call
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 bg-gray-800 border border-gray-600 hover:border-blue-400 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                See Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default BlogPost;