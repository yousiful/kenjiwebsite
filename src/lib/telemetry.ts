import { supabase } from './supabaseClient';

const SESSION_KEY = 'kenjiai_session_id';

function getSessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getConnectionType(): string {
  const nav = navigator as Navigator & { connection?: { effectiveType?: string } };
  return nav.connection?.effectiveType ?? 'unknown';
}

function truncate(str: string, max = 500): string {
  return str ? str.slice(0, max) : '';
}

function rateVital(name: string, value: number): string {
  const thresholds: Record<string, [number, number]> = {
    LCP: [2500, 4000],
    FID: [100, 300],
    CLS: [0.1, 0.25],
    TTFB: [800, 1800],
    FCP: [1800, 3000],
  };
  const t = thresholds[name];
  if (!t) return 'unknown';
  if (value <= t[0]) return 'good';
  if (value <= t[1]) return 'needs-improvement';
  return 'poor';
}

export async function logVital(name: string, value: number): Promise<void> {
  try {
    await supabase.from('perf_vitals').insert({
      metric_name: name,
      metric_value: Math.round(value * 100) / 100,
      rating: rateVital(name, value),
      page_path: window.location.pathname,
      session_id: getSessionId(),
      connection_type: getConnectionType(),
      user_agent: truncate(navigator.userAgent, 200),
    });
  } catch {
    // non-blocking — silently ignore telemetry failures
  }
}

export async function logError(params: {
  error_type: 'runtime' | 'promise_rejection' | 'resource' | 'chunk_load';
  message: string;
  filename?: string;
  lineno?: number;
  colno?: number;
  stack?: string;
}): Promise<void> {
  try {
    await supabase.from('error_events').insert({
      error_type: params.error_type,
      message: truncate(params.message, 500),
      filename: truncate(params.filename ?? '', 300),
      lineno: params.lineno ?? 0,
      colno: params.colno ?? 0,
      stack: truncate(params.stack ?? '', 1000),
      page_path: window.location.pathname,
      session_id: getSessionId(),
      user_agent: truncate(navigator.userAgent, 200),
    });
  } catch {
    // non-blocking — silently ignore telemetry failures
  }
}
