// Admin analytics aggregation (server functions)
import { createServerFn } from '@tanstack/react-start';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireAdminSession } from './admin-session.server';

interface DateRange {
  startDate: string;
  endDate: string;
}

interface ToolStats {
  toolSlug: string;
  visits: number;
  uniqueVisitors: number;
}

interface CountryStats {
  countryCode: string;
  visits: number;
}

export const getDashboardStats = createServerFn({ method: 'POST' }).inputValidator((data: DateRange) => data).handler(async ({ data: filters }) => {
  await requireAdminSession();
  const { getSupabaseAdmin } = await import('@/integrations/supabase/client.server');
  const supabase: SupabaseClient | null = getSupabaseAdmin();
  if (!supabase) return { enabled: false };

  const { data, error } = await supabase
    .from('analytics_events')
    .select('*')
    .gte('created_at', filters.startDate)
    .lte('created_at', filters.endDate);

  if (error || !data) return { enabled: true, stats: null };

  const totalVisits = data.length;
  const uniqueVisitors = new Set(data.map(e => e.visitor_hash)).size;
  
  const toolCounts: Record<string, number> = {};
  for (const event of data) {
    const slug = String(event.tool_slug);
    toolCounts[slug] = (toolCounts[slug] ?? 0) + 1;
  }

  const topTools: ToolStats[] = Object.entries(toolCounts)
    .map(([toolSlug, visits]) => ({ toolSlug, visits, uniqueVisitors: 0 }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);

  return {
    enabled: true,
    stats: {
      totalVisits,
      uniqueVisitors,
      topTools,
      dateRange: filters
    }
  };
});

export const getCountryStats = createServerFn({ method: 'POST' }).inputValidator((data: DateRange) => data).handler(async ({ data: filters }) => {
  await requireAdminSession();
  const { getSupabaseAdmin } = await import('@/integrations/supabase/client.server');
  const supabase: SupabaseClient | null = getSupabaseAdmin();
  if (!supabase) return { enabled: false };

  const { data } = await supabase
    .from('analytics_events')
    .select('country_code')
    .gte('created_at', filters.startDate)
    .lte('created_at', filters.endDate)
    .not('country_code', 'is', null);

  if (!data) return { enabled: true, countries: [] };

  const counts = data.reduce((acc, e) => {
    if (e.country_code) {
      acc[e.country_code] = (acc[e.country_code] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const countries: CountryStats[] = Object.entries(counts)
    .map(([countryCode, visits]) => ({ countryCode, visits }))
    .sort((a, b) => b.visits - a.visits);

  return { enabled: true, countries };
});

export const getToolDetails = createServerFn({ method: 'POST' }).inputValidator((data: { toolSlug: string } & DateRange) => data).handler(async ({ data }) => {
  await requireAdminSession();
  const { getSupabaseAdmin } = await import('@/integrations/supabase/client.server');
  const supabase: SupabaseClient | null = getSupabaseAdmin();
  if (!supabase) return { enabled: false };

  const { data: events } = await supabase
    .from('analytics_events')
    .select('*')
    .eq('tool_slug', data.toolSlug)
    .gte('created_at', data.startDate)
    .lte('created_at', data.endDate);

  if (!events) return { enabled: true, tool: null };

  return {
    enabled: true,
    tool: {
      slug: data.toolSlug,
      totalVisits: events.length,
      uniqueVisitors: new Set(events.map(e => e.visitor_hash)).size
    }
  };
});

export const getMonetagMetrics = createServerFn({ method: 'POST' }).inputValidator((data: DateRange) => data).handler(async ({ data: filters }) => {
  await requireAdminSession();
  const { getSupabaseAdmin } = await import('@/integrations/supabase/client.server');
  const supabase: SupabaseClient | null = getSupabaseAdmin();
  if (!supabase) return { enabled: false };

  const { data } = await supabase
    .from('monetag_metrics')
    .select('*')
    .gte('date', filters.startDate.split('T')[0])
    .lte('date', filters.endDate.split('T')[0])
    .order('date', { ascending: true });

  return { enabled: true, metrics: data || [] };
});

export const exportAnalyticsCSV = createServerFn({ method: 'POST' }).inputValidator((data: DateRange) => data).handler(async ({ data: filters }) => {
  await requireAdminSession();
  const { getSupabaseAdmin } = await import('@/integrations/supabase/client.server');
  const supabase: SupabaseClient | null = getSupabaseAdmin();
  if (!supabase) return null;

  const { data } = await supabase
    .from('analytics_events')
    .select('*')
    .gte('created_at', filters.startDate)
    .lte('created_at', filters.endDate)
    .order('created_at', { ascending: false })
    .limit(10000);

  if (!data) return null;

  const csv = [
    'Date,Tool,Country,Language,Referrer,Device',
    ...data.map(e => 
      `${e.created_at},${e.tool_slug},${e.country_code || ''},${e.language || ''},${e.referrer_domain || ''},${e.user_agent_category}`
    )
  ].join('\n');

  return csv;
});

export const getToolsConfig = createServerFn({ method: 'GET' }).handler(async () => {
  await requireAdminSession();
  const { getSupabaseAdmin } = await import('@/integrations/supabase/client.server');
  const supabase: SupabaseClient | null = getSupabaseAdmin();
  if (!supabase) return { enabled: false, tools: [] };

  const { data } = await supabase
    .from('tools_config')
    .select('*')
    .order('slug');

  return { enabled: true, tools: data || [] };
});

export const updateToolConfig = createServerFn({ method: 'POST' }).inputValidator((data: { slug: string; enabled: boolean }) => data).handler(async ({ data }) => {
  await requireAdminSession();
  const { getSupabaseAdmin } = await import('@/integrations/supabase/client.server');
  const supabase: SupabaseClient | null = getSupabaseAdmin();
  if (!supabase) return { success: false };

  const { error } = await supabase
    .from('tools_config')
    .upsert({ slug: data.slug, enabled: data.enabled, updated_at: new Date().toISOString() });

  return { success: !error };
});
