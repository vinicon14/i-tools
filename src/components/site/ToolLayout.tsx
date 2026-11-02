import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { pageUrl, getHrefLangLinks } from "@/lib/seo";
import { getCategory, getTool, SITE, toolsByCategory } from "@/lib/catalog";
import { AdSlot, PageShell, pageMeta } from "./Layout";
import { StatusBadge } from "./StatusBadge";
import { ToolGrid } from "./ToolCard";
import { categoryAppearance } from "./tool-appearance";
import { type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";

export type Faq = { q: string; a: string };

/** Head for a live tool page: metadata + WebApplication structured data. */
export function toolHead(slug: string, title: string, description: string, faq?: Faq[], lang?: LanguageCode) {
  const tool = getTool(slug);
  if (!tool) throw new Error(`Unknown tool: ${slug}`);
  const category = getCategory(tool.category);
  const t = lang ? getTranslations(lang) : getTranslations("pt");
  const path = `/${slug}`;
  const fullUrl = pageUrl(path, lang);
  
  const categoryTranslation = category ? t.categories[category.slug as keyof typeof t.categories] : undefined;
  const categoryName = categoryTranslation?.name || category?.name;
  const toolTranslation = t.tools[slug as keyof typeof t.tools];
  const toolName = toolTranslation?.name || tool.name;
  
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.nav.home, item: pageUrl("/", lang) },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: categoryName,
              item: pageUrl(`/categorias/${category.slug}`, lang),
            },
          ]
        : []),
      { "@type": "ListItem", position: category ? 3 : 2, name: toolName, item: fullUrl },
    ],
  };
  const faqSchema = faq && faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  } : null;
  
  const hrefLangLinks = getHrefLangLinks(path);
  
  return {
    ...pageMeta(title, description, path, "website", lang),
    links: hrefLangLinks,
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: toolName,
          url: fullUrl,
          description,
          applicationCategory: "UtilitiesApplication",
          operatingSystem: "Any",
          inLanguage: lang === "pt" ? "pt-BR" : lang || "pt-BR",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
          publisher: { "@type": "Organization", name: SITE.name },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbs),
      },
      ...(faqSchema ? [{
        type: "application/ld+json",
        children: JSON.stringify(faqSchema),
      }] : []),
    ],
  };
}

export function ToolLayout({
  slug,
  intro,
  children,
  faq,
  lang,
  toolName,
  categoryName,
  translations,
}: {
  slug: string;
  intro: string;
  children: ReactNode;
  faq: Faq[];
  lang?: string;
  toolName?: string;
  categoryName?: string;
  translations?: {
    home: string;
    faq: string;
    alsoIn: string;
  };
}) {
  const tool = getTool(slug);
  if (!tool) return null;
  const category = getCategory(tool.category);
  if (!category) return null;
  const Icon = tool.icon;
  const related = toolsByCategory(category.slug).filter((t) => t.slug !== slug);
  
  const t = translations || {
    home: "Início",
    faq: "Perguntas frequentes",
    alsoIn: "Também em",
  };
  
  const displayToolName = toolName || tool.name;
  const displayCategoryName = categoryName || category.name;
  
  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 md:pt-12">
        <nav aria-label={lang === "pt" || !lang ? "Trilha de navegação" : "Breadcrumb"} className="font-mono text-xs text-muted-foreground">
          <Link to={lang && lang !== "pt" ? `/${lang}` : "/"} className="hover:text-foreground">
            {t.home}
          </Link>{" "}
          /{" "}
          <Link
            to={lang && lang !== "pt" ? `/${lang}/categorias/${category.slug}` : `/categorias/${category.slug}`}
            className="hover:text-foreground"
          >
            {displayCategoryName}
          </Link>
        </nav>
        <div className="mt-8 flex items-center gap-3 animate-fade-in-up">
          <span className={`grid h-12 w-12 place-items-center rounded-lg ${categoryAppearance[tool.category] ?? "bg-muted text-foreground"}`}>
            <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
          </span>
          <StatusBadge status={tool.status} />
        </div>
        <h1 className="mt-5 text-4xl leading-tight sm:text-5xl animate-fade-in-up">{displayToolName}</h1>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">{intro}</p>
        <div className="mt-8 animate-fade-in-up">{children}</div>
      </section>
      <div className="mt-16">
        <AdSlot />
      </div>
      <section data-reveal aria-labelledby="faq" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 id="faq" className="text-3xl">
          {t.faq}
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
            {t.alsoIn} {displayCategoryName}
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
