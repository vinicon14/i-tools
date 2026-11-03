// Admin dashboard - with CSV export
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BarChart3, Users, Eye, Download } from 'lucide-react';

export const Route = createFileRoute('/adm/dashboard')({
  staticData: { sitemap: false },
  component: AdminDashboard,
  head: () => ({ meta: [{ title: 'Visão geral | Administração i-Tools' }, { name: 'description', content: 'Área restrita de administração do i-Tools.' }, { name: 'robots', content: 'noindex, nofollow' }, { property: 'og:title', content: 'Visão geral | i-Tools' }, { property: 'og:description', content: 'Área restrita de administração do i-Tools.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),

  beforeLoad: async () => {
    const { verifyAdminSession } = await import('@/lib/admin-auth.functions');
    const session = await verifyAdminSession();
    if (!session.authenticated) {
      throw redirect({ to: '/adm' });
    }
  },
});

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
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
      const { getDashboardStats } = await import('@/lib/admin-analytics.functions');
      const result = await getDashboardStats({ data: dateRange });
      setStats(result);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
    setLoading(false);
  };

  const exportCSV = async () => {
    setExporting(true);
    try {
      const { exportAnalyticsCSV } = await import('@/lib/admin-analytics.functions');
      const csv = await exportAnalyticsCSV({ data: dateRange });
      if (csv) {
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error('Failed to export CSV:', err);
    }
    setExporting(false);
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
          Estatísticas ainda não configuradas.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Painel administrativo</h1>
            <p className="text-gray-400 text-sm">Last 30 days overview</p>
          </div>
          <button
            onClick={exportCSV}
            disabled={exporting || !stats?.enabled}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Download className="w-4 h-4" />
            {exporting ? 'Exporting...' : 'Export CSV'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Total Visits</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats.stats?.totalVisits?.toLocaleString() || 0}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Unique Visitors</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats.stats?.uniqueVisitors?.toLocaleString() || 0}
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Tools Used</span>
            </div>
            <div className="text-3xl font-bold text-white">
              {stats.stats?.topTools?.length || 0}
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Top Tools</h2>
          <div className="space-y-3">
            {stats.stats?.topTools?.map((tool: any, i: number) => (
              <div key={tool.toolSlug} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 font-mono w-6">{i + 1}.</span>
                  <span className="text-sm text-white">{tool.toolSlug}</span>
                </div>
                <span className="text-sm text-gray-400">{tool.visits.toLocaleString()} visits</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
