import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

interface SlashPriceProps {
  from: number;
  to: number;
  suffix?: string;
  accentClass?: string;
}

/**
 * Animated "was $X, now $Y" price reveal. Runs once when scrolled into view:
 * counts down from `from` to `to`, then draws a strike-through line across
 * the "was" price and settles on the real price next to it.
 */
export function SlashPrice({ from, to, suffix = '/mo', accentClass = 'text-[#10A37F]' }: SlashPriceProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(from);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    if (!inView) return;
    const durationMs = 900;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from - (from - to) * eased);
      setDisplay(value);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDisplay(to);
        setSettled(true);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, from, to]);

  return (
    <div ref={ref} className="flex items-baseline gap-2.5 flex-wrap">
      <span className="relative text-gray-500 text-lg font-semibold">
        ${from}{suffix}
        <motion.span
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ duration: 0.35, delay: 0.05, ease: 'easeOut' }}
          style={{ transformOrigin: 'left' }}
          className="absolute left-0 top-1/2 h-[2px] w-full bg-red-500/80"
        />
      </span>
      <motion.span
        animate={settled ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 0.3 }}
        className={`text-3xl font-black ${accentClass} tabular-nums`}
      >
        ${display}{suffix}
      </motion.span>
    </div>
  );
}
