// Admin Monetag revenue page with API integration and CSV import
import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSessionFromCookie } from '@/lib/admin-session.server';
import { getMonetagData, getMonetagSummary, testMonetagAPI, fetchMonetagAPI, importMonetagCSV } from '@/lib/monetag-integration.functions';
import { exportMonetagCSV } from '@/lib/admin-export.functions';
import { type GlobalFilters } from '@/lib/admin-filters';
import { useState, useRef } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FilterBar } from '@/components/admin/FilterBar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, Upload, DollarSign, Eye, MousePointerClick, TrendingUp, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const requireAuth = createServerFn('GET', async (_, { request }) => {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);
  if (!session) throw redirect({ to: '/adm' });
  return { username: session.username };
});

export const Route = createFileRoute('/adm/monetag')({
  staticData: { sitemap: false },
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  }),
  beforeLoad: async () => {
    await requireAuth();
  },
  loader: async () => {
    const [summary, apiStatus] = await Promise.all([
      getMonetagSummary(),
      testMonetagAPI(),
    ]);
    return { summary, apiStatus };
  },
  component: AdminMonetagPage,
});

function AdminMonetagPage() {
  const { summary, apiStatus } = Route.useLoaderData();
  
  const [filters, setFilters] = useState<GlobalFilters>({
    datePreset: 'last30days',
  });
  
  const [chartData, setChartData] = useState<Awaited<ReturnType<typeof getMonetagData>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getMonetagData(filters);
      setChartData(data);
    } catch (error) {
      console.error('Failed to load Monetag data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useState(() => {
    loadData();
  });

  const handleExport = async () => {
    try {
      const response = await exportMonetagCSV(filters);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `monetag-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export:', error);
      alert('Erro ao exportar dados');
    }
  };

  const handleCSVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadMessage(null);
    setIsLoading(true);

    try {
      const text = await file.text();
      const result = await importMonetagCSV({ csvContent: text });

      if (result.success) {
        setUploadMessage({
          type: 'success',
          text: result.message || 'Importação concluída com sucesso',
        });
        // Reload data
        await loadData();
        // Reload summary
        window.location.reload();
      } else {
        setUploadMessage({
          type: 'error',
          text: result.error || 'Erro ao importar CSV',
        });
      }
    } catch (error) {
      setUploadMessage({
        type: 'error',
        text: 'Erro ao processar arquivo CSV',
      });
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFetchAPI = async () => {
    setIsLoading(true);
    setUploadMessage(null);

    try {
      const { start, end } = require('@/lib/admin-filters').getDateRange(filters.datePreset, filters.startDate, filters.endDate);
      const result = await fetchMonetagAPI({
        startDate: start.split('T')[0],
        endDate: end.split('T')[0],
      });

      if (result.success) {
        setUploadMessage({
          type: 'success',
          text: `${result.rowsImported} dias importados da API Monetag`,
        });
        await loadData();
        window.location.reload();
      } else {
        setUploadMessage({
          type: 'error',
          text: result.error || 'Falha ao buscar dados da API',
        });
      }
    } catch (error) {
      setUploadMessage({
        type: 'error',
        text: 'Erro ao conectar com API Monetag',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              <div>
                <h1 className="text-3xl font-bold">Monetag</h1>
                <p className="text-slate-400 mt-1">Receita de anúncios e estatísticas</p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleCSVUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
                disabled={isLoading}
              >
                <Upload className="w-4 h-4 mr-2" />
                Importar CSV
              </Button>
              {apiStatus.connected && (
                <Button
                  onClick={handleFetchAPI}
                  variant="outline"
                  className="border-blue-600 text-blue-400 hover:bg-blue-900/30"
                  disabled={isLoading}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Buscar API
                </Button>
              )}
              <Button
                onClick={handleExport}
                className="bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* API Status Alert */}
          {!apiStatus.connected && (
            <Alert className="bg-yellow-900/20 border-yellow-900/50">
              <AlertCircle className="h-4 w-4 text-yellow-400" />
              <AlertDescription className="text-yellow-200">
                <strong>API Monetag não disponível.</strong> {apiStatus.message}
                <br />
                <span className="text-sm text-yellow-300">{apiStatus.recommendation}</span>
              </AlertDescription>
            </Alert>
          )}

          {/* Upload Message */}
          {uploadMessage && (
            <Alert className={uploadMessage.type === 'success' ? 'bg-green-900/20 border-green-900/50' : 'bg-red-900/20 border-red-900/50'}>
              <AlertDescription className={uploadMessage.type === 'success' ? 'text-green-200' : 'text-red-200'}>
                {uploadMessage.text}
              </AlertDescription>
            </Alert>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Receita Diária</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">
                  R$ {summary.daily.revenue.toFixed(2)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {summary.daily.impressions.toLocaleString('pt-BR')} impressões
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Receita Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">
                  R$ {summary.monthly.revenue.toFixed(2)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {summary.monthly.clicks.toLocaleString('pt-BR')} cliques
                </p>
              </CardContent>
            </Card>
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Total Acumulado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-400">
                  R$ {summary.cumulative.revenue.toFixed(2)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  RPM médio: R$ {summary.cumulative.rpm.toFixed(2)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <FilterBar filters={filters} onChange={(f) => { setFilters(f); loadData(); }} />

          {/* Revenue Chart */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Receita no Período</CardTitle>
              <CardDescription className="text-slate-400">
                Evolução diária de impressões, cliques e receita
              </CardDescription>
            </CardHeader>
            <CardContent>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
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
                    <Line type="monotone" dataKey="revenue" name="Receita (R$)" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="impressions" name="Impressões" stroke="#3b82f6" strokeWidth={1.5} />
                    <Line type="monotone" dataKey="clicks" name="Cliques" stroke="#f59e0b" strokeWidth={1.5} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-slate-400">
                  Nenhum dado disponível para o período selecionado
                </div>
              )}
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Como Importar Dados do Monetag</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300 space-y-3">
              <p>1. Acesse o painel Monetag: <a href="https://publishers.monetag.com" target="_blank" rel="noopener" className="text-blue-400 underline">publishers.monetag.com</a></p>
              <p>2. Vá em <strong>Statistics</strong> → Selecione o período desejado</p>
              <p>3. Exporte o relatório como CSV</p>
              <p>4. Clique em <strong>"Importar CSV"</strong> acima e selecione o arquivo</p>
              <p className="text-sm text-slate-500 mt-4">
                <strong>Formato esperado do CSV:</strong><br />
                Date,Impressions,Clicks,Revenue,CPM,RPM<br />
                2024-01-01,12345,678,12.34,1.00,10.00
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
