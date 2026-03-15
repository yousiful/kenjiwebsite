/*
  # Create visitor logs table

  1. New Tables
    - `visitor_logs`
      - `id` (uuid, primary key)
      - `ip` (text) - visitor IP address
      - `country` (text) - country from IP lookup
      - `city` (text) - city from IP lookup
      - `region` (text) - region/state from IP lookup
      - `org` (text) - ISP / org from IP lookup
      - `timezone` (text) - timezone from IP lookup
      - `latitude` (text) - lat coordinate
      - `longitude` (text) - lon coordinate
      - `page` (text) - page visited
      - `referrer` (text) - referrer URL
      - `user_agent` (text) - browser user agent
      - `hostname` (text) - hostname from IP lookup
      - `visited_at` (timestamptz) - when the visit occurred

  2. Security
    - Enable RLS on `visitor_logs` table
    - No public read access — only service role can query
    - Insert allowed from edge function via service role key
*/

CREATE TABLE IF NOT EXISTS visitor_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text,
  country text DEFAULT '',
  city text DEFAULT '',
  region text DEFAULT '',
  org text DEFAULT '',
  timezone text DEFAULT '',
  latitude text DEFAULT '',
  longitude text DEFAULT '',
  page text DEFAULT '',
  referrer text DEFAULT '',
  user_agent text DEFAULT '',
  hostname text DEFAULT '',
  visited_at timestamptz DEFAULT now()
);

ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert visitor logs"
  ON visitor_logs
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can select visitor logs"
  ON visitor_logs
  FOR SELECT
  TO service_role
  USING (true);

CREATE INDEX IF NOT EXISTS idx_visitor_logs_visited_at ON visitor_logs (visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitor_logs_ip ON visitor_logs (ip);
