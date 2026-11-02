// Admin dashboard - lazy load server functions
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BarChart3, Users, Eye } from 'lucide-react';

export const Route = createFileRoute('/adm/dashboard')({
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
      const result = await getDashboardStats(dateRange);
      setStats(result);
    } catch (err) {
      console.error('Failed to load stats:', err);
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
          Analytics not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
          <p className="text-gray-400 text-sm">Last 30 days overview</p>
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
