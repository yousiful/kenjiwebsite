import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';

interface RelatedArticle {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  readTime?: string;
}

interface RelatedArticlesProps {
  articles: RelatedArticle[];
  title?: string;
  currentSlug?: string;
}

export function RelatedArticles({
  articles,
  title = "Related Articles",
  currentSlug
}: RelatedArticlesProps) {
  const filteredArticles = articles.filter(article => article.slug !== currentSlug);

  if (filteredArticles.length === 0) return null;

  return (
    <section className="py-12 px-4" style={{ backgroundColor: 'rgba(11, 14, 20, 0.5)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-green-400" />
            {title}
          </h2>
          <p className="text-gray-400">Continue learning with these related resources</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredArticles.slice(0, 3).map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={`/blog/${article.slug}`}
                className="group block h-full bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-green-400 uppercase tracking-wider">
                    {article.category}
                  </span>
                  {article.readTime && (
                    <>
                      <span className="text-gray-600">•</span>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-400 transition-colors line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                <div className="flex items-center gap-2 text-green-400 font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8"
        >
          <Link
            to="/knowledge"
            className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
