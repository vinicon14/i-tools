import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { SITE_ORIGIN } from "@/lib/seo";
import {
  collectPublicSitemapEntries,
  isSitemapRouteIncluded,
  sitemapStaticPaths,
  sitemapXML,
} from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries = collectPublicSitemapEntries({
          staticPaths: sitemapStaticPaths(router),
          includeTools: isSitemapRouteIncluded(router.routesById["/$tool"]),
          includeCategories: isSitemapRouteIncluded(router.routesById["/categorias/$categoria"]),
        });
        if (entries.length === 0) return new Response("No public pages included", { status: 404 });
        return new Response(sitemapXML(SITE_ORIGIN, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
