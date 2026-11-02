// Admin logout route - /adm/logout
import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getSessionFromCookie, deleteSession, clearSessionCookie } from '@/lib/admin-session.server';

export const logoutAdmin = createServerFn('POST', async (_, { request }) => {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);

  if (session) {
    deleteSession(session.id);
  }

  return {
    success: true,
    clearCookie: clearSessionCookie(),
  };
});

export const Route = createFileRoute('/adm/logout')({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  loader: async () => {
    const result = await logoutAdmin();
    
    // Clear cookie on client side
    if (result.clearCookie) {
      document.cookie = result.clearCookie;
    }

    throw redirect({ to: '/adm' });
  },
});
