import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { AdSlot, PageShell, pageMeta } from "@/components/site/Layout";
import { StatusBadge } from "@/components/site/StatusBadge";
import { ToolGrid } from "@/components/site/ToolCard";
import { getCategory, getTool, toolsByCategory } from "@/lib/catalog";
import { isToolEnabled } from "@/lib/tool-middleware.functions";

export const Route = createFileRoute("/$tool")({
  staticData: { sitemap: true },
  loader: async ({ params }) => {
    const tool = getTool(params.tool);
    if (!tool) throw notFound();
    
    // Check if tool is enabled (admin can disable tools)
    const enabled = await isToolEnabled(params.tool);
    if (!enabled) throw notFound();
    
    return { slug: tool.slug };
  },
  head: ({ loaderData }) => {
    const tool = loaderData && getTool(loaderData.slug);
    if (!tool)
      return {
        meta: [{ title: "Página indisponível — i-Tools" }, { name: "robots", content: "noindex" }],
      };
    return pageMeta(
      `${tool.name} grátis online (em breve) — i-Tools`,
      `${tool.summary} Em preparação no i-Tools: gratuito, sem cadastro e direto no navegador.`,
      `/${tool.slug}`,
      "website",
    );
  },
  component: ToolPage,
  notFoundComponent: () => (
    <PageShell>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="text-4xl font-bold">Ferramenta não encontrada</p>
        <Link
          to="/"
          className="mt-6 inline-block font-medium underline decoration-primary underline-offset-4"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </PageShell>
  ),
});

function ToolPage() {
  const { slug } = Route.useLoaderData();
  const tool = getTool(slug);
  if (!tool) return null;
  const category = getCategory(tool.category);
  if (!category) return null;
  const Icon = tool.icon;
  const related = toolsByCategory(category.slug).filter((t) => t.slug !== slug);

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-20">
        <nav aria-label="Trilha de navegação" className="font-mono text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            Início
          </Link>{" "}
          /{" "}
          <Link
            to="/categorias/$categoria"
            params={{ categoria: category.slug }}
            className="hover:text-foreground"
          >
            {category.name}
          </Link>
        </nav>
        <div className="mt-10 flex items-center gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-md border border-border bg-card">
            <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
          </span>
          <StatusBadge status={tool.status} />
        </div>
        <h1 className="mt-6 max-w-3xl text-5xl leading-tight sm:text-6xl">{tool.name}</h1>
        <p className="mt-4 max-w-xl text-lg text-muted-foreground">{tool.summary}</p>

        <div className="mt-12 max-w-2xl rounded-md border border-border bg-card p-6">
          <h2 className="font-sans text-lg font-semibold">
            Esta ferramenta ainda não está disponível
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Estamos preparando o {tool.name} neste mesmo endereço. Quando for lançado, será
            gratuito, sem cadastro e funcionará direto no navegador.
          </p>
        </div>
        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden /> Ver todas as ferramentas do i-Tools
        </Link>
      </section>
      <AdSlot />
      {related.length > 0 && (
        <section aria-labelledby="relacionadas" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 id="relacionadas" className="mb-8 text-3xl">
            Também em {category.name}
          </h2>
          <ToolGrid tools={related} />
        </section>
      )}
    </PageShell>
  );
}
