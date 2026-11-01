import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { PageShell, pageMeta } from "@/components/site/Layout";
import { ToolGrid } from "@/components/site/ToolCard";
import { getCategory, toolsByCategory } from "@/lib/catalog";

export const Route = createFileRoute("/categorias/$categoria")({
  loader: ({ params }) => {
    if (!getCategory(params.categoria)) throw notFound();
    return { slug: params.categoria };
  },
  head: ({ loaderData }) => {
    const c = loaderData && getCategory(loaderData.slug);
    if (!c) return { meta: [{ title: "Categoria indisponível — i-Tools" }, { name: "robots", content: "noindex" }] };
    return pageMeta(`${c.name} — ferramentas online grátis | i-Tools`, `${c.description} Ferramentas gratuitas do i-Tools, sem cadastro.`, `/categorias/${c.slug}`);
  },
  component: CategoryPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-4xl">Categoria não encontrada</h1>
        <Link to="/" className="mt-6 inline-block font-medium underline decoration-primary underline-offset-4">Voltar para a página inicial</Link>
      </div>
    </PageShell>
  ),
});

function CategoryPage() {
  const { slug } = Route.useLoaderData();
  const c = getCategory(slug)!;
  const list = toolsByCategory(slug);
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
        <nav aria-label="Trilha de navegação" className="font-mono text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Início</Link> / Categorias
        </nav>
        <h1 className="mt-8 text-5xl sm:text-6xl">{c.name}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">{c.description}</p>
        <div className="mt-12">
          {list.length > 0 ? <ToolGrid tools={list} /> : <p className="text-muted-foreground">Ferramentas desta categoria estão sendo planejadas.</p>}
        </div>
      </section>
    </PageShell>
  );
}
