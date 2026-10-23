import { useEffect, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Lock, Star, Tag, Video } from 'lucide-react';
import { VideoPreview } from '../components/VideoPreview';
import { useVslDropoff } from '../hooks/useVslDropoff';

// Yousif, 2026-10-23: "Launch Time by Freedom Club", laid out like the Skool about page of a
// community he saw grow 600 -> 900 members in a month at $97/month. Split test: each visitor gets
// $17 or $97 a month and keeps it (localStorage). ?p=17 or ?p=97 forces one for checking.
// Results: kenjiai.com/funnel-stats/ (page /launch-time), steps lt_price_v_*, lt_join_*, lt_paid_*.
// Checkout: netlify/functions/launchtime-checkout.ts (Stripe). Welcome: /launch-time/welcome.

// TODO(Yousif): record a real 1-2 minute tour of the community and swap it in here. This is the
// "New Offer Overview" walkthrough for now.
const TOUR = { id: 'lt-tour', src: '/videos/pricing-vsl-lowticket.mp4', poster: '/videos/pricing-vsl-lowticket-poster.jpg' };

type Variant = '17' | '97';
const PRICE_KEY = 'kenji-launchtime-price';
const SUPPORT = 'support@mediatraffics.com';

const ft = (step: string) => (window as unknown as { __ft?: { send: (s: string) => void } }).__ft?.send(step);
const fbq = (...args: unknown[]) => (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.(...args);

function pickVariant(): Variant {
  const forced = new URLSearchParams(window.location.search).get('p');
  if (forced === '17' || forced === '97') return forced;
  try {
    const saved = localStorage.getItem(PRICE_KEY);
    if (saved === '17' || saved === '97') return saved;
    const v: Variant = Math.random() < 0.5 ? '17' : '97';
    localStorage.setItem(PRICE_KEY, v);
    return v;
  } catch {
    return '17';
  }
}

const cookie = (name: string) => document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))?.split('=')[1] || '';

const INSIDE = [
  'Paid media training: how we build, launch and read Meta ads',
  'High-ticket sales masterclass',
  'Close 4 Survival sales training',
  'Weekly business-building livestreams',
  'Weekly Q&A on sales, ads and AI systems',
  'Special member pricing on our live events',
  'Bonus: a 6-figure kickoff call with our team',
];

function Stars({ size = 'w-4 h-4' }: { size?: string }) {
  return (
    <span className="flex" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${size} text-[#F5B400] fill-[#F5B400]`} />)}
    </span>
  );
}

function Logo() {
  return (
    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#111827] text-[#F8D481] font-black text-sm tracking-tight shrink-0" aria-hidden="true">
      LT
    </span>
  );
}

function JoinButton({ variant, where }: { variant: Variant; where: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');

  const join = async () => {
    setState('loading');
    ft(`lt_join_${variant}`);
    fbq('track', 'InitiateCheckout', { value: Number(variant), currency: 'USD', content_name: 'Launch Time by Freedom Club' });
    try {
      const r = await fetch('/.netlify/functions/launchtime-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant, fbp: cookie('_fbp'), fbc: cookie('_fbc'), where }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.url) throw new Error(d.error || 'checkout');
      window.location.href = d.url;
    } catch {
      setState('error');
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={join}
        disabled={state === 'loading'}
        className="w-full rounded-xl bg-[#F8D481] hover:bg-[#F5CB66] active:translate-y-px text-[#1F1F1F] font-extrabold text-lg tracking-wide py-4 shadow-[0_2px_0_rgba(0,0,0,0.08)] transition-colors disabled:opacity-70 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F8D481]/60"
      >
        {state === 'loading' ? 'Opening checkout...' : `JOIN $${variant}/month`}
      </button>
      {state === 'error' && (
        <p className="mt-3 text-sm text-[#B42318] text-center" role="alert">
          Checkout didn't open. Try again, or email <a className="underline" href={`mailto:${SUPPORT}`}>{SUPPORT}</a> and we'll get you in.
        </p>
      )}
    </div>
  );
}

export default function LaunchTimePage() {
  const [variant] = useState<Variant>(pickVariant);
  const videoRef = useRef<HTMLVideoElement>(null);
  useVslDropoff(videoRef, TOUR.id);

  useEffect(() => {
    ft(`lt_price_v_${variant}`);
    fbq('track', 'ViewContent', { value: Number(variant), currency: 'USD', content_name: 'Launch Time by Freedom Club' });
  }, [variant]);

  useEffect(() => {
    const src = 'https://reputationhub.site/reputation/assets/review-widget.js';
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F5] text-[#1F1F1F] antialiased">
      <Helmet>
        <title>Launch Time by Freedom Club</title>
        <meta name="description" content="Learn to run your own ads and close your own clients. Weekly live calls, ads and sales training, and the AI systems we use every day." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-[#E7E5E1]">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center gap-3">
          <Logo />
          <span className="font-bold text-[17px] truncate">Launch Time</span>
          <span className="ml-auto text-sm text-[#6B6B6B] whitespace-nowrap">by Freedom Club</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pb-16">
        <section className="pt-6 sm:pt-10">
          <h1 className="text-[28px] sm:text-4xl font-extrabold leading-tight tracking-tight">Launch Time by Freedom Club</h1>
          <a href="#reviews" className="mt-2 inline-flex items-center gap-2 text-[15px] text-[#4B4B4B] hover:text-[#1F1F1F]">
            <Stars />
            <span><span className="font-semibold text-[#1F1F1F]">5.0</span> · 31 Google reviews</span>
          </a>

          <div className="mt-5 aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-[0_12px_40px_-16px_rgba(0,0,0,0.45)]">
            <VideoPreview videoRef={videoRef} src={TOUR.src} poster={TOUR.poster} label="Play the tour of what's inside" />
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 text-[16px]">
            <div className="flex items-center gap-2.5"><Lock className="w-5 h-5 text-[#4B4B4B]" aria-hidden="true" /><dt className="sr-only">Access</dt><dd className="font-semibold">Private</dd></div>
            <div className="flex items-center gap-2.5"><Video className="w-5 h-5 text-[#4B4B4B]" aria-hidden="true" /><dt className="sr-only">Calls</dt><dd className="font-semibold">Weekly live calls</dd></div>
            <div className="flex items-center gap-2.5"><Tag className="w-5 h-5 text-[#4B4B4B]" aria-hidden="true" /><dt className="sr-only">Price</dt><dd className="font-semibold tabular-nums">${variant}/month</dd></div>
            <div className="flex items-center gap-2.5">
              <span className="w-5 h-5 rounded-full bg-[#111827] text-white text-[10px] font-bold flex items-center justify-center" aria-hidden="true">YA</span>
              <dt className="sr-only">Host</dt><dd className="font-semibold">By Yousif Alias</dd>
            </div>
          </dl>

          <div className="mt-6"><JoinButton variant={variant} where="top" /></div>
          <p className="mt-2.5 text-center text-sm text-[#6B6B6B]">Billed monthly. Cancel anytime by emailing {SUPPORT}.</p>
        </section>

        <section className="mt-10 text-[17px] leading-relaxed space-y-5 [text-wrap:pretty]">
          <p>If you're reading this, watch the video above. It walks you through what's inside.</p>
          <p>Launch Time is for business owners and new agency owners who want to run their own ads and close their own clients, without guessing.</p>
          <p>
            I've been running paid ads since 2013, and our team has worked with 500+ businesses. One funnel we built brought in $186K.
            Everything inside is what we use on our own ads and our clients' ads right now.
          </p>

          <div>
            <h2 className="font-bold text-[19px]">Inside, we cover:</h2>
            <ul className="mt-3 space-y-2.5">
              {INSIDE.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="w-5 h-5 mt-[3px] shrink-0 text-[#16A34A]" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p>Every week we go live. Bring your ads, your offer and your sales calls, and we'll work through whatever is holding you back.</p>
          <p>If that's what you're looking for, come on in.</p>
        </section>

        <section id="reviews" className="mt-12 scroll-mt-20" data-track-section="lt_reviews">
          <div className="flex items-center gap-2 text-[17px]">
            <Stars size="w-5 h-5" />
            <span><span className="font-bold">5.0</span> · 31 Google reviews</span>
          </div>
          <div className="mt-4 rounded-2xl overflow-hidden bg-white border border-[#E7E5E1]">
            <iframe
              className="lc_reviews_widget min-h-[560px] sm:min-h-[420px]"
              src="https://reputationhub.site/reputation/widgets/review_widget/q5L4ttbBMHNxieXIcTVJ"
              frameBorder="0"
              scrolling="no"
              style={{ minWidth: '100%', width: '100%' }}
              title="KenjiAI Google reviews"
            />
          </div>
        </section>

        <section className="mt-10 rounded-2xl bg-white border border-[#E7E5E1] p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <Logo />
            <div>
              <p className="font-bold leading-tight">Launch Time by Freedom Club</p>
              <p className="text-sm text-[#6B6B6B] tabular-nums">${variant}/month · Private</p>
            </div>
          </div>
          <div className="mt-5"><JoinButton variant={variant} where="bottom" /></div>
        </section>
      </main>
    </div>
  );
}

export function LaunchTimeWelcomePage() {
  const [state, setState] = useState<{ status: 'loading' | 'paid' | 'unpaid'; firstName?: string }>({ status: 'loading' });

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id') || '';
    if (!sessionId) { setState({ status: 'unpaid' }); return; }
    let tries = 0;
    const check = async () => {
      try {
        const r = await fetch(`/.netlify/functions/launchtime-confirm?session_id=${encodeURIComponent(sessionId)}`);
        const d = await r.json();
        if (d.paid) {
          setState({ status: 'paid', firstName: d.first_name });
          ft(`lt_paid_${d.variant}`);
          fbq('track', 'Purchase', { value: d.value, currency: 'USD', content_name: 'Launch Time by Freedom Club' }, { eventID: sessionId });
          return;
        }
      } catch { /* retried below */ }
      // A just-finished checkout can take a few seconds to show as paid.
      if (++tries < 4) setTimeout(check, 2500);
      else setState({ status: 'unpaid' });
    };
    check();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F7F5] text-[#1F1F1F] antialiased">
      <Helmet>
        <title>You're in | Launch Time</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <header className="bg-white border-b border-[#E7E5E1]">
        <div className="max-w-2xl mx-auto px-4 h-14 flex items-center gap-3">
          <Logo />
          <span className="font-bold text-[17px]">Launch Time</span>
        </div>
      </header>
      <main className="max-w-2xl mx-auto px-4 py-12 sm:py-16 text-[17px] leading-relaxed" aria-live="polite">
        {state.status === 'loading' && <p className="text-[#6B6B6B]">Confirming your membership...</p>}

        {state.status === 'paid' && (
          <>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              You're in{state.firstName ? `, ${state.firstName}` : ''}.
            </h1>
            <p className="mt-5">Welcome to Launch Time. Your community login is on its way to your email and phone. Check both, including spam.</p>
            <p className="mt-4">Your membership includes a 6-figure kickoff call with our team. Grab a time now so we can map out your first ads together.</p>
            <a
              href="https://go.mediatraffics.com/leads"
              className="mt-7 block w-full text-center rounded-xl bg-[#F8D481] hover:bg-[#F5CB66] text-[#1F1F1F] font-extrabold text-lg py-4 transition-colors"
            >
              Book my kickoff call
            </a>
            <p className="mt-6 text-sm text-[#6B6B6B]">No login after 15 minutes? Email {SUPPORT} and we'll sort it out.</p>
          </>
        )}

        {state.status === 'unpaid' && (
          <>
            <h1 className="text-3xl font-extrabold tracking-tight">We couldn't confirm your payment yet.</h1>
            <p className="mt-5">
              If you were charged, email {SUPPORT} and we'll get you in today. If checkout didn't finish, you can{' '}
              <a href="/launch-time" className="underline">go back and join here</a>.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
