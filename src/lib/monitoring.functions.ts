// Server functions for performance monitoring and uptime tracking
import { createServerFn } from '@tanstack/react-start';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireAdminSession } from './admin-session.server';

async function adminClient(): Promise<SupabaseClient> {
  await requireAdminSession();
  const { getSupabaseAdmin } = await import('@/integrations/supabase/client.server');
  const client = getSupabaseAdmin();
  if (!client) throw new Error('Estatísticas ainda não configuradas.');
  return client;
}
import { getSessionFromCookie } from './admin-session.server';



// Track performance metric (called by instrumented functions)
export const trackPerformance = createServerFn({ method: 'POST' }).inputValidator((data: {
  metricType: 'server_function' | 'api_call' | 'integration';
  functionName: string;
  durationMs: number;
  status: 'success' | 'error' | 'timeout';
  errorMessage?: string;
}) => data).handler(async ({ data }) => {
  const supabaseAdmin = await adminClient();
  try {
    await supabaseAdmin.from('performance_metrics').insert({
      metric_type: data.metricType,
      function_name: data.functionName,
      duration_ms: data.durationMs,
      status: data.status,
      error_message: data.errorMessage || null,
      occurred_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Monitoring] Failed to track performance:', error);
  }
  return { success: true };
});

// Record uptime check
export const recordUptimeCheck = createServerFn({ method: 'POST' }).inputValidator((data: {
  checkType: 'heartbeat' | 'health_endpoint' | 'integration';
  endpoint?: string;
  status: 'up' | 'down' | 'degraded';
  responseTimeMs?: number;
  errorMessage?: string;
}) => data).handler(async ({ data }) => {
  const supabaseAdmin = await adminClient();
  try {
    await supabaseAdmin.from('uptime_checks').insert({
      check_type: data.checkType,
      endpoint: data.endpoint || null,
      status: data.status,
      response_time_ms: data.responseTimeMs || null,
      error_message: data.errorMessage || null,
      checked_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Monitoring] Failed to record uptime check:', error);
  }
  return { success: true };
});

// Create admin alert
export const createAdminAlert = createServerFn({ method: 'POST' }).inputValidator((data: {
  alertType: 'error_spike' | 'integration_failure' | 'uptime_down' | 'performance_degradation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
}) => data).handler(async ({ data }) => {
  const supabaseAdmin = await adminClient();
  try {
    await supabaseAdmin.from('admin_alerts').insert({
      alert_type: data.alertType,
      severity: data.severity,
      title: data.title,
      message: data.message,
      metadata: data.metadata || null,
      is_resolved: false,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Monitoring] Failed to create alert:', error);
  }
  return { success: true };
});

// Get performance metrics summary
export const getPerformanceMetrics = createServerFn({ method: 'GET' }).handler(async () => {
  const supabaseAdmin = await adminClient();

  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabaseAdmin
    .from('performance_metrics')
    .select('*')
    .gte('occurred_at', last24Hours)
    .order('occurred_at', { ascending: false })
    .limit(1000);

  // Calculate averages and stats
  const byFunction = new Map<string, { total: number; count: number; errors: number }>();

  data?.forEach((metric) => {
    const key = metric.function_name || 'unknown';
    if (!byFunction.has(key)) {
      byFunction.set(key, { total: 0, count: 0, errors: 0 });
    }
    const stats = byFunction.get(key);
    if (!stats) return;
    stats.total += metric.duration_ms;
    stats.count++;
    if (metric.status === 'error') stats.errors++;
  });

  const summary = Array.from(byFunction.entries()).map(([name, stats]) => ({
    name,
    avgDuration: Math.round(stats.total / stats.count),
    count: stats.count,
    errorRate: stats.count > 0 ? (stats.errors / stats.count) * 100 : 0,
  }));

  return {
    summary: summary.sort((a, b) => b.count - a.count).slice(0, 20),
    totalCalls: data?.length || 0,
    avgResponseTime: data && data.length > 0 
      ? Math.round(data.reduce((sum, m) => sum + m.duration_ms, 0) / data.length)
      : 0,
  };
});

// Get uptime statistics
export const getUptimeStats = createServerFn({ method: 'GET' }).handler(async () => {
  const supabaseAdmin = await adminClient();

  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabaseAdmin
    .from('uptime_checks')
    .select('*')
    .gte('checked_at', last24Hours)
    .order('checked_at', { ascending: false });

  const total = data?.length || 0;
  const up = data?.filter((c) => c.status === 'up').length || 0;
  const down = data?.filter((c) => c.status === 'down').length || 0;

  const uptimePercentage = total > 0 ? (up / total) * 100 : 100;

  return {
    uptimePercentage,
    totalChecks: total,
    upChecks: up,
    downChecks: down,
    recentChecks: data?.slice(0, 50) || [],
  };
});

// Get admin alerts
export const getAdminAlerts = createServerFn({ method: 'GET' }).handler(async () => {
  const supabaseAdmin = await adminClient();

  const { data } = await supabaseAdmin
    .from('admin_alerts')
    .select('*')
    .eq('is_resolved', false)
    .order('created_at', { ascending: false })
    .limit(50);

  return data || [];
});

// Resolve admin alert
export const resolveAlert = createServerFn({ method: 'POST' }).inputValidator((data: string) => data).handler(async ({ data: alertId }) => {
  const supabaseAdmin = await adminClient();

  const { error } = await supabaseAdmin
    .from('admin_alerts')
    .update({
      is_resolved: true,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', alertId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
});

// Check for error spikes and create alerts
export const checkErrorSpikes = createServerFn({ method: 'GET' }).handler(async () => {
  const supabaseAdmin = await adminClient();

  const last10Minutes = new Date(Date.now() - 10 * 60 * 1000).toISOString();
  const last1Hour = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  // Count errors in last 10 minutes vs last hour
  const { count: recent } = await supabaseAdmin
    .from('error_logs')
    .select('*', { count: 'exact', head: true })
    .gte('occurred_at', last10Minutes);

  const { count: hourly } = await supabaseAdmin
    .from('error_logs')
    .select('*', { count: 'exact', head: true })
    .gte('occurred_at', last1Hour);

  const recentCount = recent || 0;
  const hourlyAvg = (hourly || 0) / 6; // 10-minute average over the hour

  // If recent count is 3x the average, create alert
  if (recentCount > hourlyAvg * 3 && recentCount > 10) {
    await createAdminAlert({ data: {
      alertType: 'error_spike',
      severity: 'high',
      title: 'Pico de Erros Detectado',
      message: `${recentCount} erros nos últimos 10 minutos (média: ${Math.round(hourlyAvg)})`,
      metadata: { recentCount, hourlyAvg },
    } });

    return {
      spikeDetected: true,
      recentCount,
      hourlyAvg,
    };
  }

  return { spikeDetected: false };
});
