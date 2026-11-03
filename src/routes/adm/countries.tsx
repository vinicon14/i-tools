// Countries/Geography page - lazy load
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Globe } from 'lucide-react';

export const Route = createFileRoute('/adm/countries')({
  staticData: { sitemap: false },
  component: AdminCountries,
  head: () => ({ meta: [{ title: 'Visitantes por país | Administração i-Tools' }, { name: 'description', content: 'Área restrita de administração do i-Tools.' }, { name: 'robots', content: 'noindex, nofollow' }, { property: 'og:title', content: 'Visitantes por país | i-Tools' }, { property: 'og:description', content: 'Área restrita de administração do i-Tools.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),

  beforeLoad: async () => {
    const { verifyAdminSession } = await import('@/lib/admin-auth.functions');
    const session = await verifyAdminSession();
    if (!session.authenticated) throw redirect({ to: '/adm' });
  },
});

export default function AdminCountries() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString()
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { getCountryStats } = await import('@/lib/admin-analytics.functions');
      const result = await getCountryStats({ data: dateRange });
      setStats(result);
    } catch (err) {
      console.error('Failed to load country stats:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-gray-400">Loading...</div>
      </AdminLayout>
    );
  }

  if (!stats?.enabled) {
    return (
      <AdminLayout>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-amber-400">
          Analytics not configured.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Geografia</h1>
          <p className="text-gray-400 text-sm">Visitantes por país (últimos 30 dias) • Timezone: America/Sao_Paulo</p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-300">
            Dados baseados em pageviews registrados (excluindo bots e rotas administrativas).
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="space-y-3">
            {stats.countries?.map((country: any) => (
              <div key={country.countryCode} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-white font-medium">{country.countryCode}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400">{country.visits.toLocaleString()} pageviews</span>
                  <div className="w-24 bg-gray-800 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min(100, (country.visits / (stats.countries[0]?.visits || 1)) * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
