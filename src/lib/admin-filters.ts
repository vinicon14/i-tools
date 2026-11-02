// Global filter types and utilities for admin analytics
export type DatePreset = 
  | 'today' 
  | 'yesterday' 
  | 'last7days' 
  | 'last30days' 
  | 'last90days' 
  | 'thisMonth' 
  | 'previousMonth' 
  | 'custom';

export interface GlobalFilters {
  datePreset: DatePreset;
  startDate?: string; // ISO date
  endDate?: string; // ISO date
  toolSlug?: string;
  country?: string;
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  trafficSource?: string; // referrer domain
}

export function getDateRange(preset: DatePreset, customStart?: string, customEnd?: string): { start: string; end: string } {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  switch (preset) {
    case 'today':
      return {
        start: today.toISOString(),
        end: now.toISOString(),
      };
    
    case 'yesterday':
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayEnd = new Date(yesterday);
      yesterdayEnd.setHours(23, 59, 59, 999);
      return {
        start: yesterday.toISOString(),
        end: yesterdayEnd.toISOString(),
      };
    
    case 'last7days':
      const last7 = new Date(today);
      last7.setDate(last7.getDate() - 7);
      return {
        start: last7.toISOString(),
        end: now.toISOString(),
      };
    
    case 'last30days':
      const last30 = new Date(today);
      last30.setDate(last30.getDate() - 30);
      return {
        start: last30.toISOString(),
        end: now.toISOString(),
      };
    
    case 'last90days':
      const last90 = new Date(today);
      last90.setDate(last90.getDate() - 90);
      return {
        start: last90.toISOString(),
        end: now.toISOString(),
      };
    
    case 'thisMonth':
      const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        start: thisMonthStart.toISOString(),
        end: now.toISOString(),
      };
    
    case 'previousMonth':
      const prevMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return {
        start: prevMonthStart.toISOString(),
        end: prevMonthEnd.toISOString(),
      };
    
    case 'custom':
      if (!customStart || !customEnd) {
        // Fallback to last 30 days
        const defaultStart = new Date(today);
        defaultStart.setDate(defaultStart.getDate() - 30);
        return {
          start: defaultStart.toISOString(),
          end: now.toISOString(),
        };
      }
      return {
        start: new Date(customStart).toISOString(),
        end: new Date(customEnd).toISOString(),
      };
    
    default:
      return {
        start: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end: now.toISOString(),
      };
  }
}

export function formatDatePreset(preset: DatePreset): string {
  const labels: Record<DatePreset, string> = {
    today: 'Hoje',
    yesterday: 'Ontem',
    last7days: 'Últimos 7 dias',
    last30days: 'Últimos 30 dias',
    last90days: 'Últimos 90 dias',
    thisMonth: 'Este mês',
    previousMonth: 'Mês anterior',
    custom: 'Personalizado',
  };
  return labels[preset];
}

export function getTrafficSourceDomain(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return null;
  }
}
