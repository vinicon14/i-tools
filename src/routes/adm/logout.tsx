// Logout route - lazy load server functions
import { createFileRoute, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/adm/logout')({
  beforeLoad: async () => {
    const { adminLogout } = await import('@/lib/admin-auth.functions');
    await adminLogout();
    throw redirect({ to: '/adm' });
  },
});

export default function AdminLogout() {
  return <div>Logging out...</div>;
}
