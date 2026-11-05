import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, Lock, ShieldCheck, Star, Zap } from 'lucide-react';

// Yousif, 2026-11-05: new low-ticket page for Freedom Club ($7/month), laid out like a short
// direct-response book page (price in the headline area, one big button, guarantee, "why $7",
// what's inside, founder story). Checkout is Stripe (netlify/functions/freedom-checkout.ts), not the
// GHL 2-step form. Results: kenjiai.com/funnel-stats/ steps fc_v, fc_join_<where>, fc_paid.

const SUPPORT = 'support@mediatraffics.com';
const ft = (step: string) => (window as unknown as { __ft?: { send: (s: string) => void } }).__ft?.send(step);
const fbq = (...args: unknown[]) => (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq?.(...args);
const cookie = (name: string) => document.cookie.split('; ').find((c) => c.startsWith(`${name}=`))?.split('=')[1] || '';

const INSIDE = [
  {
    title: 'How we build, launch and read Meta ads.',
    body: 'The paid media training our team uses on our own ads and our clients\' ads right now. What to post, who to show it to, and which numbers tell you to fix the ad, the page or the offer.',
    tag: 'Paid Media Expert Training',
  },
  {
    title: 'How to close the people your ads bring in.',
    body: 'Leads don\'t pay you. Calls that close do. The High-Ticket Sales Masterclass and the Close 4 Survival daily sales training show you what to say from the first call to the yes.',
    tag: 'High-Ticket Sales Masterclass · Close 4 Survival',
  },
  {
    title: 'Live help every week.',
    body: 'Business-building livestreams where you bring your ads, your offer and your sales calls, and we work through what\'s holding you back.',
    tag: 'Weekly Livestreams',
  },
  {
    title: 'A kickoff call with my team.',
    body: 'Book a 1:1 call after you join so we can map out your first ads together. Members also get special pricing on our live events.',
    tag: 'Bonus: 6-Figure Kickoff Call · Member Event Pricing',
  },
];

function Stars({ size = 'w-5 h-5' }: { size?: string }) {
  return (
    <span className="flex gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => <Star key={i} className={`${size} text-[#F5B400] fill-[#F5B400]`} />)}
    </span>
  );
}

function JoinButton({ where, label = 'JOIN FREEDOM CLUB FOR $7' }: { where: string; label?: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');

  const join = async () => {
    setState('loading');
    ft(`fc_join_${where}`);
    fbq('track', 'InitiateCheckout', { value: 7, currency: 'USD', content_name: 'Freedom Club' });
    try {
      const r = await fetch('/.netlify/functions/freedom-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fbp: cookie('_fbp'), fbc: cookie('_fbc'), where }),
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
        className="w-full rounded-2xl bg-[#CCFF4D] hover:bg-[#BDF22F] active:translate-y-px text-[#111111] font-black text-xl sm:text-2xl tracking-tight py-5 shadow-[0_10px_30px_-12px_rgba(120,170,0,0.7)] transition-colors disabled:opacity-70 disabled:cursor-wait focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#CCFF4D]/60"
      >
        {state === 'loading' ? 'Opening checkout...' : label}
      </button>
      <div className="mt-3 flex flex-wrap justify-center gap-x-6 gap-y-1 text-[15px] text-[#4B5563]">
        <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#16A34A]" aria-hidden="true" />Secure checkout</span>
        <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#16A34A]" aria-hidden="true" />Instant access</span>
        <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-[#16A34A]" aria-hidden="true" />Cancel anytime</span>
      </div>
      {state === 'error' && (
        <p className="mt-3 text-sm text-[#B42318] text-center" role="alert">
          Checkout didn't open. Try again, or email {SUPPORT} and we'll get you in.
        </p>
      )}
    </div>
  );
}

function PriceLine() {
  return (
    <p className="flex items-baseline justify-center gap-3">
      <span className="text-[#4B5563] text-lg">Only</span>
      <span className="text-4xl font-black tabular-nums">$7</span>
      <span className="text-[#4B5563] text-lg">/month</span>
    </p>
  );
}

export default function FreedomClubPage() {
  useEffect(() => {
    ft('fc_v');
    fbq('track', 'ViewContent', { value: 7, currency: 'USD', content_name: 'Freedom Club' });
  }, []);

  useEffect(() => {
    const src = 'https://reputationhub.site/reputation/assets/review-widget.js';
    if (document.querySelector(`script[src="${src}"]`)) return;
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return (
    <div className="min-h-screen bg-white text-[#111111] antialiased">
      <Helmet>
        <title>Freedom Club | Ads that pay for themselves</title>
        <meta name="description" content="The ads and sales system behind $3.35M in client sales, taught step by step. $7 a month, cancel anytime." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <main className="max-w-2xl mx-auto px-5 sm:px-6 pb-20">
        <section className="pt-8 sm:pt-14">
          <span className="inline-block rounded-full bg-[#111111] text-white text-[13px] font-bold tracking-[0.12em] uppercase px-4 py-2">
            For business owners who run ads
          </span>
          <h1 className="mt-6 text-[40px] sm:text-[56px] leading-[1.02] font-black tracking-[-0.03em] [text-wrap:balance]">
            After $3.35M In Client Sales, I Know Why Your Ads Don't Pay.
          </h1>
          <p className="mt-6 text-[20px] sm:text-[22px] leading-relaxed text-[#4B5563] [text-wrap:pretty]">
            The ads and follow-up system behind $3.35M in sales for 500+ businesses, taught step by step inside
            Freedom Club. For $7 a month.
          </p>
          <div className="mt-8"><JoinButton where="top" /></div>
        </section>

        <section className="mt-12 -mx-5 sm:mx-0 px-5 sm:px-6 py-8 bg-[#F6F7F9] sm:rounded-3xl" data-track-section="fc_reviews_top">
          <div className="flex items-center gap-3">
            <Stars />
            <span className="font-bold text-lg">5.0 from 31 Google reviews</span>
          </div>
          <div className="mt-4 rounded-2xl overflow-hidden bg-white border border-[#E5E7EB]">
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

        <section className="mt-12 rounded-3xl border-2 border-[#111111] p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-8 h-8 shrink-0 text-[#16A34A]" aria-hidden="true" />
            <div className="text-[18px] leading-relaxed">
              <p><span className="font-black">Guarantee:</span> join, look around, use it. If it isn't worth $7 in your
                first 30 days, email {SUPPORT} and you get your $7 back. No questions.</p>
              <p className="mt-4"><span className="font-black">Why $7?</span> Because I'd rather show you how we work
                than ask you for a big check up front. If it helps you, you'll know where to find us.</p>
            </div>
          </div>
          <div className="mt-6"><PriceLine /></div>
        </section>

        <section className="mt-14">
          <h2 className="text-[32px] sm:text-[40px] font-black tracking-[-0.02em] leading-tight">What's waiting for you inside</h2>
          <ul className="mt-8 space-y-8">
            {INSIDE.map((item) => (
              <li key={item.title} className="flex items-start gap-4">
                <span className="mt-1 flex items-center justify-center w-8 h-8 rounded-full bg-[#CCFF4D] shrink-0" aria-hidden="true">
                  <Check className="w-5 h-5 text-[#111111]" strokeWidth={3} />
                </span>
                <div>
                  <h3 className="text-[21px] font-extrabold leading-snug">{item.title}</h3>
                  <p className="mt-2 text-[18px] leading-relaxed text-[#374151] [text-wrap:pretty]">{item.body}</p>
                  <p className="mt-2 text-[15px] text-[#6B7280]">({item.tag})</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10"><JoinButton where="inside" /></div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px] text-[#4B5563]">
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4" aria-hidden="true" />Paid through Stripe</span>
            <span className="flex items-center gap-1.5"><Zap className="w-4 h-4" aria-hidden="true" />Login sent to your email and phone</span>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-[32px] sm:text-[40px] font-black tracking-[-0.02em] leading-tight">My name is Yousif Alias</h2>
          <div className="mt-6 sm:flex sm:items-start sm:gap-6">
            <img
              src="/webinar1/presenter-yousif.jpg"
              alt="Yousif Alias"
              width={600}
              height={600}
              loading="lazy"
              className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl object-cover shrink-0"
            />
            <div className="mt-6 sm:mt-0 space-y-4 text-[18px] leading-relaxed text-[#374151] [text-wrap:pretty]">
              <p>I've been running paid ads since 2013. Since then my team has worked with 500+ businesses, and the
                funnels we built have done $3.35M in sales for our clients. One of them brought in $186K by itself.</p>
              <p>Most business owners I meet aren't bad at what they do. Their ads just bring in people who were never
                going to buy, and nobody follows up with the ones who would.</p>
              <p>Freedom Club is where I show you how we fix both. The same training, the same weekly calls, for $7.</p>
            </div>
          </div>
        </section>

        <section className="mt-16 rounded-3xl bg-[#F6F7F9] p-6 sm:p-8">
          <h2 className="text-[26px] sm:text-[32px] font-black tracking-[-0.02em]">No catch</h2>
          <p className="mt-4 text-[18px] leading-relaxed text-[#374151] [text-wrap:pretty]">
            It's $7 a month. You can cancel any time with one email to {SUPPORT}, and the first 30 days are covered
            by the guarantee above.
          </p>
          <div className="mt-6"><PriceLine /></div>
          <div className="mt-6"><JoinButton where="bottom" label="YES! LET ME IN FOR $7" /></div>
        </section>

        <p className="mt-12 text-center text-sm text-[#9CA3AF]">© 2026 Media Traffics LLC · KenjiAI</p>
      </main>
    </div>
  );
}

export function FreedomClubWelcomePage() {
  const [state, setState] = useState<{ status: 'loading' | 'paid' | 'unpaid'; firstName?: string }>({ status: 'loading' });

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get('session_id') || '';
    if (!sessionId) { setState({ status: 'unpaid' }); return; }
    let tries = 0;
    const check = async () => {
      try {
        const r = await fetch(`/.netlify/functions/freedom-confirm?session_id=${encodeURIComponent(sessionId)}`);
        const d = await r.json();
        if (d.paid) {
          setState({ status: 'paid', firstName: d.first_name });
          ft('fc_paid');
          fbq('track', 'Purchase', { value: d.value, currency: 'USD', content_name: 'Freedom Club' }, { eventID: sessionId });
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
    <div className="min-h-screen bg-white text-[#111111] antialiased">
      <Helmet>
        <title>You're in | Freedom Club</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="max-w-2xl mx-auto px-5 py-14 sm:py-20 text-[18px] leading-relaxed" aria-live="polite">
        {state.status === 'loading' && <p className="text-[#6B7280]">Confirming your membership...</p>}

        {state.status === 'paid' && (
          <>
            <h1 className="text-4xl sm:text-5xl font-black tracking-[-0.02em]">
              You're in{state.firstName ? `, ${state.firstName}` : ''}.
            </h1>
            <p className="mt-5">Welcome to Freedom Club. Your login is on its way to your email and phone. Check both, including spam.</p>
            <p className="mt-4">Your membership includes a kickoff call with my team. Grab a time now so we can map out your first ads together.</p>
            <a
              href="https://go.mediatraffics.com/leads"
              className="mt-8 block w-full text-center rounded-2xl bg-[#CCFF4D] hover:bg-[#BDF22F] text-[#111111] font-black text-xl py-5 transition-colors"
            >
              Book my kickoff call
            </a>
            <p className="mt-6 text-sm text-[#6B7280]">No login after 15 minutes? Email {SUPPORT} and we'll sort it out.</p>
          </>
        )}

        {state.status === 'unpaid' && (
          <>
            <h1 className="text-3xl font-black tracking-[-0.02em]">We couldn't confirm your payment yet.</h1>
            <p className="mt-5">
              If you were charged, email {SUPPORT} and we'll get you in today. If checkout didn't finish, you can{' '}
              <a href="/freedom" className="underline">go back and join here</a>.
            </p>
          </>
        )}
      </main>
    </div>
  );
}
