import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { pageUrl } from "@/lib/seo";
import { getCategory, getTool, SITE, toolsByCategory } from "@/lib/catalog";
import { AdSlot, PageShell, pageMeta } from "./Layout";
import { StatusBadge } from "./StatusBadge";
import { ToolGrid } from "./ToolCard";
import { categoryAppearance } from "./tool-appearance";

export type Faq = { q: string; a: string };

/** Head for a live tool page: metadata + WebApplication structured data. */
export function toolHead(slug: string, title: string, description: string) {
  const tool = getTool(slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  return {
    ...pageMeta(title, description, `/${slug}`, "website"),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.name,
          url: pageUrl(`/${slug}`),
          description,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          inLanguage: "pt-BR",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
          publisher: { "@type": "Organization", name: SITE.name },
        }),
      },
    ],
  };
}

export function ToolLayout({
  slug,
  intro,
  children,
  faq,
}: {
  slug: string;
  intro: string;
  children: ReactNode;
  faq: Faq[];
}) {
  const tool = getTool(slug);
  if (!tool) return null;
  const category = getCategory(tool.category);
  if (!category) return null;
  const Icon = tool.icon;
  const related = toolsByCategory(category.slug).filter((t) => t.slug !== slug);
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-12">
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
        <div className="mt-8 flex items-center gap-3 animate-fade-in-up">
          <span className={`grid h-12 w-12 place-items-center rounded-lg ${categoryAppearance[tool.category] ?? "bg-muted text-foreground"}`}>
            <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </span>
          <StatusBadge status={tool.status} />
        </div>
        <h1 className="mt-5 text-4xl leading-tight sm:text-5xl animate-fade-in-up">{tool.name}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>
        <div className="mt-8 animate-fade-in-up">{children}</div>
      </section>
      <div className="mt-16">
        <AdSlot />
      </div>
      <section data-reveal aria-labelledby="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 id="faq" className="text-3xl">
          Perguntas frequentes
        </h2>
        <dl className="mt-8 divide-y divide-border border-y border-border">
          {faq.map((f) => (
            <div key={f.q} className="py-5">
              <dt className="font-semibold">{f.q}</dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>
      {related.length > 0 && (
        <section data-reveal aria-labelledby="relacionadas" className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <h2 id="relacionadas" className="mb-8 text-3xl">
            Também em {category.name}
          </h2>
          <ToolGrid tools={related} />
        </section>
      )}
    </PageShell>
  );
}

export const panel = "rounded-md border border-border bg-card p-5 sm:p-8";
export const btnPrimary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50";
export const btnSecondary =
  "inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-background px-5 text-sm font-medium transition-colors hover:border-foreground disabled:opacity-50";
