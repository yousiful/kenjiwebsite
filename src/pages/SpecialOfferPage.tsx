import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, Minus } from 'lucide-react';
import SEOHead from '../components/SEOHead';
import { ReviewsNative } from '../components/ReviewsNative';
import { ResultsDisclaimer } from '../components/ResultsDisclaimer';
import { faqPage, service } from '../lib/schema';

/* /special: the webinar offer. $10K total, split $5K now and $5K only after we've generated
   10X the first payment ($50K in tracked sales). Yousif, 2026-10-15.

   PAYMENT LINKS GO HERE. While PAY_UPFRONT_URL still starts with '#', every "get started"
   button falls back to the 15-minute walkthrough calendar so the page never dead-ends. */
const LINKS = {
  PAY_UPFRONT_URL: '#pay-link-coming',
  BOOK_URL: 'https://api.leadconnectorhq.com/widget/booking/jB82SG2CBq9Nh8103IfC', // "#1 Client Attraction System Walkthrough"
};
const PAY_LIVE = !LINKS.PAY_UPFRONT_URL.startsWith('#');
const START_URL = PAY_LIVE ? LINKS.PAY_UPFRONT_URL : LINKS.BOOK_URL;
const START_LABEL = PAY_LIVE ? 'Get started for $5,000' : 'Book your 15-minute start call';

const EASE = [0.22, 1, 0.36, 1] as const;

const STACK = [
  { title: 'We fix the offer first', body: 'Before a dollar goes to ads, we tighten what you sell, how it’s priced and how it’s said, so it works on people who’ve never heard of you.' },
  { title: 'We script, edit, launch and manage your ads', body: 'Facebook and Instagram first. Once those are working, YouTube and TikTok. We run them for the full 6 to 12 months, not just the launch.' },
  { title: 'A funnel built for your business', body: 'Your branding, your copy, your offer. Written and built by us.' },
  { title: 'Email and text follow-up', body: 'Reminders that get people to show up, and follow-up for everyone who doesn’t buy the first time.' },
  { title: 'Order form and booking pages', body: 'Sell straight from the page or book calls on your calendar, whichever fits your price.' },
  { title: 'An AI caller for new leads', body: 'It calls new leads in your voice, answers their questions and books them on your calendar, so nobody sits for a day waiting on a callback.' },
  { title: 'The numbers, every week', body: 'Cost per lead, show rate, close rate. You’ll know exactly where the money comes from and where it leaks.' },
  { title: 'Strategy calls when you need them', body: 'Offer, pricing, ads, sales. Book time with our team whenever something comes up.' },
];

const BONUSES = [
  { title: 'Your webinar slide deck, done for you', body: 'Written and designed around your offer, ready to present.' },
  { title: 'A monthly 1:1 call with me', body: 'Me, Yousif. Not an assistant. One call a month for as long as we work together.' },
  { title: 'I review your first launch myself', body: 'Send me the recording of your first webinar or sales call and I’ll tell you what to keep and what to change.' },
];

const FOR_POINTS = [
  'You already sell something and people have paid you for it.',
  'You can fund an ad budget on top of the fee.',
  'You’ll show up: to the webinar, the calls, and the leads we send you.',
  'You want a team running this with you for months, not a one-time setup.',
];

const NOT_FOR_POINTS = [
  'You haven’t made a sale yet and want ads to find your offer for you.',
  'You don’t have money for ad spend right now.',
  'You want a course to do it all yourself.',
];

const STEPS = [
  { when: 'Week 1', what: 'Onboarding call. We go through your offer, your numbers and your goals, and set the ad budget together.' },
  { when: 'Weeks 2 to 4', what: 'We build the funnel, follow-up, booking and ads, then launch.' },
  { when: 'Months 2 to 12', what: 'We manage, test and scale. You get the numbers weekly and a call with me every month.' },
];

const FAQS = [
  {
    q: 'When do I pay the second $5,000?',
    a: 'Only after the campaigns we run have brought in $50,000 in tracked sales, which is 10X your first payment. If that takes 6 months, it’s due at 6 months. If we haven’t hit it within 12 months, you never pay it.',
  },
  {
    q: 'What counts as a tracked sale?',
    a: 'A sale from a lead that came in through the ads and funnel we run, tracked in your pipeline and payments. We go over exactly how it’s tracked on your onboarding call, before anything launches.',
  },
  {
    q: 'Is ad spend included in the $10,000?',
    a: 'No. You pay Meta (and any other ad platform) directly from your own card. The $10,000 is our fee for building and running everything. We set the budget with you on the onboarding call based on your offer and margins.',
  },
  {
    q: 'How long do you work with me?',
    a: 'Between 6 and 12 months. We keep going until we hit the 10X mark, up to 12 months.',
  },
  {
    q: 'What if I have questions before I pay?',
    a: 'Book a 15-minute call and ask them. We’d rather you start sure than start fast.',
  },
];

const PATH = '/special';
const TITLE = 'Done-For-You Ads: $5K Now, $5K After 10X | KenjiAI';
const DESCRIPTION =
  'We fix your offer, build your funnel and follow-up, and run your ads for 6 to 12 months. $5,000 to start. The second $5,000 is only due after we’ve brought in $50,000 in tracked sales.';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    service({
      path: PATH,
      name: 'Done-for-you ads and sales system',
      description: DESCRIPTION,
      serviceType: ['Advertising management', 'Sales funnel development'],
      offers: [
        {
          '@type': 'Offer',
          name: 'First payment',
          price: '5000',
          priceCurrency: 'USD',
          description: 'Due today. The second $5,000 is due only after $50,000 in tracked sales.',
        },
      ],
    }),
    faqPage(PATH, FAQS),
  ],
};

const StartButton: React.FC<{ label?: string; className?: string }> = ({ label = START_LABEL, className = '' }) => (
  <a
    href={START_URL}
    className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-[#5EEAD4] px-7 py-4 text-[17px] sm:text-[18px] font-semibold text-[#06221E] transition-colors hover:bg-[#7FF0DF] ${className}`}
  >
    {label}
    <ArrowRight className="w-5 h-5" aria-hidden="true" />
  </a>
);

const BookLink: React.FC = () => (PAY_LIVE ? (
  <a
    href={LINKS.BOOK_URL}
    className="text-[16px] text-[#C9D2DE] font-medium underline decoration-white/30 hover:decoration-[#5EEAD4] hover:text-[#F3EEE6]"
  >
    Questions first? Book 15 minutes
  </a>
) : null);

const SpecialOfferPage: React.FC = () => {
  const reduce = useReducedMotion();
  const fade = (i = 0) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0.3, y: 10 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.1 },
          transition: { duration: 0.5, delay: i * 0.06, ease: EASE },
        };

  return (
    <>
      <SEOHead
        title={TITLE}
        description={DESCRIPTION}
        canonical={`https://kenjiai.com${PATH}`}
        keywords="done for you ads, webinar ads, facebook ads agency, performance based marketing, KenjiAI, Media Traffics"
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
        className="ks text-[#F3EEE6] pt-8"
        style={{ background: 'radial-gradient(120% 60% at 50% -5%, #142133 0%, #0B0E14 55%)', backgroundColor: '#0B0E14' }}
      >
        <style>{`
          .ks ::selection { background: rgba(94, 234, 212, 0.35); color: #fff; }
          .ks .display { font-family: 'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif; letter-spacing: -0.02em; }
          .ks :focus-visible { outline: 2px solid #5EEAD4; outline-offset: 3px; border-radius: 14px; }
          .ks a { text-underline-offset: 4px; }
        `}</style>

        {/* ---------- Hero ---------- */}
        <section className="px-5 sm:px-8 pt-10 sm:pt-14 pb-16 sm:pb-20" aria-labelledby="sp-h1">
          <div className="max-w-6xl mx-auto">
            <img src="/kenji-logo.webp" alt="KenjiAI" className="h-10 sm:h-12 w-auto object-contain mb-10 sm:mb-14" />
            <p className="text-[14px] font-semibold text-[#5EEAD4]">The offer from the webinar</p>
            <motion.h1
              id="sp-h1"
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
              className="display mt-4 text-[40px] sm:text-[56px] lg:text-[68px] leading-[0.98] font-extrabold text-balance max-w-4xl"
            >
              We run your ads. You pay the second half after we make you $50K.
            </motion.h1>
            <p className="mt-6 text-[18px] sm:text-[19px] leading-relaxed text-[#C9D2DE] max-w-[62ch] text-pretty">
              We fix your offer, build your funnel and follow-up, and run your ads for 6 to 12 months. It’s the same
              system behind one funnel that brought in $186K. Five thousand to start. The other five thousand only
              comes due once our campaigns have brought you ten times that.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row sm:items-center gap-5">
              <StartButton />
              <BookLink />
            </div>
          </div>
        </section>

        {/* ---------- Pricing breakdown ---------- */}
        <section className="px-5 sm:px-8 py-20 sm:py-28 border-t border-white/10" aria-labelledby="price-h2">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-12 lg:gap-16">
            <div>
              <h2 id="price-h2" className="display text-[34px] sm:text-[48px] leading-[1.02] font-extrabold text-balance">
                How the $10,000 works
              </h2>
              <p className="mt-5 text-[18px] leading-relaxed text-[#C9D2DE] max-w-[46ch] text-pretty">
                Half up front, so we can build and launch. Half when it’s paid for itself ten times over. If we can’t get
                you there, we eat it.
              </p>
            </div>
            <dl className="rounded-3xl border border-white/10 bg-white/[0.035] divide-y divide-white/10">
              {[
                { k: 'Today', v: '$5,000', note: 'Covers the offer work, the full build and the launch.' },
                { k: 'After $50,000 in tracked sales', v: '$5,000', note: 'That’s 10X your first payment. Not before.' },
                { k: 'If we haven’t hit $50,000 in 12 months', v: '$0', note: 'You never pay the second half.' },
                { k: 'Ad spend', v: 'Paid by you to Meta', note: 'Straight from your card to the ad platform. Separate from our fee.' },
                { k: 'How long we work together', v: '6 to 12 months', note: 'Until we hit 10X, up to 12 months.' },
              ].map((row, i) => (
                <motion.div key={row.k} {...fade(i)} className="px-6 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-x-6 gap-y-1">
                  <dt className="text-[16px] font-semibold text-[#F3EEE6]">{row.k}</dt>
                  <dd className="display text-[24px] sm:text-[28px] font-extrabold text-[#5EEAD4] sm:text-right tabular-nums">{row.v}</dd>
                  <dd className="text-[15px] text-[#A9B4C4] sm:col-span-2">{row.note}</dd>
                </motion.div>
              ))}
            </dl>
          </div>
        </section>

        {/* ---------- What we do ---------- */}
        <section className="px-5 sm:px-8 py-20 sm:py-28 border-t border-white/10" aria-labelledby="stack-h2">
          <div className="max-w-6xl mx-auto">
            <h2 id="stack-h2" className="display text-[34px] sm:text-[48px] leading-[1.02] font-extrabold text-balance max-w-3xl">
              What we do for you
            </h2>
            <p className="mt-5 text-[18px] text-[#C9D2DE] max-w-[56ch]">All of it is done for you. You show up, sell and take the calls.</p>
            <ol className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {STACK.map((item, i) => (
                <motion.li key={item.title} {...fade(i % 2)} className="flex gap-5">
                  <span className="shrink-0 w-9 h-9 rounded-lg grid place-items-center bg-white/8 text-[15px] font-bold text-[#A9B4C4] tabular-nums">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-[19px] font-semibold text-[#F3EEE6]">{item.title}</h3>
                    <p className="mt-2 text-[16px] leading-relaxed text-[#A9B4C4] max-w-[52ch]">{item.body}</p>
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- Bonuses ---------- */}
        <section className="px-5 sm:px-8 py-20 sm:py-28 border-t border-white/10" aria-labelledby="bonus-h2">
          <div className="max-w-6xl mx-auto">
            <h2 id="bonus-h2" className="display text-[34px] sm:text-[48px] leading-[1.02] font-extrabold text-balance max-w-3xl">
              Also included
            </h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
              {BONUSES.map((b, i) => (
                <motion.div key={b.title} {...fade(i)} className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
                  <h3 className="display text-[22px] leading-snug font-extrabold text-[#F3EEE6]">{b.title}</h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-[#A9B4C4]">{b.body}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-5">
              <StartButton />
              <BookLink />
            </div>
          </div>
        </section>

        {/* ---------- Proof ---------- */}
        <section className="px-5 sm:px-8 py-20 sm:py-28 border-t border-white/10" aria-labelledby="result-h2">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 items-end">
            <h2 id="result-h2" className="display text-[56px] sm:text-[88px] lg:text-[104px] leading-[0.9] font-extrabold text-[#5EEAD4]">
              One funnel. $186K.
            </h2>
            <p className="text-[18px] sm:text-[20px] leading-relaxed text-[#C9D2DE] max-w-[46ch] text-pretty">
              We built it, ran the ads and set up the follow-up behind it. Better ads plus better follow-up is the same
              system behind a 5x return on ad spend for our clients. We’ve run ads since 2013 for 500+ businesses.
            </p>
          </div>
        </section>

        <div className="border-t border-white/10">
          <ReviewsNative variant="home" />
        </div>

        {/* ---------- Fit ---------- */}
        <section className="px-5 sm:px-8 py-20 sm:py-28 border-t border-white/10" aria-labelledby="fit-h2">
          <div className="max-w-6xl mx-auto">
            <h2 id="fit-h2" className="display text-[34px] sm:text-[48px] leading-[1.02] font-extrabold text-balance max-w-3xl">
              Is this right for you?
            </h2>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="rounded-3xl border border-[#5EEAD4]/30 bg-[#5EEAD4]/[0.05] p-7 sm:p-8">
                <h3 className="text-[18px] font-semibold text-[#5EEAD4]">It’s a fit if</h3>
                <ul className="mt-5 space-y-4">
                  {FOR_POINTS.map((p) => (
                    <li key={p} className="flex gap-3 text-[16px] leading-relaxed text-[#F3EEE6]">
                      <Check className="w-5 h-5 mt-0.5 shrink-0 text-[#5EEAD4]" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 sm:p-8">
                <h3 className="text-[18px] font-semibold text-[#C9D2DE]">Probably not yet if</h3>
                <ul className="mt-5 space-y-4">
                  {NOT_FOR_POINTS.map((p) => (
                    <li key={p} className="flex gap-3 text-[16px] leading-relaxed text-[#A9B4C4]">
                      <Minus className="w-5 h-5 mt-0.5 shrink-0 text-[#7D8899]" aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- How it goes ---------- */}
        <section className="px-5 sm:px-8 py-20 sm:py-28 border-t border-white/10" aria-labelledby="steps-h2">
          <div className="max-w-6xl mx-auto">
            <h2 id="steps-h2" className="display text-[34px] sm:text-[48px] leading-[1.02] font-extrabold text-balance max-w-3xl">
              What happens after you start
            </h2>
            <ol className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
              {STEPS.map((s, i) => (
                <motion.li key={s.when} {...fade(i)} className="border-t-2 border-[#5EEAD4] pt-5">
                  <p className="text-[14px] font-semibold text-[#5EEAD4]">{s.when}</p>
                  <p className="mt-3 text-[17px] leading-relaxed text-[#C9D2DE]">{s.what}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="px-5 sm:px-8 py-20 sm:py-28 border-t border-white/10" aria-labelledby="faq-h2">
          <div className="max-w-3xl mx-auto">
            <h2 id="faq-h2" className="display text-[34px] sm:text-[48px] leading-[1.02] font-extrabold">Questions</h2>
            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {FAQS.map((f) => (
                <details key={f.q} className="group py-6">
                  <summary className="cursor-pointer list-none flex items-start justify-between gap-6 text-[18px] font-semibold text-[#F3EEE6]">
                    {f.q}
                    <span className="shrink-0 text-[#5EEAD4] text-[22px] leading-none transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="mt-4 text-[16px] leading-relaxed text-[#A9B4C4] max-w-[60ch]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Close ---------- */}
        <section className="px-5 sm:px-8 py-20 sm:py-28 border-t border-white/10" aria-labelledby="close-h2">
          <div className="max-w-3xl mx-auto">
            <h2 id="close-h2" className="display text-[36px] sm:text-[52px] leading-[1.02] font-extrabold text-balance">
              Five thousand to start. The rest after $50K.
            </h2>
            <p className="mt-5 text-[18px] leading-relaxed text-[#C9D2DE] max-w-[56ch]">
              Same team, same system behind one funnel that brought in $186K. If you’re in, start below and we’ll book
              your onboarding call this week.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5">
              <StartButton />
              <BookLink />
            </div>
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

export default SpecialOfferPage;
