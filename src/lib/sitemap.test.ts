import { describe, expect, it } from "vitest";
import { getPageLanguages, SITE_ORIGIN } from "./seo";
import { collectPublicSitemapEntries, sitemapXML } from "./sitemap";
import { tools } from "./catalog";
import { getPathWithLang, LANGUAGES } from "./i18n";

describe("public tool sitemap", () => {
  it("includes every catalog tool exactly once", () => {
    const xml = sitemapXML(
      SITE_ORIGIN,
      tools.flatMap((tool) => [{ path: `/${tool.slug}` }, { path: `/${tool.slug}` }]),
    );
    expect(xml.match(/<loc>/g)).toHaveLength(15);
    for (const tool of tools) expect(xml).toContain(`<loc>${SITE_ORIGIN}/${tool.slug}</loc>`);
  });
  it("does not invent modification dates", () => {
    expect(sitemapXML(SITE_ORIGIN, [{ path: "/qr" }])).not.toContain("lastmod");
  });
  it("rejects external URL entries", () => {
    expect(() => sitemapXML(SITE_ORIGIN, [{ path: "//other.example/qr" }])).toThrow();
  });
  it("lists localized tools in every language getPageLanguages advertises", () => {
    const xml = sitemapXML(
      SITE_ORIGIN,
      collectPublicSitemapEntries({
        staticPaths: ["/qr", "/json", "/sobre"],
        includeTools: true,
        includeCategories: false,
      }),
    );
    for (const language of LANGUAGES) {
      expect(xml).toContain(`<loc>${SITE_ORIGIN}${getPathWithLang("/qr", language.code)}</loc>`);
      expect(xml).toContain(
        `<loc>${SITE_ORIGIN}${getPathWithLang("/meu-cep", language.code)}</loc>`,
      );
    }
    expect(getPageLanguages("/qr")).toHaveLength(18);
    expect(xml).toContain(`<loc>${SITE_ORIGIN}/en/qr</loc>`);
    expect(xml).toContain(`<xhtml:link rel="alternate" hreflang="en-US" href="${SITE_ORIGIN}/en/qr" />`);
    expect(xml).not.toContain(`<loc>${SITE_ORIGIN}/en/json</loc>`);
    expect(xml).not.toContain(`<loc>${SITE_ORIGIN}/en/sobre</loc>`);
  });
});
