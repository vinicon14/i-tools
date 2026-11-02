// Tool detail page with statistics and editing
import { createFileRoute, redirect, Link } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSessionFromCookie } from '@/lib/admin-session.server';
import { getToolDetailData, type GlobalFilters } from '@/lib/admin-analytics.functions';
import { supabaseAdmin } from '@/integrations/supabase/client.server';
import { getTool } from '@/lib/catalog';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FilterBar } from '@/components/admin/FilterBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Edit, Save, X } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const requireAuth = createServerFn('GET', async (_, { request }) => {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);
  if (!session) throw redirect({ to: '/adm' });
  return { username: session.username };
});

// Update tool metadata (future enhancement - would need catalog persistence)
export const updateToolMetadata = createServerFn('POST', async (data: { toolSlug: string; name: string; description: string }, { request }) => {
  await requireAuth({}, { request });
  
  // Note: This would require persisting tool metadata to database
  // For now, tools are defined in catalog.ts
  // Implementation would need a tool_metadata table in Supabase
  
  return {
    success: false,
    message: 'Edição de metadados requer persistência em banco (futuro)',
  };
});

export const Route = createFileRoute('/adm/tools/$toolSlug')({
  staticData: { sitemap: false },
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  }),
  beforeLoad: async () => {
    await requireAuth();
  },
  component: ToolDetailPage,
});

function ToolDetailPage() {
  const { toolSlug } = Route.useParams();
  const tool = getTool(toolSlug);

  const [filters, setFilters] = useState<GlobalFilters>({
    datePreset: 'last30days',
  });

  const [detailData, setDetailData] = useState<Awaited<ReturnType<typeof getToolDetailData>> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(tool?.name || '');
  const [editedSummary, setEditedSummary] = useState(tool?.summary || '');

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getToolDetailData({ toolSlug, filters });
      setDetailData(data);
    } catch (error) {
      console.error('Failed to load tool data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useState(() => {
    loadData();
  });

  const handleSave = async () => {
    const result = await updateToolMetadata({
      toolSlug,
      name: editedName,
      description: editedSummary,
    });

    if (result.success) {
      setIsEditing(false);
      alert('Ferramenta atualizada com sucesso');
    } else {
      alert(result.message);
    }
  };

  if (!tool) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
          <div className="max-w-7xl mx-auto">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="pt-6">
                <p className="text-slate-400">Ferramenta não encontrada</p>
                <Link to="/adm/tools" className="text-blue-400 hover:underline mt-4 inline-block">
                  Voltar para ferramentas
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const Icon = tool.icon;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/adm/tools">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <Icon className="w-8 h-8 text-blue-400" />
                <div>
                  <h1 className="text-3xl font-bold">{tool.name}</h1>
                  <p className="text-slate-400 mt-1">Estatísticas e configuração</p>
                </div>
              </div>
            </div>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant="outline"
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              {isEditing ? <X className="w-4 h-4 mr-2" /> : <Edit className="w-4 h-4 mr-2" />}
              {isEditing ? 'Cancelar' : 'Editar'}
            </Button>
          </div>

          {/* Tool Metadata */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Informações da Ferramenta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Nome</Label>
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Descrição</Label>
                    <Textarea
                      value={editedSummary}
                      onChange={(e) => setEditedSummary(e.target.value)}
                      rows={3}
                      className="bg-slate-700/50 border-slate-600 text-white"
                    />
                  </div>
                  <Button
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Alterações
                  </Button>
                  <p className="text-xs text-slate-500">
                    Nota: Edição de metadados requer implementação de persistência
                  </p>
                </>
              ) : (
                <>
                  <div>
                    <p className="text-sm text-slate-400">Nome</p>
                    <p className="text-white font-medium">{tool.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Descrição</p>
                    <p className="text-slate-300">{tool.summary}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Categoria</p>
                    <p className="text-white capitalize">{tool.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Status</p>
                    <p className="text-white">{tool.status === 'live' ? 'Disponível' : 'Em breve'}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Filters */}
          <FilterBar filters={filters} onChange={(f) => { setFilters(f); loadData(); }} />

          {/* Statistics */}
          {isLoading && !detailData ? (
            <div className="text-center py-12 text-slate-400">Carregando estatísticas...</div>
          ) : detailData ? (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400">Visitas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-400">
                      {detailData.visits.toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400">Visitantes Únicos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-purple-400">
                      {detailData.uniqueVisitors.toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400">Usos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-400">
                      {detailData.uses.toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-slate-700 bg-slate-800/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-slate-400">Erros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-400">
                      {detailData.errors.toLocaleString('pt-BR')}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Evolution Chart */}
              <Card className="border-slate-700 bg-slate-800/50">
                <CardHeader>
                  <CardTitle className="text-white">Evolução no Período</CardTitle>
                  <CardDescription className="text-slate-400">
                    Visitas e usos diários
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={detailData.evolution}>
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
                      <Line type="monotone" dataKey="visits" stroke="#3b82f6" name="Visitas" strokeWidth={2} />
                      <Line type="monotone" dataKey="uses" stroke="#10b981" name="Usos" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          ) : null}
        </div>
      </div>
    </AdminLayout>
  );
}
