// CSV export utilities for admin panel
import { createServerFn } from '@tanstack/react-start';
import { getSessionFromCookie } from './admin-session.server';
import {
  getDashboardKPIs,
  getVisitsChartData,
  getToolUsageData,
  getGeoData,
  getMonetagData,
  getErrorLogs,
  type GlobalFilters,
} from './admin-analytics.functions';

async function requireAdminAuth(request: Request): Promise<void> {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);
  if (!session) {
    throw new Response('Unauthorized', { status: 401 });
  }
}

function arrayToCSV(headers: string[], rows: any[][]): string {
  const escape = (value: any) => {
    const str = String(value ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(escape).join(',');
  const dataLines = rows.map((row) => row.map(escape).join(',')).join('\n');

  return `${headerLine}\n${dataLines}`;
}

// Export KPIs
export const exportKPIsCSV = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  const kpis = await getDashboardKPIs(filters);

  const headers = ['Métrica', 'Valor'];
  const rows = [
    ['Visitas Totais', kpis.totalVisits],
    ['Visitantes Únicos', kpis.uniqueVisitors],
    ['Visitas Hoje', kpis.todayVisits],
    ['Usuários Online', kpis.onlineUsers],
    ['Receita Diária', `R$ ${kpis.dailyRevenue.toFixed(2)}`],
    ['Receita Mensal', `R$ ${kpis.monthlyRevenue.toFixed(2)}`],
    ['Impressões de Anúncios', kpis.adImpressions],
    ['Cliques em Anúncios', kpis.adClicks],
  ];

  const csv = arrayToCSV(headers, rows);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="kpis-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
});

// Export visits data
export const exportVisitsCSV = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  const data = await getVisitsChartData(filters);

  const headers = ['Data', 'Visitas', 'Visitantes Únicos'];
  const rows = data.map((row) => [row.date, row.visits, row.uniqueVisitors]);

  const csv = arrayToCSV(headers, rows);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="visitas-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
});

// Export tool usage data
export const exportToolUsageCSV = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  const data = await getToolUsageData(filters);

  const headers = ['Ferramenta', 'Slug', 'Visitas', 'Visitantes Únicos', 'Usos'];
  const rows = data.map((row) => [row.toolName, row.toolSlug, row.visits, row.uniqueVisitors, row.uses]);

  const csv = arrayToCSV(headers, rows);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="ferramentas-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
});

// Export geo data
export const exportGeoCSV = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  const data = await getGeoData(filters);

  const headers = ['País', 'Código', 'Visitas', 'Visitantes Únicos', 'Percentual'];
  const rows = data.map((row) => [
    row.countryName,
    row.countryCode,
    row.visits,
    row.uniqueVisitors,
    `${row.percentage.toFixed(2)}%`,
  ]);

  const csv = arrayToCSV(headers, rows);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="geo-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
});

// Export Monetag revenue data
export const exportMonetagCSV = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  const data = await getMonetagData(filters);

  const headers = ['Data', 'Impressões', 'Cliques', 'Receita', 'CPM', 'RPM'];
  const rows = data.map((row) => [
    row.date,
    row.impressions,
    row.clicks,
    `R$ ${row.revenue.toFixed(2)}`,
    `R$ ${row.cpm.toFixed(2)}`,
    `R$ ${row.rpm.toFixed(2)}`,
  ]);

  const csv = arrayToCSV(headers, rows);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="monetag-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
});

// Export error logs
export const exportErrorsCSV = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  const data = await getErrorLogs(filters);

  const headers = ['Data/Hora', 'Tipo', 'Mensagem', 'Página', 'Ferramenta'];
  const rows = data.map((row) => [
    new Date(row.occurred_at).toLocaleString('pt-BR'),
    row.error_type,
    row.error_message,
    row.page_path,
    row.tool_slug || '-',
  ]);

  const csv = arrayToCSV(headers, rows);

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="erros-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
});

// Generate comprehensive report (all data in one file)
export const exportFullReport = createServerFn('POST', async (filters: GlobalFilters, { request }) => {
  await requireAdminAuth(request);

  const [kpis, visits, tools, geo, monetag, errors] = await Promise.all([
    getDashboardKPIs(filters),
    getVisitsChartData(filters),
    getToolUsageData(filters),
    getGeoData(filters),
    getMonetagData(filters),
    getErrorLogs(filters),
  ]);

  let report = '# Relatório Completo - i-Tools Admin\n';
  report += `Gerado em: ${new Date().toLocaleString('pt-BR')}\n`;
  report += `Período: ${filters.datePreset}\n\n`;

  // KPIs
  report += '## KPIs\n';
  report += arrayToCSV(
    ['Métrica', 'Valor'],
    [
      ['Visitas Totais', kpis.totalVisits],
      ['Visitantes Únicos', kpis.uniqueVisitors],
      ['Usuários Online', kpis.onlineUsers],
      ['Receita Diária', `R$ ${kpis.dailyRevenue.toFixed(2)}`],
      ['Receita Mensal', `R$ ${kpis.monthlyRevenue.toFixed(2)}`],
    ]
  );
  report += '\n\n';

  // Visits
  report += '## Visitas por Dia\n';
  report += arrayToCSV(
    ['Data', 'Visitas', 'Visitantes Únicos'],
    visits.map((v) => [v.date, v.visits, v.uniqueVisitors])
  );
  report += '\n\n';

  // Tools
  report += '## Ferramentas\n';
  report += arrayToCSV(
    ['Ferramenta', 'Visitas', 'Visitantes', 'Usos'],
    tools.map((t) => [t.toolName, t.visits, t.uniqueVisitors, t.uses])
  );
  report += '\n\n';

  // Geo
  report += '## Geografia\n';
  report += arrayToCSV(
    ['País', 'Visitas', 'Percentual'],
    geo.map((g) => [g.countryName, g.visits, `${g.percentage.toFixed(2)}%`])
  );
  report += '\n\n';

  // Monetag
  if (monetag.length > 0) {
    report += '## Receita Monetag\n';
    report += arrayToCSV(
      ['Data', 'Impressões', 'Cliques', 'Receita'],
      monetag.map((m) => [m.date, m.impressions, m.clicks, `R$ ${m.revenue.toFixed(2)}`])
    );
    report += '\n\n';
  }

  // Errors
  if (errors.length > 0) {
    report += '## Erros Recentes\n';
    report += arrayToCSV(
      ['Data', 'Tipo', 'Mensagem'],
      errors.slice(0, 20).map((e) => [new Date(e.occurred_at).toLocaleString('pt-BR'), e.error_type, e.error_message])
    );
  }

  return new Response(report, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="relatorio-completo-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  });
});
