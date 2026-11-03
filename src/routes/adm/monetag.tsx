// Monetag metrics page - lazy load
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { DollarSign } from 'lucide-react';

export const Route = createFileRoute('/adm/monetag')({
  staticData: { sitemap: false },
  component: AdminMonetag,
  head: () => ({ meta: [{ title: 'Monetag | Administração i-Tools' }, { name: 'description', content: 'Área restrita de administração do i-Tools.' }, { name: 'robots', content: 'noindex, nofollow' }, { property: 'og:title', content: 'Monetag | i-Tools' }, { property: 'og:description', content: 'Área restrita de administração do i-Tools.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),

  beforeLoad: async () => {
    const { verifyAdminSession } = await import('@/lib/admin-auth.functions');
    const session = await verifyAdminSession();
    if (!session.authenticated) throw redirect({ to: '/adm' });
  },
});

export default function AdminMonetag() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    endDate: new Date().toISOString()
  });

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const { getMonetagMetrics } = await import('@/lib/admin-analytics.functions');
      const result = await getMonetagMetrics({ data: dateRange });
      setMetrics(result);
    } catch (err) {
      console.error('Failed to load Monetag metrics:', err);
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

  if (!metrics?.enabled) {
    return (
      <AdminLayout>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-amber-400">
          Analytics not configured.
        </div>
      </AdminLayout>
    );
  }

  const totals = metrics.metrics?.reduce((acc: any, m: any) => ({
    impressions: acc.impressions + (m.impressions || 0),
    clicks: acc.clicks + (m.clicks || 0),
    revenue: acc.revenue + parseFloat(m.revenue_usd || 0)
  }), { impressions: 0, clicks: 0, revenue: 0 });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Monetag Performance</h1>
          <p className="text-gray-400 text-sm">Ad metrics (last 30 days)</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Revenue</span>
            </div>
            <div className="text-3xl font-bold text-white">
              ${totals?.revenue.toFixed(2) || '0.00'}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-2">Impressions</div>
            <div className="text-3xl font-bold text-white">
              {totals?.impressions.toLocaleString() || 0}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="text-sm text-gray-400 mb-2">Clicks</div>
            <div className="text-3xl font-bold text-white">
              {totals?.clicks.toLocaleString() || 0}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Daily Metrics</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800">
                <tr>
                  <th className="text-left py-2 text-gray-400 font-medium">Date</th>
                  <th className="text-right py-2 text-gray-400 font-medium">Impressions</th>
                  <th className="text-right py-2 text-gray-400 font-medium">Clicks</th>
                  <th className="text-right py-2 text-gray-400 font-medium">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {metrics.metrics?.map((m: any) => (
                  <tr key={m.date} className="border-b border-gray-800/50 last:border-0">
                    <td className="py-2 text-white">{m.date}</td>
                    <td className="py-2 text-right text-gray-300">{m.impressions.toLocaleString()}</td>
                    <td className="py-2 text-right text-gray-300">{m.clicks.toLocaleString()}</td>
                    <td className="py-2 text-right text-green-400">${parseFloat(m.revenue_usd).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
