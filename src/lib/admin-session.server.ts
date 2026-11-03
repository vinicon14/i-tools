import { useSession } from '@tanstack/react-start/server';

export function adminSessionConfig(password: string) {
  return {
    password,
    name: 'admin_session',
    maxAge: 8 * 60 * 60,
    cookie: { httpOnly: true, secure: true, sameSite: 'lax' as const, path: '/' },
  };
}

export async function getSessionFromCookie(_cookie?: string) {
  const password = process.env['ADMIN_SESSION_SECRET'];
  const username = process.env['ADMIN_USERNAME'];
  if (!password || !username) return null;
  const session = await useSession<{ username: string }>(adminSessionConfig(password));
  return session.data.username === username ? session.data : null;
}

export async function requireAdminSession() {
  const session = await getSessionFromCookie();
  if (!session) throw new Error('Acesso administrativo não autorizado.');
  return session;
}