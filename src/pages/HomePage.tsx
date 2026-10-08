import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Minus, Phone } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { ReviewsNative } from '../components/ReviewsNative';
import { ResultsDisclaimer } from '../components/ResultsDisclaimer';

/* Homepage, rebuilt 2026-10-08 per Yousif: ads agency first, software second, results over features,
   no demos and no call center on this page. One argument (same ads, with vs without a system)
   and one action (question 1 of the growth quiz, answered right here). */

const QUIZ = '/growth-quiz';
const PHONE_DISPLAY = '(213) 344-0705';
const PHONE_TEL = '+12133440705';
const LOW_TICKET_URL = 'https://startlearning.kenjiai.com';

const ROWS: { label: string; without: string; withUs: string }[] = [
  { label: 'The ad', without: 'Boosted posts and guesswork', withUs: 'Ads written and tested every week by a real media buying team' },
  { label: 'The lead', without: 'Sits in an inbox for hours', withUs: 'Gets a reply in seconds, day or night' },
  { label: 'The follow-up', without: 'One call, then nothing', withUs: 'Texts, emails and reminders until they book' },
  { label: 'The calendar', without: 'Empty slots and no-shows', withUs: 'Booked appointments that actually show up' },
];

// Same options as question 1 of the growth quiz; the quiz reads ?role= and continues at question 2.
const ROLES: { value: string; label: string }[] = [
  { value: 'owner', label: 'I own a business that’s already making sales' },
  { value: 'agency', label: 'I run a marketing agency' },
  { value: 'launching', label: 'I’m about to launch a business' },
  { value: 'browsing', label: 'I’m just looking around' },
];

const EASE = [0.16, 1, 0.3, 1] as const;

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Media Traffics | KenjiAI',
  url: 'https://kenjiai.com',
  description:
    'Ads agency and follow-up software for business owners. We run your Meta, Google and YouTube ads, and KenjiAI follows up with every lead so attention turns into income.',
  telephone: '+1-213-344-0705',
  foundingDate: '2013',
  areaServed: 'US',
};

const QuizStart: React.FC<{ idPrefix: string }> = ({ idPrefix }) => {
  const navigate = useNavigate();
  return (
    <fieldset>
      <legend id={`${idPrefix}-q`} className="display text-[22px] sm:text-[26px] font-extrabold text-[#F3EEE6]">
        Which best describes you?
      </legend>
      <p className="mt-1.5 text-[15px] text-[#A9B4C4]">7 quick questions to see if you qualify. About 60 seconds.</p>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ROLES.map((r, i) => (
          <button
            key={r.value}
            type="button"
            onClick={() => navigate(`${QUIZ}?role=${r.value}`)}
            className={`group flex items-center gap-3.5 rounded-2xl border px-4 py-4 text-left text-[16px] sm:text-[17px] font-medium transition-colors ${
              'border-white/12 bg-white/[0.035] text-[#F3EEE6] [@media(hover:hover)]:hover:border-[#5EEAD4] [@media(hover:hover)]:hover:bg-[#5EEAD4]/12 focus-visible:border-[#5EEAD4] active:border-[#5EEAD4]'
            }`}
          >
            <span
              className={`shrink-0 w-8 h-8 rounded-lg grid place-items-center text-[14px] font-bold tabular-nums ${
                'bg-white/8 text-[#A9B4C4] [@media(hover:hover)]:group-hover:bg-[#5EEAD4] [@media(hover:hover)]:group-hover:text-[#06221E]'
              }`}
            >
              {i + 1}
            </span>
            <span className="flex-1">{r.label}</span>
            <ArrowRight className="w-4 h-4 shrink-0 opacity-60 transition-transform [@media(hover:hover)]:group-hover:translate-x-0.5" aria-hidden="true" />
          </button>
        ))}
      </div>
    </fieldset>
  );
};

const HomePage: React.FC = () => {
  const reduce = useReducedMotion();

  // The "with" column lights up row by row: the page's one authored moment. Visible by default.
  const reveal = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0.25, x: -6 },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true, amount: 0.8 },
          transition: { duration: 0.55, delay: 0.15 + i * 0.18, ease: EASE },
        };

  return (
    <>
      <SEOHead
        title="Ads That Get Seen, Follow-Up That Gets Paid | Media Traffics + KenjiAI"
        description="We're an ads agency first. We run your Meta, Google and YouTube ads, then KenjiAI follows up with every lead until they book. The system behind a 5x return on ad spend for our clients."
        keywords="facebook ads agency, done for you ads, lead follow up software, KenjiAI, Media Traffics, ads for small business"
        structuredData={structuredData}
      />
      <Helmet>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div
        className="kh text-[#F3EEE6] pt-16"
        style={{ background: 'radial-gradient(120% 60% at 50% -5%, #142133 0%, #0B0E14 55%)', backgroundColor: '#0B0E14' }}
      >
        <style>{`
          .kh ::selection { background: rgba(94, 234, 212, 0.35); color: #fff; }
          .kh .display { font-family: 'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.02em; }
          .kh :focus-visible { outline: 2px solid #5EEAD4; outline-offset: 3px; border-radius: 14px; }
          .kh a { text-underline-offset: 4px; }
        `}</style>

        {/* ---------- First viewport: the argument + the action ---------- */}
        <section className="px-5 sm:px-8 pt-10 sm:pt-12 pb-16 sm:pb-20" aria-labelledby="home-h1">
          <div className="max-w-6xl mx-auto">
            <motion.h1
              id="home-h1"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="display text-[40px] sm:text-[56px] lg:text-[68px] leading-[0.98] font-extrabold text-balance max-w-4xl"
            >
              Same ad budget. Very different month.
            </motion.h1>
            <p className="mt-5 text-[18px] sm:text-[19px] leading-relaxed text-[#C9D2DE] max-w-[66ch] text-pretty">
              We’re an ads agency first. We know how to stop the scroll and get the right people to raise their hand. Then
              KenjiAI, our software, follows up with every one of them so that attention turns into income.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={QUIZ}
                className="inline-flex items-center gap-2.5 rounded-2xl bg-[#5EEAD4] text-[#06221E] font-bold text-[18px] px-7 py-4 shadow-[0_14px_34px_-14px_rgba(94,234,212,0.7)] hover:bg-[#7FF0DF] transition-colors"
              >
                See if you qualify <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </a>
              <span className="text-[15px] text-[#A9B4C4]">60-second quiz. 5.0 on Google from 31 reviews.</span>
            </div>

            {/* The ledger */}
            <div className="mt-10" role="table" aria-label="Your ads without a system compared with Media Traffics and KenjiAI">
              <div role="rowgroup" className="hidden md:grid grid-cols-[150px_1fr_1fr] gap-x-10 pb-3 border-b border-white/10">
                <span aria-hidden="true" />
                <span role="columnheader" className="text-[15px] font-semibold text-[#FFB4A1]">
                  Ads without a system
                </span>
                <span role="columnheader" className="text-[15px] font-semibold text-[#5EEAD4]">
                  Ads with Media Traffics + KenjiAI
                </span>
              </div>
              <p className="md:hidden flex flex-wrap gap-x-5 gap-y-1 pb-3 border-b border-white/10 text-[15px] font-semibold" aria-hidden="true">
                <span className="inline-flex items-center gap-1.5 text-[#FFB4A1]"><Minus className="w-3.5 h-3.5" />Without a system</span>
                <span className="inline-flex items-center gap-1.5 text-[#5EEAD4]"><Check className="w-3.5 h-3.5" />With us</span>
              </p>
              <div role="rowgroup">
                {ROWS.map((r, i) => (
                  <div
                    key={r.label}
                    role="row"
                    className="grid grid-cols-1 md:grid-cols-[150px_1fr_1fr] gap-x-10 gap-y-2 py-3.5 border-b border-white/10"
                  >
                    <span role="rowheader" className="text-[14px] font-semibold text-[#7D8899] md:pt-0.5">
                      {r.label}
                    </span>
                    <span role="cell" className="flex items-start gap-3 text-[17px] text-[#FFB4A1]/75">
                      <Minus className="mt-1 w-4 h-4 shrink-0 text-[#FFB4A1]" aria-hidden="true" />
                      <span>
                        <span className="sr-only">Without a system: </span>
                        {r.without}
                      </span>
                    </span>
                    <motion.span role="cell" className="flex items-start gap-3 text-[17px] text-[#F3EEE6] font-medium" {...reveal(i)}>
                      <Check className="mt-1 w-4 h-4 shrink-0 text-[#5EEAD4]" aria-hidden="true" />
                      <span>
                        <span className="sr-only">With us: </span>
                        {r.withUs}
                      </span>
                    </motion.span>
                  </div>
                ))}
                {/* Outcome row */}
                <div role="row" className="grid grid-cols-1 md:grid-cols-[150px_1fr_1fr] gap-x-10 gap-y-3 pt-5 pb-2 items-baseline">
                  <span role="rowheader" className="text-[14px] font-semibold text-[#7D8899]">
                    The result
                  </span>
                  <span role="cell" className="display text-[28px] sm:text-[34px] font-extrabold text-[#FFB4A1]/80 line-through decoration-2 decoration-[#FFB4A1]/50">
                    <span className="sr-only">Without a system: </span>Ad money burned
                  </span>
                  <motion.span role="cell" className="display text-[34px] sm:text-[44px] leading-none font-extrabold text-[#5EEAD4]" {...reveal(ROWS.length)}>
                    <span className="sr-only">With us: </span>5x return on ad spend
                  </motion.span>
                </div>
              </div>
            </div>

            <div className="mt-14 max-w-3xl">
              <QuizStart idPrefix="hero" />
              <p className="mt-5 text-[15px] text-[#A9B4C4] flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#5EEAD4]" aria-hidden="true" />
                Rather talk first?{' '}
                <a href={`tel:${PHONE_TEL}`} className="inline-flex items-center text-[#F3EEE6] font-semibold underline decoration-white/30 hover:decoration-[#5EEAD4]">
                  Call {PHONE_DISPLAY}
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* ---------- Ads first, software second ---------- */}
        <section className="px-5 sm:px-8 py-20 sm:py-28 border-t border-white/10" aria-labelledby="how-h2">
          <div className="max-w-6xl mx-auto">
            <h2 id="how-h2" className="display text-[34px] sm:text-[48px] leading-[1.02] font-extrabold max-w-3xl text-balance">
              Ads first. Software second. Income at the end.
            </h2>
            <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-y-14 md:gap-x-16 md:divide-x md:divide-white/10">
              <div>
                <h3 className="display text-[26px] sm:text-[30px] font-extrabold">We hack attention.</h3>
                <p className="mt-4 text-[17px] sm:text-[18px] leading-relaxed text-[#C9D2DE] max-w-[52ch]">
                  Our team writes, designs and tests your ads on Meta, Google and YouTube every week. We cut what doesn’t sell and
                  put more behind what does, so the people who see them already want what you sell.
                </p>
                <p className="mt-4 text-[15px] text-[#A9B4C4]">Running ads since 2013. 500+ businesses served.</p>
              </div>
              <div className="md:pl-16">
                <h3 className="display text-[26px] sm:text-[30px] font-extrabold">KenjiAI turns it into income.</h3>
                <p className="mt-4 text-[17px] sm:text-[18px] leading-relaxed text-[#C9D2DE] max-w-[52ch]">
                  Every lead lands in one simple app on your phone. It replies, follows up and books them on your calendar for
                  you. No tech skills needed. We set it up, and we run it with you.
                </p>
                <p className="mt-4 text-[15px] text-[#A9B4C4]">AI made simple. Open the app and see who booked today.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- One result, said plainly ---------- */}
        <section className="px-5 sm:px-8 py-20 sm:py-28 border-t border-white/10" aria-labelledby="result-h2">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-end">
            <h2 id="result-h2" className="display text-[56px] sm:text-[88px] lg:text-[104px] leading-[0.9] font-extrabold text-[#5EEAD4]">
              One funnel. $186K.
            </h2>
            <p className="text-[18px] sm:text-[20px] leading-relaxed text-[#C9D2DE] max-w-[46ch] text-pretty">
              We built it, ran the ads and set up the follow-up behind it. Better ads plus better follow-up is the same system
              behind a 5x return on ad spend for our clients.
            </p>
          </div>
        </section>

        <div className="border-t border-white/10">
          <ReviewsNative variant="home" />
        </div>

        {/* ---------- Close ---------- */}
        <section className="px-5 sm:px-8 py-20 sm:py-28 border-t border-white/10" aria-labelledby="close-h2">
          <div className="max-w-3xl mx-auto">
            <h2 id="close-h2" className="display text-[36px] sm:text-[52px] leading-[1.02] font-extrabold text-balance">
              Find out if we’re a fit.
            </h2>
            <p className="mt-4 text-[18px] text-[#C9D2DE] max-w-[56ch]">
              If you qualify, you’ll pick a time for a 15-minute walkthrough and see exactly what we’d build for you.
            </p>
            <div className="mt-10">
              <QuizStart idPrefix="close" />
            </div>
            <p className="mt-8 text-[15px] text-[#A9B4C4]">
              Not ready for done-for-you yet?{' '}
              <a href={LOW_TICKET_URL} className="text-[#F3EEE6] font-semibold underline decoration-white/30 hover:decoration-[#5EEAD4]">
                Learn how we run ads inside the $7 community
              </a>
              .
            </p>
          </div>
        </section>

        <div className="px-5 sm:px-8 pb-10">
          <div className="max-w-6xl mx-auto">
            <ResultsDisclaimer plain />
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
