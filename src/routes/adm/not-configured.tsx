// Not configured page
import { createFileRoute } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';

export const Route = createFileRoute('/adm/not-configured')({});

export default function AdminNotConfigured() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white mb-2">Admin Panel Not Configured</h1>
              <p className="text-gray-400 mb-4">
                The admin panel requires configuration before it can be used.
              </p>
              
              <div className="bg-gray-950 rounded border border-gray-800 p-4 space-y-4">
                <div>
                  <h2 className="text-sm font-semibold text-white mb-2">Required Environment Variables:</h2>
                  <ul className="text-sm text-gray-400 space-y-1 font-mono">
                    <li>• ADMIN_PASSWORD_HASH</li>
                    <li>• SUPABASE_URL</li>
                    <li>• SUPABASE_SERVICE_ROLE_KEY</li>
                    <li>• ANALYTICS_SALT (optional, for visitor hashing)</li>
                  </ul>
                </div>
                
                <div>
                  <h2 className="text-sm font-semibold text-white mb-2">Generate Password Hash:</h2>
                  <code className="block text-xs text-gray-300 bg-gray-900 p-2 rounded">
                    node scripts/hash-password.js "your-secure-password"
                  </code>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
