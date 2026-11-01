import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteFooter, SiteHeader, SoonBadge } from "@/components/site";
import { getCategory, getTool } from "@/lib/tools";

export const Route = createFileRoute("/tools/$slug")({
  loader: ({ params }) => {
    const tool = getTool(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  head: ({ params, loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Ferramenta não encontrada — ai-tools" }, { name: "robots", content: "noindex" }] };
    const t = `${loaderData.tool.name} (em breve) — ai-tools`;
    const d = `${loaderData.tool.summary} Em preparação: será gratuita, sem conta e mantida apenas por anúncios.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/tools/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/tools/${params.slug}` }],
    };
  },
  component: ToolPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold">Ferramenta não encontrada</h1>
      <Link to="/" className="mt-6 inline-block font-semibold text-primary underline">Voltar para a página inicial</Link>
    </div>
  ),
});

function ToolPage() {
  const { tool } = Route.useLoaderData();
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-14">
        <nav aria-label="Trilha de navegação" className="text-sm text-muted-foreground">
          <Link to="/" className="underline-offset-4 hover:underline">Início</Link> / {getCategory(tool.category)?.name}
        </nav>
        <div className="mt-6"><SoonBadge /></div>
        <h1 className="mt-3 text-4xl font-semibold">{tool.name}</h1>
        <p className="mt-3 text-lg text-muted-foreground">{tool.summary}</p>
        <section className="mt-10 rounded-xl border border-border bg-card p-6" aria-labelledby="status">
          <h2 id="status" className="text-xl font-semibold">Esta ferramenta ainda não está disponível</h2>
          <p className="mt-2 text-muted-foreground">
            Estamos preparando esta ferramenta. Quando for lançada, será gratuita, sem necessidade de conta, sem assinatura
            e sem paywall — mantida apenas por anúncios.
          </p>
        </section>
        <Link to="/" hash="ferramentas" className="mt-8 inline-block font-semibold text-primary underline-offset-4 hover:underline">
          Ver todas as ferramentas planejadas
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
