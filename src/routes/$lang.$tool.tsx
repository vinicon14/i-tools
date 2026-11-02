import { createFileRoute, notFound } from "@tanstack/react-router";
import { getTool } from "@/lib/catalog";
import { isValidLanguage } from "@/lib/i18n";

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
  component: () => {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md text-center">
          <p className="text-7xl font-bold text-foreground" aria-hidden="true">🚧</p>
          <h1 className="mt-4 text-xl font-semibold text-foreground">Tool page - Multilingual support coming soon</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This localized tool page will be implemented after the main infrastructure is ready.
          </p>
        </div>
      </div>
    );
  },
});
