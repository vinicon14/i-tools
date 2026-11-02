// Admin login route - /adm
import { createFileRoute, redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { verifyAdminCredentials, checkRateLimit, resetRateLimit } from '@/lib/admin-auth.server';
import { createSession, setSessionCookie, getSessionFromCookie } from '@/lib/admin-session.server';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield } from 'lucide-react';

// Server function for login
export const loginAdmin = createServerFn('POST', async (credentials: { username: string; password: string }, { request }) => {
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

  // Rate limiting
  if (!checkRateLimit(ip)) {
    throw new Error('Muitas tentativas de login. Tente novamente em 15 minutos.');
  }

  // Verify credentials
  const isValid = await verifyAdminCredentials(credentials.username, credentials.password);

  if (!isValid) {
    throw new Error('Usuário ou senha incorretos');
  }

  // Reset rate limit on successful login
  resetRateLimit(ip);

  // Create session
  const session = createSession(credentials.username);

  return {
    success: true,
    sessionCookie: setSessionCookie(session.id),
  };
});

// Check if already logged in
export const checkAdminSession = createServerFn('GET', async (_, { request }) => {
  const cookieHeader = request.headers.get('cookie');
  const session = getSessionFromCookie(cookieHeader);

  return { isAuthenticated: !!session };
});

export const Route = createFileRoute('/adm/')({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
  beforeLoad: async ({ context }) => {
    const { isAuthenticated } = await checkAdminSession();
    if (isAuthenticated) {
      throw redirect({ to: '/adm/dashboard' });
    }
  },
  component: AdminLogin,
});

function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await loginAdmin({ username, password });

      if (result.success && result.sessionCookie) {
        // Set cookie via document.cookie (client-side)
        document.cookie = result.sessionCookie;
        // Redirect to dashboard
        window.location.href = '/adm/dashboard';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800/50 backdrop-blur">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-500/10 rounded-full">
              <Shield className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-white">Painel Administrativo</CardTitle>
          <CardDescription className="text-slate-400">
            Entre com suas credenciais para acessar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">
                Usuário
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                disabled={isLoading}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                placeholder="Digite seu usuário"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                disabled={isLoading}
                className="bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-500"
                placeholder="Digite sua senha"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-900/20 border-red-900/50">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
