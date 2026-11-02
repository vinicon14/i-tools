-- Admin Analytics Tables for i-Tools
-- LGPD-compliant: no full IPs stored, daily rotation of visitor hashes

-- Tool usage events (anonymized)
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_slug TEXT NOT NULL,
  visitor_hash TEXT NOT NULL, -- SHA-256 hash of IP + daily salt, rotated daily
  country_code TEXT, -- ISO 3166-1 alpha-2
  language TEXT, -- Detected language code
  referrer_domain TEXT, -- Extracted domain only, no full URL
  user_agent_category TEXT, -- mobile|desktop|bot
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_events_tool_slug ON analytics_events(tool_slug);
CREATE INDEX IF NOT EXISTS idx_analytics_events_country ON analytics_events(country_code) WHERE country_code IS NOT NULL;

-- Tool configuration (enabled/disabled, metadata)
CREATE TABLE IF NOT EXISTS tools_config (
  slug TEXT PRIMARY KEY,
  enabled BOOLEAN NOT NULL DEFAULT true,
  display_name TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Monetag performance tracking
CREATE TABLE IF NOT EXISTS monetag_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  impressions INTEGER NOT NULL DEFAULT 0,
  clicks INTEGER NOT NULL DEFAULT 0,
  revenue_usd DECIMAL(10,4) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(date)
);

-- System monitoring events
CREATE TABLE IF NOT EXISTS monitoring_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL, -- error|warning|integration_failure
  source TEXT NOT NULL, -- function name or integration
  message TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_monitoring_events_created_at ON monitoring_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_monitoring_events_type ON monitoring_events(event_type);

-- Row-level security: admin access only (service role bypasses RLS)
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE tools_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetag_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring_events ENABLE ROW LEVEL SECURITY;

-- Policies: deny all public access (only service role can access)
CREATE POLICY analytics_events_deny_all ON analytics_events FOR ALL USING (false);
CREATE POLICY tools_config_deny_all ON tools_config FOR ALL USING (false);
CREATE POLICY monetag_metrics_deny_all ON monetag_metrics FOR ALL USING (false);
CREATE POLICY monitoring_events_deny_all ON monitoring_events FOR ALL USING (false);
