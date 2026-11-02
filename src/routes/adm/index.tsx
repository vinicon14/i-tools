// Admin login page - restructured to avoid client bundling of server code
import { createFileRoute, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { Shield } from 'lucide-react';

// Lazy load server functions (not top-level imports)
const getAdminAuth = async () => {
  const { isAdminConfigured, adminLogin, verifyAdminSession } = await import('@/lib/admin-auth.functions');
  return { isAdminConfigured, adminLogin, verifyAdminSession };
};

export const Route = createFileRoute('/adm/')({
  beforeLoad: async () => {
    const { isAdminConfigured, verifyAdminSession } = await getAdminAuth();
    const configured = await isAdminConfigured();
    if (!configured) {
      throw redirect({ to: '/adm/not-configured' });
    }

    const session = await verifyAdminSession();
    if (session.authenticated) {
      throw redirect({ to: '/adm/dashboard' });
    }
  },
});

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { adminLogin } = await getAdminAuth();
      const result = await adminLogin({ password });
      
      if (result && 'success' in result) {
        const json = await result.json();
        if (!json.success) {
          setError(json.error || 'Login failed');
          setLoading(false);
          return;
        }
      }

      window.location.href = '/adm/dashboard';
    } catch (err) {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">i-Tools Admin</h1>
          <p className="text-gray-400 text-sm">Enter admin password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 rounded-lg border border-gray-800 p-6 space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-950 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password"
              required
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
