import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ChatFeedback {
  id?: string;
  message_id: string;
  user_query: string;
  ai_response: string;
  feedback_type: 'helpful' | 'not_helpful';
  feedback_comment?: string;
  session_id: string;
  created_at?: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  meta_description: string;
  featured_image?: string;
  status: 'draft' | 'published' | 'archived';
  view_count?: number;
  generated_from_topic?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export const submitFeedback = async (feedback: ChatFeedback) => {
  const { data, error } = await supabase
    .from('chat_feedback')
    .insert([feedback])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data;
};

export const getPublishedBlogPosts = async (limit = 10) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as BlogPost[];
};

export const getBlogPostBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) throw error;
  return data as BlogPost | null;
};

export const createBlogPost = async (post: BlogPost) => {
  const { data, error } = await supabase
    .from('blog_posts')
    .insert([post])
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as BlogPost;
};

export const incrementBlogPostViews = async (slug: string) => {
  const { error } = await supabase.rpc('increment_view_count', { post_slug: slug });
  if (error) console.error('Error incrementing views:', error);
};

export const getMostHelpfulTopics = async (limit = 5) => {
  const { data, error } = await supabase
    .from('chat_feedback')
    .select('user_query, feedback_type')
    .eq('feedback_type', 'helpful')
    .order('created_at', { ascending: false })
    .limit(limit * 3);

  if (error) throw error;

  const topicCounts: Record<string, number> = {};
  data?.forEach(item => {
    const normalized = item.user_query.toLowerCase().trim();
    topicCounts[normalized] = (topicCounts[normalized] || 0) + 1;
  });

  return Object.entries(topicCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([query]) => query);
};
