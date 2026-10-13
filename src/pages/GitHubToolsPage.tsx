import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Github, ArrowUpRight, Bot, Video, Palette, LineChart, Database, Briefcase } from 'lucide-react';

type Repo = { name: string; owner: string; description: string; url: string };
type Category = { title: string; icon: React.ElementType; color: string; repos: Repo[] };

const CATEGORIES: Category[] = [
  {
    title: 'AI agents and Claude Code',
    icon: Bot,
    color: 'from-cyan-500 to-blue-500',
    repos: [
      { name: 'oh-my-claudecode', owner: 'Yeachan-Heo', description: 'Multi-agent orchestration layer for Claude Code with specialized agents, skills, and workflows.', url: 'https://github.com/Yeachan-Heo/oh-my-claudecode' },
      { name: 'superpowers', owner: 'obra', description: 'A full software development method for coding agents, built on composable skills.', url: 'https://github.com/obra/superpowers' },
      { name: 'get-shit-done', owner: 'gsd-build', description: 'Lightweight meta-prompting and spec-driven development system that keeps Claude sharp as its context fills up.', url: 'https://github.com/gsd-build/get-shit-done' },
      { name: 'ruflo', owner: 'ruvnet', description: 'Multi-agent orchestration for Claude Code: coordinated swarms, shared memory, and specialized agents.', url: 'https://github.com/ruvnet/ruflo' },
      { name: 'hermes-agent', owner: 'NousResearch', description: 'Self-improving AI agent from Nous Research that builds skills from experience and works with any model.', url: 'https://github.com/NousResearch/hermes-agent' },
      { name: 'mission-control', owner: 'builderz-labs', description: 'Self-hosted dashboard to manage AI agent fleets, dispatch tasks, and track costs.', url: 'https://github.com/builderz-labs/mission-control' },
      { name: 'Claude-Code-Agent-Monitor', owner: 'hoangsonww', description: 'Real-time dashboard for Claude Code sessions, tool usage, and subagents, wired in through Claude Code hooks.', url: 'https://github.com/hoangsonww/Claude-Code-Agent-Monitor' },
      { name: 'Agent-Quest', owner: 'FulAppiOS', description: 'Shows running Claude Code and Codex sessions as heroes moving around a 2D fantasy village.', url: 'https://github.com/FulAppiOS/Agent-Quest' },
      { name: 'Claw3D', owner: 'iamlukethedev', description: 'A 3D workspace where AI agents collaborate, review code, run tests, and execute tasks.', url: 'https://github.com/iamlukethedev/Claw3D' },
      { name: 'caveman', owner: 'JuliusBrussee', description: 'Makes coding agents talk and read less so they use fewer tokens.', url: 'https://github.com/JuliusBrussee/caveman' },
      { name: 'andrej-karpathy-skills', owner: 'multica-ai', description: 'A single CLAUDE.md file that improves Claude Code behavior, based on Andrej Karpathy\'s notes on LLM coding pitfalls.', url: 'https://github.com/multica-ai/andrej-karpathy-skills' },
      { name: 'awesome-claude-plugins', owner: 'quemsah', description: 'A ranked list of the top Claude Code plugin repositories.', url: 'https://github.com/quemsah/awesome-claude-plugins' },
      { name: 'vision-demo', owner: 'livekit-examples', description: 'LiveKit sample app for a voice AI assistant that takes realtime audio and video input.', url: 'https://github.com/livekit-examples/vision-demo' },
    ],
  },
  {
    title: 'Video and content',
    icon: Video,
    color: 'from-rose-500 to-orange-500',
    repos: [
      { name: 'remotion', owner: 'remotion-dev', description: 'Make videos programmatically with React.', url: 'https://github.com/remotion-dev/remotion' },
      { name: 'faster-whisper', owner: 'SYSTRAN', description: 'Fast speech-to-text transcription, a reimplementation of OpenAI Whisper.', url: 'https://github.com/SYSTRAN/faster-whisper' },
      { name: 'claude-code-video-toolkit', owner: 'digitalsamba', description: 'Tell Claude Code what video you want and it writes the script, makes the voiceover, music, and visuals, and renders the MP4.', url: 'https://github.com/digitalsamba/claude-code-video-toolkit' },
      { name: 'buttercut', owner: 'barefootford', description: 'Claude analyzes your footage and builds rough cuts for Final Cut, Premiere, and Resolve.', url: 'https://github.com/barefootford/buttercut' },
      { name: 'video-editor-for-claude-code', owner: 'seedprod', description: 'Cuts the "thinking" pauses out of Claude Code screen recordings automatically.', url: 'https://github.com/seedprod/video-editor-for-claude-code' },
      { name: 'hyperframes-student-kit', owner: 'nateherkai', description: 'Motion-graphics video projects built in plain HTML and GSAP that you can study and rebuild.', url: 'https://github.com/nateherkai/hyperframes-student-kit' },
      { name: 'MoneyPrinterTurbo', owner: 'harry0703', description: 'Give it a topic and it writes the script, matches footage, adds subtitles and music, and outputs a short video.', url: 'https://github.com/harry0703/MoneyPrinterTurbo' },
      { name: 'MoneyPrinterV2', owner: 'FujiwaraChoki', description: 'Python app that automates online content and money-making workflows.', url: 'https://github.com/FujiwaraChoki/MoneyPrinterV2' },
      { name: 'youtube-automation-agent', owner: 'darkzOGx', description: 'Agent that automates YouTube video creation and publishing.', url: 'https://github.com/darkzOGx/youtube-automation-agent' },
      { name: 'koda-stack', owner: 'timkoda', description: '10 creative agents for Claude Code that run a content pipeline from script to published reel.', url: 'https://github.com/timkoda/koda-stack' },
      { name: 'Recordly', owner: 'webadderallorg', description: 'Open-source screen recorder and editor for walkthroughs, demos, and product videos.', url: 'https://github.com/webadderallorg/Recordly' },
    ],
  },
  {
    title: 'Images and design',
    icon: Palette,
    color: 'from-fuchsia-500 to-purple-500',
    repos: [
      { name: 'impeccable', owner: 'pbakaus', description: 'Design guidance for AI coding agents so frontends stop looking like the same template.', url: 'https://github.com/pbakaus/impeccable' },
      { name: 'nano-banana-claude-plugin', owner: 'Ibrahim-3d', description: 'Generate and edit images inside Claude Code, powered by Google Gemini.', url: 'https://github.com/Ibrahim-3d/nano-banana-claude-plugin' },
      { name: 'Qwen-Image', owner: 'QwenLM', description: 'Open image model from Qwen that is strong at rendering text and precise image editing.', url: 'https://github.com/QwenLM/Qwen-Image' },
      { name: 'Open-Generative-AI', owner: 'Anil-matcha', description: 'Open-source app for generating AI images and videos across 200+ models.', url: 'https://github.com/Anil-matcha/Open-Generative-AI' },
    ],
  },
  {
    title: 'Trading',
    icon: LineChart,
    color: 'from-emerald-500 to-teal-500',
    repos: [
      { name: 'TradingAgents', owner: 'TauricResearch', description: 'Multi-agent LLM framework for financial trading research.', url: 'https://github.com/TauricResearch/TradingAgents' },
      { name: 'claude-trading-skills', owner: 'agiprolabs', description: 'Collection of trading, DeFi, and quant finance skills for Claude Code and other agents.', url: 'https://github.com/agiprolabs/claude-trading-skills' },
      { name: 'claude-trading-skills', owner: 'tradermonty', description: 'Claude skills for market review, risk management, trade planning, and journaling.', url: 'https://github.com/tradermonty/claude-trading-skills' },
      { name: 'kalshi-trader-plugin', owner: 'austron24', description: 'Claude Code plugin for research and trading on Kalshi prediction markets.', url: 'https://github.com/austron24/kalshi-trader-plugin' },
      { name: 'kalshi-ai-trading-bot', owner: 'ryanfrigo', description: 'Kalshi trading bot where several AI models have to agree before it enters a trade.', url: 'https://github.com/ryanfrigo/kalshi-ai-trading-bot' },
    ],
  },
  {
    title: 'Data and APIs',
    icon: Database,
    color: 'from-amber-500 to-yellow-500',
    repos: [
      { name: 'public-apis', owner: 'public-apis', description: 'Community-curated list of free public APIs.', url: 'https://github.com/public-apis/public-apis' },
      { name: 'awesome-free-llm-apis', owner: 'mnfst', description: 'LLM APIs with permanent free tiers for text inference.', url: 'https://github.com/mnfst/awesome-free-llm-apis' },
      { name: 'awesome-freellm-apis', owner: 'open-free-llm-api', description: 'Machine-readable directory of free LLM APIs with rate limits and setup snippets.', url: 'https://github.com/open-free-llm-api/awesome-freellm-apis' },
      { name: 'HomeHarvest', owner: 'Bunsly', description: 'Python library that scrapes real estate listings into clean data.', url: 'https://github.com/Bunsly/HomeHarvest' },
      { name: 'RuView', owner: 'ruvnet', description: 'Edge AI system that senses activity in a space from WiFi signals instead of cameras.', url: 'https://github.com/ruvnet/RuView' },
    ],
  },
  {
    title: 'Business and CRM',
    icon: Briefcase,
    color: 'from-sky-500 to-indigo-500',
    repos: [
      { name: 'crm', owner: 'trycompai', description: 'Agentic-first CRM where AI does the research and record keeping.', url: 'https://github.com/trycompai/crm' },
      { name: 'paperclip', owner: 'paperclipai', description: 'Server and dashboard that runs a team of AI agents with goals, budgets, and cost tracking.', url: 'https://github.com/paperclipai/paperclip' },
    ],
  },
];

const GitHubToolsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Open-Source Tools We Use | KenjiAI</title>
        <meta name="description" content="The open-source GitHub projects KenjiAI uses for AI agents, video, design, trading research, and data, with a plain description of each." />
        <link rel="canonical" href="https://kenjiai.com/github-tools" />
        <meta property="og:title" content="Open-Source Tools We Use | KenjiAI" />
        <meta property="og:url" content="https://kenjiai.com/github-tools" />
      </Helmet>

      <div className="min-h-screen px-4 py-16 sm:py-20" style={{ backgroundColor: '#0B0E14' }}>
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(0,255,255,0.06) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <a href="/helpful-links" aria-label="Back to helpful links">
              <img src="/kenji-logo.webp" alt="KenjiAI" className="h-12 sm:h-14 w-auto object-contain mb-6" />
            </a>
            <h1 className="text-white text-2xl sm:text-3xl font-bold mb-3">Open-Source Tools We Use</h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-xl">
              These are the GitHub projects behind a lot of our day-to-day work at KenjiAI. They're all free and open source. Click any card to see the repo.
            </p>
          </motion.div>

          <div className="flex flex-col gap-12">
            {CATEGORIES.map((cat) => (
              <section key={cat.title}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                    <cat.icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-white text-lg sm:text-xl font-semibold">{cat.title}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {cat.repos.map((repo) => (
                    <a
                      key={repo.url}
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 bg-gray-900/60 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-colors duration-300"
                    >
                      <Github className="flex-shrink-0 w-5 h-5 text-gray-500 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold text-sm leading-tight break-words">{repo.name}</div>
                        <div className="text-gray-500 text-xs mt-0.5">by {repo.owner}</div>
                        <div className="text-gray-400 text-xs sm:text-sm leading-snug mt-2">{repo.description}</div>
                      </div>
                      <ArrowUpRight className="flex-shrink-0 w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                    </a>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="text-gray-600 text-xs text-center mt-16">
            Each project belongs to its own authors. KenjiAI isn't affiliated with them.
            <br />
            &copy; {new Date().getFullYear()} KenjiAI. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default GitHubToolsPage;
