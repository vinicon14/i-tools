import { createServerFn } from '@tanstack/react-start';
import { useSession } from '@tanstack/react-start/server';
import { z } from 'zod';
import { matchesAdminCredentials } from './admin-credentials';
import { adminSessionConfig, getSessionFromCookie } from './admin-session.server';

export const isAdminConfigured = createServerFn({ method: 'GET' }).handler(() =>
  Boolean(process.env['ADMIN_USERNAME'] && process.env['ADMIN_PASSWORD'] && process.env['ADMIN_SESSION_SECRET']),
);

export const adminLogin = createServerFn({ method: 'POST' })
  .inputValidator((data) => z.object({ username: z.string().min(1).max(100), password: z.string().min(1).max(256) }).parse(data))
  .handler(async ({ data }) => {
    const username = process.env['ADMIN_USERNAME'];
    const password = process.env['ADMIN_PASSWORD'];
    const secret = process.env['ADMIN_SESSION_SECRET'];
    if (!username || !password || !secret) return { success: false, error: 'Acesso administrativo ainda não configurado.' };
    if (!await matchesAdminCredentials(data.username, data.password, username, password)) {
      return { success: false, error: 'Usuário ou senha incorretos.' };
    }
    const session = await useSession<{ username: string }>(adminSessionConfig(secret));
    await session.update({ username });
    return { success: true, error: '' };
  });

export const verifyAdminSession = createServerFn({ method: 'GET' }).handler(async () => ({
  authenticated: Boolean(await getSessionFromCookie()),
}));

export const adminLogout = createServerFn({ method: 'POST' }).handler(async () => {
  const secret = process.env['ADMIN_SESSION_SECRET'];
  if (secret) {
    const session = await useSession(adminSessionConfig(secret));
    await session.clear();
  }
  return { success: true };
});
