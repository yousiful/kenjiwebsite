import { useState, type ReactNode } from 'react';
import { ArrowRight, X } from 'lucide-react';

/* Black Friday / Cyber Monday 2026 theme (Yousif, 11/20): one slim, dismissible strip per landing page in the
   look of the BF statics (near-black, red tag, warm light). The deadline is real: code KENJ4LFE ($299/mo for the
   first 3 months instead of $375) ends Nov 30. Pages without that offer get the seasonal line only, no deadline.
   Auto-hides at 2026-12-01 00:00 CT. REMOVE AFTER 12/1: delete this file, HOLIDAY_LIVE uses in PricingNew, and the
   <HolidayStrip> lines in HomePage, ProductSelectionPage, LaunchTimePage, FreedomClubPage, GrowthQuizPage (Shell),
   plus the #bf-strip block in public/ai-callcenter/index.html. */
export const HOLIDAY_ENDS = Date.parse('2026-12-01T00:00:00-06:00');
export const isHolidayLive = () => Date.now() < HOLIDAY_ENDS;

export const BF_RED = '#E22E28';

type Variant = 'offer' | 'seasonal';

const keyFor = (v: Variant) => `kenji-bf26-strip-${v}-closed`;

function wasClosed(v: Variant) {
  try { return localStorage.getItem(keyFor(v)) === '1'; } catch { return false; }
}

export function HolidayTag({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-block rounded-md px-2 py-0.5 text-[12px] sm:text-[13px] font-extrabold text-white leading-5 whitespace-nowrap ${className}`}
      style={{ backgroundColor: BF_RED }}
    >
      {children}
    </span>
  );
}

/** offer: points at the KENJ4LFE /pricing deadline. seasonal: soft Black Friday framing, no deadline claim. */
export function HolidayStrip({ variant, href = '/pricing#plans' }: { variant: Variant; href?: string }) {
  const [closed, setClosed] = useState(() => !isHolidayLive() || wasClosed(variant));
  if (closed) return null;

  const close = () => {
    setClosed(true);
    try { localStorage.setItem(keyFor(variant), '1'); } catch { /* storage blocked */ }
  };

  return (
    <div
      role="region"
      aria-label="Holiday offer"
      data-holiday-strip={variant}
      className="relative z-10 text-white"
      style={{
        background: 'radial-gradient(70% 160% at 12% 0%, rgba(248,212,129,0.16) 0%, rgba(248,212,129,0) 60%), #0B0B0C',
        borderBottom: '1px solid rgba(248,212,129,0.22)',
      }}
    >
      {/* Phone: one or two short lines, left aligned. sm+: one centered line with the full offer. */}
      <p className="max-w-6xl mx-auto pl-4 pr-11 sm:px-12 py-2 sm:py-2.5 text-left sm:text-center text-[14px] sm:text-[15px] leading-6">
        {variant === 'offer' ? (
          <>
            <HolidayTag className="mr-2 align-[1px]">Black Friday</HolidayTag>
            <span className="font-semibold">Holiday pricing ends Nov 30.</span>{' '}
            <span className="hidden sm:inline text-white/75">$299 a month for your first 3 months with code KENJ4LFE.</span>{' '}
            <a
              href={href}
              className="inline-flex items-center gap-1 whitespace-nowrap font-semibold text-[#F8D481] underline underline-offset-4 decoration-[#F8D481]/40 hover:decoration-[#F8D481]"
            >
              See the offer
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </a>
          </>
        ) : (
          <>
            <HolidayTag className="mr-2 align-[1px]">Black Friday week</HolidayTag>
            <span className="text-white/85">Everyone's shopping. Owners are setting up January.</span>
          </>
        )}
      </p>
      <button
        type="button"
        onClick={close}
        aria-label="Close holiday message"
        className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 transition-colors"
      >
        <X className="w-4 h-4" aria-hidden="true" />
      </button>
    </div>
  );
}
