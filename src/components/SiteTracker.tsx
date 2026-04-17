import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getTrackingConsent } from './ConsentBanner';

// ─── Types ────────────────────────────────────────────────────────
export interface PageView {
  id: string;
  page: string;
  timestamp: string;
  sessionId: string;
  referrer: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  device: 'mobile' | 'tablet' | 'desktop';
  browser: string;
  os: string;
  screenWidth: number;
  screenHeight: number;
  language: string;
  timeOnPage: number;       // seconds, updated on exit
  scrollDepth: number;      // 0-100, updated on exit
  exitTrigger: string;      // what caused them to leave
  isNewVisitor: boolean;
  landingPage: boolean;     // first page of this session
}

export interface VisitorSession {
  sessionId: string;
  startTime: string;
  endTime: string;
  pageCount: number;
  totalDuration: number;    // seconds
  device: 'mobile' | 'tablet' | 'desktop';
  referrer: string;
  utmSource: string;
  landingPage: string;
  exitPage: string;
  isNewVisitor: boolean;
}

// ─── Storage Keys ─────────────────────────────────────────────────
const VIEWS_KEY = 'kenji_pageviews';
const SESSIONS_KEY = 'kenji_sessions';
const VISITOR_KEY = 'kenji_visitor_id';
const SESSION_KEY = 'kenji_current_session';
const MAX_RECORDS = 500;

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

function getOrCreateSession(landingPage: string, referrer: string, utmSource: string): { sessionId: string; isNewSession: boolean } {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) {
    const session = JSON.parse(existing);
    // Session expires after 30 min of inactivity
    const lastActivity = new Date(session.lastActivity).getTime();
    if (Date.now() - lastActivity < 30 * 60 * 1000) {
      session.lastActivity = new Date().toISOString();
      session.pageCount++;
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
      return { sessionId: session.sessionId, isNewSession: false };
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
  return { sessionId, isNewSession: true };
}

function savePageView(view: PageView) {
  try {
    const existing: PageView[] = JSON.parse(localStorage.getItem(VIEWS_KEY) || '[]');
    // Update existing or add new
    const idx = existing.findIndex(v => v.id === view.id);
    if (idx >= 0) {
      existing[idx] = view;
    } else {
      existing.push(view);
    }
    if (existing.length > MAX_RECORDS) existing.splice(0, existing.length - MAX_RECORDS);
    localStorage.setItem(VIEWS_KEY, JSON.stringify(existing));
  } catch {
    // storage full
  }
}

function saveSession(sessionId: string) {
  try {
    const sessionData = sessionStorage.getItem(SESSION_KEY);
    if (!sessionData) return;
    const current = JSON.parse(sessionData);
    if (current.sessionId !== sessionId) return;

    const views: PageView[] = JSON.parse(localStorage.getItem(VIEWS_KEY) || '[]');
    const sessionViews = views.filter(v => v.sessionId === sessionId);
    
    const session: VisitorSession = {
      sessionId,
      startTime: current.startTime,
      endTime: new Date().toISOString(),
      pageCount: sessionViews.length,
      totalDuration: sessionViews.reduce((sum, v) => sum + v.timeOnPage, 0),
      device: current.device,
      referrer: current.referrer,
      utmSource: current.utmSource,
      landingPage: current.landingPage,
      exitPage: sessionViews.length > 0 ? sessionViews[sessionViews.length - 1].page : current.landingPage,
      isNewVisitor: current.isNewVisitor,
    };

    const sessions: VisitorSession[] = JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]');
    const sIdx = sessions.findIndex(s => s.sessionId === sessionId);
    if (sIdx >= 0) {
      sessions[sIdx] = session;
    } else {
      sessions.push(session);
    }
    if (sessions.length > MAX_RECORDS) sessions.splice(0, sessions.length - MAX_RECORDS);
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  } catch {
    // storage full
  }
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

  // Listen for consent being granted after mount
  useEffect(() => {
    const handleConsent = () => {
      hasConsent.current = true;
    };
    window.addEventListener('tracking-consent-granted', handleConsent);
    return () => window.removeEventListener('tracking-consent-granted', handleConsent);
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
    const { sessionId, isNewSession } = getOrCreateSession(pathname, referrer, utmSource);
    currentSessionId.current = sessionId;

    const view: PageView = {
      id: currentViewId.current,
      page: pathname,
      timestamp: new Date().toISOString(),
      sessionId,
      referrer,
      utmSource,
      utmMedium: getUTMParam('medium'),
      utmCampaign: getUTMParam('campaign'),
      device: getDevice(),
      browser: getBrowser(),
      os: getOS(),
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      language: navigator.language || 'en',
      timeOnPage: 0,
      scrollDepth: 0,
      exitTrigger: '',
      isNewVisitor: visitor.isNew,
      landingPage: isNewSession,
    };

    savePageView(view);
  }, [pathname]);

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
    if (!hasConsent.current || !currentViewId.current) return;

    const views: PageView[] = JSON.parse(localStorage.getItem(VIEWS_KEY) || '[]');
    const idx = views.findIndex(v => v.id === currentViewId.current);
    if (idx >= 0) {
      views[idx].timeOnPage = Math.round((Date.now() - pageEntryTime.current) / 1000);
      views[idx].scrollDepth = maxScrollDepth.current;
      views[idx].exitTrigger = trigger;
      localStorage.setItem(VIEWS_KEY, JSON.stringify(views));
    }
    saveSession(currentSessionId.current);
  }, []);

  // Mouse leave
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (e.clientY <= 0) saveExitData('mouse_leave');
    };
    document.addEventListener('mouseleave', handler);
    return () => document.removeEventListener('mouseleave', handler);
  }, [saveExitData]);

  // Tab switch
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === 'hidden') saveExitData('tab_switch');
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [saveExitData]);

  // Before unload
  useEffect(() => {
    const handler = () => saveExitData('close_tab');
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [saveExitData]);

  // Idle (2 min)
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

  // Page navigate (cleanup on route change)
  useEffect(() => {
    return () => {
      saveExitData('navigate');
    };
  }, [pathname, saveExitData]);

  return null;
}

// ─── Data Access (for Dashboard) ──────────────────────────────────
export function getPageViews(): PageView[] {
  try { return JSON.parse(localStorage.getItem(VIEWS_KEY) || '[]'); } catch { return []; }
}

export function getSessions(): VisitorSession[] {
  try { return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '[]'); } catch { return []; }
}

export function clearAnalyticsData() {
  localStorage.removeItem(VIEWS_KEY);
  localStorage.removeItem(SESSIONS_KEY);
}
