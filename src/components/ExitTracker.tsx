import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface ExitEvent {
  page: string;
  timeOnPage: number;
  scrollDepth: number;
  exitTrigger: 'mouse_leave' | 'tab_switch' | 'back_button' | 'idle' | 'page_navigate' | 'unknown';
  device: 'mobile' | 'desktop';
  referrer: string;
  timestamp: string;
  screenWidth: number;
}

const STORAGE_KEY = 'kenji_exit_events';
const IDLE_TIMEOUT_MS = 120000; // 2 minutes of inactivity

function getDevice(): 'mobile' | 'desktop' {
  return window.innerWidth < 768 ? 'mobile' : 'desktop';
}

function getScrollDepth(): number {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) return 100;
  return Math.round((scrollTop / scrollHeight) * 100);
}

function logExitEvent(event: ExitEvent) {
  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    existing.push(event);
    // Keep last 200 events max
    if (existing.length > 200) existing.splice(0, existing.length - 200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // localStorage full or unavailable, silently fail
  }
}

export function ExitTracker() {
  const { pathname } = useLocation();
  const pageEntryTime = useRef(Date.now());
  const maxScrollDepth = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLoggedExit = useRef(false);

  const recordExit = useCallback((trigger: ExitEvent['exitTrigger']) => {
    if (hasLoggedExit.current) return;
    hasLoggedExit.current = true;

    const event: ExitEvent = {
      page: pathname,
      timeOnPage: Math.round((Date.now() - pageEntryTime.current) / 1000),
      scrollDepth: maxScrollDepth.current,
      exitTrigger: trigger,
      device: getDevice(),
      referrer: document.referrer || 'direct',
      timestamp: new Date().toISOString(),
      screenWidth: window.innerWidth,
    };

    logExitEvent(event);
  }, [pathname]);

  // Reset on page change
  useEffect(() => {
    pageEntryTime.current = Date.now();
    maxScrollDepth.current = 0;
    hasLoggedExit.current = false;
  }, [pathname]);

  // Track max scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const depth = getScrollDepth();
      if (depth > maxScrollDepth.current) {
        maxScrollDepth.current = depth;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse leave (desktop exit intent)
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        recordExit('mouse_leave');
        // Reset so we can track if they come back & leave again
        setTimeout(() => { hasLoggedExit.current = false; }, 2000);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [recordExit]);

  // Tab switch / visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        recordExit('tab_switch');
        setTimeout(() => { hasLoggedExit.current = false; }, 2000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [recordExit]);

  // Before unload (closing tab / navigating away)
  useEffect(() => {
    const handleBeforeUnload = () => {
      recordExit('back_button');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [recordExit]);

  // Idle detection
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        recordExit('idle');
        setTimeout(() => { hasLoggedExit.current = false; }, 2000);
      }, IDLE_TIMEOUT_MS);
    };

    const events = ['mousemove', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetIdleTimer, { passive: true }));
    resetIdleTimer();

    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      events.forEach(e => window.removeEventListener(e, resetIdleTimer));
    };
  }, [recordExit]);

  // Log navigation exit (user going to another page on the site)
  useEffect(() => {
    return () => {
      if (!hasLoggedExit.current) {
        // This fires when the component unmounts (route change)
        const event: ExitEvent = {
          page: pathname,
          timeOnPage: Math.round((Date.now() - pageEntryTime.current) / 1000),
          scrollDepth: maxScrollDepth.current,
          exitTrigger: 'page_navigate',
          device: getDevice(),
          referrer: document.referrer || 'direct',
          timestamp: new Date().toISOString(),
          screenWidth: window.innerWidth,
        };
        logExitEvent(event);
      }
    };
  }, [pathname]);

  return null;
}

// Utility to read exit data (call from browser console: getExitData())
if (typeof window !== 'undefined') {
  (window as any).getExitData = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    console.table(data);

    // Summary
    const pages: Record<string, { visits: number; avgTime: number; avgScroll: number; triggers: Record<string, number> }> = {};
    data.forEach((e: ExitEvent) => {
      if (!pages[e.page]) {
        pages[e.page] = { visits: 0, avgTime: 0, avgScroll: 0, triggers: {} };
      }
      pages[e.page].visits++;
      pages[e.page].avgTime += e.timeOnPage;
      pages[e.page].avgScroll += e.scrollDepth;
      pages[e.page].triggers[e.exitTrigger] = (pages[e.page].triggers[e.exitTrigger] || 0) + 1;
    });

    Object.entries(pages).forEach(([_page, stats]) => {
      stats.avgTime = Math.round(stats.avgTime / stats.visits);
      stats.avgScroll = Math.round(stats.avgScroll / stats.visits);
    });

    console.log('\n📊 Exit Summary by Page:');
    console.table(Object.entries(pages).map(([pagePath, stats]) => ({
      Page: pagePath,
      Visits: stats.visits,
      'Avg Time (s)': stats.avgTime,
      'Avg Scroll %': stats.avgScroll,
      'Top Exit Reason': Object.entries(stats.triggers).sort((a, b) => b[1] - a[1])[0]?.[0] || 'unknown',
    })));

    return data;
  };

  (window as any).clearExitData = () => {
    localStorage.removeItem(STORAGE_KEY);
    console.log('Exit data cleared.');
  };
}
