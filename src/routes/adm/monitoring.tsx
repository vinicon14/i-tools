// Admin monitoring route - /adm/monitoring
import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSessionFromCookie } from '@/lib/admin-session.server';
import { getErrorLogs } from '@/lib/admin-analytics.functions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, Bug, FileX, Server, Code } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';

export const requireAuth = createServerFn('GET', async (_, { request }) => {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);
  if (!session) throw redirect({ to: '/adm' });
  return { username: session.username };
});

export const Route = createFileRoute('/adm/monitoring')({
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
    const errorLogs = await getErrorLogs({});
    return { errorLogs };
  },
  component: AdminMonitoringPage,
});

function AdminMonitoringPage() {
  const { errorLogs } = Route.useLoaderData();

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

  const errorCounts = errorLogs.reduce((acc, log) => {
    acc[log.error_type] = (acc[log.error_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Monitoramento</h1>
            <p className="text-slate-400 mt-1">Erros e alertas do sistema</p>
          </div>

        {/* Error Summary */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(errorCounts).map(([type, count]) => {
            const Icon = getErrorIcon(type);
            return (
              <Card key={type} className="border-slate-700 bg-slate-800/50 backdrop-blur">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-red-400" />
                    <CardTitle className="text-sm font-medium text-slate-400 uppercase">
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
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
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
