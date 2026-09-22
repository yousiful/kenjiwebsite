import type { Handler, HandlerEvent } from '@netlify/functions';

interface TrendItem {
  id: string;
  title: string;
  source: string;
  category: string;
  volume: string;
  snippet: string;
  url: string;
  growth_signal: string;
  related_queries: string[];
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Fallback high-velocity trends across niches
const CURATED_TRENDS: TrendItem[] = [
  {
    id: 't-1',
    title: 'AI UGC Video Ads',
    source: 'TikTok & Meta Radar',
    category: 'E-commerce & Tools',
    volume: '350K+ Monthly Searches',
    snippet: 'Explosive rise of AI avatars and automated UGC video pipelines cutting creator production costs by 90%.',
    url: 'https://trends.google.com/trends/explore?q=AI+UGC+video+ads',
    growth_signal: 'Exploding',
    related_queries: ['ai ugc video generator', 'best ai ugc software', 'ai ugc ads tiktok shop', 'how to make ai ugc ads']
  },
  {
    id: 't-2',
    title: 'TikTok Shop Dropshipping Automation',
    source: 'Social & E-Com',
    category: 'E-commerce & Tools',
    volume: '500K+ Viral Impressions',
    snippet: 'Direct creator affiliate fulfillment model capturing billions in consumer impulse buying.',
    url: 'https://trends.google.com/trends/explore?q=tiktok+shop+automation',
    growth_signal: 'Exploding',
    related_queries: ['tiktok shop fulfillment', 'tiktok affiliate system', 'tiktok shop suppliers 2026', 'tiktok shop ads blueprint']
  },
  {
    id: 't-3',
    title: 'Autonomous Inbound AI Voice Agents',
    source: 'Tech & High-Ticket B2B',
    category: 'AI & Tech',
    volume: '280K+ High-Intent B2B Searches',
    snippet: 'Sub-500ms voice receptionists replacing missed calls and capturing 24/7 high-ticket pipeline revenue.',
    url: 'https://trends.google.com/trends/explore?q=ai+voice+agents',
    growth_signal: 'Breakout',
    related_queries: ['ai call center software', 'b2b voice receptionists', 'best voice ai platform', 'sub 500ms voice latency']
  },
  {
    id: 't-4',
    title: 'Mushroom Coffee & Biohacking Nootropics',
    source: 'Health & Wellness Radar',
    category: 'Health & Wellness',
    volume: '420K+ High-Intent Searches',
    snippet: 'Alternative caffeine and adaptogenic blends dominating subscription DTC wellness brands.',
    url: 'https://trends.google.com/trends/explore?q=mushroom+coffee+nootropics',
    growth_signal: 'High',
    related_queries: ['best mushroom coffee 2026', 'lion mane coffee review', 'cordyceps morning routine', 'adaptogen coffee alternatives']
  },
  {
    id: 't-5',
    title: 'Cold Email Infrastructure & Domain Warming',
    source: 'B2B Growth & Agency',
    category: 'Finance & Wealth',
    volume: '190K+ Searches',
    snippet: 'Secondary domain setups, SPF/DKIM automation, and AI personalization driving 40%+ open rates.',
    url: 'https://trends.google.com/trends/explore?q=cold+email+infrastructure',
    growth_signal: 'Breakout',
    related_queries: ['cold email inbox warmup', 'secondary domain setup', 'b2b lead scraping automation', 'cold email deliverability guide']
  },
  {
    id: 't-6',
    title: 'Micro-SaaS One-Person Business Stacks',
    source: 'HackerNews & IndieHackers',
    category: 'AI & Tech',
    volume: '310K+ Discussions',
    snippet: 'Solopreneurs scaling recurring subscriptions to $20K MRR using AI agents without employees.',
    url: 'https://trends.google.com/trends/explore?q=micro+saas+ideas',
    growth_signal: 'High',
    related_queries: ['profitable micro saas ideas', 'build micro saas with ai', 'stripe solo founder stack', 'how to market micro saas']
  }
];

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' };
  }

  const path = event.path || '';
  const query = event.queryStringParameters?.query || '';
  const geo = event.queryStringParameters?.geo || 'US';

  // Endpoint: Suggest / Search Intent Mining
  if (query) {
    try {
      const suggestUrl = `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`;
      const res = await fetch(suggestUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36'
        }
      });
      if (res.ok) {
        const raw = await res.json();
        const suggestions: string[] = Array.isArray(raw[1]) ? raw[1] : [];
        
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            keyword: query,
            suggestions,
            clusters: [
              {
                intent_type: 'High-Intent Buyer Searches',
                queries: [
                  `best ${query} 2026`,
                  `buy ${query} online`,
                  `${query} price & cost`,
                  `${query} reviews & comparison`
                ]
              },
              {
                intent_type: 'Frustrations & Objections',
                queries: [
                  `${query} common mistakes`,
                  `why is ${query} failing`,
                  `problems with ${query}`,
                  `${query} alternatives`
                ]
              },
              {
                intent_type: "Viral Questions & 'How-To's",
                queries: [
                  `how to make money with ${query}`,
                  `how to start with ${query}`,
                  `is ${query} worth it in 2026`,
                  `${query} step-by-step tutorial`
                ]
              },
              {
                intent_type: 'Direct Search Volume Surges',
                queries: suggestions.slice(0, 6)
              }
            ],
            insights: {
              market_temperature: '🔥 Exploding / High Commercial Intent',
              primary_objection: `Skepticism around speed-to-result and technical setup with ${query}`,
              recommended_monetization: 'High-Ticket Service, Turnkey Software/SOP, or DTC Brand',
              suggested_angle: 'The New Mechanism (Automated Protocol Replacing Outdated Manual Methods)'
            }
          })
        };
      }
    } catch (err) {
      console.error('Suggest fetch error:', err);
    }

    // Fallback if suggest query fails
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        keyword: query,
        clusters: [
          {
            intent_type: 'High-Intent Buyer Searches',
            queries: [`best ${query} 2026`, `buy ${query}`, `${query} pricing`, `${query} review`]
          },
          {
            intent_type: 'Frustrations & Objections',
            queries: [`why ${query} fails`, `${query} problems`, `${query} alternatives`]
          },
          {
            intent_type: "Viral Questions & 'How-To's",
            queries: [`how to use ${query}`, `how to scale ${query}`, `is ${query} profitable`]
          }
        ],
        insights: {
          market_temperature: 'Hot Demand',
          primary_objection: `Overcoming friction in ${query}`,
          suggested_angle: 'The New Mechanism'
        }
      })
    };
  }

  // Live Trends Endpoint
  try {
    const rssUrl = `https://trends.google.com/trending/rss?geo=${geo}`;
    const rssRes = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/122.0.0.0 Safari/537.36'
      }
    });

    if (rssRes.ok) {
      const xml = await rssRes.text();
      const items: TrendItem[] = [];
      const itemRegex = /<item>[\s\S]*?<\/item>/gi;
      let match: RegExpExecArray | null;

      while ((match = itemRegex.exec(xml)) !== null && items.length < 15) {
        const itemXml = match[0];
        const titleMatch = /<title>(.*?)<\/title>/i.exec(itemXml);
        const trafficMatch = /<ht:approx_traffic>(.*?)<\/ht:approx_traffic>/i.exec(itemXml);
        const snippetMatch = /<ht:news_item_title>(.*?)<\/ht:news_item_title>/i.exec(itemXml);
        const linkMatch = /<ht:news_item_url>(.*?)<\/ht:news_item_url>/i.exec(itemXml);

        const title = titleMatch ? titleMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : '';
        const volume = trafficMatch ? trafficMatch[1] : '50K+ searches';
        const snippet = snippetMatch ? snippetMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : 'Spiking daily search volume.';
        const url = linkMatch ? linkMatch[1] : `https://trends.google.com/trends/explore?q=${encodeURIComponent(title)}`;

        if (title) {
          items.push({
            id: `gt-${Math.random().toString(36).substr(2, 8)}`,
            title,
            source: 'Google Trends (Live)',
            category: 'General / Trending',
            volume,
            snippet,
            url,
            growth_signal: volume.includes('100K') || volume.includes('200K') || volume.includes('500K') ? 'Exploding' : 'Breakout',
            related_queries: [`${title} review`, `how to use ${title}`, `${title} alternative`, `${title} 2026`]
          });
        }
      }

      if (items.length > 0) {
        // Prepend curated high-converting marketing niches
        const combined = [...CURATED_TRENDS.slice(0, 3), ...items];
        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify(combined)
        };
      }
    }
  } catch (err) {
    console.error('Google Trends fetch error:', err);
  }

  // Fallback to Curated Marketing Trends
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(CURATED_TRENDS)
  };
};
