// Server functions for admin analytics
// These functions are called from the admin panel and require authentication

import { createServerFn } from '@tanstack/react-start';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { getSessionFromCookie } from './admin-session.server';

export interface AnalyticsFilters {
  startDate?: string;
  endDate?: string;
  toolSlug?: string;
  country?: string;
  deviceType?: string;
}

export interface DashboardKPIs {
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  onlineUsers: number;
  dailyRevenue: number;
  monthlyRevenue: number;
  adImpressions: number;
  adClicks: number;
}

export interface VisitsChartData {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

export interface ToolUsageData {
  toolSlug: string;
  toolName: string;
  visits: number;
  uniqueVisitors: number;
  uses: number;
}

export interface GeoData {
  countryCode: string;
  countryName: string;
  visits: number;
  uniqueVisitors: number;
  percentage: number;
}

// Authenticate admin session
async function requireAdminAuth(request: Request): Promise<void> {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);

  if (!session) {
    throw new Error('Unauthorized - No valid session');
  }
}

// Get dashboard KPIs
export const getDashboardKPIs = createServerFn('GET', async (filters: AnalyticsFilters, { request }) => {
  await requireAdminAuth(request);

  const today = new Date().toISOString().split('T')[0];
  const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  // Total visits
  const { count: totalVisits } = await supabaseAdmin
    .from('access_events')
    .select('*', { count: 'exact', head: true });

  // Unique visitors (approximate - count distinct visitor hashes)
  const { data: uniqueVisitorsData } = await supabaseAdmin
    .from('access_events')
    .select('visitor_hash')
    .not('visitor_hash', 'is', null);
  
  const uniqueVisitors = new Set(uniqueVisitorsData?.map((v) => v.visitor_hash)).size;

  // Today's visits
  const { count: todayVisits } = await supabaseAdmin
    .from('access_events')
    .select('*', { count: 'exact', head: true })
    .gte('visited_at', today);

  // Online users (last 5 minutes)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  const { count: onlineUsers } = await supabaseAdmin
    .from('online_users')
    .select('*', { count: 'exact', head: true })
    .gte('last_heartbeat_at', fiveMinutesAgo);

  // Daily revenue (today)
  const { data: todayRevenue } = await supabaseAdmin
    .from('monetag_revenue')
    .select('revenue_cents')
    .eq('date', today)
    .single();

  // Monthly revenue
  const { data: monthlyRevenueData } = await supabaseAdmin
    .from('monetag_revenue')
    .select('revenue_cents')
    .gte('date', thisMonthStart);

  const monthlyRevenue = monthlyRevenueData?.reduce((sum, row) => sum + (row.revenue_cents || 0), 0) || 0;

  // Ad impressions and clicks (today)
  const { data: todayAds } = await supabaseAdmin
    .from('monetag_revenue')
    .select('impressions, clicks')
    .eq('date', today)
    .single();

  const result: DashboardKPIs = {
    totalVisits: totalVisits || 0,
    uniqueVisitors,
    todayVisits: todayVisits || 0,
    onlineUsers: onlineUsers || 0,
    dailyRevenue: (todayRevenue?.revenue_cents || 0) / 100,
    monthlyRevenue: monthlyRevenue / 100,
    adImpressions: Number(todayAds?.impressions || 0),
    adClicks: Number(todayAds?.clicks || 0),
  };

  return result;
});

// Get visits chart data
export const getVisitsChartData = createServerFn('GET', async (filters: AnalyticsFilters, { request }) => {
  await requireAdminAuth(request);

  const startDate = filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDate = filters.endDate || new Date().toISOString().split('T')[0];

  const { data } = await supabaseAdmin
    .from('access_events')
    .select('visited_at, visitor_hash')
    .gte('visited_at', startDate)
    .lte('visited_at', endDate)
    .order('visited_at', { ascending: true });

  // Group by date
  const grouped = new Map<string, { visits: number; visitors: Set<string> }>();
  
  data?.forEach((row) => {
    const date = row.visited_at.split('T')[0];
    if (!grouped.has(date)) {
      grouped.set(date, { visits: 0, visitors: new Set() });
    }
    const entry = grouped.get(date)!;
    entry.visits++;
    if (row.visitor_hash) entry.visitors.add(row.visitor_hash);
  });

  const result: VisitsChartData[] = Array.from(grouped.entries()).map(([date, data]) => ({
    date,
    visits: data.visits,
    uniqueVisitors: data.visitors.size,
  }));

  return result;
});

// Get tool usage statistics
export const getToolUsageData = createServerFn('GET', async (filters: AnalyticsFilters, { request }) => {
  await requireAdminAuth(request);

  const startDate = filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDate = filters.endDate || new Date().toISOString().split('T')[0];

  const { data: accessData } = await supabaseAdmin
    .from('access_events')
    .select('tool_slug, visitor_hash')
    .not('tool_slug', 'is', null)
    .gte('visited_at', startDate)
    .lte('visited_at', endDate);

  const { data: usageData } = await supabaseAdmin
    .from('usage_events')
    .select('tool_slug')
    .gte('occurred_at', startDate)
    .lte('occurred_at', endDate);

  // Group by tool
  const grouped = new Map<string, { visits: number; visitors: Set<string>; uses: number }>();

  accessData?.forEach((row) => {
    if (!row.tool_slug) return;
    if (!grouped.has(row.tool_slug)) {
      grouped.set(row.tool_slug, { visits: 0, visitors: new Set(), uses: 0 });
    }
    const entry = grouped.get(row.tool_slug)!;
    entry.visits++;
    if (row.visitor_hash) entry.visitors.add(row.visitor_hash);
  });

  usageData?.forEach((row) => {
    if (!grouped.has(row.tool_slug)) {
      grouped.set(row.tool_slug, { visits: 0, visitors: new Set(), uses: 0 });
    }
    grouped.get(row.tool_slug)!.uses++;
  });

  // Import catalog dynamically to avoid bundling issues
  const { getTool } = await import('./catalog');

  const result: ToolUsageData[] = Array.from(grouped.entries())
    .map(([toolSlug, data]) => ({
      toolSlug,
      toolName: getTool(toolSlug)?.name || toolSlug,
      visits: data.visits,
      uniqueVisitors: data.visitors.size,
      uses: data.uses,
    }))
    .sort((a, b) => b.visits - a.visits);

  return result;
});

// Get geo statistics
export const getGeoData = createServerFn('GET', async (filters: AnalyticsFilters, { request }) => {
  await requireAdminAuth(request);

  const startDate = filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const endDate = filters.endDate || new Date().toISOString().split('T')[0];

  const { data } = await supabaseAdmin
    .from('access_events')
    .select('country_code, visitor_hash')
    .not('country_code', 'is', null)
    .gte('visited_at', startDate)
    .lte('visited_at', endDate);

  // Group by country
  const grouped = new Map<string, { visits: number; visitors: Set<string> }>();
  let totalVisits = 0;

  data?.forEach((row) => {
    if (!row.country_code) return;
    if (!grouped.has(row.country_code)) {
      grouped.set(row.country_code, { visits: 0, visitors: new Set() });
    }
    const entry = grouped.get(row.country_code)!;
    entry.visits++;
    totalVisits++;
    if (row.visitor_hash) entry.visitors.add(row.visitor_hash);
  });

  const result: GeoData[] = Array.from(grouped.entries())
    .map(([countryCode, data]) => ({
      countryCode,
      countryName: getCountryName(countryCode),
      visits: data.visits,
      uniqueVisitors: data.visitors.size,
      percentage: totalVisits > 0 ? (data.visits / totalVisits) * 100 : 0,
    }))
    .sort((a, b) => b.visits - a.visits);

  return result;
});

// Get error logs
export const getErrorLogs = createServerFn('GET', async (filters: AnalyticsFilters, { request }) => {
  await requireAdminAuth(request);

  const { data } = await supabaseAdmin
    .from('error_logs')
    .select('*')
    .order('occurred_at', { ascending: false })
    .limit(100);

  return data || [];
});

// Helper function for country names
function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    BR: 'Brasil',
    US: 'Estados Unidos',
    PT: 'Portugal',
    GB: 'Reino Unido',
    DE: 'Alemanha',
    FR: 'França',
    ES: 'Espanha',
    IT: 'Itália',
    AR: 'Argentina',
    MX: 'México',
    // Add more as needed
  };
  return countries[code] || code;
}
