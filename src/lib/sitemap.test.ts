import { describe, expect, it } from "vitest";
import { SITE_ORIGIN } from "./seo";
import { sitemapXML } from "./sitemap";
import { tools } from "./catalog";

describe("public tool sitemap", () => {
  it("includes every catalog tool exactly once", () => {
    const xml = sitemapXML(SITE_ORIGIN, tools.flatMap((tool) => [{ path: `/${tool.slug}` }, { path: `/${tool.slug}` }]));
    expect(xml.match(/<loc>/g)).toHaveLength(15);
    for (const tool of tools) expect(xml).toContain(`<loc>${SITE_ORIGIN}/${tool.slug}</loc>`);
  });
  it("does not invent modification dates", () => {
    expect(sitemapXML(SITE_ORIGIN, [{ path: "/qr" }])).not.toContain("lastmod");
  });
  it("rejects external URL entries", () => {
    expect(() => sitemapXML(SITE_ORIGIN, [{ path: "//other.example/qr" }])).toThrow();
  });
});
