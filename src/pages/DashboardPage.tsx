import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import {
  BarChart3, Users, Eye, Clock, Monitor, Smartphone, Tablet,
  Globe, ArrowUpRight, ArrowDownRight, TrendingUp, Trash2,
  RefreshCw, MousePointer, LogOut, MapPin, Search,
  ChevronDown, ChevronUp, Calendar, Zap
} from 'lucide-react';
import { getPageViews, getSessions, clearAnalyticsData } from '../components/SiteTracker';
import type { PageView, VisitorSession } from '../components/SiteTracker';

// ─── Helpers ──────────────────────────────────────────────────────
function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}m ${sec}s`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
  });
}

function getDateRange(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
}

// ─── Stat Card ────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, subValue, color, trend }: {
  icon: any; label: string; value: string | number; subValue?: string; color: string; trend?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-5"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-semibold ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
      {subValue && <div className="text-gray-500 text-xs mt-1">{subValue}</div>}
    </motion.div>
  );
}

// ─── Bar (visual) ─────────────────────────────────────────────────
function BarVisual({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="w-full bg-gray-800 rounded-full h-2.5 overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────
export default function DashboardPage() {
  const [views, setViews] = useState<PageView[]>([]);
  const [sessions, setSessions] = useState<VisitorSession[]>([]);
  const [dateRange, setDateRange] = useState(30); // days
  const [refreshKey, setRefreshKey] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    setViews(getPageViews());
    setSessions(getSessions());
  }, [refreshKey]);

  const cutoff = useMemo(() => getDateRange(dateRange), [dateRange]);

  // ─── Filtered Data ──────────────────────────────────────────────
  const filteredViews = useMemo(() =>
    views.filter(v => new Date(v.timestamp) >= cutoff), [views, cutoff]);

  const filteredSessions = useMemo(() =>
    sessions.filter(s => new Date(s.startTime) >= cutoff), [sessions, cutoff]);

  // ─── Computed Metrics ───────────────────────────────────────────
  const metrics = useMemo(() => {
    const totalViews = filteredViews.length;
    const totalSessions = filteredSessions.length;
    const uniqueVisitors = new Set(filteredSessions.filter(s => s.isNewVisitor).map(s => s.sessionId)).size +
      new Set(filteredSessions.filter(s => !s.isNewVisitor).map(s => s.sessionId)).size;
    const newVisitors = filteredSessions.filter(s => s.isNewVisitor).length;
    const avgTimeOnPage = totalViews > 0
      ? Math.round(filteredViews.reduce((sum, v) => sum + v.timeOnPage, 0) / totalViews)
      : 0;
    const avgScrollDepth = totalViews > 0
      ? Math.round(filteredViews.reduce((sum, v) => sum + v.scrollDepth, 0) / totalViews)
      : 0;
    const avgPagesPerSession = totalSessions > 0
      ? Math.round((totalViews / totalSessions) * 10) / 10
      : 0;
    const bounceRate = totalSessions > 0
      ? Math.round((filteredSessions.filter(s => s.pageCount <= 1).length / totalSessions) * 100)
      : 0;

    return {
      totalViews, totalSessions, uniqueVisitors, newVisitors,
      avgTimeOnPage, avgScrollDepth, avgPagesPerSession, bounceRate
    };
  }, [filteredViews, filteredSessions]);

  // ─── Page Rankings ──────────────────────────────────────────────
  const pageRankings = useMemo(() => {
    const map: Record<string, { views: number; avgTime: number; avgScroll: number }> = {};
    filteredViews.forEach(v => {
      if (!map[v.page]) map[v.page] = { views: 0, avgTime: 0, avgScroll: 0 };
      map[v.page].views++;
      map[v.page].avgTime += v.timeOnPage;
      map[v.page].avgScroll += v.scrollDepth;
    });
    return Object.entries(map)
      .map(([page, data]) => ({
        page,
        views: data.views,
        avgTime: Math.round(data.avgTime / data.views),
        avgScroll: Math.round(data.avgScroll / data.views),
      }))
      .sort((a, b) => b.views - a.views);
  }, [filteredViews]);

  // ─── Referrer Breakdown ─────────────────────────────────────────
  const referrerBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredViews.filter(v => v.landingPage).forEach(v => {
      let source = 'Direct';
      if (v.utmSource) source = v.utmSource;
      else if (v.referrer && v.referrer !== 'direct') {
        try { source = new URL(v.referrer).hostname; } catch { source = v.referrer; }
      }
      map[source] = (map[source] || 0) + 1;
    });
    return Object.entries(map)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredViews]);

  // ─── Device Breakdown ───────────────────────────────────────────
  const deviceBreakdown = useMemo(() => {
    const map: Record<string, number> = { mobile: 0, tablet: 0, desktop: 0 };
    filteredViews.forEach(v => { map[v.device] = (map[v.device] || 0) + 1; });
    const total = filteredViews.length || 1;
    return Object.entries(map).map(([device, count]) => ({
      device, count, pct: Math.round((count / total) * 100)
    }));
  }, [filteredViews]);

  // ─── Browser & OS ───────────────────────────────────────────────
  const browserBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredViews.forEach(v => { map[v.browser] = (map[v.browser] || 0) + 1; });
    return Object.entries(map)
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredViews]);

  const osBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    filteredViews.forEach(v => { map[v.os] = (map[v.os] || 0) + 1; });
    return Object.entries(map)
      .map(([os, count]) => ({ os, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredViews]);

  // ─── Exit Triggers ──────────────────────────────────────────────
  const exitTriggers = useMemo(() => {
    const map: Record<string, number> = {};
    filteredViews.filter(v => v.exitTrigger).forEach(v => {
      const label = v.exitTrigger.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
      map[label] = (map[label] || 0) + 1;
    });
    return Object.entries(map)
      .map(([trigger, count]) => ({ trigger, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredViews]);

  // ─── Daily Views (last N days) ──────────────────────────────────
  const dailyViews = useMemo(() => {
    const days: Record<string, number> = {};
    for (let i = 0; i < Math.min(dateRange, 30); i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days[d.toISOString().slice(0, 10)] = 0;
    }
    filteredViews.forEach(v => {
      const day = v.timestamp.slice(0, 10);
      if (days[day] !== undefined) days[day]++;
    });
    return Object.entries(days).reverse().map(([date, count]) => ({ date, count }));
  }, [filteredViews, dateRange]);

  // ─── Recent Activity ────────────────────────────────────────────
  const recentViews = useMemo(() =>
    [...filteredViews].reverse().slice(0, 20), [filteredViews]);

  const handleClear = () => {
    if (window.confirm('Clear all analytics data? This cannot be undone.')) {
      clearAnalyticsData();
      setRefreshKey(k => k + 1);
    }
  };

  const toggle = (section: string) =>
    setExpandedSection(expandedSection === section ? null : section);

  const maxDailyViews = Math.max(...dailyViews.map(d => d.count), 1);
  const maxPageViews = pageRankings.length > 0 ? pageRankings[0].views : 1;

  const deviceIcons: Record<string, any> = { mobile: Smartphone, tablet: Tablet, desktop: Monitor };

  return (
    <>
      <Helmet>
        <title>Analytics Dashboard | KenjiAI</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="pt-20 pb-16 min-h-screen" style={{ backgroundColor: '#0B0E14' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4"
          >
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
                <BarChart3 className="w-8 h-8 text-blue-400" />
                Site Analytics
              </h1>
              <p className="text-gray-400 mt-1">Real-time visitor data from localStorage</p>
            </div>
            <div className="flex items-center gap-3">
              {/* Date Range Selector */}
              <select
                value={dateRange}
                onChange={e => setDateRange(Number(e.target.value))}
                className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value={7}>Last 7 days</option>
                <option value={14}>Last 14 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
                <option value={365}>All time</option>
              </select>
              <button
                onClick={() => setRefreshKey(k => k + 1)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-lg border border-gray-700 transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleClear}
                className="bg-red-900/30 hover:bg-red-900/50 text-red-400 p-2 rounded-lg border border-red-800/50 transition-colors"
                title="Clear all data"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Empty State */}
          {filteredViews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <BarChart3 className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-400 mb-2">No data yet</h2>
              <p className="text-gray-500 max-w-md mx-auto">
                Analytics data will appear here as visitors browse the site and accept the tracking consent banner. 
                Try visiting a few pages to see data populate.
              </p>
            </motion.div>
          ) : (
            <>
              {/* ─── KPI Cards ─────────────────────────────────────── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <StatCard icon={Eye} label="Total Page Views" value={metrics.totalViews} color="bg-blue-600" />
                <StatCard icon={Users} label="Sessions" value={metrics.totalSessions} subValue={`${metrics.newVisitors} new visitors`} color="bg-green-600" />
                <StatCard icon={Clock} label="Avg Time on Page" value={formatDuration(metrics.avgTimeOnPage)} color="bg-purple-600" />
                <StatCard icon={MousePointer} label="Avg Scroll Depth" value={`${metrics.avgScrollDepth}%`} subValue={`${metrics.bounceRate}% bounce rate`} color="bg-amber-600" />
              </div>

              {/* ─── Daily Views Chart ─────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 mb-6"
              >
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Daily Page Views
                </h2>
                <div className="flex items-end gap-1 h-40">
                  {dailyViews.map((d, i) => (
                    <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                      <div className="absolute -top-8 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                        {formatDate(d.date)}: {d.count} views
                      </div>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(d.count / maxDailyViews) * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.02 }}
                        className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t min-h-[2px] hover:from-blue-500 hover:to-blue-300 transition-colors cursor-pointer"
                        style={{ minHeight: d.count > 0 ? '4px' : '2px' }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-gray-500 text-xs">{dailyViews[0]?.date ? formatDate(dailyViews[0].date) : ''}</span>
                  <span className="text-gray-500 text-xs">{dailyViews[dailyViews.length - 1]?.date ? formatDate(dailyViews[dailyViews.length - 1].date) : ''}</span>
                </div>
              </motion.div>

              {/* ─── Two Column Grid ───────────────────────────────── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                {/* Top Pages */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6"
                >
                  <button onClick={() => toggle('pages')} className="w-full flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                      <Globe className="w-5 h-5 text-green-400" />
                      Top Pages
                    </h2>
                    {expandedSection === 'pages' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>
                  <div className="space-y-3">
                    {pageRankings.slice(0, expandedSection === 'pages' ? 20 : 6).map((p) => (
                      <div key={p.page}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-gray-300 text-sm truncate max-w-[200px]">{p.page}</span>
                          <div className="flex items-center gap-4 text-xs text-gray-400">
                            <span>{p.views} views</span>
                            <span>{formatDuration(p.avgTime)}</span>
                            <span>{p.avgScroll}%↓</span>
                          </div>
                        </div>
                        <BarVisual value={p.views} max={maxPageViews} color="bg-gradient-to-r from-green-500 to-emerald-400" />
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Traffic Sources */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6"
                >
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    Traffic Sources
                  </h2>
                  {referrerBreakdown.length === 0 ? (
                    <p className="text-gray-500 text-sm">No referrer data yet</p>
                  ) : (
                    <div className="space-y-3">
                      {referrerBreakdown.map(r => (
                        <div key={r.source}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-300 text-sm truncate max-w-[200px]">{r.source}</span>
                            <span className="text-gray-400 text-xs">{r.count} sessions</span>
                          </div>
                          <BarVisual value={r.count} max={referrerBreakdown[0]?.count || 1} color="bg-gradient-to-r from-purple-500 to-pink-400" />
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* ─── Three Column Grid ─────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                {/* Devices */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6"
                >
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Monitor className="w-5 h-5 text-cyan-400" />
                    Devices
                  </h2>
                  <div className="space-y-4">
                    {deviceBreakdown.map(d => {
                      const DevIcon = deviceIcons[d.device] || Monitor;
                      return (
                        <div key={d.device} className="flex items-center gap-3">
                          <DevIcon className="w-5 h-5 text-gray-400" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-gray-300 text-sm capitalize">{d.device}</span>
                              <span className="text-gray-400 text-xs">{d.pct}%</span>
                            </div>
                            <BarVisual value={d.count} max={Math.max(...deviceBreakdown.map(x => x.count), 1)} color="bg-gradient-to-r from-cyan-500 to-blue-400" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Browsers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6"
                >
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Search className="w-5 h-5 text-amber-400" />
                    Browsers
                  </h2>
                  <div className="space-y-3">
                    {browserBreakdown.map(b => (
                      <div key={b.browser} className="flex items-center justify-between">
                        <span className="text-gray-300 text-sm">{b.browser}</span>
                        <span className="text-gray-400 text-xs bg-gray-700/50 px-2 py-1 rounded">{b.count}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Exit Triggers */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6"
                >
                  <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <LogOut className="w-5 h-5 text-red-400" />
                    Why Visitors Leave
                  </h2>
                  {exitTriggers.length === 0 ? (
                    <p className="text-gray-500 text-sm">No exit data yet</p>
                  ) : (
                    <div className="space-y-3">
                      {exitTriggers.map(e => (
                        <div key={e.trigger} className="flex items-center justify-between">
                          <span className="text-gray-300 text-sm">{e.trigger}</span>
                          <span className="text-gray-400 text-xs bg-gray-700/50 px-2 py-1 rounded">{e.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* ─── OS Breakdown ──────────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6 mb-6"
              >
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  Operating Systems
                </h2>
                <div className="flex flex-wrap gap-3">
                  {osBreakdown.map(o => (
                    <div key={o.os} className="bg-gray-700/30 border border-gray-600/30 rounded-lg px-4 py-3 text-center">
                      <div className="text-white font-semibold text-lg">{o.count}</div>
                      <div className="text-gray-400 text-xs">{o.os}</div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* ─── Recent Activity ───────────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-6"
              >
                <button onClick={() => toggle('activity')} className="w-full flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-indigo-400" />
                    Recent Activity ({recentViews.length})
                  </h2>
                  {expandedSection === 'activity' ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 text-xs border-b border-gray-700">
                        <th className="text-left pb-2 pr-4">Time</th>
                        <th className="text-left pb-2 pr-4">Page</th>
                        <th className="text-left pb-2 pr-4">Device</th>
                        <th className="text-right pb-2 pr-4">Duration</th>
                        <th className="text-right pb-2 pr-4">Scroll</th>
                        <th className="text-left pb-2">Exit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentViews.slice(0, expandedSection === 'activity' ? 20 : 8).map(v => (
                        <tr key={v.id} className="border-b border-gray-800/50 hover:bg-gray-700/20 transition-colors">
                          <td className="py-2 pr-4 text-gray-400 text-xs whitespace-nowrap">{formatDateTime(v.timestamp)}</td>
                          <td className="py-2 pr-4 text-gray-300 truncate max-w-[180px]">{v.page}</td>
                          <td className="py-2 pr-4 text-gray-400 text-xs capitalize">{v.device}</td>
                          <td className="py-2 pr-4 text-right text-gray-300">{v.timeOnPage > 0 ? formatDuration(v.timeOnPage) : '-'}</td>
                          <td className="py-2 pr-4 text-right text-gray-300">{v.scrollDepth > 0 ? `${v.scrollDepth}%` : '-'}</td>
                          <td className="py-2 text-gray-400 text-xs">{v.exitTrigger || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
