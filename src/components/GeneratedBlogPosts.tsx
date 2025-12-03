import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, Eye, ArrowRight, Sparkles } from 'lucide-react';
import { getPublishedBlogPosts, BlogPost } from '../lib/supabase';

const GeneratedBlogPosts: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        );

        const data = await Promise.race([
          getPublishedBlogPosts(6),
          timeoutPromise
        ]);
        setPosts(data);
      } catch (error) {
        console.error('Error loading blog posts:', error);
        setPosts([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mt-16"
    >
      <div className="flex items-center justify-center gap-3 mb-8">
        <Sparkles className="w-6 h-6 text-yellow-400" />
        <h2 className="text-3xl font-bold text-white">AI-Generated Knowledge Articles</h2>
      </div>
      <p className="text-center text-gray-400 mb-10 max-w-2xl mx-auto">
        These evergreen SEO-optimized articles are automatically generated from popular questions and topics.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-gray-800/50 border border-gray-700 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={post.featured_image}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                {post.category}
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                {post.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(post.published_at!).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {post.view_count || 0}
                  </span>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <a
                href={`/blog/${post.slug}`}
                className="flex items-center gap-2 text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
              >
                Read Article
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </motion.article>
        ))}
      </div>

      {posts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-10"
        >
          <p className="text-sm text-gray-500">
            <BookOpen className="inline w-4 h-4 mr-1" />
            New articles are automatically generated based on popular questions and feedback
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GeneratedBlogPosts;
