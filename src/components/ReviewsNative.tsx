import { useState } from 'react';
import { Star } from 'lucide-react';

// Yousif, 2026-10-06: "reviews dont really show on kenjiai.com/pricing". The reputationhub iframe
// depends on a third-party script and often renders blank or late, so these real Google reviews
// are in the page itself. Quotes are verbatim excerpts (copied 2026-10-06 from the review widget).
// The full widget still loads on request.
const WIDGET_URL = 'https://reputationhub.site/reputation/widgets/review_widget/q5L4ttbBMHNxieXIcTVJ';

const FEATURED = {
  name: 'Lipsia P.',
  date: 'Nov 2025',
  text:
    "I have been in business for eight years and a half and I have probably hired 6 other marketing agencies and they all promised me clients but once we paid they disappeared… I found Yousif with Kenji AI and he didn't just show me a sales deck. He showed me results… In the first two weeks we generated our first 4 clients and we had 17 leads that signed up…",
};

const REVIEWS = [
  { name: 'Christian A.', date: 'Jun 2022', text: 'After struggling for months to find leads for my business. I scheduled a walkthrough with Media Traffics… Straight to the point. I have doubled in business since the video call.' },
  { name: 'Atlas Food Company', date: 'Apr 2022', text: 'Media Traffics did an incredible job helping us create our ads and generating leads for as low as 78 cents a lead.' },
  { name: 'Pierre H.', date: 'May 2022', text: "I'm blown away with their knowledge of Facebook. My calendar is getting full with all the leads only after a few days of hiring them." },
  { name: 'Benjamin L.', date: 'Aug 2025', text: "I've invested in many different business and marketing programs over the years and have sold products and services since 2009. Yousif and his team at Kenji make the set up of the platform and everything needed to run an online business seamless! It's all under one roof." },
  { name: 'Kelly F.', date: 'Aug 2021', text: 'Media Traffics is helping me grow my business! I just signed up my first client today thanks to their assistance with lead generation and creating ads for me!' },
  { name: 'Bethany M.', date: 'Jul 2024', text: "By talking with Media Traffics I believe I've built a true consulting partnership who truly understands the business and what it truly means to create a brand!" },
];

function Stars({ size = 'w-4 h-4' }: { size?: string }) {
  return (
    <span className="flex" aria-label="5 out of 5 stars">
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${size} text-amber-400 fill-amber-400`} aria-hidden="true" />)}
    </span>
  );
}

export function ReviewsNative({ variant = 'default' }: { variant?: 'default' | 'home' }) {
  const home = variant === 'home';
  const [showAll, setShowAll] = useState(false);

  return (
    <section className={home ? 'px-5 sm:px-8 py-20 sm:py-28' : 'px-4 sm:px-6 py-20 sm:py-24'} aria-labelledby="reviews-heading">
      <div className={home ? 'max-w-6xl mx-auto' : 'max-w-5xl mx-auto'}>
        <h2 id="reviews-heading" className={home ? 'display text-[34px] sm:text-[48px] leading-[1.02] font-extrabold text-[#F3EEE6] text-balance max-w-3xl' : 'text-3xl sm:text-5xl font-black text-white text-center leading-tight tracking-tight [text-wrap:balance]'}>
          What owners say after working with us
        </h2>
        <p className={home ? 'mt-4 text-[#C9D2DE] flex items-center gap-2 text-[17px]' : 'mt-4 text-center text-gray-300 flex items-center justify-center gap-2 text-base sm:text-lg'}>
          <Stars /> <span><span className="text-white font-semibold">5.0</span> average across 31 Google reviews</span>
        </p>

        <figure className={home ? 'mt-14 max-w-4xl' : 'mt-14 max-w-3xl mx-auto text-center'}>
          <blockquote className={home ? 'display text-[24px] sm:text-[30px] leading-[1.3] text-[#F3EEE6] font-semibold [text-wrap:pretty]' : 'text-xl sm:text-2xl leading-relaxed text-white font-medium [text-wrap:pretty]'}>
            "{FEATURED.text}"
          </blockquote>
          <figcaption className={home ? 'mt-6 flex items-center gap-3 text-gray-400' : 'mt-6 flex items-center justify-center gap-3 text-gray-400'}>
            <Stars size="w-3.5 h-3.5" />
            <span className="text-white font-semibold">{FEATURED.name}</span>
            <span>{FEATURED.date}</span>
          </figcaption>
        </figure>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-x-12 border-t border-white/10">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="py-8 border-b border-white/10">
              <Stars size="w-3.5 h-3.5" />
              <blockquote className="mt-3 text-gray-200 leading-relaxed max-w-[60ch]">"{r.text}"</blockquote>
              <figcaption className="mt-4 text-sm text-gray-400">
                <span className="text-white font-semibold">{r.name}</span> · {r.date} · Google review
              </figcaption>
            </figure>
          ))}
        </div>

        <div className={home ? 'mt-10' : 'mt-10 text-center'}>
          {showAll ? (
            <iframe
              className="w-full min-h-[560px] sm:min-h-[420px] rounded-2xl"
              src={WIDGET_URL}
              frameBorder="0"
              title="All KenjiAI Google reviews"
              loading="lazy"
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="rounded-xl border border-white/20 hover:border-white/40 text-white font-semibold px-6 py-3 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/20"
            >
              Read all 31 reviews
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
