import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Flame, 
  Compass, 
  Gift, 
  Target, 
  Sparkles, 
  FolderKanban, 
  Settings, 
  Zap, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  TrendingUp, 
  ArrowRight, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  ShoppingCart, 
  AlertCircle, 
  HelpCircle, 
  Video, 
  Eye, 
  Download, 
  Trash2, 
  Calendar,
  X,
  Key,
  Cpu,
  Globe
} from 'lucide-react';

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

interface OfferComponent {
  dream_outcome: string;
  perceived_likelihood: string;
  time_delay_reduction: string;
  effort_and_sacrifice_reduction: string;
  core_deliverables: string[];
  pricing_model: string;
  price_point: string;
  risk_reversal_guarantee: string;
  scarcity_urgency_triggers: string[];
  bonus_stack: string[];
}

interface GeneratedOffer {
  trend_keyword: string;
  target_audience: string;
  offer_name: string;
  tagline: string;
  framework: OfferComponent;
  action_steps: string[];
}

interface AdAngle {
  angle_type: string;
  headline: string;
  core_belief_to_shift: string;
  hook_concept: string;
  primary_text: string;
  call_to_action: string;
  best_platform: string;
}

interface ViralHook {
  category: string;
  hook_text: string;
  visual_cue: string;
  script_outline_30s: Record<string, string>;
  platforms: string[];
}

interface Campaign {
  id: string;
  title: string;
  trend_keyword: string;
  niche: string;
  created_at: string;
  offer?: GeneratedOffer;
  angles?: AdAngle[];
  hooks?: ViralHook[];
}

const QUICK_NICHES = [
  "AI UGC Video Ads",
  "TikTok Shop Dropshipping",
  "Autonomous Inbound AI Voice Agents",
  "Mushroom Coffee & Biohacking",
  "Cold Email Infrastructure",
  "Micro-SaaS Solopreneur Stacks"
];

export default function TrendPulsePage() {
  const [activeTab, setActiveTab] = useState<'radar' | 'explorer' | 'offers' | 'angles' | 'hooks' | 'campaigns'>('radar');
  const [currentTrend, setCurrentTrend] = useState('AI UGC Video Ads');
  const [currentNiche, setCurrentNiche] = useState('E-commerce & Tools');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [generatingOverlay, setGeneratingOverlay] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  // Settings State
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('trendpulse_settings');
      return saved ? JSON.parse(saved) : { geo: 'US', geminiKey: '', useAi: false };
    } catch {
      return { geo: 'US', geminiKey: '', useAi: false };
    }
  });

  // Campaigns State
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    try {
      const saved = localStorage.getItem('trendpulse_campaigns');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('trendpulse_campaigns', JSON.stringify(campaigns));
    } catch (e) {
      console.error(e);
    }
  }, [campaigns]);

  // Live Trends State
  const [trends, setTrends] = useState<TrendItem[]>([]);
  const [trendsLoading, setTrendsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [trendSearch, setTrendSearch] = useState('');

  // Explorer State
  const [explorerQuery, setExplorerQuery] = useState(currentTrend);
  const [explorerData, setExplorerData] = useState<any>(null);
  const [explorerLoading, setExplorerLoading] = useState(false);

  // Offer State
  const [offerKeyword, setOfferKeyword] = useState(currentTrend);
  const [offerNiche, setOfferNiche] = useState(currentNiche);
  const [offerAudience, setOfferAudience] = useState('');
  const [offerData, setOfferData] = useState<GeneratedOffer | null>(null);
  const [offerCopied, setOfferCopied] = useState(false);

  // Angles State
  const [anglesKeyword, setAnglesKeyword] = useState(currentTrend);
  const [anglesData, setAnglesData] = useState<AdAngle[] | null>(null);
  const [copiedAngleIdx, setCopiedAngleIdx] = useState<number | null>(null);

  // Hooks State
  const [hooksKeyword, setHooksKeyword] = useState(currentTrend);
  const [hooksData, setHooksData] = useState<ViralHook[] | null>(null);
  const [copiedHookIdx, setCopiedHookIdx] = useState<number | null>(null);

  // Fetch Live Trends via Netlify Function or Client Fallback
  const fetchTrends = async () => {
    setTrendsLoading(true);
    try {
      const res = await fetch(`/.netlify/functions/trendpulse?geo=${settings.geo}`);
      if (res.ok) {
        const data = await res.json();
        setTrends(data);
      } else {
        throw new Error('Fallback to static trends');
      }
    } catch {
      // Fallback
      setTrends([
        {
          id: 't-1',
          title: 'AI UGC Video Ads',
          source: 'TikTok & Meta Radar',
          category: 'E-commerce & Tools',
          volume: '350K+ Monthly Searches',
          snippet: 'Automated video generation with AI avatars cutting creator ad production costs by 90%.',
          url: 'https://trends.google.com/trends/explore?q=AI+UGC+video+ads',
          growth_signal: 'Exploding',
          related_queries: ['ai ugc video generator', 'best ai ugc software', 'ai ugc ads blueprint']
        },
        {
          id: 't-2',
          title: 'TikTok Shop Dropshipping Automation',
          source: 'Social & E-Com',
          category: 'E-commerce & Tools',
          volume: '500K+ Viral Impressions',
          snippet: 'Creator affiliate dropshipping model driving billions in consumer impulsive checkout revenue.',
          url: 'https://trends.google.com/trends/explore?q=tiktok+shop+automation',
          growth_signal: 'Exploding',
          related_queries: ['tiktok shop fulfillment', 'tiktok affiliate system', 'tiktok shop suppliers 2026']
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
          related_queries: ['ai call center software', 'b2b voice receptionists', 'best voice ai platform']
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
          related_queries: ['best mushroom coffee 2026', 'lion mane coffee review', 'adaptogen coffee']
        }
      ]);
    } finally {
      setTrendsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, [settings.geo]);

  // Marketing Synthesis Functions
  const generateOfferInternal = (term: string, nicheInput: string = "General", audienceInput: string = ""): GeneratedOffer => {
    const cleanTerm = term.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const target = audienceInput || (
      nicheInput.toLowerCase().includes('e-com') ? "E-commerce Founders, Dropshippers & DTC Brand Owners" :
      nicheInput.toLowerCase().includes('ai') || nicheInput.toLowerCase().includes('tech') ? "High-Growth Agencies, Solopreneurs & Tech Operators" :
      "Action-Oriented Operators & Business Owners Capitalizing on Market Arbitrage"
    );

    return {
      trend_keyword: cleanTerm,
      target_audience: target,
      offer_name: `The 30-Day ${cleanTerm} Sprint: Zero-To-Scale Acquisition Blueprint`,
      tagline: `The Turnkey System to Weaponize ${cleanTerm} for Predictable Revenue Without Burnout, Massive Ad Spend, or Guesswork.`,
      framework: {
        dream_outcome: `Achieve category dominance and capture high-margin revenue directly from the surging market demand in ${cleanTerm}.`,
        perceived_likelihood: `Overcome skepticism with a battle-tested protocol, step-by-step SOPs, pre-built asset templates, and 1-on-1 private audit checkpoints.`,
        time_delay_reduction: `Get the entire system deployed and generating initial customer momentum within the first 7 to 14 days, cutting traditional ramp-up time by 80%.`,
        effort_and_sacrifice_reduction: `Eliminates the need for technical coding, tedious trial-and-error, or hiring expensive agencies. Everything is packaged in drag-and-drop templates.`,
        core_deliverables: [
          `The Core ${cleanTerm} Implementation Vault: 12 battle-tested modules and tactical execution playbooks.`,
          `Plug-and-Play Swipe Files & Funnel Templates: Copy-paste conversion assets ready for immediate launch.`,
          `Weekly War-Room Coaching & Creative Audits: Direct teardown of your angles, creatives, and unit economics.`,
          `Private VIP Slack/Discord Channel: Real-time technical support and peer collaboration.`
        ],
        pricing_model: "Tiered High-Ticket ($997 Fast-Track / $2,497 Full Implementation VIP with Done-With-You Support)",
        price_point: "$1,497 (or 3 payments of $597)",
        risk_reversal_guarantee: `The 100% 'Results Or It's Free' Guarantee: Deploy the protocol for 30 days. If you don't achieve a measurable 3x ROI or acquire your first 5 profitable clients/sales using ${cleanTerm}, we will refund 100% of your investment and let you keep all assets.`,
        scarcity_urgency_triggers: [
          "Strictly capped at 25 participants per cohort to maintain 1-on-1 audit quality.",
          `First 10 applicants unlock the exclusive '${cleanTerm} 0-to-100K Virality Playbook' for free.`,
          "Enrollment locks at midnight Sunday or when seats fill."
        ],
        bonus_stack: [
          `Bonus 1: The '${cleanTerm} Ad Angles Swipe File' (Value: $497) - 30 plug-and-play ad hooks with proven click-through records.`,
          `Bonus 2: The 'Zero-Friction Conversion Funnel' (Value: $997) - High-converting landing page structure tested at scale.`,
          `Bonus 3: 'Automated Retention & Retargeting Matrix' (Value: $697) - 5-part email sequence to double lifetime customer value.`,
          `Bonus 4: '1-on-1 Creative Angle Audit Session' (Value: $500) - Direct teardown of your first live campaign.`
        ]
      },
      action_steps: [
        `1. Audience Validation: Verify that ${target} are actively asking questions revealed in trend spikes.`,
        `2. Pre-Sell Angle: Launch a pilot teaser using the Contrarian / New Mechanism angle to collect pre-orders.`,
        `3. Fulfillment Stack: Assemble core deliverables into a clean portal (Notion or Skool).`,
        `4. Scale Trajectory: Funnel organic TikTok/Reels traffic and Meta paid ads into the guarantee offer.`
      ]
    };
  };

  const generateAnglesInternal = (term: string, nicheInput: string = "General"): AdAngle[] => {
    const cleanTerm = term.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return [
      {
        angle_type: "The New Mechanism (Schwartz Stage 3: Solution Aware)",
        headline: `Why 90% of Traditional Methods Fail (And The Emerging '${cleanTerm}' Protocol Replacing Them)`,
        core_belief_to_shift: "It's not that you weren't trying hard enough; the old vehicle was structurally broken. The new mechanism fixes the bottleneck.",
        hook_concept: "Side-by-side comparison showing the frustrating Old Way (time-consuming, expensive) vs. the Modern Mechanism powered by this trend.",
        primary_text: `Most people think they need to grind 14 hours a day or blow thousands on outdated playbooks to get ahead. But there's a reason early adopters are crushing it with ${cleanTerm} right now.\n\nWhile others are stuck doing things manually, this protocol automates the friction and unlocks asymmetric leverage. Here is the exact breakdown of how it works and how to install it in under 48 hours...`,
        call_to_action: "Get The Free Breakdown",
        best_platform: "Meta / Facebook & LinkedIn"
      },
      {
        angle_type: "Us vs. Them / The Industry Villain",
        headline: `What 'Gurus' And Legacy Providers Won't Tell You About ${cleanTerm}`,
        core_belief_to_shift: "The established industry profits off your confusion and keeps you paying monthly retainers instead of giving you the keys.",
        hook_concept: "Call out gatekeepers and expensive middlemen: 'They charged you $5,000 for this. Here's how to do it in 20 minutes for $0.'",
        primary_text: `The gatekeepers are terrified of this trend. For years, agencies charged enterprise retainers just to gatekeep ${cleanTerm}.\n\nToday, the playbook leaked. You don't need a massive team or complicated software stacks. You just need this 3-step operational blueprint. Click below to see the proof before this gets taken down.`,
        call_to_action: "See The Proof",
        best_platform: "YouTube & Meta"
      },
      {
        angle_type: "Contrarian / Mythbuster (Schwartz Stage 2: Problem Aware)",
        headline: `Stop Doing [Common Practice]. Why It's Silently Killing Your Growth in 2026`,
        core_belief_to_shift: "The standard advice everyone repeats on social media is actually the #1 reason you are hitting a plateau.",
        hook_concept: "Cut to camera shaking head: 'If you're still relying on [standard tactic], stop scrolling. You're bleeding cash.'",
        primary_text: `Every single day, I see creators and founders make the exact same mistake with ${cleanTerm}.\n\nThey copy what worked in 2023, burn their budget, and wonder why conversions are flatlining. In this short masterclass, I reveal the 3 myths everyone believes—and the contrarian framework that generates 4x the output with half the effort.`,
        call_to_action: "Watch The Masterclass",
        best_platform: "TikTok / Reels / Shorts"
      },
      {
        angle_type: "Pain-Agitate-Solution (Emotional Direct-Response)",
        headline: `Tired of Wasting Hours on ${cleanTerm} Without Real Results? Read This.`,
        core_belief_to_shift: "Your frustration is valid, but staying stuck is optional when there is a proven roadmap.",
        hook_concept: "A relatable opening detailing late-night burnout, open tabs, confusion, and zero traction.",
        primary_text: `Nothing is more exhausting than pouring your heart and time into ${cleanTerm}, only to hear crickets.\n\nYou watch others make it look effortless, while you're drowning in overwhelm. We built this system specifically for people who are done with theory and want a reliable, turnkey process that delivers results in days, not months. Here is what happens when you plug it in...`,
        call_to_action: "Claim Your Roadmap",
        best_platform: "Meta & Instagram"
      },
      {
        angle_type: "Aspirational Identity & Status Shift",
        headline: `The Shift From Stressed Operator to High-Leverage Modern Leader`,
        core_belief_to_shift: `Adopting ${cleanTerm} is not just an efficiency hack; it signals that you operate at the top 1% standard of the modern economy.`,
        hook_concept: "High-aesthetic B-roll of seamless workflow and rapid results, contrasting chaos with calm control.",
        primary_text: `There are two types of entrepreneurs right now: those getting left behind by rapid market shifts, and those who mastered ${cleanTerm} to build effortless leverage.\n\nWhich side do you want to be on 6 months from now? Discover the exact system the fastest-growing players are using to dominate their category.`,
        call_to_action: "Join The Top 1%",
        best_platform: "LinkedIn & Twitter / X"
      },
      {
        angle_type: "Urgency / First-Mover Arbitrage Window",
        headline: `The Window on ${cleanTerm} Is Wide Open—For Now.`,
        core_belief_to_shift: "Trends have an arbitrage period where attention is cheap and conversions are high. Delaying means paying 10x more later.",
        hook_concept: `Countdown clock or trend line hockey stick graphic: 'Right now we are in the golden window for ${cleanTerm}.'`,
        primary_text: `Every massive market shift has a 6-to-12 month golden window where early movers capture 80% of the upside. Right now, ${cleanTerm} is experiencing that exact breakout phase.\n\nIn 12 months, this will be saturated. If you want to position yourself at the forefront before ad costs double, grab our complete launch checklist today.`,
        call_to_action: "Lock In Early Advantage",
        best_platform: "TikTok / Reels & Meta"
      }
    ];
  };

  const generateHooksInternal = (term: string): ViralHook[] => {
    const cleanTerm = term.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    return [
      {
        category: "Pattern Interrupt (High Retention)",
        hook_text: `Wait, don't buy anything for ${cleanTerm} until you watch this 20-second test.`,
        visual_cue: "Holding an object towards the lens, then tossing it over shoulder or tapping the camera with a snap sound.",
        script_outline_30s: {
          "0-3s (Hook)": `Wait! If you're planning on using ${cleanTerm}, pause for 10 seconds.`,
          "3-10s (Agitation)": "Most people burn their entire budget on tools they don't need.",
          "10-23s (Value)": "Here is the secret workflow: step 1, strip the bloat; step 2, connect the automated feed; step 3, watch the conversions roll in.",
          "23-30s (CTA)": "Comment 'PROTOCOL' below and I'll DM you the free template."
        },
        platforms: ["TikTok", "Instagram Reels", "YouTube Shorts"]
      },
      {
        category: "Negative / Warning Hook",
        hook_text: `The biggest mistake 99% of beginners make with ${cleanTerm} (and how to avoid it).`,
        visual_cue: "Screen recording showing an error screen or red warning box, text banner flashing 'DO NOT DO THIS'.",
        script_outline_30s: {
          "0-3s (Hook)": `Whatever you do, do NOT set up ${cleanTerm} like this.`,
          "3-10s (Agitation)": "Doing this destroys your conversion rate and gets your ad account flagged.",
          "10-23s (Value)": "Instead, make this one 2-minute tweak in your backend settings...",
          "23-30s (CTA)": "Save this video so you don't lose the setting later."
        },
        platforms: ["TikTok", "Reels", "Meta Feed"]
      },
      {
        category: "Curiosity Gap / Secret Mechanism",
        hook_text: `I audited 50 top brands in ${cleanTerm}, and every single one had this exact hidden asset.`,
        visual_cue: "Showing a blurred spreadsheet / dashboard with a magnifying glass pointing to 1 highlighted column.",
        script_outline_30s: {
          "0-3s (Hook)": `I spent 40 hours analyzing how top 1% brands exploit ${cleanTerm}.`,
          "3-10s (Agitation)": "They aren't smarter than you, they just use this unfair conversion lever.",
          "10-23s (Value)": "Here is the exact framework they use to turn cold traffic into buyers...",
          "23-30s (CTA)": "Check the link in bio to copy the exact spreadsheet."
        },
        platforms: ["TikTok", "YouTube Shorts", "Twitter / X"]
      },
      {
        category: "Data Shock / Authority Hook",
        hook_text: `Google just reported a 400% surge in ${cleanTerm}. Here is what happens next.`,
        visual_cue: "Showing a real Google Trends graph pointing to the breakout spike, wearing glasses / looking authoritative.",
        script_outline_30s: {
          "0-3s (Hook)": `Look at this chart. ${cleanTerm} is having its biggest breakout in 5 years.`,
          "3-10s (Agitation)": "When a curve spikes like this, fortunes are made in the first 90 days.",
          "10-23s (Value)": "Here are the 3 business models you can launch this weekend to monetize this wave.",
          "23-30s (CTA)": "Follow for daily trend alerts and drop your questions below."
        },
        platforms: ["TikTok", "Reels", "LinkedIn Video"]
      },
      {
        category: "POV / Extreme Relatability",
        hook_text: `POV: You finally stopped guessing and found the exact shortcut for ${cleanTerm}.`,
        visual_cue: "Smiling in front of a laptop with green notifications pinging, relaxed posture, soothing background beat.",
        script_outline_30s: {
          "0-3s (Hook)": `POV: You realized you don't need a massive team to win with ${cleanTerm}.`,
          "3-10s (Agitation)": "Remember when you used to spend 5 hours doing this manually?",
          "10-23s (Value)": "Now you just run this 1 system and let the automated funnel do the heavy lifting.",
          "23-30s (CTA)": "Tap my profile link to grab the turnkey blueprint right now."
        },
        platforms: ["Instagram Reels", "TikTok"]
      },
      {
        category: "'Stop Doing X' Pattern",
        hook_text: `Stop paying agencies $3,000/mo for ${cleanTerm}. Do this instead.`,
        visual_cue: "Tearing a mock invoice or clicking 'Cancel Subscription' on a mock checkout screen.",
        script_outline_30s: {
          "0-3s (Hook)": `If an agency is charging you thousands for ${cleanTerm}, fire them.`,
          "3-10s (Agitation)": "They are literally using free tools and white-labeling templates.",
          "10-23s (Value)": "Here is the exact software stack and 3 prompts you need to do it yourself in 15 minutes.",
          "23-30s (CTA)": "DM me 'STACK' and I'll send you the exact tools list."
        },
        platforms: ["TikTok", "Meta Feed", "Twitter / X"]
      }
    ];
  };

  // 1-Click Turn Trend Into Full Campaign
  const handleLaunchFullCampaign = (term: string, nicheInput: string = "General") => {
    setCurrentTrend(term);
    setCurrentNiche(nicheInput);
    setGeneratingOverlay(true);

    setTimeout(() => {
      const offer = generateOfferInternal(term, nicheInput);
      const angles = generateAnglesInternal(term, nicheInput);
      const hooks = generateHooksInternal(term);

      const newCampaign: Campaign = {
        id: `camp-${Date.now()}`,
        title: `${term} Growth Blitz`,
        trend_keyword: term,
        niche: nicheInput,
        created_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        offer,
        angles,
        hooks
      };

      setOfferData(offer);
      setAnglesData(angles);
      setHooksData(hooks);
      setCampaigns(prev => [newCampaign, ...prev.filter(c => c.trend_keyword !== term)]);
      setGeneratingOverlay(false);

      setToastMessage({
        title: `Campaign Created: "${term}"`,
        subtitle: `Engineered $100M Offer, 6 Ad Angles & 6 Viral Hooks. Saved to Vault.`
      });

      setActiveTab('offers');

      setTimeout(() => setToastMessage(null), 5000);
    }, 400);
  };

  // Mine Search Intent
  const handleExploreSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!explorerQuery.trim()) return;

    setExplorerLoading(true);
    try {
      const res = await fetch(`/.netlify/functions/trendpulse?query=${encodeURIComponent(explorerQuery.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setExplorerData(data);
      } else {
        throw new Error('Fallback to client intent');
      }
    } catch {
      setExplorerData({
        keyword: explorerQuery,
        clusters: [
          {
            intent_type: 'High-Intent Buyer Searches',
            queries: [
              `best ${explorerQuery} 2026`,
              `buy ${explorerQuery} online`,
              `${explorerQuery} pricing & cost`,
              `${explorerQuery} reviews & comparison`
            ]
          },
          {
            intent_type: 'Frustrations & Objections',
            queries: [
              `${explorerQuery} common mistakes`,
              `why is ${explorerQuery} failing`,
              `problems with ${explorerQuery}`,
              `${explorerQuery} alternatives`
            ]
          },
          {
            intent_type: "Viral Questions & 'How-To's",
            queries: [
              `how to make money with ${explorerQuery}`,
              `how to start with ${explorerQuery}`,
              `is ${explorerQuery} worth it in 2026`,
              `${explorerQuery} step-by-step tutorial`
            ]
          }
        ],
        insights: {
          market_temperature: '🔥 Exploding / High Commercial Intent',
          primary_objection: `Confusion and execution friction with ${explorerQuery}`,
          recommended_monetization: 'High-Ticket Sprint, Turnkey System, or DTC Brand',
          suggested_angle: 'The New Mechanism (Automation / Turnkey Protocol)'
        }
      });
    } finally {
      setExplorerLoading(false);
    }
  };

  // Export Markdown Brief
  const handleDownloadMarkdown = (camp: Campaign) => {
    const md: string[] = [
      `# 🚀 CAMPAIGN BRIEF: ${camp.title}`,
      `**Target Trend**: ${camp.trend_keyword} | **Niche**: ${camp.niche} | **Generated**: ${camp.created_at}`,
      `\n---\n`
    ];

    if (camp.offer) {
      md.push(`## 🏆 $100M GRAND SLAM OFFER: ${camp.offer.offer_name}`);
      md.push(`> *${camp.offer.tagline}*`);
      md.push(`- **Target Avatar**: ${camp.offer.target_audience}`);
      md.push(`- **Dream Outcome**: ${camp.offer.framework.dream_outcome}`);
      md.push(`- **Speed/Time Delay**: ${camp.offer.framework.time_delay_reduction}`);
      md.push(`- **Effort Reduction**: ${camp.offer.framework.effort_and_sacrifice_reduction}`);
      md.push(`- **Price Point**: ${camp.offer.framework.price_point} (${camp.offer.framework.pricing_model})`);
      md.push(`- **Risk-Reversal Guarantee**: ${camp.offer.framework.risk_reversal_guarantee}`);
      md.push(`\n### Core Deliverables:`);
      camp.offer.framework.core_deliverables.forEach(d => md.push(`- [x] ${d}`));
      md.push(`\n### Bonus Stack:`);
      camp.offer.framework.bonus_stack.forEach(b => md.push(`- 🎁 ${b}`));
      md.push(`\n### Scarcity Triggers:`);
      camp.offer.framework.scarcity_urgency_triggers.forEach(s => md.push(`- ⏳ ${s}`));
      md.push(`\n`);
    }

    if (camp.angles) {
      md.push(`## 🎯 PSYCHOLOGICAL AD ANGLES MATRIX`);
      camp.angles.forEach((a, i) => {
        md.push(`### Angle ${i + 1}: ${a.angle_type}`);
        md.push(`**Headline**: ${a.headline}`);
        md.push(`**Belief Shift**: ${a.core_belief_to_shift}`);
        md.push(`**Hook Concept**: ${a.hook_concept}`);
        md.push(`**Platform**: ${a.best_platform} | **CTA**: ${a.call_to_action}`);
        md.push(`\n\`\`\`text\n${a.primary_text}\n\`\`\`\n`);
      });
    }

    if (camp.hooks) {
      md.push(`## ⚡ VIRAL HOOK VAULT & 30-SECOND SCRIPTS`);
      camp.hooks.forEach((h, i) => {
        md.push(`### Hook ${i + 1} [${h.category}]`);
        md.push(`**Spoken**: "${h.hook_text}"`);
        md.push(`**Visual Pattern Interrupt**: ${h.visual_cue}`);
        md.push(`**30-Second UGC Outline**:`);
        Object.entries(h.script_outline_30s).forEach(([t, s]) => md.push(`- **${t}**: ${s}`));
        md.push(`\n`);
      });
    }

    const blob = new Blob([md.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campaign-${camp.trend_keyword.toLowerCase().replace(/\s+/g, '-')}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const navItems = [
    { id: 'radar', label: 'Live Trend Radar', icon: Flame },
    { id: 'explorer', label: 'Search Intent Miner', icon: Compass },
    { id: 'offers', label: '$100M Offer Architect', icon: Gift },
    { id: 'angles', label: 'Ad Angle Matrix', icon: Target },
    { id: 'hooks', label: 'Viral Hook Vault', icon: Sparkles },
    { id: 'campaigns', label: 'Campaign Vault', icon: FolderKanban, badge: campaigns.length }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 selection:bg-indigo-500 selection:text-white pb-20">
      <Helmet>
        <title>TrendPulse &amp; AdForge | Winning Trends, $100M Offers &amp; Viral Hooks | KenjiAI</title>
        <meta name="title" content="TrendPulse & AdForge | Winning Trends, $100M Offers & Viral Hooks | KenjiAI" />
        <meta name="description" content="Discover real-time breakout market trends, architect $100M Grand Slam Offers, formulate 6 psychological direct-response ad angles, and generate viral UGC video hooks." />
        <link rel="canonical" href="https://kenjiai.com/trendpulse" />
        <meta property="og:title" content="TrendPulse & AdForge | Winning Trends & Hooks" />
        <meta property="og:description" content="Reverse-engineer real-time search trends into high-converting offers, ad angles, and hooks." />
        <meta property="og:url" content="https://kenjiai.com/trendpulse" />
      </Helmet>

      {/* Header Bar */}
      <div className="sticky top-0 z-40 bg-[#0B0F17]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('radar')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 ring-1 ring-white/20">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold tracking-tight text-white">TrendPulse</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                    by KenjiAI
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Winning Trends, Offers &amp; Viral Ad Angles</p>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as any)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 bg-purple-500/30 text-purple-200 text-[10px] rounded-full border border-purple-500/40">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Settings button */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition border border-transparent hover:border-slate-700"
                title="Settings & Feeds"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden flex overflow-x-auto py-2 space-x-1 scrollbar-none border-t border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap ${
                    isActive ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40' : 'text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* TAB 1: LIVE TREND RADAR */}
        {activeTab === 'radar' && (
          <div className="space-y-6">
            {/* Hero Banner */}
            <div className="relative overflow-hidden rounded-2xl p-6 sm:p-8 bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/20 shadow-xl">
              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
                  <Flame className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Autonomous Trend &amp; Marketing Intelligence</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Discover What's Spiking Before The Market Catches Up.
                </h1>
                <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                  Real-time multi-source data from Google Trends, HackerNews &amp; Social Feeds. Click any trend to immediately architect a <strong className="text-indigo-300 font-semibold">$100M Offer</strong>, <strong className="text-purple-300 font-semibold">6 Psychological Ad Angles</strong>, and <strong className="text-pink-300 font-semibold">Viral UGC Hooks</strong>.
                </p>

                {/* Quick Niches */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-medium text-slate-400">High-Velocity Niches:</span>
                  {QUICK_NICHES.map((niche) => (
                    <button
                      key={niche}
                      onClick={() => handleLaunchFullCampaign(niche, "E-commerce & Tools")}
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-200 border border-slate-700/60 hover:border-indigo-500/40 transition flex items-center space-x-1"
                    >
                      <span>{niche}</span>
                      <ArrowRight className="w-3 h-3 text-indigo-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filter and Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
                {['all', 'E-commerce', 'AI & Tech', 'Health & Wellness'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {cat === 'all' ? 'All Feeds' : cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search trending keywords..."
                    value={trendSearch}
                    onChange={(e) => setTrendSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  onClick={fetchTrends}
                  disabled={trendsLoading}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                >
                  <RefreshCw className={`w-4 h-4 ${trendsLoading ? 'animate-spin text-indigo-400' : ''}`} />
                </button>
              </div>
            </div>

            {/* Grid */}
            {trendsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="p-5 rounded-xl bg-slate-900/60 animate-pulse space-y-3 border border-slate-800">
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="h-6 bg-slate-800 rounded w-3/4" />
                    <div className="h-10 bg-slate-800/60 rounded" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trends
                  .filter(item => {
                    if (selectedCategory !== 'all' && !item.category.toLowerCase().includes(selectedCategory.toLowerCase())) return false;
                    if (trendSearch && !item.title.toLowerCase().includes(trendSearch.toLowerCase())) return false;
                    return true;
                  })
                  .map((trend) => (
                    <div
                      key={trend.id}
                      className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400 mb-2">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                            {trend.source}
                          </span>
                          <span className="px-2 py-0.5 rounded font-medium text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            {trend.growth_signal}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                          {trend.title}
                        </h3>

                        <div className="mt-1 flex items-center space-x-1.5 text-xs font-semibold text-indigo-400">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{trend.volume}</span>
                        </div>

                        <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {trend.snippet}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                        <button
                          onClick={() => {
                            setExplorerQuery(trend.title);
                            setActiveTab('explorer');
                          }}
                          className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition flex items-center space-x-1"
                        >
                          <Compass className="w-3.5 h-3.5 text-slate-400" />
                          <span>Mine Intent</span>
                        </button>

                        <button
                          onClick={() => handleLaunchFullCampaign(trend.title, trend.category)}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/20 transition flex items-center space-x-1"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Create Campaign</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: SEARCH INTENT MINER */}
        {activeTab === 'explorer' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="max-w-3xl">
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
                  <Compass className="w-3.5 h-3.5 text-purple-400" />
                  <span>Search Intent &amp; Market Psychology Miner</span>
                </div>
                <h2 className="text-xl font-bold text-white">Uncover What Buyers Are Actively Searching &amp; Asking</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter any keyword to reverse-engineer commercial search queries, burning pain points, and objections.
                </p>

                <form onSubmit={handleExploreSearch} className="mt-4 flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. AI video ads, dropshipping, supplements..."
                      value={explorerQuery}
                      onChange={(e) => setExplorerQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={explorerLoading || !explorerQuery.trim()}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-lg shadow-purple-600/30 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {explorerLoading ? (
                      <span>Mining Queries...</span>
                    ) : (
                      <>
                        <Compass className="w-4 h-4" />
                        <span>Mine Intent Clusters</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {explorerData && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Demand Heat</span>
                    <p className="text-base font-bold text-emerald-400 mt-1">{explorerData.insights.market_temperature}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Primary Objection</span>
                    <p className="text-xs font-semibold text-slate-200 mt-1">{explorerData.insights.primary_objection}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Recommended Angle</span>
                    <p className="text-xs font-semibold text-indigo-400 mt-1">{explorerData.insights.suggested_angle}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {explorerData.clusters.map((cluster: any, idx: number) => (
                    <div key={idx} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                      <div className="flex items-center space-x-2 text-indigo-400 font-bold text-sm">
                        <Compass className="w-4 h-4" />
                        <span>{cluster.intent_type}</span>
                      </div>

                      <div className="space-y-1.5">
                        {cluster.queries.map((q: string, qIdx: number) => (
                          <div
                            key={qIdx}
                            onClick={() => handleLaunchFullCampaign(q, 'Search Query')}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/60 transition group cursor-pointer"
                          >
                            <span className="text-xs text-slate-300 group-hover:text-indigo-200">{q}</span>
                            <span className="opacity-0 group-hover:opacity-100 transition px-2 py-0.5 rounded bg-indigo-600/30 text-indigo-300 text-[10px] font-semibold flex items-center space-x-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Forge</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: OFFER ARCHITECT */}
        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-2">
                <Gift className="w-3.5 h-3.5 text-indigo-400" />
                <span>Hormozi $100M Grand Slam Offer Architect</span>
              </div>
              <h2 className="text-xl font-bold text-white">Engineer An Irresistible, High-Ticket Converting Offer</h2>
              <p className="text-xs text-slate-400 mt-1">
                Maximize the Value Equation: Elevate the Dream Outcome &amp; Likelihood of Success, while collapsing Time Delay and Effort.
              </p>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Trending Topic or Product</label>
                  <input
                    type="text"
                    value={offerKeyword}
                    onChange={(e) => setOfferKeyword(e.target.value)}
                    placeholder="e.g. AI UGC Video Ads"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Industry / Niche</label>
                  <select
                    value={offerNiche}
                    onChange={(e) => setOfferNiche(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="E-commerce & Tools">E-commerce &amp; DTC</option>
                    <option value="AI & Tech">AI &amp; SaaS</option>
                    <option value="Health & Wellness">Health &amp; Wellness</option>
                    <option value="Finance & Wealth">Finance &amp; Wealth</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target Customer Avatar</label>
                  <input
                    type="text"
                    value={offerAudience}
                    onChange={(e) => setOfferAudience(e.target.value)}
                    placeholder="e.g. DTC Brand Owners"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="sm:col-span-3 flex justify-end">
                  <button
                    onClick={() => {
                      const res = generateOfferInternal(offerKeyword, offerNiche, offerAudience);
                      setOfferData(res);
                    }}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center space-x-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Architect Grand Slam Offer</span>
                  </button>
                </div>
              </div>
            </div>

            {offerData && (
              <div className="p-6 sm:p-8 rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-950 space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Target: {offerData.target_audience}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-white mt-2">
                      {offerData.offer_name}
                    </h3>
                    <p className="text-sm text-indigo-200 mt-1 font-medium">{offerData.tagline}</p>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(offerData, null, 2));
                      setOfferCopied(true);
                      setTimeout(() => setOfferCopied(false), 2000);
                    }}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center space-x-1.5"
                  >
                    {offerCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{offerCopied ? 'Copied JSON!' : 'Copy Brief'}</span>
                  </button>
                </div>

                {/* 4 Pillars */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/20">
                    <span className="text-xs font-bold text-emerald-400">✨ Dream Outcome</span>
                    <p className="text-[11px] text-slate-300 mt-1">{offerData.framework.dream_outcome}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/20">
                    <span className="text-xs font-bold text-indigo-400">🛡️ Perceived Likelihood</span>
                    <p className="text-[11px] text-slate-300 mt-1">{offerData.framework.perceived_likelihood}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/20">
                    <span className="text-xs font-bold text-amber-400">⚡ Time Delay</span>
                    <p className="text-[11px] text-slate-300 mt-1">{offerData.framework.time_delay_reduction}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-indigo-500/20">
                    <span className="text-xs font-bold text-rose-400">🔥 Effort &amp; Sacrifice</span>
                    <p className="text-[11px] text-slate-300 mt-1">{offerData.framework.effort_and_sacrifice_reduction}</p>
                  </div>
                </div>

                {/* Deliverables & Bonuses */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Core Deliverables Stack</h4>
                    <ul className="space-y-1.5">
                      {offerData.framework.core_deliverables.map((d, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                    <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">Objection-Crushing Bonus Stack</h4>
                    <ul className="space-y-1.5">
                      {offerData.framework.bonus_stack.map((b, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start space-x-2">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Guarantee & Pricing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400">Pricing Strategy</span>
                    <p className="text-base font-bold text-white mt-1">{offerData.framework.price_point}</p>
                    <p className="text-[10px] text-slate-400">{offerData.framework.pricing_model}</p>
                  </div>

                  <div className="sm:col-span-2 p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                    <span className="text-[11px] font-bold text-emerald-300">Unconditional Risk-Reversal Guarantee</span>
                    <p className="text-xs text-emerald-200 mt-1 leading-relaxed">{offerData.framework.risk_reversal_guarantee}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: AD ANGLES MATRIX */}
        {activeTab === 'angles' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-semibold mb-2">
                <Target className="w-3.5 h-3.5 text-pink-400" />
                <span>Direct-Response Psychological Angle Matrix</span>
              </div>
              <h2 className="text-xl font-bold text-white">Synthesize 6 Battle-Tested Psychological Angles</h2>
              <p className="text-xs text-slate-400 mt-1">
                Eugene Schwartz direct-response architecture: shift subconscious buyer beliefs and crush ad fatigue.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={anglesKeyword}
                  onChange={(e) => setAnglesKeyword(e.target.value)}
                  placeholder="e.g. AI UGC Video Ads"
                  className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-pink-500"
                />
                <button
                  onClick={() => {
                    const res = generateAnglesInternal(anglesKeyword);
                    setAnglesData(res);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs transition shadow-lg shadow-pink-600/30 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate 6 Ad Angles</span>
                </button>
              </div>
            </div>

            {anglesData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {anglesData.map((angle, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300">
                          {angle.angle_type}
                        </span>
                        <span className="text-slate-400">Best on: <strong className="text-slate-200">{angle.best_platform}</strong></span>
                      </div>

                      <h3 className="text-base font-bold text-white leading-snug">"{angle.headline}"</h3>

                      <div className="mt-2.5 p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                        <span className="text-indigo-400 font-bold">Belief Shift: </span>
                        <span className="text-slate-300">{angle.core_belief_to_shift}</span>
                      </div>

                      <div className="mt-2 text-[11px] text-slate-400">
                        <span className="text-pink-400 font-bold">Visual Hook: </span>
                        <span>{angle.hook_concept}</span>
                      </div>

                      <div className="mt-3 p-3 rounded-lg bg-[#0B0F17] border border-slate-800/80 text-xs text-slate-300 font-mono whitespace-pre-line leading-relaxed">
                        {angle.primary_text}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-emerald-400">CTA: "{angle.call_to_action}"</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${angle.headline}\n\n${angle.primary_text}\n\nCTA: ${angle.call_to_action}`);
                          setCopiedAngleIdx(idx);
                          setTimeout(() => setCopiedAngleIdx(null), 2000);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center space-x-1.5"
                      >
                        {copiedAngleIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedAngleIdx === idx ? 'Copied!' : 'Copy Angle'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: VIRAL HOOK VAULT */}
        {activeTab === 'hooks' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>First-3-Second Viral Hook Vault &amp; 30s UGC Outlines</span>
              </div>
              <h2 className="text-xl font-bold text-white">Capture Aggressive Attention on TikTok, Reels &amp; Meta</h2>
              <p className="text-xs text-slate-400 mt-1">
                Stop the scroll in under 1.5 seconds with psychological pattern interrupts, data shocks, and video scripts.
              </p>

              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={hooksKeyword}
                  onChange={(e) => setHooksKeyword(e.target.value)}
                  placeholder="e.g. AI UGC Video Ads"
                  className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={() => {
                    const res = generateHooksInternal(hooksKeyword);
                    setHooksData(res);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition shadow-lg shadow-amber-600/30 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Unlock Viral Hooks</span>
                </button>
              </div>
            </div>

            {hooksData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {hooksData.map((h, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between space-y-4">
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-semibold mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
                          {h.category}
                        </span>
                        <div className="flex items-center space-x-1 text-slate-400">
                          <Video className="w-3.5 h-3.5" />
                          <span>{h.platforms.join(' • ')}</span>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/20">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                          Spoken Script (0-3s Hook):
                        </span>
                        <p className="text-sm font-bold text-white leading-snug">"{h.hook_text}"</p>
                      </div>

                      <div className="mt-3 flex items-start space-x-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                        <Eye className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-indigo-300">Visual Pattern Interrupt: </strong>
                          <span>{h.visual_cue}</span>
                        </div>
                      </div>

                      <div className="mt-3 space-y-1.5">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5" />
                          <span>30-Second UGC Video Breakdown</span>
                        </span>
                        {Object.entries(h.script_outline_30s).map(([timing, line], sIdx) => (
                          <div key={sIdx} className="p-1.5 rounded bg-[#0B0F17] border border-slate-800/80 flex items-start space-x-2 text-xs">
                            <span className="text-[10px] font-bold text-amber-400 whitespace-nowrap">{timing}:</span>
                            <span className="text-slate-300 leading-tight">{line}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-end">
                      <button
                        onClick={() => {
                          const script = `HOOK: "${h.hook_text}"\nVISUAL: ${h.visual_cue}\n\n${Object.entries(h.script_outline_30s).map(([t, l]) => `${t}: ${l}`).join('\n')}`;
                          navigator.clipboard.writeText(script);
                          setCopiedHookIdx(idx);
                          setTimeout(() => setCopiedHookIdx(null), 2000);
                        }}
                        className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition flex items-center space-x-1.5"
                      >
                        {copiedHookIdx === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedHookIdx === idx ? 'Copied Script!' : 'Copy UGC Script'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 6: CAMPAIGN VAULT */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
                  <FolderKanban className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Campaign Hub &amp; Export Center</span>
                </div>
                <h2 className="text-xl font-bold text-white">Your Saved Winning Campaigns &amp; Briefs</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Access ready-to-deploy direct response assets, export structured Markdown briefs, or hand off to media buyers.
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-white">{campaigns.length}</span>
                <p className="text-[11px] text-slate-400">Campaigns Stored</p>
              </div>
            </div>

            {campaigns.length === 0 ? (
              <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
                <FolderKanban className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-300">No campaigns saved yet</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Browse the Live Trend Radar or use the Search Intent Miner and click "Create Campaign" to architect your first winning brief.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {campaigns.map((c) => (
                  <div
                    key={c.id}
                    className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center space-x-2 text-[11px]">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold">
                          {c.trend_keyword}
                        </span>
                        <span className="text-slate-400">• {c.niche}</span>
                        <span className="text-slate-500 flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{c.created_at}</span>
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{c.offer?.offer_name || c.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-1">{c.offer?.tagline}</p>

                      <div className="flex items-center space-x-4 pt-1 text-xs text-slate-300">
                        <span>💰 {c.offer?.framework?.price_point || '$1,497'}</span>
                        <span>🎯 {c.angles?.length || 6} Ad Angles</span>
                        <span>⚡ {c.hooks?.length || 6} Viral Hooks</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 w-full md:w-auto justify-end pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                      <button
                        onClick={() => handleDownloadMarkdown(c)}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition flex items-center space-x-1.5 border border-slate-700"
                        title="Download Markdown brief"
                      >
                        <Download className="w-4 h-4 text-indigo-400" />
                        <span>Download .MD</span>
                      </button>

                      <button
                        onClick={() => {
                          if (c.offer) setOfferData(c.offer);
                          if (c.angles) setAnglesData(c.angles);
                          if (c.hooks) setHooksData(c.hooks);
                          setActiveTab('offers');
                        }}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition flex items-center space-x-1.5 shadow-md shadow-indigo-600/20"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setCampaigns(campaigns.filter(item => item.id !== c.id))}
                        className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition"
                        title="Delete Campaign"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Generation Overlay */}
      {generatingOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="p-8 rounded-2xl bg-slate-900 border border-indigo-500/40 text-center max-w-md shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto text-indigo-400 animate-pulse">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Synthesizing Marketing Blitz...</h3>
              <p className="text-xs text-slate-400 mt-1">
                Analyzing '{currentTrend}', engineering $100M Grand Slam Offer, 6 Direct Response Angles &amp; Viral Hooks.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 border border-emerald-500/40 p-4 rounded-xl shadow-2xl flex items-start space-x-3 max-w-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold text-white">{toastMessage.title}</p>
            <p className="text-[11px] text-slate-300 mt-0.5">{toastMessage.subtitle}</p>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg bg-[#111827] rounded-2xl border border-slate-700/80 shadow-2xl p-6">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">TrendPulse Configuration</h2>
                <p className="text-xs text-slate-400">Configure regions and AI keys</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
                <p className="font-semibold text-emerald-200">Zero-Config Mode Active</p>
                <p className="mt-0.5 text-emerald-400/90 leading-relaxed">
                  Real-time Google Trends &amp; Direct-Response marketing engines run 100% free out-of-the-box.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center space-x-1.5">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  <span>Google Trends Region / Market</span>
                </label>
                <select
                  value={settings.geo}
                  onChange={(e) => {
                    const newSettings = { ...settings, geo: e.target.value };
                    setSettings(newSettings);
                    localStorage.setItem('trendpulse_settings', JSON.stringify(newSettings));
                  }}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-slate-200 focus:outline-none"
                >
                  <option value="US">United States (US)</option>
                  <option value="GB">United Kingdom (GB)</option>
                  <option value="CA">Canada (CA)</option>
                  <option value="AU">Australia (AU)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
