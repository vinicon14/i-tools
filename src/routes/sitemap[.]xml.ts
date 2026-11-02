import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { categories, tools } from "@/lib/catalog";
import { SITE_ORIGIN, pageUrl } from "@/lib/seo";
import { LANGUAGES, type LanguageCode } from "@/lib/i18n";
import {
  isSitemapRouteIncluded,
  sitemapPathForLocation,
  sitemapStaticPaths,
  type SitemapEntry,
} from "@/lib/sitemap";

interface SitemapEntryWithAlternates extends SitemapEntry {
  alternates?: Array<{ hreflang: string; href: string }>;
}

function generateSitemapXML(baseURL: string, entries: SitemapEntryWithAlternates[]): string {
  const origin = new URL(baseURL);
  if (
    !/^https?:$/.test(origin.protocol) ||
    origin.username ||
    origin.password ||
    origin.pathname !== "/" ||
    origin.search ||
    origin.hash
  ) {
    throw new Error("The sitemap base URL must be the public site origin");
  }
  
  const entities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;",
  };
  
  const escape = (value: string) =>
    value.replace(/[&<>"']/g, (character) => entities[character] ?? character);
  
  const seen = new Set<string>();
  const urls: string[] = [];
  
  for (const entry of entries) {
    const url = new URL(entry.path, origin);
    if (seen.has(url.href)) continue;
    seen.add(url.href);
    
    const alternatesXml = entry.alternates
      ? entry.alternates
          .map(
            (alt) =>
              `<xhtml:link rel="alternate" hreflang="${escape(alt.hreflang)}" href="${escape(alt.href)}" />`,
          )
          .join("")
      : "";
    
    urls.push(
      `<url><loc>${escape(url.href)}</loc>${entry.lastmod ? `<lastmod>${escape(entry.lastmod)}</lastmod>` : ""}${alternatesXml}</url>`,
    );
  }
  
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls.join("")}</urlset>`;
}

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const baseEntries: string[] = sitemapStaticPaths(router);
        const entries: SitemapEntryWithAlternates[] = [];
        
        // Add static pages for all languages
        for (const basePath of baseEntries) {
          for (const lang of LANGUAGES) {
            const localizedPath = lang.code === "pt" ? basePath : `/${lang.code}${basePath}`;
            const alternates = LANGUAGES.map((l) => ({
              hreflang: l.code === "pt" ? "pt-BR" : l.code,
              href: pageUrl(basePath, l.code),
            }));
            alternates.push({
              hreflang: "x-default",
              href: pageUrl(basePath, "pt"),
            });
            entries.push({ path: localizedPath, alternates });
          }
        }
        
        // Add tool pages for all languages
        if (isSitemapRouteIncluded(router.routesById["/$tool"])) {
          for (const tool of tools) {
            const basePath = `/${tool.slug}`;
            for (const lang of LANGUAGES) {
              const localizedPath = lang.code === "pt" ? basePath : `/${lang.code}${basePath}`;
              const alternates = LANGUAGES.map((l) => ({
                hreflang: l.code === "pt" ? "pt-BR" : l.code,
                href: pageUrl(basePath, l.code),
              }));
              alternates.push({
                hreflang: "x-default",
                href: pageUrl(basePath, "pt"),
              });
              entries.push({ path: localizedPath, alternates });
            }
          }
        }
        
        // Add category pages for all languages
        if (isSitemapRouteIncluded(router.routesById["/categorias/$categoria"])) {
          for (const category of categories) {
            const basePath = `/categorias/${category.slug}`;
            for (const lang of LANGUAGES) {
              const localizedPath = lang.code === "pt" ? basePath : `/${lang.code}${basePath}`;
              const alternates = LANGUAGES.map((l) => ({
                hreflang: l.code === "pt" ? "pt-BR" : l.code,
                href: pageUrl(basePath, l.code),
              }));
              alternates.push({
                hreflang: "x-default",
                href: pageUrl(basePath, "pt"),
              });
              entries.push({ path: localizedPath, alternates });
            }
          }
        }
        
        if (entries.length === 0) return new Response("No public pages included", { status: 404 });
        return new Response(generateSitemapXML(SITE_ORIGIN, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
