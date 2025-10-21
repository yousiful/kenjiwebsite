export interface InternalLink {
  url: string;
  anchorText: string;
  title?: string;
  context: string;
}

export interface PageLinks {
  page: string;
  relatedLinks: InternalLink[];
}

export const internalLinkingConfig: Record<string, PageLinks> = {
  '/': {
    page: 'Homepage',
    relatedLinks: [
      {
        url: '/ai-automation',
        anchorText: 'AI automation platform',
        title: 'Complete AI business automation solution',
        context: 'main-feature'
      },
      {
        url: '/voice-agents',
        anchorText: '24/7 AI voice agents',
        title: 'AI voice agents that close deals automatically',
        context: 'main-feature'
      },
      {
        url: '/crm',
        anchorText: 'intelligent CRM',
        title: 'AI-powered CRM and sales automation',
        context: 'platform-feature'
      },
      {
        url: '/marketing-automation',
        anchorText: 'marketing automation',
        title: 'Automated marketing campaigns and workflows',
        context: 'platform-feature'
      },
      {
        url: '/free-tools',
        anchorText: 'free AI tools',
        title: 'No-cost AI tools for business growth',
        context: 'lead-magnet'
      },
      {
        url: '/pricing',
        anchorText: 'explore pricing plans',
        title: 'View AI platform pricing and features',
        context: 'conversion'
      },
      {
        url: '/knowledge',
        anchorText: 'knowledge base',
        title: 'Learn about AI automation and best practices',
        context: 'education'
      }
    ]
  },

  '/ai-automation': {
    page: 'AI Automation',
    relatedLinks: [
      {
        url: '/voice-agents',
        anchorText: 'AI voice agents',
        title: 'Automate customer calls with voice AI',
        context: 'related-solution'
      },
      {
        url: '/crm',
        anchorText: 'CRM automation',
        title: 'Intelligent customer relationship management',
        context: 'complementary-feature'
      },
      {
        url: '/marketing-automation',
        anchorText: 'automated marketing',
        title: 'AI-powered marketing campaigns',
        context: 'complementary-feature'
      },
      {
        url: '/free-tools',
        anchorText: 'free automation tools',
        title: 'Try free AI tools before upgrading',
        context: 'lead-magnet'
      },
      {
        url: '/pricing',
        anchorText: 'AI automation pricing',
        title: 'View complete automation platform pricing',
        context: 'conversion'
      },
      {
        url: '/knowledge',
        anchorText: 'automation best practices',
        title: 'Learn how to implement AI automation',
        context: 'education'
      }
    ]
  },

  '/voice-agents': {
    page: 'Voice Agents',
    relatedLinks: [
      {
        url: '/voice-ai',
        anchorText: 'Voice AI platform',
        title: 'Affordable voice AI starting at $10/month',
        context: 'alternative-offering'
      },
      {
        url: '/ai-automation',
        anchorText: 'full AI automation platform',
        title: 'Complete business automation solution',
        context: 'upsell'
      },
      {
        url: '/crm',
        anchorText: 'integrate with CRM',
        title: 'Connect voice agents with your CRM',
        context: 'integration'
      },
      {
        url: '/marketing-automation',
        anchorText: 'marketing workflows',
        title: 'Automate follow-up marketing campaigns',
        context: 'complementary'
      },
      {
        url: '/pricing',
        anchorText: 'voice agent pricing',
        title: 'See voice agent plans and features',
        context: 'conversion'
      }
    ]
  },

  '/voice-ai': {
    page: 'Voice AI',
    relatedLinks: [
      {
        url: '/voice-agents',
        anchorText: 'enterprise voice agents',
        title: 'Advanced voice agents for scaling businesses',
        context: 'upsell'
      },
      {
        url: '/ai-automation',
        anchorText: 'complete automation platform',
        title: 'Full AI business automation suite',
        context: 'upsell'
      },
      {
        url: '/free-tools',
        anchorText: 'free AI tools',
        title: 'Start with free tools',
        context: 'lead-magnet'
      },
      {
        url: '/pricing',
        anchorText: 'voice AI pricing',
        title: 'Affordable voice AI plans',
        context: 'conversion'
      }
    ]
  },

  '/crm': {
    page: 'CRM & Sales',
    relatedLinks: [
      {
        url: '/ai-automation',
        anchorText: 'AI automation features',
        title: 'Automate your entire sales process',
        context: 'related-solution'
      },
      {
        url: '/voice-agents',
        anchorText: 'voice agents for sales',
        title: 'AI voice agents that qualify and close leads',
        context: 'feature-enhancement'
      },
      {
        url: '/marketing-automation',
        anchorText: 'marketing automation',
        title: 'Nurture leads with automated campaigns',
        context: 'complementary'
      },
      {
        url: '/free-tools',
        anchorText: 'sales coach tool',
        title: 'Free AI sales coaching',
        context: 'lead-magnet'
      },
      {
        url: '/pricing',
        anchorText: 'CRM pricing',
        title: 'See CRM platform pricing',
        context: 'conversion'
      }
    ]
  },

  '/marketing-automation': {
    page: 'Marketing Automation',
    relatedLinks: [
      {
        url: '/ai-automation',
        anchorText: 'complete automation platform',
        title: 'Full AI business automation',
        context: 'related-solution'
      },
      {
        url: '/crm',
        anchorText: 'CRM integration',
        title: 'Connect marketing with sales CRM',
        context: 'integration'
      },
      {
        url: '/voice-agents',
        anchorText: 'voice agent follow-ups',
        title: 'Automate call follow-ups',
        context: 'feature-enhancement'
      },
      {
        url: '/free-tools',
        anchorText: 'ViralPost Pro',
        title: 'Free content creation tool',
        context: 'lead-magnet'
      },
      {
        url: '/pricing',
        anchorText: 'marketing automation pricing',
        title: 'View marketing platform pricing',
        context: 'conversion'
      }
    ]
  },

  '/free-tools': {
    page: 'Free Tools',
    relatedLinks: [
      {
        url: '/ai-automation',
        anchorText: 'upgrade to full platform',
        title: 'Get complete AI automation',
        context: 'upsell'
      },
      {
        url: '/voice-agents',
        anchorText: 'add voice automation',
        title: 'Automate calls with AI voice agents',
        context: 'upsell'
      },
      {
        url: '/pricing',
        anchorText: 'see premium features',
        title: 'View all paid platform features',
        context: 'conversion'
      },
      {
        url: '/knowledge',
        anchorText: 'learn AI best practices',
        title: 'Educational resources and guides',
        context: 'education'
      }
    ]
  },

  '/knowledge': {
    page: 'Knowledge Base',
    relatedLinks: [
      {
        url: '/ai-automation',
        anchorText: 'AI automation platform',
        title: 'Explore automation features',
        context: 'product-link'
      },
      {
        url: '/voice-agents',
        anchorText: 'voice AI technology',
        title: 'Learn about voice agents',
        context: 'product-link'
      },
      {
        url: '/free-tools',
        anchorText: 'try free tools',
        title: 'Practice with free AI tools',
        context: 'lead-magnet'
      },
      {
        url: '/pricing',
        anchorText: 'platform pricing',
        title: 'View plans and pricing',
        context: 'conversion'
      }
    ]
  },

  '/pricing': {
    page: 'Pricing',
    relatedLinks: [
      {
        url: '/ai-automation',
        anchorText: 'AI automation features',
        title: 'See what\'s included',
        context: 'feature-detail'
      },
      {
        url: '/voice-agents',
        anchorText: 'voice agent capabilities',
        title: 'Explore voice automation',
        context: 'feature-detail'
      },
      {
        url: '/free-tools',
        anchorText: 'start with free tools',
        title: 'Try before you buy',
        context: 'trial'
      },
      {
        url: '/knowledge',
        anchorText: 'learn more',
        title: 'Educational resources',
        context: 'support'
      }
    ]
  },

  '/investors': {
    page: 'Investors',
    relatedLinks: [
      {
        url: '/',
        anchorText: 'platform overview',
        title: 'See our AI automation platform',
        context: 'product-info'
      },
      {
        url: '/knowledge',
        anchorText: 'market research',
        title: 'Industry insights and analysis',
        context: 'research'
      }
    ]
  }
};

export const getRelatedLinks = (currentPath: string, maxLinks: number = 5): InternalLink[] => {
  const config = internalLinkingConfig[currentPath];
  if (!config) return [];

  return config.relatedLinks.slice(0, maxLinks);
};

export const getAnchorTextVariations = (url: string): string[] => {
  const variations: Record<string, string[]> = {
    '/ai-automation': [
      'AI automation platform',
      'business automation solution',
      'automated AI workflows',
      'explore AI automation features',
      'complete automation platform',
      'AI business automation'
    ],
    '/voice-agents': [
      'AI voice agents',
      'voice automation system',
      '24/7 voice AI',
      'automated voice agents',
      'intelligent voice agents',
      'voice agent platform'
    ],
    '/voice-ai': [
      'Voice AI platform',
      'affordable voice AI',
      'voice automation solution',
      'AI-powered voice system',
      'voice AI technology'
    ],
    '/crm': [
      'AI-powered CRM',
      'intelligent CRM platform',
      'CRM automation',
      'sales automation CRM',
      'customer relationship platform'
    ],
    '/marketing-automation': [
      'marketing automation platform',
      'AI marketing automation',
      'automated marketing campaigns',
      'marketing automation tools',
      'intelligent marketing system'
    ],
    '/free-tools': [
      'free AI tools',
      'complimentary AI tools',
      'no-cost AI resources',
      'free automation tools',
      'AI tools at no charge'
    ],
    '/pricing': [
      'view pricing plans',
      'AI platform pricing',
      'see our pricing',
      'explore pricing options',
      'platform pricing details'
    ],
    '/knowledge': [
      'knowledge base',
      'learning resources',
      'educational content',
      'AI automation guides',
      'help center'
    ]
  };

  return variations[url] || [];
};

export const getLinkContext = (fromPage: string, toPage: string): string => {
  const links = internalLinkingConfig[fromPage]?.relatedLinks || [];
  const link = links.find(l => l.url === toPage);
  return link?.context || 'general';
};

export const isStrongLink = (fromPage: string, toPage: string): boolean => {
  const strongContexts = ['main-feature', 'conversion', 'upsell', 'related-solution'];
  const context = getLinkContext(fromPage, toPage);
  return strongContexts.includes(context);
};

export const getRecommendedLinksForPage = (currentPage: string): InternalLink[] => {
  const config = internalLinkingConfig[currentPage];
  if (!config) return [];

  return config.relatedLinks.filter(link =>
    isStrongLink(currentPage, link.url)
  );
};
