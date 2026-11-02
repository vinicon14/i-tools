// Admin tools management route - /adm/tools
import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSessionFromCookie } from '@/lib/admin-session.server';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { tools, type Tool } from '@/lib/catalog';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, XCircle, Eye, TrendingUp } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';

// Require authentication
export const requireAuth = createServerFn('GET', async (_, { request }) => {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);
  if (!session) throw redirect({ to: '/adm' });
  return { username: session.username };
});

// Get tool configurations
export const getToolConfigs = createServerFn('GET', async (_, { request }) => {
  await requireAuth({}, { request });

  const { data } = await supabaseAdmin
    .from('tool_config')
    .select('*')
    .order('tool_slug');

  // Create a map of configurations
  const configMap = new Map<string, { isEnabled: boolean }>();
  data?.forEach((config) => {
    configMap.set(config.tool_slug, { isEnabled: config.is_enabled });
  });

  // Combine with catalog tools
  return tools.map((tool) => ({
    ...tool,
    isEnabled: configMap.get(tool.slug)?.isEnabled ?? true,
  }));
});

// Toggle tool enabled state
export const toggleToolEnabled = createServerFn('POST', async (data: { toolSlug: string; enabled: boolean }, { request }) => {
  await requireAuth({}, { request });

  const { error } = await supabaseAdmin
    .from('tool_config')
    .upsert({
      tool_slug: data.toolSlug,
      is_enabled: data.enabled,
      updated_at: new Date().toISOString(),
    });

  if (error) throw new Error('Falha ao atualizar configuração da ferramenta');

  return { success: true };
});

// Get tool statistics
export const getToolStats = createServerFn('GET', async (_, { request }) => {
  await requireAuth({}, { request });

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: accessData } = await supabaseAdmin
    .from('access_events')
    .select('tool_slug, visitor_hash')
    .not('tool_slug', 'is', null)
    .gte('visited_at', thirtyDaysAgo);

  const { data: usageData } = await supabaseAdmin
    .from('usage_events')
    .select('tool_slug')
    .gte('occurred_at', thirtyDaysAgo);

  // Group by tool
  const statsMap = new Map<string, { visits: number; uniqueVisitors: Set<string>; uses: number }>();

  accessData?.forEach((row) => {
    if (!row.tool_slug) return;
    if (!statsMap.has(row.tool_slug)) {
      statsMap.set(row.tool_slug, { visits: 0, uniqueVisitors: new Set(), uses: 0 });
    }
    const stats = statsMap.get(row.tool_slug)!;
    stats.visits++;
    if (row.visitor_hash) stats.uniqueVisitors.add(row.visitor_hash);
  });

  usageData?.forEach((row) => {
    if (!statsMap.has(row.tool_slug)) {
      statsMap.set(row.tool_slug, { visits: 0, uniqueVisitors: new Set(), uses: 0 });
    }
    statsMap.get(row.tool_slug)!.uses++;
  });

  return Object.fromEntries(
    Array.from(statsMap.entries()).map(([slug, data]) => [
      slug,
      {
        visits: data.visits,
        uniqueVisitors: data.uniqueVisitors.size,
        uses: data.uses,
      },
    ])
  );
});

export const Route = createFileRoute('/adm/tools')({
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
    const [toolsWithConfig, stats] = await Promise.all([
      getToolConfigs(),
      getToolStats(),
    ]);
    return { toolsWithConfig, stats };
  },
  component: AdminToolsPage,
});

function AdminToolsPage() {
  const { toolsWithConfig, stats } = Route.useLoaderData();
  const [tools, setTools] = useState(toolsWithConfig);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleToggle = async (toolSlug: string, currentEnabled: boolean) => {
    setIsUpdating(toolSlug);
    
    try {
      await toggleToolEnabled({ toolSlug, enabled: !currentEnabled });
      
      setTools((prev) =>
        prev.map((tool) =>
          tool.slug === toolSlug ? { ...tool, isEnabled: !currentEnabled } : tool
        )
      );
    } catch (error) {
      console.error('Failed to toggle tool:', error);
      alert('Falha ao atualizar ferramenta. Tente novamente.');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <AdminLayout>
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Ferramentas</h1>
          <p className="text-slate-400 mt-1">
            Ative, desative e monitore o uso das ferramentas
          </p>
        </div>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Ferramentas</CardTitle>
            <CardDescription className="text-slate-400">
              Estatísticas dos últimos 30 dias
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-700">
                    <TableHead className="text-slate-300">Ferramenta</TableHead>
                    <TableHead className="text-slate-300">Categoria</TableHead>
                    <TableHead className="text-slate-300">Status</TableHead>
                    <TableHead className="text-slate-300 text-right">Visitas</TableHead>
                    <TableHead className="text-slate-300 text-right">Visitantes Únicos</TableHead>
                    <TableHead className="text-slate-300 text-right">Usos</TableHead>
                    <TableHead className="text-slate-300 text-center">Ativo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tools.map((tool) => {
                    const toolStats = stats[tool.slug] || { visits: 0, uniqueVisitors: 0, uses: 0 };
                    
                    return (
                      <TableRow key={tool.slug} className="border-slate-700">
                        <TableCell className="font-medium text-white">
                          <div className="flex items-center gap-2">
                            <tool.icon className="w-4 h-4 text-blue-400" />
                            {tool.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-400 capitalize">
                          {tool.category}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={tool.status === 'live' ? 'default' : 'secondary'}
                            className={
                              tool.status === 'live'
                                ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            }
                          >
                            {tool.status === 'live' ? 'Disponível' : 'Em breve'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right text-slate-300">
                          {toolStats.visits.toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right text-slate-300">
                          {toolStats.uniqueVisitors.toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right text-slate-300">
                          {toolStats.uses.toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-center">
                          <Switch
                            checked={tool.isEnabled}
                            onCheckedChange={() => handleToggle(tool.slug, tool.isEnabled)}
                            disabled={isUpdating === tool.slug}
                            className="data-[state=checked]:bg-green-600"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-white">Sobre a Desativação de Ferramentas</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-400 space-y-2">
            <p>
              Ao desativar uma ferramenta, ela retornará erro 404 para visitantes públicos.
              Os links continuam no catálogo interno, mas a rota pública fica indisponível.
            </p>
            <p className="text-sm text-slate-500">
              Use isso para manutenção, remover ferramentas problemáticas ou ocultar features em teste.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
    </AdminLayout>
  );
}
