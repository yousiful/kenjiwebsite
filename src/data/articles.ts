export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
  keywords: string[];
  image: string;
  content: string;
  // Course-specific fields
  level?: string;
  duration?: string;
  lessons?: number;
  students?: string;
  rating?: number;
  instructor?: string;
  skills?: string[];
  isCourse?: boolean;
}

export const articles: Record<string, Article> = {
  // --- COURSES ---
  'ai-automation-business-growth-2025': {
    slug: 'ai-automation-business-growth-2025',
    title: 'Complete AI Business Automation Mastery',
    excerpt: 'Master AI automation from beginner to expert. Learn how to build AI systems that generate $2.3M+ in revenue.',
    category: 'AI Mastery',
    date: '2025-01-15',
    author: 'KenjiAI Team',
    readTime: '8 week course',
    tags: ['AI Mastery', 'Business Automation'],
    keywords: ['AI automation course', 'business automation'],
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Course Overview</h2><p class="text-gray-300">Detailed curriculum on building AI agents and scaling revenue.</p>`,
    level: 'Beginner to Advanced',
    duration: '8 weeks',
    lessons: 24,
    students: '15,247',
    rating: 4.9,
    instructor: 'Dr. Sarah Chen',
    isCourse: true
  },
  'voice-ai-sales-conversion-optimization': {
    slug: 'voice-ai-sales-conversion-optimization',
    title: 'Voice AI Sales Mastery: Close Deals 24/7',
    excerpt: 'Deploy AI voice agents that close $500K+ in deals while you sleep. Master conversation design and objection handling.',
    category: 'AI Sales',
    date: '2025-01-12',
    author: 'KenjiAI Team',
    readTime: '4 week course',
    tags: ['AI Sales', 'Voice AI'],
    keywords: ['voice AI course', 'sales automation'],
    image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Voice AI Strategy</h2><p class="text-gray-300">How to sound human and handle objections 24/7.</p>`,
    level: 'Intermediate',
    duration: '4 weeks',
    lessons: 16,
    students: '8,934',
    rating: 4.8,
    instructor: 'Marcus Johnson',
    isCourse: true
  },
  'tax-optimization-ai-strategies': {
    slug: 'tax-optimization-ai-strategies',
    title: 'AI-Powered Tax Optimization for Entrepreneurs',
    excerpt: 'Master tax strategies using AI tools to minimize liability and maximize deductions for business owners.',
    category: 'Tax Strategy',
    date: '2025-01-10',
    author: 'KenjiAI Team',
    readTime: '6 week course',
    tags: ['Tax Strategy', 'Wealth'],
    keywords: ['tax optimization', 'AI tax planning'],
    image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Tax Alpha</h2><p class="text-gray-300">Using AI to find missed deductions and optimize structure.</p>`,
    level: 'Intermediate',
    duration: '6 weeks',
    lessons: 18,
    students: '12,456',
    rating: 4.9,
    instructor: 'Jennifer Martinez, CPA',
    isCourse: true
  },
  'smart-investment-ai-analytics': {
    slug: 'smart-investment-ai-analytics',
    title: 'Smart Investment Strategies with AI Analytics',
    excerpt: 'Learn to use AI for investment analysis and risk management like a top-tier quant fund.',
    category: 'Investment AI',
    date: '2025-01-08',
    author: 'KenjiAI Team',
    readTime: '10 week course',
    tags: ['Investment', 'AI Analytics'],
    keywords: ['AI investment', 'portfolio optimization'],
    image: 'https://images.pexels.com/photos/6770609/pexels-photo-6770609.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Invest with Data</h2><p class="text-gray-300">AI-driven portfolio management and risk simulation.</p>`,
    level: 'Advanced',
    duration: '10 weeks',
    lessons: 30,
    students: '6,789',
    rating: 4.7,
    instructor: 'David Park, CFA',
    isCourse: true
  },
  'chatbot-customer-service-automation': {
    slug: 'chatbot-customer-service-automation',
    title: 'AI Customer Service Excellence',
    excerpt: 'Build intelligent chatbots that provide exceptional customer service while reducing costs by 70%.',
    category: 'AI Customer Service',
    date: '2025-01-08',
    author: 'KenjiAI Team',
    readTime: '3 week course',
    tags: ['Customer Service', 'Chatbots'],
    keywords: ['chatbot course', 'service automation'],
    image: 'https://images.pexels.com/photos/8439094/pexels-photo-8439094.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Auto-Service</h2><p class="text-gray-300">Conversation design for high-SAT chatbots.</p>`,
    level: 'Beginner',
    duration: '3 weeks',
    lessons: 12,
    students: '11,234',
    rating: 4.7,
    instructor: 'Lisa Thompson',
    isCourse: true
  },
  'retirement-planning-ai-optimization': {
    slug: 'retirement-planning-ai-optimization',
    title: 'AI-Optimized Retirement Planning',
    excerpt: 'Use AI to create personalized retirement strategies that maximize wealth accumulation.',
    category: 'Retirement Planning',
    date: '2025-01-05',
    author: 'KenjiAI Team',
    readTime: '5 week course',
    tags: ['Retirement', 'Wealth Management'],
    keywords: ['retirement planning', 'AI planning'],
    image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Financial Freedom</h2><p class="text-gray-300">Future simulations for wealth longevity.</p>`,
    level: 'Intermediate',
    duration: '5 weeks',
    lessons: 15,
    students: '9,567',
    rating: 4.8,
    instructor: 'Robert Chen, CFP',
    isCourse: true
  },
  'crm-automation-pipeline-optimization': {
    slug: 'crm-automation-pipeline-optimization',
    title: 'CRM Automation & Sales Pipeline Mastery',
    excerpt: 'Transform your CRM into a revenue-generating machine with AI-driven lead nurturing.',
    category: 'Sales AI',
    date: '2025-01-03',
    author: 'KenjiAI Team',
    readTime: '4 week course',
    tags: ['CRM', 'Pipeline'],
    keywords: ['CRM automation', 'sales pipeline'],
    image: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Pipeline Perfection</h2><p class="text-gray-300">Automating lead flow through the CRM.</p>`,
    level: 'Intermediate',
    duration: '4 weeks',
    lessons: 14,
    students: '7,892',
    rating: 4.6,
    instructor: 'Alex Rivera',
    isCourse: true
  },
  'cryptocurrency-ai-trading-strategies': {
    slug: 'cryptocurrency-ai-trading-strategies',
    title: 'AI-Powered Cryptocurrency Trading',
    excerpt: 'Master cryptocurrency trading using AI algorithms and predictive market analysis.',
    category: 'Crypto Trading',
    date: '2025-01-01',
    author: 'KenjiAI Team',
    readTime: '8 week course',
    tags: ['Crypto', 'Trading'],
    keywords: ['cryptocurrency course', 'AI trading'],
    image: 'https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Crypto Alpha</h2><p class="text-gray-300">24/7 market monitoring and automated trade execution.</p>`,
    level: 'Advanced',
    duration: '8 weeks',
    lessons: 24,
    students: '5,432',
    rating: 4.9,
    instructor: 'Elena Rodriguez',
    isCourse: true
  },
  'business-valuation-ai-analysis': {
    slug: 'business-valuation-ai-analysis',
    title: 'AI-Enhanced Business Valuation',
    excerpt: 'Learn to value businesses using AI-powered financial analysis and ML insights.',
    category: 'Business Finance',
    date: '2024-12-28',
    author: 'KenjiAI Team',
    readTime: '6 week course',
    tags: ['Finance', 'Valuation'],
    keywords: ['business valuation', 'financial analysis'],
    image: 'https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">True Value</h2><p class="text-gray-300">ML models for DCF and comparable analysis.</p>`,
    level: 'Advanced',
    duration: '6 weeks',
    lessons: 18,
    students: '4,123',
    rating: 4.5,
    instructor: 'Michael Foster, CFA',
    isCourse: true
  },

  // --- BLOG ARTICLES ---
  'automate-follow-ups-never-lose-lead': {
    slug: 'automate-follow-ups-never-lose-lead',
    title: 'How to Automate Follow-Ups So No Lead Falls Through the Cracks',
    excerpt: 'Most businesses lose 50% of their leads because nobody follows up fast enough. Here\'s how to fix that.',
    category: 'Lead Management',
    date: '2026-04-10',
    author: 'KenjiAI Team',
    readTime: '7 min read',
    tags: ['Lead Management', 'Automation'],
    keywords: ['automate follow ups', 'lead automation'],
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Speed to Lead</h2><p class="text-gray-300">Why the first 5 minutes are worth millions.</p>`
  },
  'ai-voice-agents-what-they-cost-are-they-worth-it': {
    slug: 'ai-voice-agents-what-they-cost-are-they-worth-it',
    title: 'AI Voice Agents: What They Are, What They Cost, and Whether They\'re Worth It',
    excerpt: 'AI voice agents can answer your phone, qualify leads, and book appointments 24/7. But are they actually good enough?',
    category: 'AI Voice',
    date: '2026-04-08',
    author: 'KenjiAI Team',
    readTime: '9 min read',
    tags: ['AI Voice', 'Technology'],
    keywords: ['AI voice agents', 'AI phone answering'],
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Voice Revolution</h2><p class="text-gray-300">Honest breakdown of costs and capabilities.</p>`
  },
  'signs-you-need-crm-losing-money': {
    slug: 'signs-you-need-crm-losing-money',
    title: '5 Signs You\'re Losing Money Without a CRM',
    excerpt: 'If you\'re still tracking leads in spreadsheets, sticky notes, or your head, you\'re leaving money on the table.',
    category: 'CRM',
    date: '2026-04-05',
    author: 'KenjiAI Team',
    readTime: '6 min read',
    tags: ['CRM', 'Business Ops'],
    keywords: ['do I need a CRM', 'CRM benefits'],
    image: 'https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">The Cost of Manual Tracking</h2><p class="text-gray-300">Warning signs your current system is failing.</p>`
  },
  'get-more-google-reviews-autopilot': {
    slug: 'get-more-google-reviews-autopilot',
    title: 'How to Get More Google Reviews on Autopilot',
    excerpt: 'Google reviews are the #1 factor in local search rankings. Here\'s how to get more of them automatically.',
    category: 'Reputation',
    date: '2026-04-01',
    author: 'KenjiAI Team',
    readTime: '5 min read',
    tags: ['Google Reviews', 'SEO'],
    keywords: ['get more reviews', 'reputation automation'],
    image: 'https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Reputation Engine</h2><p class="text-gray-300">How to automate the ask and filter feedback.</p>`
  },
  'what-marketing-automation-actually-does': {
    slug: 'what-marketing-automation-actually-does',
    title: 'What Does a Marketing Automation Platform Actually Do?',
    excerpt: 'Marketing automation sounds complicated but it\'s really not. Here\'s the plain-English breakdown.',
    category: 'Marketing',
    date: '2026-03-28',
    author: 'KenjiAI Team',
    readTime: '8 min read',
    tags: ['Marketing Automation', 'Email'],
    keywords: ['what is marketing automation', 'email automation'],
    image: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Automation Explained</h2><p class="text-gray-300">Sending the right message to the right person at the right time.</p>`
  },
  'ai-agents-the-next-10-trillion-dollar-market': {
    slug: 'ai-agents-the-next-10-trillion-dollar-market',
    title: 'Why AI Agents Are the Next $10 Trillion Market',
    excerpt: 'The transition from passice chatbots to autonomous agents is the biggest shift in technology since the internet.',
    category: 'Viral News',
    date: '2026-04-20',
    author: 'KenjiAI Research',
    readTime: '10 min read',
    tags: ['AI Agents', 'Future'],
    keywords: ['AI agents market', 'autonomous agents'],
    image: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Beyond the Chatbot</h2><p class="text-gray-300">How autonomous agents will rework the global economy.</p>`
  },
  'the-opensource-ai-model-destroying-big-techs-moat': {
    slug: 'the-opensource-ai-model-destroying-big-techs-moat',
    title: 'The Open-Source AI Model Destroying Big Tech\'s Moat',
    excerpt: 'While OpenAI and Google fight for dominance, a shift in open-source AI is making high-performance models free.',
    category: 'Viral News',
    date: '2026-04-18',
    author: 'KenjiAI Research',
    readTime: '8 min read',
    tags: ['Open Source', 'AI Strategy'],
    keywords: ['open source AI', 'Llama 4 impact'],
    image: 'https://images.pexels.com/photos/7688460/pexels-photo-7688460.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">No Moat Reality</h2><p class="text-gray-300">Why proprietary models are losing their edge.</p>`
  },
  'stop-scrolling-or-your-business-is-dead-ai-warning': {
    slug: 'stop-scrolling-or-your-business-is-dead-ai-warning',
    title: 'STOP SCROLLING OR YOUR BUSINESS IS DEAD: The AI Warning',
    excerpt: 'The "AI Gap" is real, and it\'s widening every day. Those who adapt now will thrive; those who wait will be obsolete.',
    category: 'Viral News',
    date: '2026-04-15',
    author: 'Peter Roth',
    readTime: '6 min read',
    tags: ['Business Survival', 'AI Adoption'],
    keywords: ['AI business survival', 'why AI is urgent'],
    image: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800',
    content: `<h2 class="text-2xl font-bold text-white mb-4">Adapt or Perish</h2><p class="text-gray-300">Why sticking to old workflows is financial suicide.</p>`
  }
};

export function getArticleBySlug(slug: string): Article | undefined {
  return articles[slug];
}

export function getAllArticles(): Article[] {
  return Object.values(articles).sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
