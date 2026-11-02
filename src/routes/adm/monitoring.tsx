// Comprehensive admin monitoring page with performance, uptime, and alerts
import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSessionFromCookie } from '@/lib/admin-session.server';
import { getErrorLogs } from '@/lib/admin-analytics.functions';
import {
  getPerformanceMetrics,
  getUptimeStats,
  getAdminAlerts,
  resolveAlert,
  checkErrorSpikes,
} from '@/lib/monitoring.functions';
import { type GlobalFilters } from '@/lib/admin-filters';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, Bug, FileX, Server, Code, Check, Clock, Activity, TrendingUp, AlertCircle } from 'lucide-react';

export const requireAuth = createServerFn('GET', async (_, { request }) => {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);
  if (!session) throw redirect({ to: '/adm' });
  return { username: session.username };
});

export const Route = createFileRoute('/adm/monitoring')({
  staticData: { sitemap: false },
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  }),
  beforeLoad: async () => {
    await requireAuth();
  },
  loader: async () => {
    const [errorLogs, perfMetrics, uptimeStats, alerts] = await Promise.all([
      getErrorLogs({}),
      getPerformanceMetrics(),
      getUptimeStats(),
      getAdminAlerts(),
    ]);

    // Check for error spikes
    await checkErrorSpikes();

    return { errorLogs, perfMetrics, uptimeStats, alerts };
  },
  component: AdminMonitoringPage,
});

function AdminMonitoringPage() {
  const { errorLogs, perfMetrics, uptimeStats, alerts: initialAlerts } = Route.useLoaderData();
  const [alerts, setAlerts] = useState(initialAlerts);

  const handleResolveAlert = async (alertId: string) => {
    const result = await resolveAlert(alertId);
    if (result.success) {
      setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    }
  };

  const getErrorIcon = (type: string) => {
    switch (type) {
      case '404': return FileX;
      case '500': return Server;
      case 'js_error': return Bug;
      case 'tool_error': return AlertTriangle;
      case 'integration_error': return Code;
      default: return AlertTriangle;
    }
  };

  const getErrorColor = (type: string) => {
    switch (type) {
      case '404': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case '500': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'js_error': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'tool_error': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'integration_error': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/50';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      case 'low': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const errorCounts = errorLogs.reduce((acc, log) => {
    acc[log.error_type] = (acc[log.error_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Monitoramento</h1>
            <p className="text-slate-400 mt-1">Erros, performance, uptime e alertas do sistema</p>
          </div>

          {/* Admin Alerts */}
          {alerts.length > 0 && (
            <div className="space-y-3">
              {alerts.map((alert) => (
                <Alert key={alert.id} className={getSeverityColor(alert.severity)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 mt-0.5" />
                      <div>
                        <AlertTitle className="text-lg font-semibold">{alert.title}</AlertTitle>
                        <AlertDescription className="mt-1">{alert.message}</AlertDescription>
                        <p className="text-xs mt-2 opacity-70">
                          {new Date(alert.created_at).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleResolveAlert(alert.id)}
                      className="text-current hover:bg-white/10"
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Resolver
                    </Button>
                  </div>
                </Alert>
              ))}
            </div>
          )}

          {/* System Health KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Uptime (24h)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${uptimeStats.uptimePercentage >= 99 ? 'text-green-400' : uptimeStats.uptimePercentage >= 95 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {uptimeStats.uptimePercentage.toFixed(2)}%
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {uptimeStats.upChecks}/{uptimeStats.totalChecks} checks OK
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Tempo Médio Resposta</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${perfMetrics.avgResponseTime < 500 ? 'text-green-400' : perfMetrics.avgResponseTime < 1000 ? 'text-yellow-400' : 'text-red-400'}`}>
                  {perfMetrics.avgResponseTime}ms
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {perfMetrics.totalCalls.toLocaleString('pt-BR')} chamadas
                </p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Total de Erros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-400">
                  {errorLogs.length}
                </div>
                <p className="text-xs text-slate-500 mt-1">Últimos 100</p>
              </CardContent>
            </Card>

            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Alertas Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-400">
                  {alerts.length}
                </div>
                <p className="text-xs text-slate-500 mt-1">Pendentes</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Performance por Função (24h)</CardTitle>
              <CardDescription className="text-slate-400">
                Tempo médio e taxa de erro
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Função</TableHead>
                      <TableHead className="text-slate-300 text-right">Chamadas</TableHead>
                      <TableHead className="text-slate-300 text-right">Tempo Médio</TableHead>
                      <TableHead className="text-slate-300 text-right">Taxa de Erro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {perfMetrics.summary.map((metric) => (
                      <TableRow key={metric.name} className="border-slate-700">
                        <TableCell className="font-medium text-white font-mono text-sm">
                          {metric.name}
                        </TableCell>
                        <TableCell className="text-right text-slate-300">
                          {metric.count.toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={metric.avgDuration < 500 ? 'text-green-400' : metric.avgDuration < 1000 ? 'text-yellow-400' : 'text-red-400'}>
                            {metric.avgDuration}ms
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={metric.errorRate === 0 ? 'text-green-400' : metric.errorRate < 5 ? 'text-yellow-400' : 'text-red-400'}>
                            {metric.errorRate.toFixed(1)}%
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Error Summary */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(errorCounts).map(([type, count]) => {
              const Icon = getErrorIcon(type);
              return (
                <Card key={type} className="border-slate-700 bg-slate-800/50">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-red-400" />
                      <CardTitle className="text-sm text-slate-400 uppercase">
                        {type.replace('_', ' ')}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-400">{count}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Error Logs Table */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Logs de Erros Recentes</CardTitle>
              <CardDescription className="text-slate-400">
                Últimos 100 erros registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">Tipo</TableHead>
                      <TableHead className="text-slate-300">Mensagem</TableHead>
                      <TableHead className="text-slate-300">Página</TableHead>
                      <TableHead className="text-slate-300">Ferramenta</TableHead>
                      <TableHead className="text-slate-300">Data/Hora</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {errorLogs.map((log) => (
                      <TableRow key={log.id} className="border-slate-700">
                        <TableCell>
                          <Badge className={getErrorColor(log.error_type)}>
                            {log.error_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-slate-300 max-w-md truncate">
                          {log.error_message}
                        </TableCell>
                        <TableCell className="text-slate-400 font-mono text-sm">
                          {log.page_path}
                        </TableCell>
                        <TableCell className="text-slate-400">
                          {log.tool_slug || '-'}
                        </TableCell>
                        <TableCell className="text-slate-400 text-sm">
                          {new Date(log.occurred_at).toLocaleString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {errorLogs.length === 0 && (
                  <div className="text-center py-8 text-slate-400">
                    Nenhum erro registrado
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
