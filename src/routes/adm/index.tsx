import { createFileRoute, redirect, useRouter } from '@tanstack/react-router';
import { useState } from 'react';
import { Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PageShell } from '@/components/site/Layout';
import { adminLogin, verifyAdminSession } from '@/lib/admin-auth.functions';

export const Route = createFileRoute('/adm/')({
  staticData: { sitemap: false },
  head: () => ({ meta: [
    { title: 'Acesso administrativo | i-Tools' },
    { name: 'description', content: 'Acesso restrito à administração do i-Tools.' },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Acesso administrativo | i-Tools' },
    { property: 'og:description', content: 'Acesso restrito à administração do i-Tools.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ] }),
  beforeLoad: async () => {
    if ((await verifyAdminSession()).authenticated) throw redirect({ to: '/adm/dashboard' });
  },
  component: AdminLogin,
});

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await adminLogin({ data: { username, password } });
      if (!result.success) { setError(result.error); return; }
      setPassword('');
      await router.invalidate();
      await router.navigate({ to: '/adm/dashboard' });
    } catch { setError('Não foi possível entrar. Tente novamente.'); }
    finally { setLoading(false); }
  };
  return <PageShell>
    <section className="mx-auto w-full max-w-md px-6 py-16">
      <Shield className="mb-4 h-8 w-8 text-primary" aria-hidden="true" />
      <h1 className="text-3xl">Administração i-Tools</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div className="space-y-2"><label htmlFor="username">Usuário</label>
          <Input id="username" autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} required disabled={loading} />
        </div>
        <div className="space-y-2"><label htmlFor="password">Senha</label>
          <Input id="password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" disabled={loading} className="w-full">{loading ? 'Entrando…' : 'Entrar'}</Button>
      </form>
    </section>
  </PageShell>;
}
