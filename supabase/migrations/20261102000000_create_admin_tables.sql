-- Admin panel tables for i-Tools analytics and monitoring
-- Run this migration in Supabase Dashboard or via Lovable deployment

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Admin users table (for future multi-admin support)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  CONSTRAINT username_length CHECK (char_length(username) >= 3)
);

CREATE INDEX idx_admin_users_username ON admin_users(username);
CREATE INDEX idx_admin_users_is_active ON admin_users(is_active);

-- Admin sessions table
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_token TEXT UNIQUE NOT NULL,
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  last_activity_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX idx_admin_sessions_user ON admin_sessions(admin_user_id);

-- Access events table (anonymized visitor tracking)
-- IP addresses are hashed for LGPD compliance
CREATE TABLE IF NOT EXISTS access_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_hash TEXT NOT NULL, -- SHA256 hash of IP + salt (daily rotation)
  tool_slug TEXT, -- NULL for homepage
  page_path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  country_code CHAR(2), -- From cf-ipcountry or IP geolocation
  city TEXT, -- From cf-ipcity when available
  device_type TEXT CHECK (device_type IN ('mobile', 'tablet', 'desktop')),
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  session_id UUID -- For grouping visits by the same user
);

CREATE INDEX idx_access_events_visited_at ON access_events(visited_at DESC);
CREATE INDEX idx_access_events_tool_slug ON access_events(tool_slug);
CREATE INDEX idx_access_events_visitor_hash ON access_events(visitor_hash);
CREATE INDEX idx_access_events_country ON access_events(country_code);
CREATE INDEX idx_access_events_session ON access_events(session_id);
CREATE INDEX idx_access_events_date ON access_events(DATE(visited_at));

-- Tool usage events (specific tool interactions)
CREATE TABLE IF NOT EXISTS usage_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_hash TEXT NOT NULL,
  tool_slug TEXT NOT NULL,
  event_type TEXT NOT NULL, -- 'use', 'download', 'share', 'error'
  metadata JSONB, -- Tool-specific data (e.g., file size, video duration)
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_usage_events_occurred_at ON usage_events(occurred_at DESC);
CREATE INDEX idx_usage_events_tool_slug ON usage_events(tool_slug);
CREATE INDEX idx_usage_events_type ON usage_events(event_type);
CREATE INDEX idx_usage_events_date ON usage_events(DATE(occurred_at));

-- Online users tracking (heartbeat-based)
CREATE TABLE IF NOT EXISTS online_users (
  visitor_hash TEXT PRIMARY KEY,
  last_heartbeat_at TIMESTAMPTZ DEFAULT NOW(),
  page_path TEXT,
  tool_slug TEXT
);

CREATE INDEX idx_online_users_heartbeat ON online_users(last_heartbeat_at);

-- Geo statistics aggregation (daily summaries)
CREATE TABLE IF NOT EXISTS geo_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL,
  country_code CHAR(2) NOT NULL,
  city TEXT,
  visit_count INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT unique_geo_date UNIQUE (date, country_code, city)
);

CREATE INDEX idx_geo_stats_date ON geo_stats(date DESC);
CREATE INDEX idx_geo_stats_country ON geo_stats(country_code);

-- Monetag revenue data
CREATE TABLE IF NOT EXISTS monetag_revenue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date DATE NOT NULL UNIQUE,
  impressions BIGINT DEFAULT 0,
  clicks BIGINT DEFAULT 0,
  revenue_cents INTEGER DEFAULT 0, -- Store in cents to avoid floating point issues
  currency TEXT DEFAULT 'USD',
  cpm DECIMAL(10, 2),
  rpm DECIMAL(10, 2),
  source TEXT DEFAULT 'api', -- 'api' or 'csv_import'
  imported_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_monetag_revenue_date ON monetag_revenue(date DESC);

-- Error logs
CREATE TABLE IF NOT EXISTS error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  error_type TEXT NOT NULL, -- '404', '500', 'js_error', 'tool_error', 'integration_error'
  page_path TEXT,
  tool_slug TEXT,
  error_message TEXT,
  stack_trace TEXT,
  user_agent TEXT,
  visitor_hash TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_error_logs_occurred_at ON error_logs(occurred_at DESC);
CREATE INDEX idx_error_logs_type ON error_logs(error_type);
CREATE INDEX idx_error_logs_tool_slug ON error_logs(tool_slug);

-- Admin activity logs
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID REFERENCES admin_users(id),
  action TEXT NOT NULL, -- 'login', 'logout', 'view_dashboard', 'export_data', 'edit_tool'
  resource TEXT, -- What was accessed/modified
  metadata JSONB,
  ip_address TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_logs_occurred_at ON admin_logs(occurred_at DESC);
CREATE INDEX idx_admin_logs_admin_user ON admin_logs(admin_user_id);
CREATE INDEX idx_admin_logs_action ON admin_logs(action);

-- Tool configuration (enable/disable, custom settings)
CREATE TABLE IF NOT EXISTS tool_config (
  tool_slug TEXT PRIMARY KEY,
  is_enabled BOOLEAN DEFAULT true,
  custom_settings JSONB, -- Tool-specific configuration
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES admin_users(id)
);

-- Tool metadata overrides (for editing tool name/description)
CREATE TABLE IF NOT EXISTS tool_metadata (
  tool_slug TEXT PRIMARY KEY,
  custom_name TEXT, -- Override display name
  custom_summary TEXT, -- Override description/summary
  custom_keywords TEXT[], -- Override keywords
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES admin_users(id)
);

CREATE INDEX idx_tool_metadata_updated_at ON tool_metadata(updated_at DESC);

-- Performance monitoring (response times)
CREATE TABLE IF NOT EXISTS performance_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_type TEXT NOT NULL, -- 'server_function', 'api_call', 'integration'
  function_name TEXT, -- Name of the function/endpoint
  duration_ms INTEGER NOT NULL, -- Duration in milliseconds
  status TEXT, -- 'success', 'error', 'timeout'
  error_message TEXT,
  occurred_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_performance_metrics_occurred_at ON performance_metrics(occurred_at DESC);
CREATE INDEX idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX idx_performance_metrics_function ON performance_metrics(function_name);

-- Uptime monitoring (availability checks)
CREATE TABLE IF NOT EXISTS uptime_checks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  check_type TEXT NOT NULL, -- 'heartbeat', 'health_endpoint', 'integration'
  endpoint TEXT, -- URL or identifier
  status TEXT NOT NULL, -- 'up', 'down', 'degraded'
  response_time_ms INTEGER,
  error_message TEXT,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_uptime_checks_checked_at ON uptime_checks(checked_at DESC);
CREATE INDEX idx_uptime_checks_type ON uptime_checks(check_type);
CREATE INDEX idx_uptime_checks_status ON uptime_checks(status);

-- Admin alerts (for error spikes, integration failures)
CREATE TABLE IF NOT EXISTS admin_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_type TEXT NOT NULL, -- 'error_spike', 'integration_failure', 'uptime_down', 'performance_degradation'
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  metadata JSONB, -- Additional context
  is_resolved BOOLEAN DEFAULT false,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_admin_alerts_created_at ON admin_alerts(created_at DESC);
CREATE INDEX idx_admin_alerts_severity ON admin_alerts(severity);
CREATE INDEX idx_admin_alerts_is_resolved ON admin_alerts(is_resolved);

-- Functions for data aggregation

-- Function to clean up old online users (older than 5 minutes)
CREATE OR REPLACE FUNCTION cleanup_online_users()
RETURNS void AS $$
BEGIN
  DELETE FROM online_users
  WHERE last_heartbeat_at < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql;

-- Function to aggregate daily stats
CREATE OR REPLACE FUNCTION aggregate_daily_geo_stats(target_date DATE)
RETURNS void AS $$
BEGIN
  INSERT INTO geo_stats (date, country_code, city, visit_count, unique_visitors)
  SELECT
    target_date,
    country_code,
    city,
    COUNT(*) as visit_count,
    COUNT(DISTINCT visitor_hash) as unique_visitors
  FROM access_events
  WHERE DATE(visited_at) = target_date
    AND country_code IS NOT NULL
  GROUP BY country_code, city
  ON CONFLICT (date, country_code, city)
  DO UPDATE SET
    visit_count = EXCLUDED.visit_count,
    unique_visitors = EXCLUDED.unique_visitors;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) - Ensure only server-side access
-- The server will use the service role key which bypasses RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE access_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE online_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE geo_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE monetag_revenue ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE uptime_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_alerts ENABLE ROW LEVEL SECURITY;

-- Grant permissions to service role (used by supabaseAdmin)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- Comments for documentation
COMMENT ON TABLE access_events IS 'Anonymized page visit tracking with IP hashing for LGPD compliance';
COMMENT ON TABLE usage_events IS 'Tool-specific usage events for analytics';
COMMENT ON TABLE online_users IS 'Real-time online user tracking via heartbeat';
COMMENT ON TABLE monetag_revenue IS 'Daily Monetag advertising revenue data';
COMMENT ON TABLE error_logs IS 'Error tracking for monitoring and debugging';
COMMENT ON TABLE tool_config IS 'Per-tool configuration and enable/disable flags';
COMMENT ON TABLE tool_metadata IS 'Custom tool metadata overrides (name, description, keywords)';
