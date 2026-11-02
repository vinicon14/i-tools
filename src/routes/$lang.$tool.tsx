import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { getTool } from "@/lib/catalog";
import { isValidLanguage, type LanguageCode } from "@/lib/i18n";
import { getTranslations } from "@/lib/translations";
import { toolHead, ToolLayout } from "@/components/site/ToolLayout";
import { VideoDownloader } from "@/components/site/VideoDownloader";
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
              to={`/${lang}`}
              className="mt-6 inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t.common.backToHome}
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }
  
  // Video downloaders
  if (toolSlug === "baixar-video-youtube") {
    return <VideoDownloader platform="youtube" />;
  }
  if (toolSlug === "baixar-video-tiktok") {
    return <VideoDownloader platform="tiktok" />;
  }
  if (toolSlug === "baixar-video-instagram") {
    return <VideoDownloader platform="instagram" />;
  }
  
  // For other tools, show a generic tool layout with coming soon message
  return (
    <ToolLayout
      slug={toolSlug}
      intro={toolTranslation.summary}
      faq={[]}
    >
      <div className="rounded-md border border-border bg-card p-8 text-center">
        <p className="text-lg text-muted-foreground">
          This tool is being localized. Please visit the{" "}
          <Link to={`/${toolSlug}`} className="text-primary hover:underline">
            Portuguese version
          </Link>{" "}
          for now.
        </p>
      </div>
    </ToolLayout>
  );
}
