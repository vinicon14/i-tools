// Tools management page - with enable/disable
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { tools } from '@/lib/catalog';
import { Settings, ToggleLeft, ToggleRight } from 'lucide-react';

export const Route = createFileRoute('/adm/tools')({
  beforeLoad: async () => {
    const { verifyAdminSession } = await import('@/lib/admin-auth.functions');
    const session = await verifyAdminSession();
    if (!session.authenticated) throw redirect({ to: '/adm' });
  },
});

export default function AdminTools() {
  const [search, setSearch] = useState('');
  const [toolsConfig, setToolsConfig] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  const toolList = Object.values(tools);

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const { getToolsConfig } = await import('@/lib/admin-analytics.functions');
      const result = await getToolsConfig();
      if (result.enabled && result.tools) {
        const config: Record<string, boolean> = {};
        result.tools.forEach((t: any) => {
          config[t.slug] = t.enabled;
        });
        setToolsConfig(config);
      }
    } catch (err) {
      console.error('Failed to load tools config:', err);
    }
    setLoading(false);
  };

  const toggleTool = async (slug: string) => {
    const currentState = toolsConfig[slug] ?? true;
    const newState = !currentState;
    
    setToolsConfig(prev => ({ ...prev, [slug]: newState }));

    try {
      const { updateToolConfig } = await import('@/lib/admin-analytics.functions');
      await updateToolConfig({ slug, enabled: newState });
    } catch (err) {
      console.error('Failed to update tool:', err);
      setToolsConfig(prev => ({ ...prev, [slug]: currentState }));
    }
  };

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
          {filteredTools.map((tool) => {
            const isEnabled = toolsConfig[tool.slug] ?? true;
            return (
              <div key={tool.slug} className="bg-gray-900 border border-gray-800 rounded-lg p-4 hover:border-gray-700 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white">{tool.title}</h3>
                    <p className="text-xs text-gray-500 font-mono">/{tool.slug}</p>
                  </div>
                  <button
                    onClick={() => toggleTool(tool.slug)}
                    disabled={loading}
                    className="ml-2 focus:outline-none"
                    title={isEnabled ? 'Click to disable' : 'Click to enable'}
                  >
                    {isEnabled ? (
                      <ToggleRight className="w-6 h-6 text-blue-400" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2 mb-2">{tool.description}</p>
                <div className="text-xs">
                  {isEnabled ? (
                    <span className="text-green-400">● Enabled</span>
                  ) : (
                    <span className="text-gray-600">● Disabled</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
