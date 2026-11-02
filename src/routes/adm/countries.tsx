// Admin countries page with world map and city breakdown
import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSessionFromCookie } from '@/lib/admin-session.server';
import { getGeoData } from '@/lib/admin-analytics.functions';
import { exportGeoCSV } from '@/lib/admin-export.functions';
import { type GlobalFilters } from '@/lib/admin-filters';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { FilterBar } from '@/components/admin/FilterBar';
import { WorldMap } from '@/components/admin/WorldMap';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, MapPin, Globe } from 'lucide-react';

export const requireAuth = createServerFn('GET', async (_, { request }) => {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);
  if (!session) throw redirect({ to: '/adm' });
  return { username: session.username };
});

export const Route = createFileRoute('/adm/countries')({
  staticData: { sitemap: false },
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  }),
  beforeLoad: async () => {
    await requireAuth();
  },
  component: AdminCountriesPage,
});

function AdminCountriesPage() {
  const [filters, setFilters] = useState<GlobalFilters>({
    datePreset: 'last30days',
  });
  
  const [geoData, setGeoData] = useState<Awaited<ReturnType<typeof getGeoData>>>([]);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load data when filters change
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getGeoData(filters);
      setGeoData(data);
    } catch (error) {
      console.error('Failed to load geo data:', error);
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
      const response = await exportGeoCSV(filters);
      // Trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `paises-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export:', error);
      alert('Erro ao exportar dados');
    }
  };

  const selectedCountryData = selectedCountry ? geoData.find((c) => c.countryCode === selectedCountry) : null;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold">Geografia</h1>
                <p className="text-slate-400 mt-1">Visitantes por país e cidade</p>
              </div>
            </div>
            <Button
              onClick={handleExport}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Exportar CSV
            </Button>
          </div>

          {/* Filters */}
          <FilterBar filters={filters} onChange={(f) => { setFilters(f); loadData(); }} />

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Total de Países</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-400">{geoData.length}</div>
              </CardContent>
            </Card>
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Total de Visitas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-400">
                  {geoData.reduce((sum, c) => sum + c.visits, 0).toLocaleString('pt-BR')}
                </div>
              </CardContent>
            </Card>
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">Visitantes Únicos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-400">
                  {geoData.reduce((sum, c) => sum + c.uniqueVisitors, 0).toLocaleString('pt-BR')}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* World Map */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Mapa Mundial</CardTitle>
              <CardDescription className="text-slate-400">
                Distribuição de visitantes por país (clique para ver cidades)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg border border-slate-700 bg-slate-900/50">
                <WorldMap data={geoData} onCountryClick={setSelectedCountry} />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>Menos visitas</span>
                <div className="flex gap-1">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-3 rounded"
                      style={{
                        background: `rgb(${51 + (59 - 51) * (i / 4)}, ${65 + (130 - 65) * (i / 4)}, ${99 + (246 - 99) * (i / 4)})`,
                      }}
                    />
                  ))}
                </div>
                <span>Mais visitas</span>
              </div>
            </CardContent>
          </Card>

          {/* Countries Table */}
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-white">Países</CardTitle>
              <CardDescription className="text-slate-400">
                Clique em um país para ver cidades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-700">
                      <TableHead className="text-slate-300">País</TableHead>
                      <TableHead className="text-slate-300 text-right">Visitas</TableHead>
                      <TableHead className="text-slate-300 text-right">Visitantes Únicos</TableHead>
                      <TableHead className="text-slate-300 text-right">Percentual</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {geoData.map((country) => (
                      <TableRow
                        key={country.countryCode}
                        className="border-slate-700 cursor-pointer hover:bg-slate-700/30"
                        onClick={() => setSelectedCountry(country.countryCode)}
                      >
                        <TableCell className="font-medium text-white">
                          {country.countryName} ({country.countryCode})
                        </TableCell>
                        <TableCell className="text-right text-slate-300">
                          {country.visits.toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right text-slate-300">
                          {country.uniqueVisitors.toLocaleString('pt-BR')}
                        </TableCell>
                        <TableCell className="text-right text-blue-400">
                          {country.percentage.toFixed(2)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Cities Table (when country selected) */}
          {selectedCountryData && selectedCountryData.cities && selectedCountryData.cities.length > 0 && (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardHeader>
                <CardTitle className="text-white">
                  Cidades - {selectedCountryData.countryName}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Top cidades neste país
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-slate-700">
                        <TableHead className="text-slate-300">Cidade</TableHead>
                        <TableHead className="text-slate-300 text-right">Visitas</TableHead>
                        <TableHead className="text-slate-300 text-right">Visitantes Únicos</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedCountryData.cities.map((city) => (
                        <TableRow key={city.city} className="border-slate-700">
                          <TableCell className="font-medium text-white">{city.city}</TableCell>
                          <TableCell className="text-right text-slate-300">
                            {city.visits.toLocaleString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right text-slate-300">
                            {city.uniqueVisitors.toLocaleString('pt-BR')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
