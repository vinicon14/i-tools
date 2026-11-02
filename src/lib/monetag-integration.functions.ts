// Monetag API integration and CSV import
// Monetag typically provides statistics through their publisher dashboard
// This module attempts API integration and provides CSV import fallback

import { createServerFn } from '@tanstack/react-start';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { getSessionFromCookie } from './admin-session.server';

async function requireAdminAuth(request: Request): Promise<void> {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);
  if (!session) {
    throw new Response('Unauthorized', { status: 401 });
  }
}

export interface MonetagRevenueRow {
  date: string; // YYYY-MM-DD
  impressions: number;
  clicks: number;
  revenue: number; // in currency units (not cents)
  cpm?: number;
  rpm?: number;
  currency?: string;
}

/**
 * Fetch Monetag data from API (if available)
 * 
 * Note: As of 2024, Monetag does not provide a public REST API for publisher statistics.
 * Publishers must access data through their dashboard at https://publishers.monetag.com
 * 
 * This function is a placeholder for future API integration if Monetag releases one.
 * For now, use CSV import via importMonetagCSV().
 */
export const fetchMonetagAPI = createServerFn('POST', async ({ startDate, endDate }: { startDate: string; endDate: string }, { request }) => {
  await requireAdminAuth(request);

  const apiToken = process.env['MONETAG_API_TOKEN'];

  if (!apiToken) {
    return {
      success: false,
      error: 'MONETAG_API_TOKEN não configurado. Configure no Lovable Dashboard.',
      useCSVImport: true,
    };
  }

  // Monetag API endpoint (hypothetical - verify with official docs if available)
  const apiUrl = 'https://api.monetag.com/v1/publisher/statistics';

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        start_date: startDate,
        end_date: endDate,
        group_by: 'day',
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: 'Token Monetag inválido ou expirado',
          useCSVImport: true,
        };
      }
      if (response.status === 404) {
        return {
          success: false,
          error: 'API Monetag não encontrada. Use importação manual via CSV.',
          useCSVImport: true,
        };
      }
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    // Transform API response to our format (adjust based on actual API response)
    const rows: MonetagRevenueRow[] = data.data?.map((item: any) => ({
      date: item.date,
      impressions: item.impressions || 0,
      clicks: item.clicks || 0,
      revenue: item.revenue || 0,
      cpm: item.cpm || 0,
      rpm: item.rpm || 0,
      currency: item.currency || 'USD',
    })) || [];

    // Save to database
    for (const row of rows) {
      await saveMonetagData(row, 'api');
    }

    return {
      success: true,
      rowsImported: rows.length,
      data: rows,
    };

  } catch (error) {
    console.error('[Monetag API] Error fetching data:', error);
    return {
      success: false,
      error: 'API Monetag indisponível. Use importação CSV manual.',
      useCSVImport: true,
    };
  }
});

/**
 * Import Monetag data from CSV file
 * Expected CSV format:
 * Date,Impressions,Clicks,Revenue,CPM,RPM
 * 2024-01-01,12345,678,12.34,1.00,10.00
 */
export const importMonetagCSV = createServerFn('POST', async ({ csvContent }: { csvContent: string }, { request }) => {
  await requireAdminAuth(request);

  try {
    const lines = csvContent.trim().split('\n');
    if (lines.length < 2) {
      return { success: false, error: 'Arquivo CSV vazio ou inválido' };
    }

    const header = lines[0].toLowerCase();
    const rows: MonetagRevenueRow[] = [];

    // Parse CSV rows
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map((v) => v.trim().replace(/"/g, ''));

      // Flexible column detection
      const dateIdx = 0;
      const impressionsIdx = 1;
      const clicksIdx = 2;
      const revenueIdx = 3;
      const cpmIdx = 4;
      const rpmIdx = 5;

      if (values.length < 4) {
        console.warn(`[Monetag CSV] Linha ${i + 1} inválida, pulando`);
        continue;
      }

      const row: MonetagRevenueRow = {
        date: values[dateIdx],
        impressions: parseInt(values[impressionsIdx]) || 0,
        clicks: parseInt(values[clicksIdx]) || 0,
        revenue: parseFloat(values[revenueIdx]) || 0,
        cpm: values[cpmIdx] ? parseFloat(values[cpmIdx]) : undefined,
        rpm: values[rpmIdx] ? parseFloat(values[rpmIdx]) : undefined,
        currency: 'USD', // Default, adjust if CSV includes currency column
      };

      // Validate date format (YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(row.date)) {
        console.warn(`[Monetag CSV] Data inválida na linha ${i + 1}: ${row.date}`);
        continue;
      }

      rows.push(row);
    }

    if (rows.length === 0) {
      return { success: false, error: 'Nenhum dado válido encontrado no CSV' };
    }

    // Save to database
    let savedCount = 0;
    for (const row of rows) {
      const saved = await saveMonetagData(row, 'csv_import');
      if (saved) savedCount++;
    }

    return {
      success: true,
      rowsImported: savedCount,
      totalRows: rows.length,
      message: `${savedCount} de ${rows.length} linhas importadas com sucesso`,
    };

  } catch (error) {
    console.error('[Monetag CSV] Error importing:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro ao importar CSV',
    };
  }
});

// Save Monetag data to database
async function saveMonetagData(data: MonetagRevenueRow, source: 'api' | 'csv_import'): Promise<boolean> {
  try {
    // Convert revenue to cents for storage
    const revenueCents = Math.round(data.revenue * 100);

    // Calculate CPM and RPM if not provided
    const cpm = data.cpm || (data.impressions > 0 ? (data.revenue / data.impressions) * 1000 : 0);
    const rpm = data.rpm || (data.impressions > 0 ? (data.revenue / data.impressions) * 1000 : 0);

    const { error } = await supabaseAdmin
      .from('monetag_revenue')
      .upsert({
        date: data.date,
        impressions: data.impressions,
        clicks: data.clicks,
        revenue_cents: revenueCents,
        currency: data.currency || 'USD',
        cpm: cpm,
        rpm: rpm,
        source: source,
        imported_at: new Date().toISOString(),
      }, {
        onConflict: 'date', // Update if exists
      });

    if (error) {
      console.error('[Monetag] Error saving data:', error);
      return false;
    }

    return true;

  } catch (error) {
    console.error('[Monetag] Error saving data:', error);
    return false;
  }
}

// Get Monetag summary statistics
export const getMonetagSummary = createServerFn('GET', async (_, { request }) => {
  await requireAdminAuth(request);

  const today = new Date().toISOString().split('T')[0];
  const thisMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  // Daily
  const { data: dailyData } = await supabaseAdmin
    .from('monetag_revenue')
    .select('*')
    .eq('date', today)
    .single();

  // Monthly
  const { data: monthlyData } = await supabaseAdmin
    .from('monetag_revenue')
    .select('*')
    .gte('date', thisMonthStart);

  // Cumulative (all time)
  const { data: cumulativeData } = await supabaseAdmin
    .from('monetag_revenue')
    .select('*');

  const calculateTotals = (data: any[] | null) => {
    if (!data || data.length === 0) {
      return { impressions: 0, clicks: 0, revenue: 0, cpm: 0, rpm: 0 };
    }

    const impressions = data.reduce((sum, row) => sum + (Number(row.impressions) || 0), 0);
    const clicks = data.reduce((sum, row) => sum + (Number(row.clicks) || 0), 0);
    const revenue = data.reduce((sum, row) => sum + (row.revenue_cents || 0), 0) / 100;
    const cpm = impressions > 0 ? (revenue / impressions) * 1000 : 0;
    const rpm = impressions > 0 ? (revenue / impressions) * 1000 : 0;

    return { impressions, clicks, revenue, cpm, rpm };
  };

  return {
    daily: calculateTotals(dailyData ? [dailyData] : null),
    monthly: calculateTotals(monthlyData),
    cumulative: calculateTotals(cumulativeData),
    lastImportDate: cumulativeData?.[cumulativeData.length - 1]?.imported_at,
    lastImportSource: cumulativeData?.[cumulativeData.length - 1]?.source,
  };
});

// Test Monetag API connection
export const testMonetagAPI = createServerFn('GET', async (_, { request }) => {
  await requireAdminAuth(request);

  const apiToken = process.env['MONETAG_API_TOKEN'];

  if (!apiToken) {
    return {
      connected: false,
      message: 'MONETAG_API_TOKEN não configurado',
      recommendation: 'Configure MONETAG_API_TOKEN no Lovable Dashboard ou use importação CSV',
    };
  }

  // Try a simple API call to check connectivity
  try {
    const response = await fetch('https://api.monetag.com/v1/ping', {
      headers: { 'Authorization': `Bearer ${apiToken}` },
    });

    if (response.status === 404) {
      return {
        connected: false,
        message: 'API Monetag não está disponível publicamente',
        recommendation: 'Use importação manual de CSV exportado do painel Monetag',
      };
    }

    return {
      connected: response.ok,
      message: response.ok ? 'Conexão estabelecida' : 'Token inválido',
      recommendation: response.ok ? 'API configurada corretamente' : 'Verifique o token no Lovable Dashboard',
    };

  } catch (error) {
    return {
      connected: false,
      message: 'Não foi possível conectar à API Monetag',
      recommendation: 'API pode não estar disponível. Use importação CSV como alternativa.',
    };
  }
});
