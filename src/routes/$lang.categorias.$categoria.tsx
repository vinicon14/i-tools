import { createFileRoute, notFound } from "@tanstack/react-router";
import { isValidLanguage, type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { getCategory, toolsByCategory } from "@/lib/catalog";
import { PageShell, pageMeta } from "@/components/site/Layout";
import { ToolGrid } from "@/components/site/ToolCard";
import { getSeoLinks } from "@/lib/seo";

export const Route = createFileRoute("/$lang/categorias/$categoria")({
  staticData: { sitemap: true },
  beforeLoad: ({ params }) => {
    if (!isValidLanguage(params.lang) || params.lang === "pt") {
      throw notFound();
    }
    const category = getCategory(params.categoria);
    if (!category) {
      throw notFound();
    }
  },
  head: ({ params }) => {
    const lang = params.lang as LanguageCode;
    const t = getTranslations(lang);
    const category = getCategory(params.categoria);
    if (!category) throw notFound();
    
    const categoryTranslation = t.categories[category.slug as keyof typeof t.categories];
    const path = `/categorias/${params.categoria}`;
    const hrefLangLinks = getSeoLinks(path, lang);
    
    return {
      ...pageMeta(
        `${categoryTranslation.name} — ${t.site.name}`,
        categoryTranslation.description,
        path,
        "website",
        lang,
      ),
      links: hrefLangLinks,
    };
  },
  component: LocalizedCategoryPage,
});

function LocalizedCategoryPage() {
  const { lang, categoria } = Route.useParams();
  const t = getTranslations(lang as LanguageCode);
  const category = getCategory(categoria);
  
  if (!category) {
    throw notFound();
  }
  
  const tools = toolsByCategory(categoria);
  const categoryTranslation = t.categories[category.slug as keyof typeof t.categories];
  const Icon = category.icon;

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6">
        <div className="mb-6 grid h-16 w-16 place-items-center rounded-xl bg-muted">
          <Icon className="h-8 w-8" strokeWidth={1.5} aria-hidden />
        </div>
        <h1 className="text-4xl sm:text-5xl">{categoryTranslation.name}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          {categoryTranslation.description}
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-6xl px-4 pb-20 sm:px-6">
        <ToolGrid tools={tools} />
      </section>
    </PageShell>
  );
}
