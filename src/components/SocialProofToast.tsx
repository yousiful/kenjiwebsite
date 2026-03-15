import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Calendar, Zap, TrendingUp, Star } from 'lucide-react';

const FIRST_NAMES = [
  'Marcus','Priya','Jordan','Leila','Devon','Amara','Finn','Yuki',
  'Zara','Elijah','Nadia','Cole','Ingrid','Theo','Sasha','Omar',
  'Vivian','Blake','Mila','Rory','Layla','Aiden','Nora','Kai',
];

const LAST_INITIALS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'.split('');

const CITIES = [
  'New York', 'Austin', 'Chicago', 'Miami', 'Seattle',
  'Los Angeles', 'Atlanta', 'Denver', 'Boston', 'Dallas',
  'Nashville', 'Phoenix', 'Charlotte', 'Portland', 'San Diego',
];

const EVENTS = [
  { icon: ShoppingCart, label: 'purchased', detail: 'Yearly Plan', color: '#00d4ff' },
  { icon: Calendar, label: 'booked', detail: 'VIP Strategy Call', color: '#a78bfa' },
  { icon: Zap, label: 'activated', detail: 'AI Automation Suite', color: '#34d399' },
  { icon: TrendingUp, label: 'upgraded to', detail: 'Enterprise Tier', color: '#fb923c' },
  { icon: Star, label: 'enrolled in', detail: 'AI Education Program', color: '#fbbf24' },
  { icon: ShoppingCart, label: 'purchased', detail: 'Monthly Plan', color: '#00d4ff' },
  { icon: Calendar, label: 'scheduled', detail: 'Demo Session', color: '#a78bfa' },
  { icon: Zap, label: 'launched', detail: 'CRM Workflow', color: '#34d399' },
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomMinutesAgo(): string {
  const n = Math.floor(Math.random() * 58) + 1;
  if (n === 1) return 'just now';
  if (n < 60) return `${n}m ago`;
  return '1h ago';
}

function generateEvent() {
  const first = randomFrom(FIRST_NAMES);
  const initial = randomFrom(LAST_INITIALS);
  const city = randomFrom(CITIES);
  const event = randomFrom(EVENTS);
  const time = randomMinutesAgo();
  return { first, initial, city, event, time, id: Math.random() };
}

export function SocialProofToast() {
  const [queue, setQueue] = useState<ReturnType<typeof generateEvent>[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const push = () => {
      setQueue((prev) => {
        const next = generateEvent();
        const updated = [...prev, next];
        return updated.slice(-3);
      });
    };

    const initial = setTimeout(() => {
      push();
      timerRef.current = setInterval(push, 6000);
    }, 2500);

    return () => {
      clearTimeout(initial);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;
    const last = queue[queue.length - 1];
    const timeout = setTimeout(() => {
      setQueue((prev) => prev.filter((e) => e.id !== last.id));
    }, 5200);
    return () => clearTimeout(timeout);
  }, [queue]);

  return (
    <div className="fixed bottom-5 left-5 z-50 flex flex-col gap-2.5 pointer-events-none">
      <AnimatePresence initial={false}>
        {queue.map((item) => {
          const Icon = item.event.icon;
          const color = item.event.color;
          return (
            <motion.div
              key={item.id}
              initial={{ x: -340, opacity: 0, scale: 0.88 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: -340, opacity: 0, scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              className="relative w-[280px] select-none"
            >
              <div
                className="relative overflow-hidden rounded-2xl border px-3.5 py-3"
                style={{
                  background: 'rgba(6, 10, 22, 0.55)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  borderColor: `${color}30`,
                  boxShadow: `0 0 0 1px ${color}18, 0 8px 32px rgba(0,0,0,0.45), 0 0 40px ${color}14`,
                }}
              >
                <div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{
                    background: `radial-gradient(ellipse at 10% 50%, ${color}12 0%, transparent 60%)`,
                  }}
                />

                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  animate={{ x: ['-110%', '110%'] }}
                  transition={{ duration: 2.4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3 }}
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.055) 50%, transparent 100%)',
                    width: '60%',
                  }}
                />

                <div className="relative flex items-center gap-3">
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${color}18`,
                      border: `1px solid ${color}35`,
                    }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold leading-tight truncate">
                      <span style={{ color }}>{item.first} {item.initial}.</span>
                      {' '}
                      <span className="text-white/70 font-normal">{item.event.label}</span>
                    </p>
                    <p className="text-white text-[11px] font-bold mt-0.5 truncate">
                      {item.event.detail}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-white/35 text-[9px] tracking-wide uppercase">{item.city}</span>
                      <span className="text-white/20 text-[9px]">·</span>
                      <span className="text-white/35 text-[9px]">{item.time}</span>
                      <span className="ml-auto flex items-center gap-1">
                        <span
                          className="w-1.5 h-1.5 rounded-full animate-pulse"
                          style={{ background: color }}
                        />
                        <span className="text-[9px] font-medium" style={{ color }}>Live</span>
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="absolute bottom-0 left-0 h-[2px] rounded-full"
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: 5.2, ease: 'linear' }}
                  style={{
                    width: '100%',
                    background: `linear-gradient(90deg, ${color}, ${color}50)`,
                    transformOrigin: 'left',
                  }}
                />
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
