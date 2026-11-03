import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getTool, getCategory } from "@/lib/catalog";
import { isValidLanguage, type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { toolHead, ToolLayout } from "@/components/site/ToolLayout";
import { LocalizedVideoDownloader } from "@/components/site/LocalizedVideoDownloader";
import { PageShell } from "@/components/site/Layout";

export const Route = createFileRoute("/$lang/$tool")({
  staticData: { sitemap: true },
  beforeLoad: ({ params }) => {
    if (!isValidLanguage(params.lang) || params.lang === "pt") {
      throw notFound();
    }
    const tool = getTool(params.tool);
    if (!tool) {
      throw notFound();
    }
  },
  head: ({ params }) => {
    const lang = params.lang as LanguageCode;
    const t = getTranslations(lang);
    const tool = getTool(params.tool);
    if (!tool) throw notFound();
    
    const toolTranslation = t.tools[params.tool as keyof typeof t.tools];
    if (!toolTranslation) throw notFound();
    
    return toolHead(
      params.tool,
      `${toolTranslation.name} — i-Tools`,
      toolTranslation.summary,
      [],
      lang,
    );
  },
  component: LocalizedToolPage,
});

function LocalizedToolPage() {
  const { tool: toolSlug, lang } = Route.useParams();
  const t = getTranslations(lang as LanguageCode);
  const tool = getTool(toolSlug);
  
  if (!tool) {
    throw notFound();
  }
  
  const toolTranslation = t.tools[toolSlug as keyof typeof t.tools];
  
  if (!toolTranslation) {
    return (
      <PageShell>
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <h1 className="mt-4 text-xl font-semibold text-foreground">{t.common.notFound}</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {t.common.notFoundDescription}
            </p>
            <Link
              to="/$lang"
              params={{ lang }}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t.common.backToHome}
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }
  
  const category = getTool(toolSlug)?.category;
  const categoryTranslation = category ? t.categories[category as keyof typeof t.categories] : undefined;
  
  // Video downloaders
  if (toolSlug === "baixar-video-youtube" || toolSlug === "baixar-video-tiktok" || toolSlug === "baixar-video-instagram") {
    const platform = toolSlug === "baixar-video-youtube" ? "youtube" : toolSlug === "baixar-video-tiktok" ? "tiktok" : "instagram";
    return <LocalizedVideoDownloader platform={platform} lang={lang as LanguageCode} />;
  }
  
  // For all other tools, show the actual tool interface
  // Import the tool's component dynamically
  return (
    <ToolLayout
      slug={toolSlug}
      intro={toolTranslation.summary}
      faq={[]}
      lang={lang}
      toolName={toolTranslation.name}
      categoryName={categoryTranslation?.name}
      translations={{
        home: t.nav.home,
        faq: t.common.faq,
        alsoIn: t.common.alsoIn,
      }}
    >
      <div className="rounded-md border border-border bg-card p-8 text-center">
        <p className="text-lg font-semibold text-foreground mb-2">
          {toolTranslation.name}
        </p>
        <p className="text-sm text-muted-foreground">
          {toolTranslation.summary}
        </p>
        <div className="mt-6">
          <Link 
            to="/$tool"
            params={{ tool: toolSlug }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t.nav.home} (Português)
          </Link>
        </div>
      </div>
    </ToolLayout>
  );
}
