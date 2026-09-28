import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import {
  Sparkles,
  Building2,
  Flame,
  Zap,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Globe,
  Sliders,
  ArrowRight,
  ShieldCheck,
  Download,
  Share2,
  CheckCircle2,
  PhoneCall,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';

type NamingMode = 'business' | 'offer' | 'product' | 'lead_magnet';

interface GeneratedNameItem {
  id: string;
  name: string;
  category: string;
  tagline: string;
  psychology: string;
  formula: string;
  adHook: string;
  domainName: string;
}

interface NichePreset {
  label: string;
  niche: string;
  avatar: string;
  outcome: string;
  seed: string;
  pricePoint: string;
}

const PRESETS: NichePreset[] = [
  {
    label: 'AI Automation & Voice AI',
    niche: 'AI Voice Agents & Inbound Automation',
    avatar: 'High-volume local service businesses & clinics',
    outcome: 'Answer 100% of inbound calls under 1 second and auto-book appointments 24/7',
    seed: 'Kenji',
    pricePoint: '$497/mo retainer + $3,500 setup'
  },
  {
    label: 'B2B Growth & Agency',
    niche: 'Client Acquisition & Paid Ads Management',
    avatar: 'B2B SaaS founders & 7-figure agency owners',
    outcome: 'Add 30 qualified sales pipeline meetings a month with zero cold outbound',
    seed: 'Pipeline',
    pricePoint: '$5,000/mo retainer'
  },
  {
    label: 'Roofing & Home Services',
    niche: 'Residential Roofing & Solar Installation',
    avatar: 'Homeowners needing emergency roof replacements after storms',
    outcome: 'Get a drone roof inspection and insurance claim payout in 48 hours',
    seed: 'Apex',
    pricePoint: '$12,500 project average'
  },
  {
    label: 'Real Estate & Mortgage',
    niche: 'High-End Residential Listings & Mortgages',
    avatar: 'Affluent homeowners looking to upgrade or downsize',
    outcome: 'Sell within 21 days for at or above list price without hosting open houses',
    seed: 'Estate',
    pricePoint: '2.5% listing fee'
  },
  {
    label: 'Health, MedSpa & Aesthetics',
    niche: 'Body Contouring & Anti-Aging Treatments',
    avatar: 'Professionals aged 35-55 seeking non-invasive treatments',
    outcome: 'Look 7 years younger in 3 sessions without surgery or downtime',
    seed: 'Lumina',
    pricePoint: '$2,800 package'
  },
  {
    label: 'E-Commerce & D2C',
    niche: 'Performance Athletic Apparel & Recovery',
    avatar: 'Crossfitters and endurance athletes',
    outcome: 'Cut muscle recovery time in half with medical-grade compression',
    seed: 'Veloce',
    pricePoint: '$140 average order value'
  }
];

const STYLE_OPTIONS = [
  { id: 'all', label: 'All Styles' },
  { id: 'hormozi', label: 'Alex Hormozi $100M Grand Slam' },
  { id: 'modern_ai', label: 'Modern AI & Tech' },
  { id: 'high_status', label: 'High-Status & Authority' },
  { id: 'action_punchy', label: 'Action & Outcome-Driven' },
  { id: 'compound', label: 'Compound & Portmanteau' }
];

export const NameGeneratorPage: React.FC = () => {
  const [mode, setMode] = useState<NamingMode>('business');
  const [niche, setNiche] = useState('AI Automation & Voice Inbound');
  const [avatar, setAvatar] = useState('Local service business owners losing missed calls');
  const [outcome, setOutcome] = useState('Answer 100% of calls in 2 seconds and book 30 appointments monthly');
  const [seed, setSeed] = useState('');
  const [pricePoint, setPricePoint] = useState('$1,500/mo');
  const [selectedStyle, setSelectedStyle] = useState('all');

  const [results, setResults] = useState<GeneratedNameItem[]>([]);
  const [favorites, setFavorites] = useState<GeneratedNameItem[]>(() => {
    try {
      const saved = localStorage.getItem('kenji_saved_names');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<'generated' | 'favorites'>('generated');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedDossierId, setCopiedDossierId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('kenji_saved_names', JSON.stringify(favorites));
    } catch {
      // storage unavailable
    }
  }, [favorites]);

  const applyPreset = (preset: NichePreset) => {
    setNiche(preset.niche);
    setAvatar(preset.avatar);
    setOutcome(preset.outcome);
    setSeed(preset.seed);
    setPricePoint(preset.pricePoint);
  };

  // Algorithmic Generator
  const generateNames = useCallback(() => {
    setIsGenerating(true);

    const cleanSeed = seed.trim().replace(/[^a-zA-Z0-9]/g, '');
    const cleanNiche = niche.trim() || 'Business';
    const cleanAvatar = avatar.trim() || 'Clients';
    const cleanOutcome = outcome.trim() || 'Transformative Results';

    const items: GeneratedNameItem[] = [];

    const sanitizeSlug = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (mode === 'business') {
      // 1. Modern AI & Tech
      const techSeed = cleanSeed || 'Kenji';
      items.push({
        id: `biz-tech-1-${Date.now()}`,
        name: `${techSeed}AI Systems`,
        category: 'Modern AI & Tech',
        tagline: `Next-generation ${cleanNiche.toLowerCase()} powered by autonomous intelligence.`,
        psychology: 'Combines direct technological authority with institutional credibility.',
        formula: 'Brand Anchor + AI Modifier + Category Anchor',
        adHook: `Why top ${cleanAvatar.toLowerCase()} are replacing manual workflows with ${techSeed}AI.`,
        domainName: `${sanitizeSlug(techSeed)}ai.com`
      });

      items.push({
        id: `biz-tech-2-${Date.now()}`,
        name: `Cogni${cleanSeed || 'Scale'}`,
        category: 'Modern AI & Tech',
        tagline: `Intelligent execution infrastructure for modern ${cleanAvatar.toLowerCase()}.`,
        psychology: 'Implies cognitive superiority and deep mathematical automation.',
        formula: 'Cognitive Prefix + Kinetic Velocity Root',
        adHook: `The autonomous backend that handles ${cleanOutcome.toLowerCase()} while you sleep.`,
        domainName: `cogni${sanitizeSlug(cleanSeed || 'scale')}.com`
      });

      items.push({
        id: `biz-tech-3-${Date.now()}`,
        name: `Synapse${cleanSeed || 'Pulse'}`,
        category: 'Modern AI & Tech',
        tagline: `Real-time synchronization for high-velocity ${cleanNiche.toLowerCase()}.`,
        psychology: 'Biological neural terminology commands subconscious trust and complexity bias.',
        formula: 'Neural Synapse + Momentum Trigger',
        adHook: `How 1 click with Synapse${cleanSeed || 'Pulse'} solves your biggest revenue bottleneck.`,
        domainName: `synapse${sanitizeSlug(cleanSeed || 'pulse')}.io`
      });

      // 2. High-Status & Authority
      items.push({
        id: `biz-status-1-${Date.now()}`,
        name: `Apex ${cleanSeed || 'Growth'} Advisory`,
        category: 'High-Status & Authority',
        tagline: `Institutional-grade strategy and execution for elite operators.`,
        psychology: 'Anchors perception at the highest tier of the market, justifying premium pricing.',
        formula: 'Apex Dominance + Domain Core + Advisory Container',
        adHook: `Exclusive framework reserved for top 1% ${cleanAvatar.toLowerCase()}.`,
        domainName: `apex${sanitizeSlug(cleanSeed || 'growth')}.com`
      });

      items.push({
        id: `biz-status-2-${Date.now()}`,
        name: `Vanguard ${cleanNiche.split(' ')[0] || 'Enterprise'}`,
        category: 'High-Status & Authority',
        tagline: `Pioneering the benchmark standard for ${cleanAvatar.toLowerCase()}.`,
        psychology: 'Military vanguard connotation implies market leadership and defensibility.',
        formula: 'Vanguard Anchor + Industry Noun',
        adHook: `The industry standard ${cleanAvatar.toLowerCase()} rely on when failure is not an option.`,
        domainName: `vanguard${sanitizeSlug(cleanNiche.split(' ')[0] || 'tech')}.com`
      });

      // 3. Action & Outcome-Driven
      items.push({
        id: `biz-action-1-${Date.now()}`,
        name: `Rev${cleanSeed || 'Forge'}`,
        category: 'Action & Outcome-Driven',
        tagline: `Turn your traffic and calls into predictable, recurring revenue.`,
        psychology: 'Active industrial verb triggers emotional certainty of hands-on results.',
        formula: 'Revenue Abbreviation + Industrial Action Verb',
        adHook: `Stop losing pipeline: see how Rev${cleanSeed || 'Forge'} delivers ${cleanOutcome.toLowerCase()}.`,
        domainName: `rev${sanitizeSlug(cleanSeed || 'forge')}.com`
      });

      items.push({
        id: `biz-action-2-${Date.now()}`,
        name: `Pipeline${cleanSeed || 'Pilot'}`,
        category: 'Action & Outcome-Driven',
        tagline: `Autopilot qualification and deal flow for serious operators.`,
        psychology: 'Relieves cognitive load by positioning the solution as automated guidance.',
        formula: 'Core Asset + Autopilot Metaphor',
        adHook: `What happens when you put your entire lead acquisition on autopilot?`,
        domainName: `pipeline${sanitizeSlug(cleanSeed || 'pilot')}.com`
      });

      // 4. Compound & Portmanteau
      items.push({
        id: `biz-comp-1-${Date.now()}`,
        name: `Omni${cleanSeed || 'Flow'}`,
        category: 'Compound & Portmanteau',
        tagline: `Unified seamless execution across all customer touchpoints.`,
        psychology: 'Presents an all-encompassing, frictionless solution that eliminates point solutions.',
        formula: 'Omni Ubiquity + Frictionless State',
        adHook: `Replace 5 disjointed tools with one unified Omni${cleanSeed || 'Flow'} engine.`,
        domainName: `omni${sanitizeSlug(cleanSeed || 'flow')}.ai`
      });

      items.push({
        id: `biz-comp-2-${Date.now()}`,
        name: `Hyper${cleanSeed || 'Reach'}`,
        category: 'Compound & Portmanteau',
        tagline: `Accelerated scale and penetration in competitive markets.`,
        psychology: 'Exaggerated speed multiplier implies 10x leverage over competitors.',
        formula: 'Hyper Acceleration + Direct Commercial Action',
        adHook: `The unfair advantage giving ${cleanAvatar.toLowerCase()} 3x more booked deals.`,
        domainName: `hyper${sanitizeSlug(cleanSeed || 'reach')}.co`
      });

      items.push({
        id: `biz-comp-3-${Date.now()}`,
        name: `Echo${cleanSeed || 'Sphere'}`,
        category: 'Compound & Portmanteau',
        tagline: `Amplifying your voice and brand across every inbound channel.`,
        psychology: 'Acoustic and geometric completeness creates sticky brand recognition.',
        formula: 'Resonance Anchor + Total Ecosystem Container',
        adHook: `Every missed customer message captured and converted into high-ticket cashflow.`,
        domainName: `echo${sanitizeSlug(cleanSeed || 'sphere')}.com`
      });
    } else if (mode === 'offer') {
      // Alex Hormozi $100M Grand Slam Offer Framework
      items.push({
        id: `offer-magic-1-${Date.now()}`,
        name: `The 90-Day ${cleanSeed || 'Pipeline'} Inbound Machine`,
        category: 'Alex Hormozi $100M Grand Slam',
        tagline: `Guaranteed ${cleanOutcome} in 90 days or you do not pay.`,
        psychology: 'M.A.G.I.C. Framework: Magnet, Avatar clarity, Goal specificity, Interval, and Container.',
        formula: 'M.A.G.I.C. (Interval + Outcome + Proprietary Container)',
        adHook: `We will personally build and install the 90-Day ${cleanSeed || 'Pipeline'} Inbound Machine for you.`,
        domainName: `the90day${sanitizeSlug(cleanSeed || 'pipeline')}.com`
      });

      items.push({
        id: `offer-magic-2-${Date.now()}`,
        name: `The Zero-Missed-Call Revenue Protocol`,
        category: 'Alex Hormozi $100M Grand Slam',
        tagline: `Every single customer answered in 2 seconds, qualified, and booked on your calendar.`,
        psychology: 'Absolute Risk Elimination: Addresses the #1 leaky bucket pain point directly.',
        formula: 'Zero-Pain Guarantee + High-Status Protocol Container',
        adHook: `If your phone rings, we answer it in 500ms. If we do not book the job, you owe nothing.`,
        domainName: `revenueprotocol.ai`
      });

      items.push({
        id: `offer-magic-3-${Date.now()}`,
        name: `The 30-Day ${cleanNiche.split(' ')[0] || 'Client'} Surge Sprint`,
        category: 'Alex Hormozi $100M Grand Slam',
        tagline: `A rapid-deployment execution sprint engineered to unlock immediate cashflow.`,
        psychology: 'Sprint psychology creates urgency, compresses time delay, and maximizes perceived likelihood.',
        formula: 'Compressed Timeframe + Explosive Surge Verb + Sprint Container',
        adHook: `Attention ${cleanAvatar}: Here is the exact roadmap to double your deal flow in 30 days.`,
        domainName: `surgesprint.com`
      });

      items.push({
        id: `offer-magic-4-${Date.now()}`,
        name: `The ${cleanSeed || 'Apex'} Acquisition Blueprint`,
        category: 'Action & Outcome-Driven',
        tagline: `The step-by-step institutional playbook to dominate your local market.`,
        psychology: 'Pre-packaged intellectual property implies zero guesswork and done-for-you ease.',
        formula: 'Status Anchor + Acquisition Focus + Architecture Container',
        adHook: `Steal the exact acquisition blueprint generating 40+ inbound calls every single week.`,
        domainName: `acquisitionblueprint.io`
      });

      items.push({
        id: `offer-magic-5-${Date.now()}`,
        name: `The Grand Slam ${cleanAvatar.split(' ')[0] || 'Growth'} Engine`,
        category: 'Alex Hormozi $100M Grand Slam',
        tagline: `An offer so good people would feel stupid saying no, completely managed for you.`,
        psychology: 'Alex Hormozi Core Principle: Value equation maximized through minimized effort & sacrifice.',
        formula: 'Grand Slam Anchor + Audience Tag + Kinetic Engine',
        adHook: `How we help ${cleanAvatar} add ${cleanPricePoint} in net new revenue without ad spend burn.`,
        domainName: `growthengine.ai`
      });

      items.push({
        id: `offer-magic-6-${Date.now()}`,
        name: `The 14-Day Automated Conversion Protocol`,
        category: 'Modern AI & Tech',
        tagline: `Deploy AI Voice Agents & CRM sequences that close cold leads into signed contracts.`,
        psychology: 'High certainty with tight deadline and technological leverage.',
        formula: '14-Day Velocity + Automated Deliverable + Medical-grade Protocol',
        adHook: `Stop letting leads slip through the cracks. Install our 14-day protocol today.`,
        domainName: `conversionprotocol.com`
      });
    } else if (mode === 'product') {
      items.push({
        id: `prod-1-${Date.now()}`,
        name: `${cleanSeed || 'Kenji'} VoicePulse`,
        category: 'Modern AI & Tech',
        tagline: `Autonomous 24/7 Voice AI agent trained specifically for your business.`,
        psychology: 'Sound/voice imagery paired with vitality and real-time response.',
        formula: 'Brand Prefix + Acoustic Metaphor + Vitality Root',
        adHook: `Meet ${cleanSeed || 'Kenji'} VoicePulse: your newest receptionist that never sleeps or takes a break.`,
        domainName: `${sanitizeSlug(cleanSeed || 'kenji')}voicepulse.com`
      });

      items.push({
        id: `prod-2-${Date.now()}`,
        name: `CloserPilot 360`,
        category: 'Action & Outcome-Driven',
        tagline: `End-to-end CRM and follow-up engine that turns cold clicks into signed agreements.`,
        psychology: 'Direct, unapologetic outcome orientation targeting the ultimate business metric.',
        formula: 'Sales Role + Autopilot + 360 Degree Completeness',
        adHook: `Never lose another warm prospect: CloserPilot 360 follows up across SMS, email, and voice.`,
        domainName: `closerpilot360.com`
      });

      items.push({
        id: `prod-3-${Date.now()}`,
        name: `AdForge Matrix`,
        category: 'Compound & Portmanteau',
        tagline: `AI-driven creative generation that writes hooks, angles, and video scripts in 10 seconds.`,
        psychology: 'Manufacturing metaphor promises relentless production and infinite scale.',
        formula: 'Advertising Abbrev + Heavy Industrial Forge + Computational Matrix',
        adHook: `Generate 30 winning ad variations in 60 seconds with AdForge Matrix.`,
        domainName: `adforgematrix.ai`
      });

      items.push({
        id: `prod-4-${Date.now()}`,
        name: `LeadVault OS`,
        category: 'High-Status & Authority',
        tagline: `The mission-control operating system for your revenue and deal pipeline.`,
        psychology: 'Security and capital preservation framing attracts high-ticket enterprise buyers.',
        formula: 'Asset Target + Bank Security Vault + Operating System Authority',
        adHook: `Your leads are your most valuable asset. Protect and monetize them with LeadVault OS.`,
        domainName: `leadvaultos.com`
      });
    } else {
      // Lead Magnet / Playbook / Course
      items.push({
        id: `lm-1-${Date.now()}`,
        name: `The 7-Figure ${cleanNiche.split(' ')[0] || 'AI'} Playbook`,
        category: 'High-Status & Authority',
        tagline: `The exact operational playbook used to scale past $100K/month with zero extra headcount.`,
        psychology: 'Proven social proof and aspirational milestone triggering high opt-in rates.',
        formula: 'Monetary Benchmark + Niche Focus + Playbook Architecture',
        adHook: `Free Download: The 7-Figure Playbook top operators keep hidden from the public.`,
        domainName: `sevenfigureplaybook.com`
      });

      items.push({
        id: `lm-2-${Date.now()}`,
        name: `The Missed Call Revenue Audit Checklist`,
        category: 'Action & Outcome-Driven',
        tagline: `A 5-minute diagnostic score to calculate how much money slips through your phone lines.`,
        psychology: 'Diagnostic pain finder creates immediate curiosity and reveals burning need.',
        formula: 'Negative Cost Audit + Action Checklist Format',
        adHook: `Run this 5-minute audit to see if you are leaking $10,000+ every month in unanswered calls.`,
        domainName: `revenueauditscore.com`
      });

      items.push({
        id: `lm-3-${Date.now()}`,
        name: `The $100M Grand Slam Offer Cheat Sheet`,
        category: 'Alex Hormozi $100M Grand Slam',
        tagline: `Fill-in-the-blanks templates to craft an irresistible, high-ticket guarantee in 20 minutes.`,
        psychology: 'Low barrier to entry, extreme promised speed, derived from proven billionaire frameworks.',
        formula: 'Billionaire Authority + Core Mechanism + Fast-Action Cheat Sheet',
        adHook: `Copy and paste these 12 offer templates to immediately raise your prices by 300%.`,
        domainName: `offercheatsheet.com`
      });

      items.push({
        id: `lm-4-${Date.now()}`,
        name: `The Autonomous Agency Blueprint (2026 Edition)`,
        category: 'Modern AI & Tech',
        tagline: `How to replace 5 full-time staff with AI Voice Agents, CRM automations, and smart bots.`,
        psychology: 'Future-pacing and massive cost reduction triggers immediate executive urgency.',
        formula: 'Autonomous Future + Industry Model + Architecture Blueprint',
        adHook: `Download the 2026 blueprint for running a 90% margin business powered by Kenji AI.`,
        domainName: `agencyblueprint.ai`
      });
    }

    // Add extra variation combinations based on seed
    if (cleanSeed) {
      items.push({
        id: `custom-seed-1-${Date.now()}`,
        name: `${cleanSeed} Dynamics`,
        category: 'High-Status & Authority',
        tagline: `Enterprise performance solutions engineered for ${cleanAvatar.toLowerCase()}.`,
        psychology: 'Kinetic physical authority that commands respect from corporate buyers.',
        formula: 'Custom Seed + Physical Kinetic Suffix',
        adHook: `Discover why market leaders are migrating to ${cleanSeed} Dynamics.`,
        domainName: `${sanitizeSlug(cleanSeed)}dynamics.com`
      });
      items.push({
        id: `custom-seed-2-${Date.now()}`,
        name: `${cleanSeed}ify`,
        category: 'Compound & Portmanteau',
        tagline: `Making ${cleanOutcome.toLowerCase()} effortless and accessible in 1 click.`,
        psychology: 'Modern consumer tech suffix creating approachability and viral ease.',
        formula: 'Custom Seed + Transformation Suffix (-ify)',
        adHook: `Don't do it the hard way. ${cleanSeed}ify your entire workflow today.`,
        domainName: `${sanitizeSlug(cleanSeed)}ify.com`
      });
    }

    setTimeout(() => {
      setResults(items);
      setIsGenerating(false);
    }, 250);
  }, [mode, niche, avatar, outcome, seed, pricePoint]);

  // Initial generation on mount
  useEffect(() => {
    generateNames();
  }, [generateNames]);

  const toggleFavorite = (item: GeneratedNameItem) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === item.id || f.name === item.name);
      if (exists) {
        return prev.filter((f) => f.id !== item.id && f.name !== item.name);
      } else {
        return [item, ...prev];
      }
    });
  };

  const handleCopyName = (id: string, name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyDossier = (item: GeneratedNameItem) => {
    const text = [
      `BRAND & OFFER DOSSIER: ${item.name}`,
      `Category: ${item.category}`,
      `Tagline: "${item.tagline}"`,
      `Psychological Rationale: ${item.psychology}`,
      `Formula: ${item.formula}`,
      `Sample Ad Hook: "${item.adHook}"`,
      `Target Domain: ${item.domainName}`,
      ``,
      `Engineered via KenjiAI Business & Offer Name Generator: https://kenjiai.com/tools/name-generator`,
      `Ready to deploy voice agents & automated sales? Visit https://kenjiai.com`
    ].join('\n');

    navigator.clipboard.writeText(text);
    setCopiedDossierId(item.id);
    setTimeout(() => setCopiedDossierId(null), 2000);
  };

  const exportAllFavorites = () => {
    if (favorites.length === 0) return;
    const content = favorites
      .map(
        (f, idx) =>
          `${idx + 1}. ${f.name} (${f.category})\n   Tagline: ${f.tagline}\n   Hook: ${f.adHook}\n   Domain: ${f.domainName}\n`
      )
      .join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kenjiai-saved-brand-and-offer-names-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const displayedList = useMemo(() => {
    const list = activeTab === 'favorites' ? favorites : results;
    if (selectedStyle === 'all') return list;
    return list.filter((item) => {
      if (selectedStyle === 'hormozi') return item.category.includes('Hormozi');
      if (selectedStyle === 'modern_ai') return item.category.includes('Modern AI');
      if (selectedStyle === 'high_status') return item.category.includes('High-Status');
      if (selectedStyle === 'action_punchy') return item.category.includes('Action');
      if (selectedStyle === 'compound') return item.category.includes('Compound');
      return true;
    });
  }, [activeTab, favorites, results, selectedStyle]);

  return (
    <>
      <Helmet>
        <title>AI Business & $100M Offer Name Generator | KenjiAI</title>
        <meta
          name="description"
          content="Generate high-converting business names, Alex Hormozi $100M Grand Slam offer titles, SaaS products, and lead magnets with domain checks and conversion psychology. Free from KenjiAI."
        />
        <link rel="canonical" href="https://kenjiai.com/tools/name-generator" />
        <meta property="og:title" content="AI Business & $100M Offer Name Generator | KenjiAI" />
        <meta
          property="og:description"
          content="Craft irresistible brand and offer names using the Alex Hormozi M.A.G.I.C. framework, AI positioning, and domain suggestions."
        />
        <meta property="og:url" content="https://kenjiai.com/tools/name-generator" />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="pt-28 pb-20 bg-gray-950 min-h-screen text-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb / Back Link */}
          <div className="mb-8 flex items-center justify-between">
            <Link
              to="/free-tools"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-cyan-400 transition-colors"
            >
              <ArrowRight className="w-4 h-4 rotate-180" /> Back to Free AI Growth Tools
            </Link>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              100% Free • No Signup Required
            </span>
          </div>

          {/* Hero Header */}
          <div className="text-center max-w-4xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-emerald-500/10 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>BrandCraft & OfferForge Engine</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
              AI Business &{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                $100M Offer Name
              </span>{' '}
              Generator
            </h1>

            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto mb-6">
              Engineered with Alex Hormozi’s Grand Slam Value Equation, modern tech branding formulas, and conversion psychology.
              Create brand names and offers people feel stupid saying no to.
            </p>

            {/* Quick Stats / Highlights */}
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-400 pt-2 border-t border-gray-800/80">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Alex Hormozi M.A.G.I.C. Framework</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                <span>Live Domain (.com / .ai) Links</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                <span>Ad Hooks & Conversion Psychology</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Private Local Vault & Export</span>
              </div>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="bg-gray-900/80 p-1.5 rounded-2xl border border-gray-800 grid grid-cols-2 sm:grid-cols-4 gap-1.5 shadow-xl">
              <button
                type="button"
                onClick={() => setMode('business')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  mode === 'business'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Business & Brand</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('offer')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  mode === 'offer'
                    ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Flame className="w-4 h-4 text-amber-400" />
                <span>$100M Grand Slam Offer</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('product')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  mode === 'product'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Product & SaaS Feature</span>
              </button>

              <button
                type="button"
                onClick={() => setMode('lead_magnet')}
                className={`flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  mode === 'lead_magnet'
                    ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/60'
                }`}
              >
                <Target className="w-4 h-4" />
                <span>Lead Magnet / Course</span>
              </button>
            </div>
          </div>

          {/* Generator Workspace Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Input Configuration (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gray-900/90 border border-gray-800/90 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-xl">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-5 border-b border-gray-800">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-5 h-5 text-cyan-400" />
                    <h2 className="text-lg font-bold text-white">Target Positioning</h2>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">Real-Time Engine</span>
                </div>

                {/* 1-Click Presets */}
                <div className="mt-5">
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    1-Click Industry Presets:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => applyPreset(p)}
                        className="text-xs bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white px-2.5 py-1 rounded-lg border border-gray-700/60 transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inputs */}
                <div className="space-y-4 mt-6">
                  {/* Niche */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Your Industry / Niche
                    </label>
                    <input
                      type="text"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="e.g. AI Call Centers, Roofing, B2B SaaS"
                      className="w-full bg-gray-950/80 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>

                  {/* Target Avatar */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Target Audience / Avatar (Who pays you?)
                    </label>
                    <input
                      type="text"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      placeholder="e.g. Busy dental clinic owners, Real estate brokers"
                      className="w-full bg-gray-950/80 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                    />
                  </div>

                  {/* Dream Outcome / Transformation */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                      Core Dream Outcome / Promised Transformation
                    </label>
                    <textarea
                      rows={2}
                      value={outcome}
                      onChange={(e) => setOutcome(e.target.value)}
                      placeholder="e.g. Answer 100% of calls in 2 seconds and book 30 appointments monthly"
                      className="w-full bg-gray-950/80 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                    />
                  </div>

                  {/* Seed / Prefix & Price Point */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Seed / Keyword (Opt)
                      </label>
                      <input
                        type="text"
                        value={seed}
                        onChange={(e) => setSeed(e.target.value)}
                        placeholder="e.g. Kenji, Apex, Flow"
                        className="w-full bg-gray-950/80 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                        Price / Pricing Model
                      </label>
                      <input
                        type="text"
                        value={pricePoint}
                        onChange={(e) => setPricePoint(e.target.value)}
                        placeholder="e.g. $1,500/mo, $5K setup"
                        className="w-full bg-gray-950/80 border border-gray-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Generate CTA Button */}
                <div className="mt-7">
                  <button
                    type="button"
                    onClick={generateNames}
                    disabled={isGenerating}
                    className="w-full group flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all duration-200 transform active:scale-[0.99]"
                  >
                    <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
                    <span>Generate New Variations</span>
                  </button>
                </div>

                {/* Kenji Ecosystem Cross-link box */}
                <div className="mt-6 pt-5 border-t border-gray-800/80 bg-gray-950/40 -mx-6 -mb-6 p-6 rounded-b-3xl">
                  <div className="flex items-start gap-3">
                    <PhoneCall className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        Next Step After Naming:
                      </h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                        Ready to make this offer print money? Deploy a 24/7 AI Voice Receptionist from Kenji AI that answers every inbound call in under 1 second.
                      </p>
                      <Link
                        to="/call-center-upgrade"
                        className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold mt-2.5 transition-colors"
                      >
                        Explore Kenji AI Call Center Upgrade <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* RIGHT COLUMN: Generated Results & Favorites (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Results Top Bar */}
              <div className="bg-gray-900/80 border border-gray-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                
                {/* Tabs: Generated vs Saved */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('generated')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                      activeTab === 'generated'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generated ({results.length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('favorites')}
                    className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
                      activeTab === 'favorites'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <BookmarkCheck className="w-4 h-4 text-amber-400" />
                    <span>Saved Vault ({favorites.length})</span>
                  </button>
                </div>

                {/* Filter Styles Dropdown & Export */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="bg-gray-950 border border-gray-800 rounded-lg px-2.5 py-1.5 text-xs text-gray-300 focus:outline-none focus:border-cyan-500"
                  >
                    {STYLE_OPTIONS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>

                  {activeTab === 'favorites' && favorites.length > 0 && (
                    <button
                      type="button"
                      onClick={exportAllFavorites}
                      title="Download favorites as a text report"
                      className="flex items-center gap-1.5 text-xs bg-gray-800 hover:bg-gray-700 text-gray-200 px-3 py-1.5 rounded-lg transition-colors border border-gray-700"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Export</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Cards List */}
              <div className="space-y-4">
                {displayedList.length === 0 ? (
                  <div className="bg-gray-900/50 border border-gray-800 rounded-3xl p-12 text-center">
                    <Bookmark className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <h3 className="text-white font-bold text-base mb-1">
                      {activeTab === 'favorites' ? 'No Saved Names Yet' : 'No Results Matching Style'}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-400 max-w-sm mx-auto">
                      {activeTab === 'favorites'
                        ? 'Click the bookmark icon on any generated name card to save it to your private browser vault.'
                        : 'Select "All Styles" or change your keywords to reveal more options.'}
                    </p>
                  </div>
                ) : (
                  displayedList.map((item) => {
                    const isFav = favorites.some((f) => f.id === item.id || f.name === item.name);
                    const domainSearchUrl = `https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(item.domainName)}`;

                    return (
                      <div
                        key={item.id}
                        className="bg-gray-900/80 hover:bg-gray-900 border border-gray-800/90 hover:border-gray-700 rounded-2xl p-5 sm:p-6 transition-all duration-200 group shadow-lg"
                      >
                        {/* Card Header: Category Badge, Name & Actions */}
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div>
                            <span className="inline-block text-[11px] font-semibold px-2.5 py-0.5 rounded-md bg-gray-800 border border-gray-700/80 text-cyan-400 mb-2 font-mono">
                              {item.category}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                              <span>{item.name}</span>
                            </h3>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {/* Copy Name */}
                            <button
                              type="button"
                              onClick={() => handleCopyName(item.id, item.name)}
                              title="Copy name to clipboard"
                              className="p-2 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                            >
                              {copiedId === item.id ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>

                            {/* Bookmark / Save */}
                            <button
                              type="button"
                              onClick={() => toggleFavorite(item)}
                              title={isFav ? 'Remove from favorites' : 'Save to favorites vault'}
                              className={`p-2 rounded-lg transition-colors ${
                                isFav
                                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                  : 'bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white'
                              }`}
                            >
                              <Bookmark className="w-4 h-4 fill-current" />
                            </button>
                          </div>
                        </div>

                        {/* Tagline / Subtitle */}
                        <p className="text-sm font-medium text-cyan-300/90 mb-3 italic">
                          "{item.tagline}"
                        </p>

                        {/* Psychology & Formula Info */}
                        <div className="bg-gray-950/60 rounded-xl p-3.5 border border-gray-800/60 space-y-2 mb-4 text-xs">
                          <div>
                            <span className="font-semibold text-gray-400">Psychology: </span>
                            <span className="text-gray-300">{item.psychology}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-400">Formula: </span>
                            <span className="text-emerald-400 font-mono">{item.formula}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-gray-400">Sample Ad Hook: </span>
                            <span className="text-gray-300">"{item.adHook}"</span>
                          </div>
                        </div>

                        {/* Footer / Meta Links */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-800/80 text-xs">
                          {/* Domain Search Link */}
                          <a
                            href={domainSearchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-gray-400 hover:text-emerald-400 transition-colors"
                          >
                            <Globe className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Check domain: <strong className="text-white font-mono">{item.domainName}</strong></span>
                            <ExternalLink className="w-3 h-3 text-gray-500" />
                          </a>

                          {/* Copy Full Dossier */}
                          <button
                            type="button"
                            onClick={() => handleCopyDossier(item)}
                            className="inline-flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
                          >
                            {copiedDossierId === item.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Dossier Copied!</span>
                              </>
                            ) : (
                              <>
                                <Share2 className="w-3.5 h-3.5" />
                                <span>Copy Full Pitch Dossier</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

            </div>

          </div>

          {/* Value Section: Why Great Names Command 10x Pricing */}
          <div className="mt-20 border-t border-gray-800 pt-16">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                The Science Behind Billion-Dollar Business & Offer Names
              </h2>
              <p className="text-sm sm:text-base text-gray-400">
                Most businesses pick cute or vague names that confuse buyers. High-converting brands engineer names that shift core beliefs and minimize perceived risk before the prospect even reads the sales page.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4">
                  <Flame className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Alex Hormozi M.A.G.I.C. Formula
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  <strong>M</strong>agnet (Why they look), <strong>A</strong>vatar (Who it is for), <strong>G</strong>oal (The dream outcome), <strong>I</strong>nterval (How fast it happens), and <strong>C</strong>ontainer (System, Sprint, or Machine). An offer named this way makes the value immediate.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Risk Reversal & Perception Anchors
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  Words like <em>Protocol</em>, <em>Vault</em>, and <em>Engine</em> trigger enterprise credibility and process certainty. Prospects feel they are buying a tested mechanical system rather than raw human labor.
                </p>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white mb-2">
                  Connected to Kenji AI Scale Engine
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  A name is only as good as the machine fulfilling it. Pair your offer with Kenji AI 24/7 Voice Agents, automated SMS booking sequences, and automated lead qualification to close deals on autopilot.
                </p>
              </div>
            </div>
          </div>

          {/* Ecosystem CTAs Banner */}
          <div className="mt-16 bg-gradient-to-r from-blue-900/30 via-cyan-900/20 to-emerald-900/30 border border-cyan-500/30 rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden">
            <div className="relative z-10 max-w-3xl mx-auto">
              <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-3 block font-mono">
                Launch & Scale with Kenji AI
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4">
                Have Your Winning Name? Now Build The System That Sells It.
              </h2>
              <p className="text-sm sm:text-base text-gray-300 mb-8 leading-relaxed">
                Connect your new brand to Kenji AI's complete inbound automation stack: 24/7 Voice Agents answering under 1 second, automated CRM pipeline, and done-for-you lead generation campaigns.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  to="/call-center-upgrade"
                  className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-6 py-3 rounded-xl shadow-lg transition-all"
                >
                  Upgrade to AI Call Center
                </Link>
                <Link
                  to="/trendpulse"
                  className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl border border-gray-700 transition-all flex items-center gap-2"
                >
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Build Ad Hooks on TrendPulse</span>
                </Link>
                <Link
                  to="/tools/icp-generator"
                  className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl border border-gray-700 transition-all flex items-center gap-2"
                >
                  <Target className="w-4 h-4 text-cyan-400" />
                  <span>Target Audiences with ICP Generator</span>
                </Link>
              </div>
            </div>
          </div>

          {/* FAQ Accordion / Quick Answers */}
          <div className="mt-16 border-t border-gray-800 pt-12">
            <h3 className="text-xl font-bold text-white mb-6">Frequently Asked Questions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-gray-400">
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-5">
                <h4 className="font-semibold text-white mb-2">Can I legally trademark these business and offer names?</h4>
                <p className="leading-relaxed">
                  Yes, but you should always conduct a formal trademark clearance search on USPTO.gov or your country's trademark database. The more compound, unique, or invented the name (e.g. Kenji, SynapseForge), the easier it is to trademark.
                </p>
              </div>
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-5">
                <h4 className="font-semibold text-white mb-2">What makes an Alex Hormozi $100M Grand Slam offer name work?</h4>
                <p className="leading-relaxed">
                  Alex Hormozi teaches that a Grand Slam offer minimizes time delay and effort while maximizing dream outcome and perceived likelihood. The name states the guaranteed result and timeframe upfront (e.g. "90-Day Inbound Machine").
                </p>
              </div>
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-5">
                <h4 className="font-semibold text-white mb-2">Is a .com or .ai domain better for my business?</h4>
                <p className="leading-relaxed">
                  If you are building an AI, software, or tech product, a <strong className="text-white">.ai</strong> domain communicates high tech authority. For local services, home improvement, and traditional agencies, a clean <strong className="text-white">.com</strong> remains the gold standard.
                </p>
              </div>
              <div className="bg-gray-900/40 border border-gray-800/80 rounded-xl p-5">
                <h4 className="font-semibold text-white mb-2">Are my generated names saved privately?</h4>
                <p className="leading-relaxed">
                  Yes! All saved names in your vault are stored locally in your browser's private storage. Nothing is sent to public databases, and you can export your list at any time.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default NameGeneratorPage;
