-- Kenji Studio (kenjiai.com/video-generation) schema, Netlify DB (Neon Postgres).
-- The same statements run idempotently on cold start (netlify/functions/_vidgen/db.ts SCHEMA).
-- Keep the two in sync.

CREATE TABLE IF NOT EXISTS vg_users (
  id uuid PRIMARY KEY,
  google_sub text NOT NULL UNIQUE,
  email text NOT NULL,
  name text NOT NULL DEFAULT '',
  picture text NOT NULL DEFAULT '',
  plan text NOT NULL DEFAULT 'none',
  sub_status text NOT NULL DEFAULT '',
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Append-only. Balance = SUM(delta). ref makes every grant, hold and refund idempotent.
CREATE TABLE IF NOT EXISTS vg_credit_ledger (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES vg_users(id),
  delta integer NOT NULL,
  reason text NOT NULL,
  ref text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS vg_credit_ledger_user ON vg_credit_ledger (user_id);

CREATE TABLE IF NOT EXISTS vg_generations (
  id uuid PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES vg_users(id),
  goal text NOT NULL,
  model text NOT NULL,
  title text NOT NULL DEFAULT '',
  prompt text NOT NULL DEFAULT '',
  aspect text,
  seconds integer NOT NULL DEFAULT 0,
  hf_path text NOT NULL,
  hf_body jsonb NOT NULL,
  credits integer NOT NULL,
  est_usd numeric(12,4) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'queued',
  hf_request_id text UNIQUE,
  hf_output_url text,
  error text,
  attempts integer NOT NULL DEFAULT 0,
  next_try_at timestamptz NOT NULL DEFAULT now(),
  media_stored boolean NOT NULL DEFAULT false,
  media_bytes bigint,
  media_type text,
  store_attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  checked_at timestamptz,
  finished_at timestamptz
);
CREATE INDEX IF NOT EXISTS vg_generations_user ON vg_generations (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS vg_generations_status ON vg_generations (status);

-- Every Higgsfield upload URL we handed out, so generation inputs can only use the person's own uploads.
CREATE TABLE IF NOT EXISTS vg_uploads (
  public_url text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES vg_users(id),
  kind text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Rate limiting (prompt writer, uploads).
CREATE TABLE IF NOT EXISTS vg_usage (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  kind text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS vg_usage_lookup ON vg_usage (user_id, kind, created_at);

-- Rate limiting for signed-out visitors (prompt writer). Only an HMAC of the IP is stored.
CREATE TABLE IF NOT EXISTS vg_ip_usage (
  id bigserial PRIMARY KEY,
  ip_hash text NOT NULL,
  kind text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS vg_ip_usage_lookup ON vg_ip_usage (ip_hash, kind, created_at);

-- Webhook dedupe (Higgsfield request_id + status, Stripe event id).
CREATE TABLE IF NOT EXISTS vg_webhook_events (
  source text NOT NULL,
  event_id text NOT NULL,
  status text NOT NULL DEFAULT '',
  received_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (source, event_id, status)
);
