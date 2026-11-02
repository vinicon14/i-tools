// Comprehensive admin dashboard with filters and all charts
import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSessionFromCookie } from '@/lib/admin-session.server';
import {
  getDashboardKPIs,
  getVisitsChartData,
  getToolUsageData,
  getGeoData,
  getMonetagData,
  getVisitsPerHour,
  getFilterOptions,
  type GlobalFilters,
} from '@/lib/admin-analytics.functions';
import { exportFullReport } from '@/lib/admin-export.functions';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FilterBar } from '@/components/admin/FilterBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Eye, TrendingUp, DollarSign, MousePointerClick, Activity, Download } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export const requireAuth = createServerFn('GET', async (_, { request }) => {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);
  if (!session) throw redirect({ to: '/adm' });
  return { username: session.username };
});

export const Route = createFileRoute('/adm/dashboard')({
  staticData: { sitemap: false },
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  }),
  beforeLoad: async () => {
    await requireAuth();
  },
  loader: async () => {
    const filterOptions = await getFilterOptions();
    return { filterOptions };
  },
  component: AdminDashboard,
});

function AdminDashboard() {
  const { filterOptions } = Route.useLoaderData();
  
  const [filters, setFilters] = useState<GlobalFilters>({
    datePreset: 'last30days',
  });

  const [kpis, setKpis] = useState<Awaited<ReturnType<typeof getDashboardKPIs>> | null>(null);
  const [visitsData, setVisitsData] = useState<Awaited<ReturnType<typeof getVisitsChartData>>>([]);
  const [hourlyData, setHourlyData] = useState<Awaited<ReturnType<typeof getVisitsPerHour>>>([]);
  const [toolUsage, setToolUsage] = useState<Awaited<ReturnType<typeof getToolUsageData>>>([]);
  const [geoData, setGeoData] = useState<Awaited<ReturnType<typeof getGeoData>>>([]);
  const [monetagData, setMonetagData] = useState<Awaited<ReturnType<typeof getMonetagData>>>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load all data when filters change
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [kpisData, visits, hourly, tools, geo, monetag] = await Promise.all([
        getDashboardKPIs(filters),
        getVisitsChartData(filters),
        getVisitsPerHour(filters),
        getToolUsageData(filters),
        getGeoData(filters),
        getMonetagData(filters),
      ]);

      setKpis(kpisData);
      setVisitsData(visits);
      setHourlyData(hourly);
      setToolUsage(tools);
      setGeoData(geo);
      setMonetagData(monetag);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load on mount and filter change
  useState(() => {
    loadData();
  });

  const handleExport = async () => {
    try {
      const response = await exportFullReport(filters);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-completo-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export:', error);
      alert('Erro ao exportar relatório');
    }
  };

  const kpiCards = kpis ? [
    {
      title: 'Visitas Totais',
      value: kpis.totalVisits.toLocaleString('pt-BR'),
      icon: Eye,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
    },
    {
      title: 'Visitantes Únicos',
      value: kpis.uniqueVisitors.toLocaleString('pt-BR'),
      icon: Users,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
    },
    {
      title: 'Visitas Hoje',
      value: kpis.todayVisits.toLocaleString('pt-BR'),
      icon: TrendingUp,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
    },
    {
      title: 'Usuários Online',
      value: kpis.onlineUsers.toLocaleString('pt-BR'),
      icon: Activity,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Receita Diária',
      value: `R$ ${kpis.dailyRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      title: 'Receita Mensal',
      value: `R$ ${kpis.monthlyRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10',
    },
    {
      title: 'Impressões de Anúncios',
      value: kpis.adImpressions.toLocaleString('pt-BR'),
      icon: Eye,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
    },
    {
      title: 'Cliques em Anúncios',
      value: kpis.adClicks.toLocaleString('pt-BR'),
      icon: MousePointerClick,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10',
    },
  ] : [];

  const chartColors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4'];

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-slate-400 mt-1">Visão geral do i-Tools</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-slate-400">
                Última atualização: {new Date().toLocaleString('pt-BR')}
              </div>
              <Button
                onClick={handleExport}
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>
          </div>

          {/* Filters */}
          <FilterBar
            filters={filters}
            onChange={(f) => {
              setFilters(f);
              loadData();
            }}
            availableCountries={filterOptions.countries}
            availableTrafficSources={filterOptions.trafficSources}
          />

          {/* KPI Cards */}
          {isLoading && !kpis ? (
            <div className="text-center py-12 text-slate-400">Carregando...</div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {kpiCards.map((kpi) => (
                  <Card key={kpi.title} className="border-slate-700 bg-slate-800/50 backdrop-blur">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-slate-400">
                        {kpi.title}
                      </CardTitle>
                      <div className={`p-2 rounded-full ${kpi.bgColor}`}>
                        <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Visits Chart */}
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white">Visitas no Período</CardTitle>
                  <CardDescription className="text-slate-400">
                    Visitas totais e visitantes únicos por dia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={visitsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="date" stroke="#94a3b8" />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                        }}
                        labelStyle={{ color: '#e2e8f0' }}
                      />
                      <Legend />
                      <Area type="monotone" dataKey="visits" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} name="Visitas" />
                      <Area type="monotone" dataKey="uniqueVisitors" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} name="Visitantes Únicos" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Hourly Visits Chart */}
              <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-white">Visitas por Hora</CardTitle>
                  <CardDescription className="text-slate-400">
                    Distribuição de visitas ao longo do dia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                      <XAxis dataKey="hour" stroke="#94a3b8" tickFormatter={(hour) => `${hour}h`} />
                      <YAxis stroke="#94a3b8" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="visits" fill="#10b981" name="Visitas" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Tool Usage and Geo Data */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Tool Usage */}
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">Ferramentas Mais Usadas</CardTitle>
                    <CardDescription className="text-slate-400">
                      Top 10 ferramentas por visitas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={toolUsage.slice(0, 10)} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis type="number" stroke="#94a3b8" />
                        <YAxis dataKey="toolName" type="category" stroke="#94a3b8" width={120} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="visits" fill="#3b82f6" name="Visitas" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Geographic Data */}
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">Visitantes por País</CardTitle>
                    <CardDescription className="text-slate-400">
                      Top 6 países por visitas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={geoData.slice(0, 6)}
                          dataKey="visits"
                          nameKey="countryName"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry) => `${entry.countryName} (${entry.percentage.toFixed(1)}%)`}
                        >
                          {geoData.slice(0, 6).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Monetag Revenue Chart */}
              {monetagData.length > 0 && (
                <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-white">Receita Monetag</CardTitle>
                    <CardDescription className="text-slate-400">
                      Evolução de receita e impressões
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={monetagData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="date" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#1e293b',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="revenue" stroke="#10b981" name="Receita (R$)" strokeWidth={2} />
                        <Line type="monotone" dataKey="cpm" stroke="#f59e0b" name="CPM" strokeWidth={1.5} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
