import type { AnyRoute, AnyRouter, ParsedLocation } from "@tanstack/react-router";
import { categories, tools } from "./catalog";
import { DEFAULT_LANGUAGE, getPathWithLang } from "./i18n";
import { getHtmlLang, getPageLanguages, pageUrl } from "./seo";

declare module "@tanstack/react-router" {
  interface StaticDataRouteOption {
    sitemap: boolean | "exclude-subtree";
  }
}

export const sitemapRouteInventoryVersion = 1;

type RouteMatch =
  | { routeParams: Record<string, unknown>; foundRoute?: AnyRoute; parseError?: unknown }
  | [AnyRoute[], Record<string, unknown>, AnyRoute | undefined];

export function isSitemapRouteIncluded(route: AnyRoute | undefined): boolean {
  if (!route || route.isRoot || route.options.staticData?.sitemap !== true) return false;
  for (let ancestor = route.parentRoute; ancestor; ancestor = ancestor.parentRoute) {
    if (ancestor.options.staticData?.sitemap === "exclude-subtree") return false;
  }
  return true;
}

export function sitemapStaticPaths(router: AnyRouter): string[] {
  const paths = new Set<string>();
  for (const route of Object.values(router.routesById) as AnyRoute[]) {
    if (!isSitemapRouteIncluded(route) || /[$*]/.test(route.fullPath)) continue;
    const location = router.buildLocation({ to: route.fullPath });
    const path = sitemapPathForLocation(router, location, route.id);
    if (path !== undefined) paths.add(path);
  }
  return [...paths].sort();
}

export function sitemapPathForLocation(
  router: AnyRouter,
  location: Pick<ParsedLocation, "pathname" | "publicHref">,
  routeId: string,
): string | undefined {
  if (!isSafeSitemapPath(location.pathname) || !isSafeSitemapPath(location.publicHref))
    return undefined;
  const result = router.getMatchedRoutes(location.pathname) as RouteMatch;
  const [params, foundRoute] = Array.isArray(result)
    ? [result[1], result[2]]
    : [result.routeParams, result.parseError ? undefined : result.foundRoute];
  return params["**"] === undefined &&
    foundRoute?.id === routeId &&
    isSitemapRouteIncluded(foundRoute)
    ? location.publicHref
    : undefined;
}

export interface SitemapEntry {
  path: string;
  lastmod?: string;
  alternates?: Array<{ hreflang: string; href: string }>;
}

function isSafeSitemapPath(pathname: string): boolean {
  if (!pathname.startsWith("/") || pathname.startsWith("//") || /[?#\\]/.test(pathname))
    return false;
  try {
    return decodeURI(new URL(pathname, "https://sitemap.invalid").pathname) === decodeURI(pathname);
  } catch {
    return false;
  }
}

export function sitemapEntriesForPath(basePath: string): SitemapEntry[] {
  const languages = getPageLanguages(basePath);
  const alternates = [
    ...languages.map((code) => ({
      hreflang: getHtmlLang(code),
      href: pageUrl(basePath, code),
    })),
    {
      hreflang: "x-default",
      href: pageUrl(basePath, DEFAULT_LANGUAGE),
    },
  ];
  return languages.map((lang) => ({
    path: getPathWithLang(basePath, lang),
    alternates,
  }));
}

export function collectPublicSitemapEntries(options: {
  staticPaths: string[];
  includeTools: boolean;
  includeCategories: boolean;
  blogPosts?: Array<{ path: string; lastmod?: string }>;
}): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const path of options.staticPaths) entries.push(...sitemapEntriesForPath(path));
  if (options.includeTools) {
    for (const tool of tools) entries.push(...sitemapEntriesForPath(`/${tool.slug}`));
  }
  if (options.includeCategories) {
    for (const category of categories) {
      entries.push(...sitemapEntriesForPath(`/categorias/${category.slug}`));
    }
  }
  if (options.blogPosts) {
    for (const post of options.blogPosts) {
      entries.push(post.lastmod ? { path: post.path, lastmod: post.lastmod } : { path: post.path });
    }
  }
  return entries;
}

export function sitemapXML(baseURL: string, entries: SitemapEntry[]): string {
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
  const hasAlternates = entries.some((entry) => entry.alternates?.length);
  for (const entry of entries) {
    if (!isSafeSitemapPath(entry.path)) throw new Error("Invalid sitemap path");
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
  const xmlns = hasAlternates
    ? 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"'
    : 'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"';
  return `<?xml version="1.0" encoding="UTF-8"?><urlset ${xmlns}>${urls.join("")}</urlset>`;
}
