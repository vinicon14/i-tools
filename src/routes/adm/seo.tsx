import { createFileRoute, redirect } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useState } from 'react';
import { Sparkles, Copy, Download, LoaderCircle, Check } from 'lucide-react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { verifyAdminSession } from '@/lib/admin-auth.functions';
import { generateToolSeo } from '@/lib/admin-seo.functions';
import { seoDraftText, type SeoDraft } from '@/lib/admin-seo';
import { tools } from '@/lib/catalog';

export const Route = createFileRoute('/adm/seo')({
  staticData: { sitemap: false },
  beforeLoad: async () => { if (!(await verifyAdminSession()).authenticated) throw redirect({ to: '/adm' }); },
  head: () => ({ meta: [
    { title: 'Editor SEO com IA | Administração i-Tools' },
    { name: 'description', content: 'Editor restrito de títulos, descrições e textos das ferramentas do i-Tools.' },
    { name: 'robots', content: 'noindex, nofollow' },
    { property: 'og:title', content: 'Editor SEO com IA | i-Tools' },
    { property: 'og:description', content: 'Editor administrativo de conteúdo SEO do i-Tools.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary' },
  ] }),
  component: AdminSeo,
});

function AdminSeo() {
  const generate = useServerFn(generateToolSeo);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [draft, setDraft] = useState<SeoDraft | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;
    setPending(true); setError(''); setCopied(false);
    try {
      const result = await generate({ data: { name, description } });
      if (result.error) setError(result.error);
      else setDraft(result.draft);
    } catch { setError('Não foi possível gerar o SEO. Verifique seu acesso administrativo e tente novamente.'); }
    finally { setPending(false); }
  }
  async function copy() {
    if (!draft) return;
    try { await navigator.clipboard.writeText(seoDraftText(draft)); setCopied(true); }
    catch { setError('Não foi possível copiar. Você pode baixar o texto.'); }
  }
  function download() {
    if (!draft) return;
    const url = URL.createObjectURL(new Blob([seoDraftText(draft)], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'itools-seo.txt'; link.click(); URL.revokeObjectURL(url);
  }
  return <AdminLayout>
    <div className="bg-background text-foreground -mx-4 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex items-center gap-3"><Sparkles className="size-6 text-primary" /><h1 className="text-3xl sm:text-4xl">SEO das ferramentas</h1></div>
        <form onSubmit={submit} className="space-y-5 border-b border-border pb-8">
          <div className="max-w-md space-y-2"><Label htmlFor="catalog-tool">Ferramenta do catálogo</Label>
            <select id="catalog-tool" disabled={pending} defaultValue="" className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" onChange={e => { const tool = tools.find(t => t.slug === e.target.value); if (tool) { setName(tool.name); setDescription(tool.summary); } }}>
              <option value="">Escolha uma ferramenta (opcional)</option>{tools.map(t => <option key={t.slug} value={t.slug}>{t.name}</option>)}
            </select>
          </div>
          <div className="space-y-2"><Label htmlFor="tool-name">Nome da ferramenta</Label><Input id="tool-name" required minLength={2} maxLength={120} value={name} onChange={e => setName(e.target.value)} disabled={pending} /></div>
          <div className="space-y-2"><Label htmlFor="tool-description">Descrição da ferramenta</Label><Textarea id="tool-description" required minLength={10} maxLength={4000} rows={5} value={description} onChange={e => setDescription(e.target.value)} disabled={pending} /></div>
          <Button disabled={pending} type="submit">{pending ? <LoaderCircle className="motion-safe:animate-spin" /> : <Sparkles />}{pending ? 'Gerando SEO…' : 'Gerar SEO com IA'}</Button>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        </form>
        <div aria-live="polite" aria-busy={pending}>
          {draft && <section className="pt-8 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-2xl">Rascunho de SEO</h2><p className="mt-1 text-sm text-muted-foreground">Não aplicado às páginas públicas.</p></div><div className="flex gap-2"><Button type="button" variant="outline" onClick={copy}>{copied ? <Check /> : <Copy />}{copied ? 'Copiado' : 'Copiar'}</Button><Button type="button" variant="outline" onClick={download}><Download />Baixar</Button></div></div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-4"><h3 className="font-semibold">Títulos SEO</h3>{draft.titles.map((title, i) => <div key={i} className="space-y-2"><Label htmlFor={`seo-title-${i}`}>Opção {i + 1} · {title.length}/65</Label><Input id={`seo-title-${i}`} maxLength={65} value={title} onChange={e => { setCopied(false); setDraft({ ...draft, titles: draft.titles.map((t, j) => j === i ? e.target.value : t) }); }} /></div>)}</div>
              <div className="space-y-4"><h3 className="font-semibold">Meta descrições</h3>{draft.metaDescriptions.map((text, i) => <div key={i} className="space-y-2"><Label htmlFor={`seo-meta-${i}`}>Opção {i + 1} · {text.length}/160</Label><Textarea id={`seo-meta-${i}`} maxLength={160} value={text} onChange={e => { setCopied(false); setDraft({ ...draft, metaDescriptions: draft.metaDescriptions.map((t, j) => j === i ? e.target.value : t) }); }} /></div>)}</div>
            </div>
            <div className="space-y-5"><h3 className="font-semibold">Texto da página</h3><div className="space-y-2"><Label htmlFor="seo-h1">Título principal</Label><Input id="seo-h1" value={draft.heading} onChange={e => { setCopied(false); setDraft({ ...draft, heading: e.target.value }); }} /></div><div className="space-y-2"><Label htmlFor="seo-intro">Introdução</Label><Textarea id="seo-intro" rows={4} value={draft.introduction} onChange={e => { setCopied(false); setDraft({ ...draft, introduction: e.target.value }); }} /></div>
              {draft.sections.map((section, i) => <div key={i} className="space-y-2"><Label htmlFor={`section-heading-${i}`}>Seção {i + 1}</Label><Input id={`section-heading-${i}`} value={section.heading} onChange={e => { setCopied(false); setDraft({ ...draft, sections: draft.sections.map((s, j) => j === i ? { ...s, heading: e.target.value } : s) }); }} /><Label htmlFor={`section-body-${i}`} className="sr-only">Texto da seção {i + 1}</Label><Textarea id={`section-body-${i}`} rows={5} value={section.body} onChange={e => { setCopied(false); setDraft({ ...draft, sections: draft.sections.map((s, j) => j === i ? { ...s, body: e.target.value } : s) }); }} /></div>)}
            </div>
          </section>}
        </div>
      </div>
    </div>
  </AdminLayout>;
}