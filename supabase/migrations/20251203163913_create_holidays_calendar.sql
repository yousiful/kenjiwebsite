/*
  # Holiday Calendar System

  1. New Tables
    - `holidays`
      - `id` (uuid, primary key)
      - `name` (text) - Holiday name (e.g., "Christmas", "Halloween")
      - `start_date` (text) - Start date in MM-DD format for annual recurrence
      - `end_date` (text) - End date in MM-DD format
      - `theme_color` (text) - Primary theme color (hex)
      - `secondary_color` (text) - Secondary theme color (hex)
      - `emoji` (text) - Holiday emoji
      - `confetti_colors` (jsonb) - Array of confetti colors
      - `banner_message` (text) - Special banner message
      - `is_active` (boolean) - Whether to show this holiday
      - `priority` (integer) - Priority when multiple holidays overlap
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `holidays` table
    - Add policy for public read access
    - Add policy for authenticated admin updates

  3. Initial Data
    - Pre-populate with major holidays throughout the year
*/

-- Create holidays table
CREATE TABLE IF NOT EXISTS holidays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date text NOT NULL,
  end_date text NOT NULL,
  theme_color text DEFAULT '#3b82f6',
  secondary_color text DEFAULT '#60a5fa',
  emoji text DEFAULT '🎉',
  confetti_colors jsonb DEFAULT '["#ff0000", "#00ff00", "#0000ff", "#ffff00"]'::jsonb,
  banner_message text,
  is_active boolean DEFAULT true,
  priority integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;

-- Public can read holidays
CREATE POLICY "Anyone can view active holidays"
  ON holidays
  FOR SELECT
  USING (is_active = true);

-- Only authenticated users can manage holidays
CREATE POLICY "Authenticated users can insert holidays"
  ON holidays
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update holidays"
  ON holidays
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete holidays"
  ON holidays
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert default holidays
INSERT INTO holidays (name, start_date, end_date, theme_color, secondary_color, emoji, confetti_colors, banner_message, priority) VALUES
  ('New Year', '12-26', '01-02', '#fbbf24', '#fcd34d', '🎆', '["#fbbf24", "#fcd34d", "#ffffff", "#60a5fa"]'::jsonb, 'Happy New Year! Start fresh with KenjiAI', 10),
  ('Valentine''s Day', '02-10', '02-15', '#ec4899', '#f9a8d4', '💝', '["#ec4899", "#f9a8d4", "#fecdd3", "#ffffff"]'::jsonb, 'Spread the love this Valentine''s Day', 8),
  ('St. Patrick''s Day', '03-15', '03-18', '#10b981', '#34d399', '🍀', '["#10b981", "#34d399", "#6ee7b7", "#ffffff"]'::jsonb, 'Lucky you found KenjiAI!', 7),
  ('Easter', '03-25', '04-05', '#a78bfa', '#c4b5fd', '🐰', '["#a78bfa", "#c4b5fd", "#fbbf24", "#ec4899"]'::jsonb, 'Hop into success this Easter!', 8),
  ('Independence Day', '07-01', '07-05', '#dc2626', '#3b82f6', '🎆', '["#dc2626", "#ffffff", "#3b82f6", "#fbbf24"]'::jsonb, 'Celebrate freedom with AI automation!', 9),
  ('Halloween', '10-25', '11-01', '#f97316', '#7c3aed', '🎃', '["#f97316", "#7c3aed", "#000000", "#fbbf24"]'::jsonb, 'Spooky savings on automation!', 10),
  ('Thanksgiving', '11-20', '11-29', '#d97706', '#b45309', '🦃', '["#d97706", "#b45309", "#dc2626", "#10b981"]'::jsonb, 'Thankful for our amazing clients!', 8),
  ('Black Friday', '11-24', '11-25', '#000000', '#fbbf24', '🛍️', '["#000000", "#fbbf24", "#dc2626", "#ffffff"]'::jsonb, 'BLACK FRIDAY DEALS - Limited Time!', 15),
  ('Cyber Monday', '11-27', '11-28', '#3b82f6', '#1e40af', '💻', '["#3b82f6", "#1e40af", "#60a5fa", "#fbbf24"]'::jsonb, 'CYBER MONDAY - Digital Deals!', 15),
  ('Christmas', '12-15', '12-26', '#dc2626', '#10b981', '🎄', '["#dc2626", "#10b981", "#ffffff", "#fbbf24"]'::jsonb, 'Merry Christmas from KenjiAI!', 10),
  ('New Year''s Eve', '12-31', '01-01', '#7c3aed', '#fbbf24', '🥳', '["#7c3aed", "#fbbf24", "#ec4899", "#ffffff"]'::jsonb, 'Ring in the new year with AI!', 12);

-- Create index for date lookups
CREATE INDEX IF NOT EXISTS idx_holidays_dates ON holidays(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_holidays_active ON holidays(is_active, priority);