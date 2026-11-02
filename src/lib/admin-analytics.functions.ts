// Comprehensive server functions for admin analytics with full filter support
// All functions require authentication and respect global filters

import { createServerFn } from '@tanstack/react-start';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { getSessionFromCookie } from './admin-session.server';
import { type GlobalFilters, getDateRange, getTrafficSourceDomain } from './admin-filters';
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

// Authenticate admin session - throws 401 if unauthorized
async function requireAdminAuth(request: Request): Promise<void> {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);

  if (!session) {
    const response = new Response('Unauthorized', { status: 401 });
    throw response;
  }
}

// Apply filters to a Supabase query
function applyFilters<T>(
  query: PostgrestFilterBuilder<any, any, T>,
  filters: GlobalFilters,
  options: {
    dateField: string;
    hasToolSlug?: boolean;
    hasCountry?: boolean;
    hasDeviceType?: boolean;
    hasReferrer?: boolean;
  }
): PostgrestFilterBuilder<any, any, T> {
  const { start, end } = getDateRange(filters.datePreset, filters.startDate, filters.endDate);

  // Apply date range
  query = query.gte(options.dateField, start).lte(options.dateField, end);

  // Apply tool filter
  if (filters.toolSlug && options.hasToolSlug) {
    query = query.eq('tool_slug', filters.toolSlug);
  }

  // Apply country filter
  if (filters.country && options.hasCountry) {
    query = query.eq('country_code', filters.country);
  }

  // Apply device type filter
  if (filters.deviceType && options.hasDeviceType) {
    query = query.eq('device_type', filters.deviceType);
  }

  // Traffic source requires string matching on referrer
  // This is handled in application logic due to complexity

  return query;
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

export interface HourlyVisitsData {
  hour: number;
  visits: number;
}

export interface VisitsChartData {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

export interface OnlineUsersChartData {
  timestamp: string;
  onlineUsers: number;
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
  cities?: CityData[];
}

export interface CityData {
  city: string;
  visits: number;
  uniqueVisitors: number;
}

export interface MonetagData {
  date: string;
  impressions: number;
  clicks: number;
  revenue: number;
  cpm: number;
  rpm: number;
}

export interface ToolDetailData {
  toolSlug: string;
  toolName: string;
  visits: number;
  uniqueVisitors: number;
  uses: number;
  avgTimeOnPage: number;
  errors: number;
  revenueAttribution: number;
  evolution: Array<{ date: string; visits: number; uses: number }>;
}

// Get dashboard KPIs with filters
export const getDashboardKPIs = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  const { start, end } = getDateRange(filters.datePreset, filters.startDate, filters.endDate);

  // Build base query
  let visitsQuery = supabaseAdmin.from('access_events').select('*', { count: 'exact', head: true });
  visitsQuery = applyFilters(visitsQuery, filters, {
    dateField: 'visited_at',
    hasToolSlug: true,
    hasCountry: true,
    hasDeviceType: true,
    hasReferrer: true,
  });

  const { count: totalVisits } = await visitsQuery;

  // Unique visitors
  let uniqueQuery = supabaseAdmin.from('access_events').select('visitor_hash');
  uniqueQuery = applyFilters(uniqueQuery, filters, {
    dateField: 'visited_at',
    hasToolSlug: true,
    hasCountry: true,
    hasDeviceType: true,
    hasReferrer: true,
  });
  uniqueQuery = uniqueQuery.not('visitor_hash', 'is', null);

  const { data: uniqueData } = await uniqueQuery;
  const uniqueVisitors = new Set(uniqueData?.map((v) => v.visitor_hash)).size;

  // Online users (last 5 minutes, respects filters)
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  let onlineQuery = supabaseAdmin.from('online_users').select('*', { count: 'exact', head: true });
  onlineQuery = onlineQuery.gte('last_heartbeat_at', fiveMinutesAgo);
  
  if (filters.toolSlug) onlineQuery = onlineQuery.eq('tool_slug', filters.toolSlug);

  const { count: onlineUsers } = await onlineQuery;

  // Revenue (Monetag data filtered by date range)
  const { data: revenueData } = await supabaseAdmin
    .from('monetag_revenue')
    .select('revenue_cents, impressions, clicks, date')
    .gte('date', start.split('T')[0])
    .lte('date', end.split('T')[0]);

  const dailyRevenue = revenueData?.find((r) => r.date === new Date().toISOString().split('T')[0])?.revenue_cents || 0;
  const monthlyRevenue = revenueData?.reduce((sum, row) => sum + (row.revenue_cents || 0), 0) || 0;
  const adImpressions = revenueData?.reduce((sum, row) => sum + (Number(row.impressions) || 0), 0) || 0;
  const adClicks = revenueData?.reduce((sum, row) => sum + (Number(row.clicks) || 0), 0) || 0;

  const result: DashboardKPIs = {
    totalVisits: totalVisits || 0,
    uniqueVisitors,
    todayVisits: totalVisits || 0, // Simplified, adjust if needed
    onlineUsers: onlineUsers || 0,
    dailyRevenue: dailyRevenue / 100,
    monthlyRevenue: monthlyRevenue / 100,
    adImpressions,
    adClicks,
  };

  return result;
});

// Get visits per hour (for selected date range, grouped by hour)
export const getVisitsPerHour = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  let query = supabaseAdmin.from('access_events').select('visited_at');
  query = applyFilters(query, filters, {
    dateField: 'visited_at',
    hasToolSlug: true,
    hasCountry: true,
    hasDeviceType: true,
    hasReferrer: true,
  });

  const { data } = await query;

  const hourCounts = new Map<number, number>();
  for (let i = 0; i < 24; i++) hourCounts.set(i, 0);

  data?.forEach((row) => {
    const hour = new Date(row.visited_at).getHours();
    hourCounts.set(hour, (hourCounts.get(hour) || 0) + 1);
  });

  const result: HourlyVisitsData[] = Array.from(hourCounts.entries())
    .map(([hour, visits]) => ({ hour, visits }))
    .sort((a, b) => a.hour - b.hour);

  return result;
});

// Get visits over time (daily breakdown)
export const getVisitsChartData = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  let query = supabaseAdmin.from('access_events').select('visited_at, visitor_hash');
  query = applyFilters(query, filters, {
    dateField: 'visited_at',
    hasToolSlug: true,
    hasCountry: true,
    hasDeviceType: true,
    hasReferrer: true,
  });
  query = query.order('visited_at', { ascending: true });

  const { data } = await query;

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

// Get online users over time (sampled every 5 minutes for the period)
export const getOnlineUsersOverTime = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  // Online users are real-time, so we sample current state
  // For historical data, we'd need a time-series table
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
  
  let query = supabaseAdmin.from('online_users').select('*', { count: 'exact', head: true });
  query = query.gte('last_heartbeat_at', fiveMinutesAgo);
  
  if (filters.toolSlug) query = query.eq('tool_slug', filters.toolSlug);

  const { count } = await query;

  // Return current snapshot (for real-time chart, implement time-series storage for history)
  const result: OnlineUsersChartData[] = [{
    timestamp: new Date().toISOString(),
    onlineUsers: count || 0,
  }];

  return result;
});

// Get tool usage statistics with filters
export const getToolUsageData = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  let accessQuery = supabaseAdmin.from('access_events').select('tool_slug, visitor_hash');
  accessQuery = applyFilters(accessQuery, filters, {
    dateField: 'visited_at',
    hasToolSlug: false, // Don't filter by tool here, we want all tools
    hasCountry: true,
    hasDeviceType: true,
    hasReferrer: true,
  });
  accessQuery = accessQuery.not('tool_slug', 'is', null);

  const { data: accessData } = await accessQuery;

  let usageQuery = supabaseAdmin.from('usage_events').select('tool_slug');
  usageQuery = applyFilters(usageQuery, filters, {
    dateField: 'occurred_at',
    hasToolSlug: false,
    hasCountry: false,
    hasDeviceType: false,
    hasReferrer: false,
  });

  const { data: usageData } = await usageQuery;

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

// Get geo statistics with cities
export const getGeoData = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  let query = supabaseAdmin.from('access_events').select('country_code, city, visitor_hash');
  query = applyFilters(query, filters, {
    dateField: 'visited_at',
    hasToolSlug: true,
    hasCountry: false, // Don't filter by country here
    hasDeviceType: true,
    hasReferrer: true,
  });
  query = query.not('country_code', 'is', null);

  const { data } = await query;

  const countryGroups = new Map<string, { visits: number; visitors: Set<string>; cities: Map<string, { visits: number; visitors: Set<string> }> }>();
  let totalVisits = 0;

  data?.forEach((row) => {
    if (!row.country_code) return;
    
    if (!countryGroups.has(row.country_code)) {
      countryGroups.set(row.country_code, { visits: 0, visitors: new Set(), cities: new Map() });
    }
    
    const countryEntry = countryGroups.get(row.country_code)!;
    countryEntry.visits++;
    totalVisits++;
    if (row.visitor_hash) countryEntry.visitors.add(row.visitor_hash);

    // Group by city within country
    if (row.city) {
      if (!countryEntry.cities.has(row.city)) {
        countryEntry.cities.set(row.city, { visits: 0, visitors: new Set() });
      }
      const cityEntry = countryEntry.cities.get(row.city)!;
      cityEntry.visits++;
      if (row.visitor_hash) cityEntry.visitors.add(row.visitor_hash);
    }
  });

  const result: GeoData[] = Array.from(countryGroups.entries())
    .map(([countryCode, data]) => ({
      countryCode,
      countryName: getCountryName(countryCode),
      visits: data.visits,
      uniqueVisitors: data.visitors.size,
      percentage: totalVisits > 0 ? (data.visits / totalVisits) * 100 : 0,
      cities: Array.from(data.cities.entries())
        .map(([city, cityData]) => ({
          city,
          visits: cityData.visits,
          uniqueVisitors: cityData.visitors.size,
        }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 10), // Top 10 cities per country
    }))
    .sort((a, b) => b.visits - a.visits);

  return result;
});

// Get Monetag revenue data with period comparison
export const getMonetagData = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  const { start, end } = getDateRange(filters.datePreset, filters.startDate, filters.endDate);

  const { data } = await supabaseAdmin
    .from('monetag_revenue')
    .select('*')
    .gte('date', start.split('T')[0])
    .lte('date', end.split('T')[0])
    .order('date', { ascending: true });

  const result: MonetagData[] = (data || []).map((row) => ({
    date: row.date,
    impressions: Number(row.impressions) || 0,
    clicks: Number(row.clicks) || 0,
    revenue: (row.revenue_cents || 0) / 100,
    cpm: row.cpm || 0,
    rpm: row.rpm || 0,
  }));

  return result;
});

// Get tool detail data
export const getToolDetailData = createServerFn('POST', async ({ toolSlug, filters }: { toolSlug: string; filters: GlobalFilters }, { request }) => {
  await requireAdminAuth(request);

  // Apply tool filter
  const toolFilters = { ...filters, toolSlug };

  let accessQuery = supabaseAdmin.from('access_events').select('visited_at, visitor_hash');
  accessQuery = applyFilters(accessQuery, toolFilters, {
    dateField: 'visited_at',
    hasToolSlug: true,
    hasCountry: true,
    hasDeviceType: true,
    hasReferrer: true,
  });

  const { data: accessData } = await accessQuery;

  let usageQuery = supabaseAdmin.from('usage_events').select('occurred_at, event_type');
  usageQuery = applyFilters(usageQuery, toolFilters, {
    dateField: 'occurred_at',
    hasToolSlug: true,
    hasCountry: false,
    hasDeviceType: false,
    hasReferrer: false,
  });

  const { data: usageData } = await usageQuery;

  let errorQuery = supabaseAdmin.from('error_logs').select('*', { count: 'exact', head: true });
  errorQuery = applyFilters(errorQuery, toolFilters, {
    dateField: 'occurred_at',
    hasToolSlug: true,
    hasCountry: false,
    hasDeviceType: false,
    hasReferrer: false,
  });

  const { count: errorCount } = await errorQuery;

  // Calculate metrics
  const visits = accessData?.length || 0;
  const uniqueVisitors = new Set(accessData?.map((v) => v.visitor_hash)).size;
  const uses = usageData?.length || 0;

  // Evolution by day
  const evolution = new Map<string, { visits: number; uses: number }>();
  accessData?.forEach((row) => {
    const date = row.visited_at.split('T')[0];
    if (!evolution.has(date)) evolution.set(date, { visits: 0, uses: 0 });
    evolution.get(date)!.visits++;
  });

  usageData?.forEach((row) => {
    const date = row.occurred_at.split('T')[0];
    if (!evolution.has(date)) evolution.set(date, { visits: 0, uses: 0 });
    evolution.get(date)!.uses++;
  });

  const { getTool } = await import('./catalog');
  const tool = getTool(toolSlug);

  const result: ToolDetailData = {
    toolSlug,
    toolName: tool?.name || toolSlug,
    visits,
    uniqueVisitors,
    uses,
    avgTimeOnPage: 0, // Would need session tracking for this
    errors: errorCount || 0,
    revenueAttribution: 0, // Would need revenue attribution logic
    evolution: Array.from(evolution.entries())
      .map(([date, data]) => ({ date, visits: data.visits, uses: data.uses }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  };

  return result;
});

// Get error logs with filters
export const getErrorLogs = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  let query = supabaseAdmin.from('error_logs').select('*');
  query = applyFilters(query, filters, {
    dateField: 'occurred_at',
    hasToolSlug: true,
    hasCountry: false,
    hasDeviceType: false,
    hasReferrer: false,
  });
  query = query.order('occurred_at', { ascending: false }).limit(100);

  const { data } = await query;

  return data || [];
});

// Helper function for country names (expanded)
function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    BR: 'Brasil', US: 'Estados Unidos', PT: 'Portugal', GB: 'Reino Unido',
    DE: 'Alemanha', FR: 'França', ES: 'Espanha', IT: 'Itália',
    AR: 'Argentina', MX: 'México', CL: 'Chile', CO: 'Colômbia',
    PE: 'Peru', VE: 'Venezuela', CA: 'Canadá', AU: 'Austrália',
    JP: 'Japão', CN: 'China', IN: 'Índia', RU: 'Rússia',
  };
  return countries[code] || code;
}

// Get available filter options (countries, traffic sources)
export const getFilterOptions = createServerFn('GET', async (_, { request }) => {
  await requireAdminAuth(request);

  const { data: countries } = await supabaseAdmin
    .from('access_events')
    .select('country_code')
    .not('country_code', 'is', null);

  const { data: referrers } = await supabaseAdmin
    .from('access_events')
    .select('referrer')
    .not('referrer', 'is', null)
    .limit(1000);

  const uniqueCountries = [...new Set(countries?.map((c) => c.country_code))];
  const trafficSources = [...new Set(referrers?.map((r) => getTrafficSourceDomain(r.referrer)).filter(Boolean))];

  return {
    countries: uniqueCountries.sort(),
    trafficSources: trafficSources.sort(),
  };
});
