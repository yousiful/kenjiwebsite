import React from 'react';
import { Helmet } from 'react-helmet-async';
import PageSchema from '../components/PageSchema';
import { motion } from 'framer-motion';
import { Github, ArrowUpRight, UserPlus, Link2, Video, BadgeDollarSign } from 'lucide-react';

const SIGNUP_URL = 'https://voice.kenjiai.com/affiliate?utm_source=affiliate_page&utm_medium=web&utm_campaign=creator_partners';

const STEPS = [
  {
    icon: UserPlus,
    title: 'Sign up as a partner',
    body: 'Fill out the short partner form. It takes about a minute and it is free.',
  },
  {
    icon: Link2,
    title: 'Get your affiliate link',
    body: 'We email you your partner login. Log in to your partner dashboard and copy your personal Kenji link. Every sign-up through it is tracked to you.',
  },
  {
    icon: Video,
    title: 'Make content about a free tool',
    body: 'Pick one of our free GitHub tools below, show it working, and put the tool link and your Kenji link in your description, bio or pinned comment.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Earn 35%',
    body: 'When someone signs up for Kenji AI through your link, you earn 35% commission. You can see every referral and payout in your dashboard.',
  },
];

const TOOLS = [
  {
    name: 'kenji-clip-engine',
    url: 'https://github.com/yousiful/kenji-clip-engine',
    what: 'Turns any YouTube video into captioned vertical clips, then posts them to Facebook, Instagram, TikTok, YouTube Shorts, LinkedIn and Pinterest through Kenji.',
    idea: 'Video idea: "I turned one YouTube video into 10 Shorts with a free tool."',
  },
  {
    name: 'no-website-finder',
    url: 'https://github.com/yousiful/no-website-finder',
    what: 'Finds local businesses on Google Maps that have no website and loads them into Kenji as leads.',
    idea: 'Video idea: "How agencies find clients who need a website, free."',
  },
  {
    name: 'meta-ads-kill-switch',
    url: 'https://github.com/yousiful/meta-ads-kill-switch',
    what: 'Pauses Meta ads that spend over a limit with zero results, so a bad ad set can’t burn the budget overnight.',
    idea: 'Video idea: "This script stops Facebook ads from wasting your money."',
  },
  {
    name: 'reel-editing-toolkit',
    url: 'https://github.com/yousiful/reel-editing-toolkit',
    what: 'Our full reel pipeline: animated captions, cue cards, zooms and sound effects, built with Remotion.',
    idea: 'Video idea: "The open-source setup behind our reels."',
  },
];

const DESCRIPTION_TEMPLATE = `Free tool from this video: https://github.com/yousiful/kenji-clip-engine
The platform it posts through (Kenji AI): YOUR_AFFILIATE_LINK
(Affiliate link: I earn a commission if you sign up, at no cost to you.)`;

const AffiliatePage: React.FC = () => {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(DESCRIPTION_TEMPLATE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <PageSchema path="/affiliate" name={'Kenji AI Partner Program'} description={'Earn 35% commission by sharing free Kenji AI GitHub tools with your audience. Step-by-step sign-up for creators.'} />
      <Helmet>
        <title>Partner Program, Earn 35% | KenjiAI</title>
        <meta name="description" content="Earn 35% commission by sharing free Kenji AI GitHub tools with your audience. Step-by-step sign-up for creators." />
        <link rel="canonical" href="https://kenjiai.com/affiliate" />
        <meta property="og:title" content="Kenji AI Partner Program, earn 35%" />
        <meta property="og:url" content="https://kenjiai.com/affiliate" />
      </Helmet>

      <div className="min-h-screen px-4 py-16 sm:py-20" style={{ backgroundColor: '#0B0E14' }}>
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(255,213,74,0.07) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center mb-12"
          >
            <a href="/" aria-label="KenjiAI home">
              <img src="/kenji-logo.webp" alt="KenjiAI" className="h-12 sm:h-14 w-auto object-contain mb-6" />
            </a>
            <h1 className="text-white text-3xl sm:text-4xl font-bold mb-4">Earn 35% sharing free tools</h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl">
              We build free, open-source tools for marketers and agencies. Show one to your audience, and when someone signs up for Kenji AI through your link, you earn 35% commission.
            </p>
            <a
              href={SIGNUP_URL}
              className="mt-8 inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-[#0B0E14] bg-[#ffd54a] hover:bg-[#ffcc1f] transition-colors"
            >
              Become a partner <ArrowUpRight className="w-4 h-4" />
            </a>
          </motion.div>

          <section className="mb-14">
            <h2 className="text-white text-xl sm:text-2xl font-semibold mb-5">How it works</h2>
            <ol className="flex flex-col gap-3">
              {STEPS.map((s, i) => (
                <li key={s.title} className="flex items-start gap-4 bg-gray-900/60 border border-gray-800 rounded-xl p-4 sm:p-5">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#ffd54a] text-[#0B0E14] font-bold flex items-center justify-center">{i + 1}</div>
                  <div className="min-w-0">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <s.icon className="w-4 h-4 text-[#ffd54a]" /> {s.title}
                    </h3>
                    <p className="text-gray-400 text-sm sm:text-base leading-relaxed mt-1">{s.body}</p>
                    {i === 0 && (
                      <a href={SIGNUP_URL} className="inline-flex items-center gap-1 text-[#ffd54a] text-sm font-semibold mt-2 hover:underline">
                        Open the partner form <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mb-14">
            <h2 className="text-white text-xl sm:text-2xl font-semibold mb-2">Free tools you can feature</h2>
            <p className="text-gray-400 text-sm sm:text-base mb-5">Each one has a full guide with screenshots, and each one runs through Kenji, so your viewers have a reason to sign up.</p>
            <div className="grid grid-cols-1 gap-3">
              {TOOLS.map((t) => (
                <a
                  key={t.url}
                  href={t.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 bg-gray-900/60 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-colors duration-300"
                >
                  <Github className="flex-shrink-0 w-5 h-5 text-gray-500 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm sm:text-base break-words">{t.name}</h3>
                    <p className="text-gray-400 text-sm leading-snug mt-1">{t.what}</p>
                    <p className="text-[#ffd54a]/90 text-xs sm:text-sm mt-2">{t.idea}</p>
                  </div>
                  <ArrowUpRight className="flex-shrink-0 w-4 h-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
          </section>

          <section className="mb-14">
            <h2 className="text-white text-xl sm:text-2xl font-semibold mb-2">What to put in your description</h2>
            <p className="text-gray-400 text-sm sm:text-base mb-4">Swap in your own link. Always say it&apos;s an affiliate link; it&apos;s the law in the US and your audience trusts you more for it.</p>
            <pre className="whitespace-pre-wrap break-words bg-black/50 border border-gray-800 rounded-xl p-4 text-gray-300 text-xs sm:text-sm">{DESCRIPTION_TEMPLATE}</pre>
            <button onClick={copy} className="mt-3 text-sm font-semibold text-[#ffd54a] hover:underline">
              {copied ? 'Copied' : 'Copy this text'}
            </button>
          </section>

          <section className="mb-14">
            <h2 className="text-white text-xl sm:text-2xl font-semibold mb-5">Questions</h2>
            <div className="flex flex-col gap-4 text-sm sm:text-base">
              <div>
                <h3 className="text-white font-semibold">Do I need to use Kenji myself?</h3>
                <p className="text-gray-400 mt-1">No, but it helps. The tools post through Kenji, so showing it working makes the best content.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold">How much do I earn?</h3>
                <p className="text-gray-400 mt-1">35% commission on Kenji AI sign-ups that come through your link. Your dashboard shows every referral and payout.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold">Can I promote it on any platform?</h3>
                <p className="text-gray-400 mt-1">Yes. YouTube, Instagram, Facebook, TikTok, LinkedIn, a newsletter or a blog all work. Don&apos;t spam groups or DMs with your link.</p>
              </div>
            </div>
          </section>

          <div className="text-center">
            <a
              href={SIGNUP_URL}
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 font-semibold text-[#0B0E14] bg-[#ffd54a] hover:bg-[#ffcc1f] transition-colors"
            >
              Become a partner <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          <p className="text-gray-600 text-xs text-center mt-16">&copy; {new Date().getFullYear()} KenjiAI. All rights reserved.</p>
        </div>
      </div>
    </>
  );
};

export default AffiliatePage;
