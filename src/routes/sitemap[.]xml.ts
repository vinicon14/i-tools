import { createFileRoute } from "@tanstack/react-router";
import { getRouterInstance } from "@tanstack/react-start";
import { categories, tools } from "@/lib/catalog";
import { SITE_ORIGIN } from "@/lib/seo";
import { isSitemapRouteIncluded, sitemapPathForLocation, sitemapStaticPaths, sitemapXML, type SitemapEntry } from "@/lib/sitemap";

export const Route = createFileRoute("/sitemap.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () => {
        const router = await getRouterInstance();
        const entries: SitemapEntry[] = sitemapStaticPaths(router).map((path) => ({ path }));
        if (isSitemapRouteIncluded(router.routesById["/$tool"])) {
          for (const tool of tools) {
            const location = router.buildLocation({ to: "/$tool", params: { tool: tool.slug }, search: () => ({}), hash: "" });
            const path = sitemapPathForLocation(router, location, "/$tool");
            if (path) entries.push({ path });
          }
        }
        if (isSitemapRouteIncluded(router.routesById["/categorias/$categoria"])) {
          for (const category of categories) {
            const location = router.buildLocation({ to: "/categorias/$categoria", params: { categoria: category.slug }, search: () => ({}), hash: "" });
            const path = sitemapPathForLocation(router, location, "/categorias/$categoria");
            if (path) entries.push({ path });
          }
        }
        if (entries.length === 0) return new Response("No public pages included", { status: 404 });
        return new Response(sitemapXML(SITE_ORIGIN, entries), {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
