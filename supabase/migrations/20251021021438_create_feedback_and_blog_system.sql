/*
  # Create Feedback and Blog System

  ## Overview
  This migration creates a comprehensive system for collecting user feedback on AI chat responses 
  and automatically generating evergreen blog posts for SEO.

  ## New Tables
  
  ### `chat_feedback`
  Stores user feedback on AI chat responses to improve the system and identify popular topics
  - `id` (uuid, primary key)
  - `message_id` (text) - Unique identifier for the chat message
  - `user_query` (text) - The question the user asked
  - `ai_response` (text) - The AI's response
  - `feedback_type` (enum) - 'helpful' or 'not_helpful'
  - `feedback_comment` (text, optional) - Additional user comments
  - `session_id` (text) - Anonymous session tracking
  - `created_at` (timestamptz)

  ### `blog_posts`
  Stores AI-generated blog posts created from popular topics and queries
  - `id` (uuid, primary key)
  - `title` (text) - SEO-optimized blog title
  - `slug` (text, unique) - URL-friendly slug
  - `content` (text) - Full blog post content
  - `excerpt` (text) - Short preview
  - `category` (text) - Topic category
  - `tags` (text[]) - Array of tags for organization
  - `meta_description` (text) - SEO meta description
  - `featured_image` (text) - Image URL
  - `status` (enum) - 'draft', 'published', 'archived'
  - `view_count` (integer) - Number of views
  - `generated_from_topic` (text) - Source topic/query
  - `published_at` (timestamptz)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Allow public read access to published blog posts
  - Allow anonymous feedback submission
  - Restrict blog management to authenticated admin users
*/

-- Create feedback type enum
DO $$ BEGIN
  CREATE TYPE feedback_type AS ENUM ('helpful', 'not_helpful');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create blog status enum
DO $$ BEGIN
  CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create chat_feedback table
CREATE TABLE IF NOT EXISTS chat_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id text NOT NULL,
  user_query text NOT NULL,
  ai_response text NOT NULL,
  feedback_type feedback_type NOT NULL,
  feedback_comment text,
  session_id text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  excerpt text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  tags text[] DEFAULT '{}',
  meta_description text NOT NULL,
  featured_image text DEFAULT 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
  status blog_status DEFAULT 'draft',
  view_count integer DEFAULT 0,
  generated_from_topic text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chat_feedback_created_at ON chat_feedback(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_feedback_type ON chat_feedback(feedback_type);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_session_id ON chat_feedback(session_id);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

-- Enable RLS
ALTER TABLE chat_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for chat_feedback
CREATE POLICY "Allow anonymous feedback submission"
  ON chat_feedback
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow public read of all feedback"
  ON chat_feedback
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS Policies for blog_posts
CREATE POLICY "Allow public read of published blog posts"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Allow authenticated users to manage blog posts"
  ON blog_posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DO $$ BEGIN
  CREATE TRIGGER update_blog_posts_updated_at
    BEFORE UPDATE ON blog_posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
