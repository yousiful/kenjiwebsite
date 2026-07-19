import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, MessageCircle, TrendingUp, ArrowRight, CheckCircle2,
  Zap, PhoneCall, Target, Shield, Sparkles,
  Clock, DollarSign, BarChart3, ChevronDown, ChevronUp,
  Megaphone, Bot, Calendar, Globe, Lock, Headphones, RefreshCw, Star, Play
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { META_CONFIG } from '../config/meta';
import { ResultsDisclaimer } from '../components/ResultsDisclaimer';

// ─── Checkout / CTA links ─────────────────────────────────────────────────
const LINKS = {
  starter: 'https://voice.kenjiai.com/sales-page-page-7007-1150-9157',
  growth:  'https://buy.stripe.com/4gM14mdmde8ofif895aMU1k',
  scale:   'https://buy.stripe.com/aFaeVc4PH9S8fifahdaMU1j',
  demo:    'https://go.mediatraffics.com/leads',
  gift:    'https://voice.kenjiai.com/gift',
};

type FbqWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  gtag?: (...args: unknown[]) => void;
};

function trackCheckout(planId: string, price: number, planName: string) {
  const w = window as FbqWindow;
  if (w.gtag) {
    w.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: price,
      items: [{ item_id: planId, item_name: planName, category: 'Voice AI', quantity: 1, price }],
    });
  }
  if (w.fbq) {
    const eventId =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const customData = {
      content_name: planName,
      content_ids: [planId],
      content_type: 'product',
      value: price,
      currency: 'USD',
    };
    w.fbq('track', 'InitiateCheckout', customData, { eventID: eventId });

    const readCookie = (name: string): string | undefined => {
      const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
      return match ? decodeURIComponent(match[1]) : undefined;
    };
    fetch(META_CONFIG.capiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_name: 'InitiateCheckout',
        event_id: eventId,
        event_source_url: window.location.href,
        user_data: { fbp: readCookie('_fbp'), fbc: readCookie('_fbc') },
        custom_data: customData,
      }),
    }).catch(() => {});
  }
}

// ─── KenjiAI review widget ────────────────────────────────────────────────
function KenjiReviews() {
  useEffect(() => {
    const SRC = 'https://reputationhub.site/reputation/assets/review-widget.js';
    if (document.querySelector(`script[src="${SRC}"]`)) return;
    const s = document.createElement('script');
    s.src = SRC;
    s.type = 'text/javascript';
    s.async = true;
    document.body.appendChild(s);
  }, []);
  return (
    <div className="rounded-2xl overflow-hidden">
      <iframe
        className="lc_reviews_widget"
        src="https://reputationhub.site/reputation/widgets/review_widget/q5L4ttbBMHNxieXIcTVJ"
        frameBorder="0"
        scrolling="no"
        style={{ minWidth: '100%', width: '100%' }}
        title="KenjiAI Customer Reviews"
      />
    </div>
  );
}

// ─── Animated counter ─────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = '',
  prefix = '',
}: {
  target: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      let start = 0;
      const step = target / 60;
      const timer = setInterval(() => {
        start += step;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return (
    <span ref={ref}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// ─── Pricing plan definitions ─────────────────────────────────────────────
const plans = [
  {
    id: 'starter',
    badge: null,
    name: 'Starter',
    tagline: 'Try it risk-free — no monthly fee',
    price: 0,
    priceLabel: 'FREE',
    priceSub: '',
    creditNote: '$0.29 / min · pay only for what you use',
    link: LINKS.starter,
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/30',
    glowColor: 'shadow-blue-500/10',
    popular: false,
    cta: 'Start Free →',
    features: [
      '1 AI Voice Agent',
      '1 Dedicated Phone Number',
      'Pay-as-you-go credits ($0.29/min)',
      'Basic CRM access',
      '150+ natural voices',
      'Call transcriptions via email',
      'Basic support',
    ],
  },
  {
    id: 'growth',
    badge: 'MOST POPULAR',
    name: 'Growth',
    tagline: '5,000 credits included every month',
    price: 99,
    priceLabel: '$99',
    priceSub: '/month',
    creditNote: '5,000 credits included (~277 mins of AI calls)',
    link: LINKS.growth,
    color: 'from-green-500 to-emerald-500',
    borderColor: 'border-green-400/50',
    glowColor: 'shadow-green-500/20',
    popular: true,
    cta: 'Get Growth Plan →',
    features: [
      '3 AI Voice Agents',
      '3 Phone Numbers',
      '5,000 credits / month included',
      'Full CRM + pipeline management',
      '150+ voices · multi-language',
      'Team calendar & appointment booking',
      'Zoom onboarding & setup call',
      'Priority support',
    ],
  },
  {
    id: 'scale',
    badge: 'DONE-FOR-YOU',
    name: 'Scale + Ads',
    tagline: 'We run your ads AND your AI answers',
    price: 375,
    priceLabel: '$375',
    priceSub: '/month',
    creditNote: '5,000 credits + DFY ad campaigns included',
    link: LINKS.scale,
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-400/50',
    glowColor: 'shadow-amber-500/20',
    popular: false,
    cta: 'Get Scale + Ads →',
    features: [
      'Everything in Growth',
      'Done-For-You Meta / Google Ads',
      'Ad creative built & launched week 1',
      'Leads flow directly into your AI agent',
      'Monthly ad refresh + optimization',
      'Dedicated growth strategist',
      'Quarterly strategy call',
      'Priority white-glove support',
    ],
  },
];

// ─── FAQ data ─────────────────────────────────────────────────────────────
const faqs = [
  {
    q: 'How does the $0/month plan work?',
    a: "You start completely free — no credit card required upfront. You only pay for the call credits you actually use at $0.29 per minute. It's the perfect way to test the AI with real callers before committing to a plan.",
  },
  {
    q: 'What are the 5,000 credits on the $99 plan?',
    a: 'Credits are the fuel your AI voice agent runs on. 5,000 credits equals roughly 277 minutes of AI call time per month — enough for hundreds of inbound or outbound calls. Any extra usage is billed at the standard per-minute rate.',
  },
  {
    q: 'What does "Done-For-You Ads" mean on the $375 plan?',
    a: 'Our team builds, launches, and manages your Meta and/or Google ad campaigns for you. We write the copy, design the creative, set the targeting, and route every lead directly into your AI front desk. You focus on closing — we handle the top of funnel.',
  },
  {
    q: 'Can I customize the AI voice and personality?',
    a: 'Yes. Choose from 150+ voices across all major languages. You can tune the personality — professional, friendly, energetic — and script exactly how it handles objections, qualifications, and bookings.',
  },
  {
    q: 'How fast can I be up and running?',
    a: 'Most businesses are live within 24–48 hours. The Starter plan is self-serve and takes about 15 minutes. Growth and Scale plans include a live Zoom setup call with our team who will build, test, and tweak it until your prospects cannot recognize it is AI.',
  },
  {
    q: 'Is there a contract?',
    a: 'No contracts, ever. Cancel anytime from your dashboard. We earn your business every month.',
  },
  {
    q: "What happens if the AI can't answer a question?",
    a: 'You configure fallback rules — the AI can transfer the call to a live agent, send an SMS, book a callback, or take a message. Nothing falls through the cracks.',
  },
];

// ─── Main component ───────────────────────────────────────────────────────
const VoiceAILandingPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activePlan, setActivePlan] = useState('growth');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCTA = (planId: string) => {
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;
    trackCheckout(plan.id, plan.price, plan.name);
    window.open(plan.link, '_blank');
  };

  return (
    <>
      <Helmet>
        <script>
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_CONFIG.pixelId}');
            fbq('track', 'PageView');
          `}
        </script>
        <noscript>
          {`<img height="1" width="1" style="display:none"
          src="https://www.facebook.com/tr?id=${META_CONFIG.pixelId}&ev=PageView&noscript=1"
          />`}
        </noscript>
        <title>AI Voice Front Desk & AI Caller — Starts Free | KenjiAI</title>
        <meta
          name="description"
          content="Deploy an AI voice agent that answers calls 24/7, qualifies leads, books appointments, and closes deals — starting at $0/month. Plans from $0 to $375/mo with done-for-you ads."
        />
        <link rel="canonical" href="https://kenjiai.com/voice-ai" />
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

        {/* ── NAV ──────────────────────────────────────────────────────── */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/5">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img src="/kenji-logo.webp" alt="KenjiAI" className="h-8 w-auto" />
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm text-gray-400">
              <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </div>
            <a
              href={LINKS.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-green-500/25 transition-all duration-300"
            >
              Book Free Demo
            </a>
          </div>
        </nav>

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-green-500/5 blur-[120px] rounded-full" />
            <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full" />
          </div>

          <div className="max-w-5xl mx-auto text-center relative">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-8"
            >
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              AI Front Desk · Starts at $0/month · No Contract
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.05] tracking-tight mb-6"
            >
              Your Phone Rings.{' '}
              <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                AI Answers.
              </span>
              <br />
              <span className="text-white">Leads Get Booked.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-xl sm:text-2xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              Deploy a human-sounding AI voice agent that handles every inbound call, qualifies every lead,
              and books every appointment —{' '}
              <span className="text-white font-semibold">
                24 hours a day, 7 days a week, starting completely free.
              </span>
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
            >
              <button
                onClick={() => handleCTA('starter')}
                className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-lg px-10 py-5 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:shadow-[0_0_50px_rgba(34,197,94,0.5)] transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-3 w-full sm:w-auto justify-center"
                aria-label="Activate your free AI front desk"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Phone className="w-5 h-5 relative" aria-hidden="true" />
                <span className="relative">Activate My FREE AI Front Desk</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative" aria-hidden="true" />
              </button>
              <a
                href={LINKS.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white border border-white/10 hover:border-white/30 px-8 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 inline-flex items-center gap-2 w-full sm:w-auto justify-center"
              >
                <Play className="w-4 h-4" aria-hidden="true" />
                See a Live Demo
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isVisible ? 1 : 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500"
            >
              {[
                { icon: Shield, text: '30-Day Money-Back Guarantee' },
                { icon: Zap, text: 'Live in Under 24 Hours' },
                { icon: Lock, text: 'No Contract · Cancel Anytime' },
                { icon: Globe, text: '150+ Voices & Languages' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-green-400" aria-hidden="true" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── PROBLEM AGITATION ────────────────────────────────────────── */}
        <section className="py-16 px-4 bg-slate-900/40 border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Every Missed Call Is a{' '}
                <span className="text-red-400">Missed Sale</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                The average business misses 62% of inbound calls. Each one is a prospect who called your
                competitor next.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                {
                  stat: '62%',
                  label: 'of calls go unanswered',
                  sub: 'during business hours alone',
                  color: 'text-red-400',
                },
                {
                  stat: '78%',
                  label: 'of buyers choose the first responder',
                  sub: 'speed-to-lead wins deals',
                  color: 'text-amber-400',
                },
                {
                  stat: '$0',
                  label: 'to start with KenjiAI',
                  sub: 'no excuse to keep missing calls',
                  color: 'text-green-400',
                },
              ].map(({ stat, label, sub, color }) => (
                <div
                  key={stat}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
                >
                  <div className={`text-5xl font-black mb-2 ${color}`}>{stat}</div>
                  <div className="text-white font-bold mb-1">{label}</div>
                  <div className="text-gray-500 text-sm">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ─────────────────────────────────────────────── */}
        <section id="how-it-works" className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
                <Zap className="w-4 h-4" aria-hidden="true" /> Simple 3-Step Setup
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                From Zero to AI Front Desk{' '}
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  in 24 Hours
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                No technical skills required. Our team handles the setup, testing, and tweaking until your
                prospects cannot tell it is AI.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  icon: Phone,
                  title: 'Pick Your Plan',
                  desc: 'Start free or choose a paid plan. We assign you a dedicated AI phone number instantly.',
                  color: 'from-blue-500 to-cyan-500',
                },
                {
                  step: '02',
                  icon: Bot,
                  title: 'We Build Your Agent',
                  desc: 'Our team customizes the voice, script, and conversation flows to match your business. Done-for-you on paid plans.',
                  color: 'from-green-500 to-emerald-500',
                },
                {
                  step: '03',
                  icon: TrendingUp,
                  title: 'Leads Flow In',
                  desc: 'Your AI answers every call, qualifies leads, books appointments, and sends you transcripts — automatically.',
                  color: 'from-amber-500 to-orange-500',
                },
              ].map(({ step, icon: Icon, title, desc, color }) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300"
                >
                  <div className="text-6xl font-black text-white/5 absolute top-4 right-6 select-none" aria-hidden="true">
                    {step}
                  </div>
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${color} rounded-2xl mb-5`}
                  >
                    <Icon className="w-7 h-7 text-white" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                  <p className="text-gray-400 leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES GRID ────────────────────────────────────────────── */}
        <section className="py-20 px-4 bg-slate-900/40 border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                Everything Your Front Desk{' '}
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  Should Do
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                One AI agent that replaces the cost of a full-time receptionist — and works better.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  icon: Clock,
                  title: '24/7 Availability',
                  desc: "Never miss a call — nights, weekends, holidays. Your AI never sleeps.",
                  color: 'text-blue-400',
                },
                {
                  icon: MessageCircle,
                  title: 'Human-Like Conversations',
                  desc: "Natural speech models in 30+ languages. Callers often can't tell it's AI.",
                  color: 'text-green-400',
                },
                {
                  icon: Calendar,
                  title: 'Appointment Booking',
                  desc: 'Syncs with your calendar and books appointments in real time during the call.',
                  color: 'text-purple-400',
                },
                {
                  icon: Target,
                  title: 'Lead Qualification',
                  desc: 'Asks your custom qualifying questions and scores leads before routing them.',
                  color: 'text-amber-400',
                },
                {
                  icon: BarChart3,
                  title: 'Instant Transcriptions',
                  desc: 'Full call transcripts emailed to you after every conversation. Perfect notes, always.',
                  color: 'text-cyan-400',
                },
                {
                  icon: Megaphone,
                  title: 'Outbound AI Caller',
                  desc: 'Proactively call your lead list, follow up on quotes, and re-engage cold contacts.',
                  color: 'text-orange-400',
                },
                {
                  icon: RefreshCw,
                  title: 'CRM Auto-Sync',
                  desc: 'Every call, lead, and booking syncs directly into your KenjiAI CRM pipeline.',
                  color: 'text-pink-400',
                },
                {
                  icon: Headphones,
                  title: 'Live Transfer',
                  desc: 'Hot leads get transferred to a live human instantly — no drop in experience.',
                  color: 'text-indigo-400',
                },
                {
                  icon: Globe,
                  title: '150+ Voices',
                  desc: 'Choose from professional, friendly, or energetic voices across all major languages.',
                  color: 'text-teal-400',
                },
              ].map(({ icon: Icon, title, desc, color }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="flex items-start gap-4 bg-white/5 border border-white/[0.08] rounded-2xl p-6 hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300"
                >
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}
                  >
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold mb-1">{title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── STATS ────────────────────────────────────────────────────── */}
        <section className="py-16 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { target: 50000, suffix: '+', label: 'Calls Handled', sub: 'This month alone' },
                { target: 97, suffix: '%', label: 'Answer Rate', sub: 'vs 38% human avg' },
                { target: 85, suffix: '%', label: 'Cost Reduction', sub: 'vs hiring staff' },
                { target: 24, suffix: '/7', label: 'Always On', sub: 'Zero sick days' },
              ].map(({ target, suffix, label, sub }) => (
                <div
                  key={label}
                  className="text-center bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                  <div className="text-4xl font-black text-white mb-1">
                    <AnimatedCounter target={target} suffix={suffix} />
                  </div>
                  <div className="text-white font-semibold text-sm mb-1">{label}</div>
                  <div className="text-gray-500 text-xs">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── REVIEWS ──────────────────────────────────────────────────── */}
        <section className="py-16 px-4 bg-slate-900/40 border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 mb-5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" aria-hidden="true" />
                <span className="text-amber-300 text-sm font-bold tracking-wide">Real Client Reviews</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
                Don't Take Our Word For It
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Hear from business owners already growing with KenjiAI Voice.
              </p>
            </div>
            <KenjiReviews />
          </div>
        </section>

        {/* ── PRICING ──────────────────────────────────────────────────── */}
        <section id="pricing" className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-green-400 text-xs font-bold uppercase tracking-wider mb-4">
                <DollarSign className="w-4 h-4" aria-hidden="true" /> Simple, Transparent Pricing
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">
                Choose Your{' '}
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  Perfect Plan
                </span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Start free. Scale when ready. Add done-for-you ads when you want us to fill your pipeline too.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 items-stretch">
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative flex flex-col bg-white/5 border rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:-translate-y-1 ${
                    plan.popular
                      ? `${plan.borderColor} shadow-2xl ${plan.glowColor}`
                      : `${plan.borderColor} hover:border-white/20`
                  } ${activePlan === plan.id ? 'ring-2 ring-offset-2 ring-offset-[#0a0a0f] ring-green-500/50' : ''}`}
                  onClick={() => setActivePlan(plan.id)}
                  role="button"
                  aria-pressed={activePlan === plan.id}
                  aria-label={`Select ${plan.name} plan`}
                >
                  {plan.badge && (
                    <div
                      className={`absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r ${plan.color} text-white text-xs font-black px-5 py-1.5 rounded-full whitespace-nowrap`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-6">
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${plan.color} rounded-2xl mb-4`}
                    >
                      <PhoneCall className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-black text-white mb-1">{plan.name}</h3>
                    <p className="text-gray-400 text-sm">{plan.tagline}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-white">{plan.priceLabel}</span>
                      {plan.priceSub && (
                        <span className="text-gray-400 text-lg">{plan.priceSub}</span>
                      )}
                    </div>
                    <div
                      className={`text-sm font-semibold mt-2 bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}
                    >
                      {plan.creditNote}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-1" aria-label={`Features in ${plan.name} plan`}>
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-gray-300 text-sm">
                        <CheckCircle2
                          className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCTA(plan.id);
                    }}
                    className={`w-full py-4 rounded-2xl font-black text-lg transition-all duration-300 bg-gradient-to-r ${plan.color} text-white hover:shadow-lg hover:opacity-90`}
                    aria-label={`Get started with ${plan.name} plan`}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Guarantee strip */}
            <div className="mt-10 bg-green-500/5 border border-green-500/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <Shield className="w-10 h-10 text-green-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <div className="text-white font-black text-lg">
                  30-Day "Make You Money" Guarantee
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  Use KenjiAI Voice for 30 days. If you don't have more leads, more booked appointments,
                  or more revenue — email us for a full refund. No forms. No hoops. You keep everything we
                  built.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── ADS CALLOUT ──────────────────────────────────────────────── */}
        <section className="py-16 px-4 bg-gradient-to-r from-amber-900/20 to-orange-900/20 border-y border-amber-500/20">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-400 px-4 py-2 rounded-full text-sm font-bold mb-6">
                  <Megaphone className="w-4 h-4" aria-hidden="true" /> Scale Plan Exclusive
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">
                  We Run Your Ads.
                  <br />
                  <span className="text-amber-400">Your AI Answers Every Lead.</span>
                </h2>
                <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                  The $375/month Scale plan is the only offer where we handle the full top-of-funnel for
                  you. Our team builds and launches your Meta and Google ad campaigns, routes every lead
                  directly into your AI front desk, and refreshes creative monthly so your campaigns never
                  go stale.
                </p>
                <ul className="space-y-3 mb-8">
                  {[
                    'Ad creative built & launched in week 1',
                    'Leads flow directly into your AI agent',
                    'Monthly ad refresh + optimization',
                    'Dedicated growth strategist',
                    '5,000 AI voice credits included',
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-300">
                      <CheckCircle2
                        className="w-5 h-5 text-amber-400 flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleCTA('scale')}
                  className="group bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black text-lg px-10 py-5 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_50px_rgba(245,158,11,0.5)] transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-3"
                  aria-label="Get Scale plus Ads plan for $375 per month"
                >
                  Get Scale + Ads for $375/mo
                  <ArrowRight
                    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Target, label: 'Qualified Leads', value: '3x more', color: 'text-amber-400' },
                  { icon: Bot, label: 'AI Answers', value: '100% of calls', color: 'text-green-400' },
                  { icon: Calendar, label: 'Appointments', value: 'Auto-booked', color: 'text-blue-400' },
                  {
                    icon: BarChart3,
                    label: 'Monthly Reporting',
                    value: 'Full transparency',
                    color: 'text-purple-400',
                  },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div
                    key={label}
                    className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center"
                  >
                    <Icon className={`w-8 h-8 ${color} mx-auto mb-3`} aria-hidden="true" />
                    <div className="text-white font-black text-sm mb-1">{value}</div>
                    <div className="text-gray-500 text-xs">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section id="faq" className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black text-white mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-400 text-lg">Everything you need to know before you start.</p>
            </div>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 p-6 text-left hover:bg-white/5 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                  >
                    <span className="text-white font-bold">{faq.q}</span>
                    {openFaq === i ? (
                      <ChevronUp
                        className="w-5 h-5 text-green-400 flex-shrink-0"
                        aria-hidden="true"
                      />
                    ) : (
                      <ChevronDown
                        className="w-5 h-5 text-gray-400 flex-shrink-0"
                        aria-hidden="true"
                      />
                    )}
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        id={`faq-answer-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────── */}
        <section className="py-20 px-4 bg-gradient-to-b from-slate-900/40 to-[#0a0a0f]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-green-900/30 to-cyan-900/30 border border-green-400/20 rounded-3xl p-12"
            >
              <Sparkles
                className="w-14 h-14 text-green-400 mx-auto mb-6"
                aria-hidden="true"
              />
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
                Stop Losing Leads to Voicemail.
                <br />
                <span className="bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                  Start Free Today.
                </span>
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Your AI front desk is ready to deploy in 24 hours. No contract. No risk. Just more answered
                calls, more qualified leads, and more booked appointments.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <button
                  onClick={() => handleCTA('starter')}
                  className="group bg-gradient-to-r from-green-600 to-emerald-600 text-white font-black text-xl px-12 py-6 rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.4)] hover:shadow-[0_0_60px_rgba(34,197,94,0.6)] transform hover:-translate-y-1 transition-all duration-300 inline-flex items-center gap-3 justify-center"
                  aria-label="Activate your free AI front desk now"
                >
                  <Phone className="w-6 h-6" aria-hidden="true" />
                  Activate My FREE AI Front Desk
                  <ArrowRight
                    className="w-6 h-6 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                </button>
                <a
                  href={LINKS.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/20 hover:border-white/40 text-white font-bold text-xl px-10 py-6 rounded-2xl transition-all duration-300 inline-flex items-center gap-2 justify-center"
                >
                  Book a Demo Call
                </a>
              </div>
              <p className="text-gray-500 text-sm">
                ✓ $0 to start &nbsp;·&nbsp; ✓ Live in 24 hours &nbsp;·&nbsp; ✓ 30-day guarantee
                &nbsp;·&nbsp; ✓ Cancel anytime
              </p>
            </motion.div>
            <div className="mt-10">
              <ResultsDisclaimer />
            </div>
          </div>
        </section>

        {/* ── FOOTER ───────────────────────────────────────────────────── */}
        <footer className="py-10 px-4 border-t border-white/5 text-center text-gray-600 text-sm">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>Copyright © 2026 Media Traffics | KenjiAI. All Rights Reserved.</div>
            <div className="flex gap-6">
              <a
                href="https://voice.kenjiai.com/affiliate"
                className="hover:text-gray-400 transition-colors"
              >
                Partners / Affiliates
              </a>
              <a
                href="https://voice.kenjiai.com/care"
                className="hover:text-gray-400 transition-colors"
              >
                Care Center
              </a>
              <a
                href="https://app.kenjiai.com"
                className="hover:text-gray-400 transition-colors"
              >
                Login
              </a>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
};

export default VoiceAILandingPage;
