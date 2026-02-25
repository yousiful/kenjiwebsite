/*
  # Performance Telemetry & Error Tracking Tables

  ## Purpose
  Stores client-side performance metrics and error events for ongoing monitoring
  of the KenjiAI website's loading reliability and conversion health.

  ## New Tables

  ### 1. `perf_vitals`
  Core Web Vitals reported by real user browsers:
  - `metric_name` - LCP, FID, CLS, TTFB, FCP, or custom timing
  - `metric_value` - numeric value (ms for time-based, unitless for CLS)
  - `rating` - 'good' | 'needs-improvement' | 'poor' (based on Google thresholds)
  - `page_path` - URL path where the metric was captured
  - `session_id` - anonymous session identifier for grouping metrics
  - `connection_type` - effective network type (4g, 3g, 2g, slow-2g, unknown)
  - `user_agent` - browser/device info (truncated)

  ### 2. `error_events`
  Client-side JavaScript errors and resource load failures:
  - `error_type` - 'runtime' | 'promise_rejection' | 'resource' | 'chunk_load'
  - `message` - error message string
  - `filename` - source file where error occurred
  - `lineno` / `colno` - error location
  - `stack` - stack trace (truncated)
  - `page_path` - URL path where error occurred
  - `session_id` - anonymous session identifier
  - `user_agent` - browser/device info (truncated)

  ## Security
  - RLS enabled on both tables
  - Anonymous users can INSERT (public telemetry collection)
  - Anonymous users cannot SELECT (data stays private)
  - Indexes for efficient dashboard queries
*/

-- Perf Vitals Table
CREATE TABLE IF NOT EXISTS perf_vitals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  rating text DEFAULT 'unknown',
  page_path text DEFAULT '',
  session_id text DEFAULT '',
  connection_type text DEFAULT 'unknown',
  user_agent text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE perf_vitals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert perf vitals"
  ON perf_vitals
  FOR INSERT
  TO anon
  WITH CHECK (metric_name IS NOT NULL AND metric_value IS NOT NULL);

-- Error Events Table
CREATE TABLE IF NOT EXISTS error_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  error_type text NOT NULL,
  message text DEFAULT '',
  filename text DEFAULT '',
  lineno integer DEFAULT 0,
  colno integer DEFAULT 0,
  stack text DEFAULT '',
  page_path text DEFAULT '',
  session_id text DEFAULT '',
  user_agent text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE error_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anon can insert error events"
  ON error_events
  FOR INSERT
  TO anon
  WITH CHECK (error_type IS NOT NULL);

-- Indexes for efficient dashboard queries
CREATE INDEX IF NOT EXISTS idx_perf_vitals_metric_name ON perf_vitals (metric_name);
CREATE INDEX IF NOT EXISTS idx_perf_vitals_page_path ON perf_vitals (page_path);
CREATE INDEX IF NOT EXISTS idx_perf_vitals_created_at ON perf_vitals (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_events_error_type ON error_events (error_type);
CREATE INDEX IF NOT EXISTS idx_error_events_created_at ON error_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_error_events_page_path ON error_events (page_path);
