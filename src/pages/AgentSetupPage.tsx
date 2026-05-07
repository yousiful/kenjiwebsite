import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  Code, Bot, TrendingUp, Zap, CheckCircle, ArrowRight,
  Monitor, DollarSign, Shield, Star, ChevronDown, ChevronUp,
  Brain, Settings, BarChart3, GitBranch
} from 'lucide-react';

const CTA_URL = 'https://go.mediatraffics.com/price';

const WHAT_YOU_GET = [
  {
    icon: Code,
    title: 'Claude Code + OpenClaw Installed',
    desc: 'We install and configure Claude Code and OpenClaw on your actual machine — not a demo, not a SaaS dashboard. Real AI agents living on your computer.',
  },
  {
    icon: GitBranch,
    title: 'Wired To Your Business',
    desc: 'Your agents get connected to your CRM, email, calendar, GHL, or any tool you already use. They run your workflows, follow up with leads, and handle ops.',
  },
  {
    icon: BarChart3,
    title: 'Automated Trading & Betting Bots',
    desc: 'Want to compound on Kalshi prediction markets or automate a trading strategy? We build and deploy your bot with real capital management rules.',
  },
  {
    icon: Brain,
    title: 'Custom Agents For Your Use Case',
    desc: 'Whether it\'s content creation, lead gen, customer support, or market analysis — we build agents that match exactly how your business makes money.',
  },
  {
    icon: Settings,
    title: 'Full Local Stack, You Own It',
    desc: 'No subscriptions to us. No platform lock-in. Everything runs on your machine. You own the code, the credentials, and the output.',
  },
  {
    icon: Shield,
    title: 'Hands-On Walkthrough Included',
    desc: 'We don\'t just hand you files and disappear. We walk you through every agent live so you understand what\'s running and how to expand it.',
  },
];

const RESULTS = [
  { metric: '48h', label: 'Average Setup Time', sub: 'From payment to running' },
  { metric: '10x', label: 'Output Per Hour', sub: 'vs. doing it manually' },
  { metric: '100%', label: 'You Own It', sub: 'No recurring fees to us' },
  { metric: '24/7', label: 'Agents Run', sub: 'While you sleep' },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Book Your Setup Call',
    desc: 'We get on a call to map your business, goals, and the tools you already use. This is where we decide exactly which agents to build.',
  },
  {
    step: '02',
    title: 'We Build & Install Everything',
    desc: 'Our team sets up Claude Code, OpenClaw, and any custom bots on your machine. We handle all the config, API keys, and integrations.',
  },
  {
    step: '03',
    title: 'Your Agents Go Live',
    desc: 'We walk you through what\'s running live on screen. Your agents start working that same day — trading, automating, or generating leads.',
  },
];

const USE_CASES = [
  {
    icon: DollarSign,
    title: 'Business Owners',
    points: [
      'AI follow-up agent for your leads',
      'Content agent that posts daily',
      'Customer support bot that never sleeps',
      'Proposal & email writing on autopilot',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Traders & Market Players',
    points: [
      'Kalshi prediction market compounder',
      'Safe-position sizing built in',
      'Auto-scan for high-edge opportunities',
      'Runs 24/7, compounds automatically',
    ],
  },
  {
    icon: Zap,
    title: 'Operators & Closers',
    points: [
      'GHL automation agents',
      'Appointment booking flows',
      'Pipeline management AI',
      'Report generation & analytics',
    ],
  },
];

const FAQS = [
  {
    q: 'Do I need to know how to code?',
    a: 'No. We handle everything. You just need a computer (Windows or Mac) and internet access. We do the install, setup, and walkthrough live with you.',
  },
  {
    q: 'What computer specs do I need?',
    a: 'Any modern Mac or Windows PC made in the last 5 years works. 8GB RAM minimum, ideally 16GB. We\'ll tell you exactly what\'s needed on our call.',
  },
  {
    q: 'How is this different from a SaaS tool?',
    a: 'These agents live on YOUR machine. You own the code. There\'s no monthly platform fee to us. The only ongoing costs are API usage (OpenRouter/Anthropic) which is typically a few dollars a month.',
  },
  {
    q: 'Can you set up the Kalshi trading bot for me?',
    a: 'Yes. We set up the safe-compounder bot with position sizing, market filters, and your Kalshi API. You control the capital — we just build and configure the system.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most setups are done within 48 hours of your discovery call. Complex multi-agent builds may take a few extra days.',
  },
  {
    q: 'What if I want to add more agents later?',
    a: 'We offer expansion sessions at a reduced rate for existing clients. Once the base stack is on your machine, adding new agents is much faster.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Derek M.',
    role: 'Agency Owner',
    avatar: 'DM',
    result: 'Saved 30h/week',
    quote: 'They set up Claude Code and a GHL automation agent in one session. My follow-up sequences now run themselves. I saved 30 hours a week immediately.',
  },
  {
    name: 'Priya S.',
    role: 'Solo Trader',
    avatar: 'PS',
    result: '+$2,400 in 3 weeks',
    quote: 'The Kalshi bot they configured has been compounding daily. It\'s small but it never stops. Made $2,400 in the first 3 weeks without touching it.',
  },
  {
    name: 'James T.',
    role: 'E-commerce Founder',
    avatar: 'JT',
    result: '10x content output',
    quote: 'I\'m posting 10x more content with half the effort. The agent writes, formats, and schedules everything. My organic traffic is up 300% in 60 days.',
  },
];

export default function AgentSetupPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>Done-For-You AI Agent Setup | KenjiAI</title>
        <meta
          name="description"
          content="We install Claude Code, OpenClaw, and custom AI agents on your computer — wired to your business to make money, automate operations, or trade markets. Done for you in 48 hours."
        />
      </Helmet>

      <div className="bg-[#0B0E14] text-white min-h-screen font-sans">

        {/* HERO */}
        <section className="relative overflow-hidden pt-20 pb-16 px-4">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-[#0B0E14] to-purple-900/15 pointer-events-none" />
          <div className="relative max-w-4xl mx-auto text-center">

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-8"
            >
              <Bot className="w-3.5 h-3.5" />
              Done-For-You AI Agent Setup
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 leading-tight"
            >
              We Install AI Agents On Your Computer{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                That Make You Money While You Sleep
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Claude Code. OpenClaw. Custom trading bots. All installed on <em>your</em> machine, wired to your business — running 24/7. No tech skills needed. Done in 48 hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-5px_rgba(59,130,246,0.5)] text-lg"
              >
                Get My Agents Set Up
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <span className="text-gray-500 text-sm">One-time setup · You own everything</span>
            </motion.div>

            {/* Trust bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-6 text-gray-500 text-sm"
            >
              {['Works on Mac & Windows', 'No coding required', '48h turnaround', 'Full walkthrough included'].map(t => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* METRICS */}
        <section className="py-12 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {RESULTS.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{r.metric}</div>
                <div className="text-white font-semibold text-sm mt-1">{r.label}</div>
                <div className="text-gray-500 text-xs mt-0.5">{r.sub}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                Everything We Set Up <span className="text-blue-400">For You</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">One session. Everything installed. Yours forever.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {WHAT_YOU_GET.map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-gray-900/60 border border-white/5 hover:border-blue-500/30 rounded-2xl p-6 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* WHO IT'S FOR */}
        <section className="py-20 px-4 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                Who This Is <span className="text-purple-400">Built For</span>
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">Whether you want to automate your business, trade smarter, or just stop doing manual work.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {USE_CASES.map((uc, i) => (
                <motion.div
                  key={uc.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-900/60 border border-white/5 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                      <uc.icon className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="font-bold text-white">{uc.title}</h3>
                  </div>
                  <ul className="space-y-2.5">
                    {uc.points.map(p => (
                      <li key={p} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                How It <span className="text-blue-400">Works</span>
              </h2>
              <p className="text-gray-400">Three steps. Fully done for you.</p>
            </div>
            <div className="space-y-6">
              {HOW_IT_WORKS.map((step, i) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="flex gap-5 bg-gray-900/60 border border-white/5 rounded-2xl p-6"
                >
                  <div className="text-3xl font-black text-blue-500/30 font-mono leading-none flex-shrink-0 w-10 pt-1">{step.step}</div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-20 px-4 bg-white/[0.02] border-y border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                Real Results From <span className="text-green-400">Real Setups</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-gray-900/60 border border-white/5 rounded-2xl p-6"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-400">{t.avatar}</div>
                      <div>
                        <div className="font-semibold text-white text-sm">{t.name}</div>
                        <div className="text-gray-500 text-xs">{t.role}</div>
                      </div>
                    </div>
                    <span className="text-green-400 text-xs font-bold bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">{t.result}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING CTA */}
        <section className="py-20 px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-gray-900 to-gray-900/60 border border-blue-500/20 rounded-3xl p-8 sm:p-12 text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Monitor className="w-3 h-3" />
                One-Time Setup
              </div>
              <h2 className="text-3xl sm:text-4xl font-black mb-4">
                Ready To Have Agents<br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Working For You By Tomorrow?</span>
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                One payment. 48 hours. Your own AI agent stack running on your machine, connected to your business, making you money.
              </p>
              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-5px_rgba(59,130,246,0.5)] text-lg mb-4"
              >
                Get My Setup Done Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <div className="text-gray-500 text-sm">Pricing revealed after discovery call · Limited spots per week</div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-4 pb-24">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black mb-3">Frequently Asked <span className="text-blue-400">Questions</span></h2>
            </div>
            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-gray-900/60 border border-white/5 rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="font-semibold text-white text-sm pr-4">{faq.q}</span>
                    {openFaq === i
                      ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                      {faq.a}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Final CTA */}
            <div className="mt-12 text-center">
              <a
                href={CTA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-5px_rgba(59,130,246,0.5)]"
              >
                Book My Setup Call
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-gray-600 text-xs mt-3">Limited availability · Pricing on call · 48h turnaround</p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
