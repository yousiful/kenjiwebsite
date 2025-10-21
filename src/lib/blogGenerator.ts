import { askManusAI } from './manusAI';
import { createBlogPost, BlogPost } from './supabase';

const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const selectCategory = (topic: string): string => {
  const topicLower = topic.toLowerCase();

  if (topicLower.includes('voice') || topicLower.includes('phone')) {
    return 'Voice AI';
  } else if (topicLower.includes('conversation') || topicLower.includes('chat')) {
    return 'Conversation AI';
  } else if (topicLower.includes('workflow') || topicLower.includes('automation')) {
    return 'Automation';
  } else if (topicLower.includes('gohighlevel') || topicLower.includes('crm')) {
    return 'GoHighLevel';
  } else if (topicLower.includes('integration')) {
    return 'Integrations';
  } else {
    return 'AI Guides';
  }
};

const selectFeaturedImage = (category: string): string => {
  const images: Record<string, string> = {
    'Voice AI': 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg',
    'Conversation AI': 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg',
    'Automation': 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    'GoHighLevel': 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg',
    'Integrations': 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
    'AI Guides': 'https://images.pexels.com/photos/8438918/pexels-photo-8438918.jpeg',
  };

  return images[category] || 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg';
};

export const generateBlogPost = async (topic: string): Promise<BlogPost> => {
  const blogPrompt = `You are a professional content writer for KenjiAI. Create a comprehensive, SEO-optimized blog post about: "${topic}"

Requirements:
1. Write a compelling title (60-70 characters)
2. Create a full blog post (800-1200 words) in markdown format
3. Include:
   - Introduction
   - 3-5 main sections with practical information
   - Real-world examples
   - Step-by-step instructions where applicable
   - Best practices
   - Conclusion with call-to-action
4. Write naturally for humans, not robots
5. Include relevant keywords naturally
6. Make it actionable and valuable
7. Focus on KenjiAI features, GoHighLevel integration, and AI automation

Format your response EXACTLY like this:
TITLE: [Your compelling title here]
EXCERPT: [A 2-sentence summary that makes people want to read more]
META_DESCRIPTION: [SEO meta description, 150-160 characters]
TAGS: [tag1, tag2, tag3, tag4, tag5]

CONTENT:
[Your full blog post content in markdown format]

Remember: Write for real people. Make it valuable, actionable, and engaging.`;

  const response = await askManusAI(blogPrompt);

  const titleMatch = response.match(/TITLE:\s*(.+)/);
  const excerptMatch = response.match(/EXCERPT:\s*(.+)/);
  const metaMatch = response.match(/META_DESCRIPTION:\s*(.+)/);
  const tagsMatch = response.match(/TAGS:\s*\[(.+)\]/);
  const contentMatch = response.match(/CONTENT:\s*([\s\S]+)$/);

  if (!titleMatch || !excerptMatch || !metaMatch || !contentMatch) {
    throw new Error('Failed to parse blog post from AI response');
  }

  const title = titleMatch[1].trim();
  const excerpt = excerptMatch[1].trim();
  const metaDescription = metaMatch[1].trim();
  const tags = tagsMatch
    ? tagsMatch[1].split(',').map(tag => tag.trim())
    : [];
  const content = contentMatch[1].trim();

  const category = selectCategory(topic);
  const slug = generateSlug(title);
  const featuredImage = selectFeaturedImage(category);

  const blogPost: BlogPost = {
    title,
    slug,
    content,
    excerpt,
    category,
    tags,
    meta_description: metaDescription,
    featured_image: featuredImage,
    status: 'published',
    generated_from_topic: topic,
    published_at: new Date().toISOString(),
  };

  const savedPost = await createBlogPost(blogPost);
  return savedPost;
};

export const generateBlogPostsFromTopics = async (topics: string[]): Promise<BlogPost[]> => {
  const posts: BlogPost[] = [];

  for (const topic of topics) {
    try {
      const post = await generateBlogPost(topic);
      posts.push(post);
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`Failed to generate blog post for topic "${topic}":`, error);
    }
  }

  return posts;
};
