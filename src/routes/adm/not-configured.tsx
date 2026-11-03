// Not configured page
import { createFileRoute } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';

export const Route = createFileRoute('/adm/not-configured')({
  staticData: { sitemap: false },
  component: AdminNotConfigured,
  head: () => ({ meta: [{ title: 'Configuração | Administração i-Tools' }, { name: 'description', content: 'Área restrita de administração do i-Tools.' }, { name: 'robots', content: 'noindex, nofollow' }, { property: 'og:title', content: 'Configuração | i-Tools' }, { property: 'og:description', content: 'Área restrita de administração do i-Tools.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),
});

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
              
<p>O acesso administrativo precisa ser configurado pelo responsável pelo site.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
