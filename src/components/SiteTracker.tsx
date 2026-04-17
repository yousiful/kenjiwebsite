import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getTrackingConsent } from './ConsentBanner';
import { supabase } from '../lib/supabaseClient';

// ─── Types ────────────────────────────────────────────────────────
export interface PageView {
  id: string;
  page: string;
  timestamp: string;
  session_id: string; // Updated to match Supabase snake_case
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  device: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  screen_width: number;
  screen_height: number;
  language: string;
  time_on_page: number;       
  scroll_depth: number;      
  exit_trigger: string;      
  is_new_visitor: boolean;
  landing_page: boolean;     
}

export interface VisitorSession {
  session_id: string;
  start_time: string;
  end_time: string;
  page_count: number;
  total_duration: number;    
  device: 'mobile' | 'tablet' | 'desktop';
  referrer: string;
  utm_source: string;
  landing_page: string;
  exit_page: string;
  is_new_visitor: boolean;
}

// ─── Storage Keys ─────────────────────────────────────────────────
const VISITOR_KEY = 'kenji_visitor_id';
const SESSION_KEY = 'kenji_current_session';

// ─── Webhook URL ──────────────────────────────────────────────────
// You can replace this with your Make, Zapier, or GHL webhook URL
const WEBHOOK_URL = import.meta.env.VITE_WEBHOOK_URL || '';

// ─── Utilities ────────────────────────────────────────────────────
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getDevice(): 'mobile' | 'tablet' | 'desktop' {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
}

function getBrowser(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  return 'Other';
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('Linux')) return 'Linux';
  return 'Other';
}

function getUTMParam(name: string): string {
  try {
    const params = new URLSearchParams(window.location.search);
    return params.get(`utm_${name}`) || '';
  } catch {
    return '';
  }
}

function getScrollDepth(): number {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollHeight <= 0) return 100;
  return Math.round((scrollTop / scrollHeight) * 100);
}

function getOrCreateVisitorId(): { id: string; isNew: boolean } {
  const existing = localStorage.getItem(VISITOR_KEY);
  if (existing) return { id: existing, isNew: false };
  const id = generateId();
  localStorage.setItem(VISITOR_KEY, id);
  return { id, isNew: true };
}

// ─── Database Operations ──────────────────────────────────────────

async function pushViewToSupabase(view: PageView) {
  try {
    const { error } = await supabase.from('analytics_pageviews').insert([view]);
    if (error) console.error('Failed to insert pageview', error);
  } catch (err) {}
}

async function updateViewInSupabase(id: string, updates: Partial<PageView>) {
  try {
    await supabase.from('analytics_pageviews').update(updates, { id: `eq.${id}` });
  } catch (err) {}
}

async function upsertSessionToSupabase(session: VisitorSession) {
  try {
    // Attempt an insert. If it fails due to conflict (session_id exists), do an update.
    // Supabase has .upsert() but our client wrapper doesn't expose it directly yet, 
    // so we'll just try updating, and if the session is new, we insert.
    const { data: existing } = await supabase.from('analytics_sessions').select('session_id', { session_id: `eq.${session.session_id}` });
    
    if (existing && existing.length > 0) {
      await supabase.from('analytics_sessions').update(session as any, { session_id: `eq.${session.session_id}` });
    } else {
      await supabase.from('analytics_sessions').insert([session as any]);
    }
  } catch (err) {}
}

async function fireWebhook(session: VisitorSession, view: PageView) {
  if (!WEBHOOK_URL) return;
  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'new_visitor',
        visitor_id: localStorage.getItem(VISITOR_KEY),
        session: session.session_id,
        landing_page: session.landing_page,
        referrer: session.referrer,
        device: session.device,
        browser: view.browser,
        os: view.os,
        location: Intl.DateTimeFormat().resolvedOptions().timeZone, // Basic proxy for location without an IP API
        timestamp: new Date().toISOString()
      })
    });
  } catch (err) {}
}

// ─── Component ────────────────────────────────────────────────────
export function SiteTracker() {
  const { pathname } = useLocation();
  const pageEntryTime = useRef(Date.now());
  const maxScrollDepth = useRef(0);
  const currentViewId = useRef('');
  const currentSessionId = useRef('');
  const hasConsent = useRef(getTrackingConsent());
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Buffer state to keep track of current session metrics without relying on remote DB
  const sessionBuffer = useRef<VisitorSession | null>(null);
  const viewsBuffer = useRef<PageView[]>([]);

  useEffect(() => {
    const handleConsent = () => { hasConsent.current = true; };
    window.addEventListener('tracking-consent-granted', handleConsent);
    return () => window.removeEventListener('tracking-consent-granted', handleConsent);
  }, []);

  // Initialize/Update Session Local Logic
  const getOrCreateSession = useCallback((landingPage: string, referrer: string, utmSource: string) => {
    const existing = sessionStorage.getItem(SESSION_KEY);
    if (existing) {
      const session = JSON.parse(existing);
      const lastActivity = new Date(session.lastActivity).getTime();
      if (Date.now() - lastActivity < 30 * 60 * 1000) {
        session.lastActivity = new Date().toISOString();
        session.pageCount++;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        return { sessionId: session.sessionId, isNewSession: false, raw: session };
      }
    }
    
    const sessionId = generateId();
    const visitor = getOrCreateVisitorId();
    const session = {
      sessionId,
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      pageCount: 1,
      landingPage,
      referrer,
      utmSource,
      device: getDevice(),
      isNewVisitor: visitor.isNew,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { sessionId, isNewSession: true, raw: session };
  }, []);

  // Create pageview on route change
  useEffect(() => {
    if (!hasConsent.current) return;

    pageEntryTime.current = Date.now();
    maxScrollDepth.current = 0;
    currentViewId.current = generateId();

    const visitor = getOrCreateVisitorId();
    const referrer = document.referrer || 'direct';
    const utmSource = getUTMParam('source');
    
    const { sessionId, isNewSession, raw } = getOrCreateSession(pathname, referrer, utmSource);
    currentSessionId.current = sessionId;

    const view: PageView = {
      id: currentViewId.current,
      page: pathname,
      timestamp: new Date().toISOString(),
      session_id: sessionId,
      referrer,
      utm_source: utmSource,
      utm_medium: getUTMParam('medium'),
      utm_campaign: getUTMParam('campaign'),
      device: getDevice(),
      browser: getBrowser(),
      os: getOS(),
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      language: navigator.language || 'en',
      time_on_page: 0,
      scroll_depth: 0,
      exit_trigger: '',
      is_new_visitor: visitor.isNew,
      landing_page: isNewSession,
    };

    viewsBuffer.current.push(view);
    
    // Construct session state
    const sessionUpdate: VisitorSession = {
      session_id: sessionId,
      start_time: raw.startTime,
      end_time: new Date().toISOString(),
      page_count: raw.pageCount,
      total_duration: viewsBuffer.current.reduce((sum, v) => sum + v.time_on_page, 0),
      device: raw.device,
      referrer: raw.referrer,
      utm_source: raw.utmSource,
      landing_page: raw.landingPage,
      exit_page: pathname,
      is_new_visitor: raw.isNewVisitor,
    };
    sessionBuffer.current = sessionUpdate;

    // Push initial inserts
    pushViewToSupabase(view);
    upsertSessionToSupabase(sessionUpdate);

    if (isNewSession) {
      fireWebhook(sessionUpdate, view);
    }
  }, [pathname, getOrCreateSession]);

  // Track scroll depth
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

  // Save exit data helper
  const saveExitData = useCallback((trigger: string) => {
    if (!hasConsent.current || !currentViewId.current || !sessionBuffer.current) return;

    const timeSpent = Math.round((Date.now() - pageEntryTime.current) / 1000);
    const depth = maxScrollDepth.current;
    
    // Update local buffers
    const vIdx = viewsBuffer.current.findIndex(v => v.id === currentViewId.current);
    if (vIdx >= 0) {
      viewsBuffer.current[vIdx].time_on_page = timeSpent;
      viewsBuffer.current[vIdx].scroll_depth = depth;
      viewsBuffer.current[vIdx].exit_trigger = trigger;
    }
    
    sessionBuffer.current.total_duration = viewsBuffer.current.reduce((sum, v) => sum + v.time_on_page, 0);
    sessionBuffer.current.end_time = new Date().toISOString();

    // Push updates
    updateViewInSupabase(currentViewId.current, {
      time_on_page: timeSpent,
      scroll_depth: depth,
      exit_trigger: trigger
    });
    upsertSessionToSupabase(sessionBuffer.current);
  }, []);

  // Exit Triggers
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (e.clientY <= 0) saveExitData('mouse_leave'); };
    document.addEventListener('mouseleave', handler);
    return () => document.removeEventListener('mouseleave', handler);
  }, [saveExitData]);

  useEffect(() => {
    const handler = () => { if (document.visibilityState === 'hidden') saveExitData('tab_switch'); };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [saveExitData]);

  useEffect(() => {
    const handler = () => saveExitData('close_tab');
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [saveExitData]);

  useEffect(() => {
    const resetIdle = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => saveExitData('idle'), 120000);
    };
    const events = ['mousemove', 'keydown', 'touchstart', 'scroll'];
    events.forEach(e => window.addEventListener(e, resetIdle, { passive: true }));
    resetIdle();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      events.forEach(e => window.removeEventListener(e, resetIdle));
    };
  }, [saveExitData]);

  useEffect(() => {
    return () => { saveExitData('navigate'); };
  }, [pathname, saveExitData]);

  return null;
}
