// Logout route - lazy load server functions
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/adm/logout')({
  staticData: { sitemap: false },
  component: AdminLogout,
  head: () => ({ meta: [{ title: 'Sair | Administração i-Tools' }, { name: 'description', content: 'Área restrita de administração do i-Tools.' }, { name: 'robots', content: 'noindex, nofollow' }, { property: 'og:title', content: 'Sair | i-Tools' }, { property: 'og:description', content: 'Área restrita de administração do i-Tools.' }, { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' }] }),

  beforeLoad: async () => {
    const { adminLogout } = await import('@/lib/admin-auth.functions');
    await adminLogout();
    throw redirect({ to: '/adm' });
  },
});

export default function AdminLogout() {
  return <div>Logging out...</div>;
}
