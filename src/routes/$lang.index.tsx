import { createFileRoute, notFound } from "@tanstack/react-router";
import { isValidLanguage, type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { tools, categories, featuredTools } from "@/lib/catalog";
import { PageShell, pageMeta } from "@/components/site/Layout";
import { ToolGrid } from "@/components/site/ToolCard";
import { Link } from "@tanstack/react-router";
import { getHrefLangLinks } from "@/lib/seo";

export const Route = createFileRoute("/$lang/")({
  staticData: { sitemap: true },
  beforeLoad: ({ params }) => {
    if (!isValidLanguage(params.lang) || params.lang === "pt") {
      throw notFound();
    }
  },
  head: ({ params }) => {
    const lang = params.lang as LanguageCode;
    const t = getTranslations(lang);
    const hrefLangLinks = getHrefLangLinks("/");
    
    return {
      ...pageMeta(
        `${t.site.name} — ${t.site.tagline}`,
        t.site.description,
        "/",
        "website",
        lang,
      ),
      links: hrefLangLinks,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: t.site.name,
            description: t.site.description,
            inLanguage: lang === "pt" ? "pt-BR" : lang,
          }),
        },
      ],
    };
  },
  component: LocalizedHomePage,
});

function LocalizedHomePage() {
  const { lang } = Route.useParams();
  const t = getTranslations(lang as LanguageCode);
  const featured = featuredTools();

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-24">
        <h1 className="text-center text-5xl leading-tight sm:text-6xl md:text-7xl">
          {t.site.tagline}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg text-muted-foreground sm:text-xl">
          {t.site.description}
        </p>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
          <h2 className="mb-8 text-3xl">Featured Tools</h2>
          <ToolGrid tools={featured} />
        </section>
      )}

      <section data-reveal className="mx-auto mt-20 max-w-6xl px-4 pb-20 sm:px-6">
        <h2 className="mb-8 text-3xl">{t.nav.categories}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const Icon = category.icon;
            const categoryTranslation = t.categories[category.slug as keyof typeof t.categories];
            return (
              <Link
                key={category.slug}
                to="/$lang/categorias/$categoria"
                params={{ lang, categoria: category.slug }}
                className="group rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground"
              >
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-lg bg-muted">
                  <Icon className="h-6 w-6" strokeWidth={1.5} aria-hidden />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary">
                  {categoryTranslation.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {categoryTranslation.description}
                </p>
              </Link>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}
