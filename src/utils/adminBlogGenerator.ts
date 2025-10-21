import { getMostHelpfulTopics } from '../lib/supabase';
import { generateBlogPostsFromTopics } from '../lib/blogGenerator';

export const generateBlogPostsFromFeedback = async () => {
  console.log('🤖 Starting automated blog post generation from user feedback...');

  try {
    const topics = await getMostHelpfulTopics(5);

    if (topics.length === 0) {
      console.log('📝 No popular topics found yet. Feedback needed!');
      return [];
    }

    console.log(`📊 Found ${topics.length} popular topics:`);
    topics.forEach((topic, idx) => {
      console.log(`  ${idx + 1}. "${topic}"`);
    });

    console.log('\n🚀 Generating blog posts with Manus AI...');
    const posts = await generateBlogPostsFromTopics(topics);

    console.log(`\n✅ Successfully generated ${posts.length} blog posts:`);
    posts.forEach((post, idx) => {
      console.log(`  ${idx + 1}. "${post.title}" (/${post.slug})`);
    });

    return posts;
  } catch (error) {
    console.error('❌ Error generating blog posts:', error);
    throw error;
  }
};

export const manuallyGenerateBlogPost = async (topic: string) => {
  console.log(`🤖 Generating blog post for: "${topic}"`);

  try {
    const { generateBlogPost } = await import('../lib/blogGenerator');
    const post = await generateBlogPost(topic);

    console.log(`✅ Blog post created: "${post.title}" (/${post.slug})`);
    return post;
  } catch (error) {
    console.error('❌ Error generating blog post:', error);
    throw error;
  }
};
