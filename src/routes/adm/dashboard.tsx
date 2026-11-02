// Admin dashboard route - /adm/dashboard
import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSessionFromCookie } from '@/lib/admin-session.server';
import { getDashboardKPIs, getVisitsChartData, getToolUsageData, getGeoData } from '@/lib/admin-analytics.functions';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Eye, TrendingUp, DollarSign, MousePointerClick, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Check admin authentication
export const requireAuth = createServerFn('GET', async (_, { request }) => {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);

  if (!session) {
    throw redirect({ to: '/adm' });
  }

  return { username: session.username };
});

export const Route = createFileRoute('/adm/dashboard')({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  beforeLoad: async () => {
    await requireAuth();
  },
  loader: async () => {
    const kpis = await getDashboardKPIs({});
    const visitsData = await getVisitsChartData({});
    const toolUsage = await getToolUsageData({});
    const geoData = await getGeoData({});

    return { kpis, visitsData, toolUsage, geoData };
  },
  component: AdminDashboard,
});

import { AdminLayout } from '@/components/admin/AdminLayout';

function AdminDashboard() {
  const { kpis, visitsData, toolUsage, geoData } = Route.useLoaderData();

  const kpiCards = [
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
  ];

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
          <div className="text-sm text-slate-400">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </div>
        </div>

        {/* KPI Cards */}
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
            <CardTitle className="text-white">Visitas nos Últimos 30 Dias</CardTitle>
            <CardDescription className="text-slate-400">
              Visitas totais e visitantes únicos por dia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={visitsData}>
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
                <Line type="monotone" dataKey="visits" stroke="#3b82f6" name="Visitas" strokeWidth={2} />
                <Line type="monotone" dataKey="uniqueVisitors" stroke="#8b5cf6" name="Visitantes Únicos" strokeWidth={2} />
              </LineChart>
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
                <BarChart data={toolUsage.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="toolName" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#94a3b8" />
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
      </div>
    </div>
    </AdminLayout>
  );
}
