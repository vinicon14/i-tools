// Tools management page - lazy load
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { tools } from '@/lib/catalog';
import { Settings } from 'lucide-react';

export const Route = createFileRoute('/adm/tools')({
  beforeLoad: async () => {
    const { verifyAdminSession } = await import('@/lib/admin-auth.functions');
    const session = await verifyAdminSession();
    if (!session.authenticated) throw redirect({ to: '/adm' });
  },
});

export default function AdminTools() {
  const [search, setSearch] = useState('');

  const toolList = Object.values(tools);

  const filteredTools = toolList.filter(tool =>
    tool.slug.toLowerCase().includes(search.toLowerCase()) ||
    tool.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Tools Management</h1>
          <p className="text-gray-400 text-sm">{toolList.length} tools available</p>
        </div>

        <div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tools..."
            className="w-full px-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTools.map((tool) => (
            <div key={tool.slug} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-sm font-semibold text-white">{tool.title}</h3>
                  <p className="text-xs text-gray-500 font-mono">/{tool.slug}</p>
                </div>
                <Settings className="w-4 h-4 text-gray-600" />
              </div>
              <p className="text-xs text-gray-400 line-clamp-2">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
