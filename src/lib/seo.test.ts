import { describe, expect, it } from "vitest";
import { LANGUAGES } from "./i18n";
import { tools } from "./catalog";
import { translations } from "./translations";
import {
  HTML_LANG,
  OG_LOCALE,
  getHrefLangLinks,
  getHtmlLang,
  getOgLocale,
  getPageLanguages,
  getSeoLinks,
  pageUrl,
  searchActionUrlTemplate,
  websiteJsonLd,
} from "./seo";

describe("individual public tool URLs", () => {
  it("uses the requested public domain for every tool's own address", () => {
    for (const tool of tools) {
      expect(pageUrl(`/${tool.slug}`)).toBe(`https://i-tools.shop/${tool.slug}`);
    }
  });
  it("rejects other origins and fragments", () => {
    for (const path of ["//other.example/qr", "https://other.example", "/#qr", "/qr?x=1"]) {
      expect(() => pageUrl(path)).toThrow();
    }
  });
  it("preserves one self-referencing canonical with language alternates", () => {
    for (const path of ["/", "/qr", "/categorias/imagens"]) {
      expect(getSeoLinks(path).filter((link) => link.rel === "canonical")).toEqual([
        { rel: "canonical", href: `https://i-tools.shop${path}` },
      ]);
      expect(getSeoLinks(path, "en").filter((link) => link.rel === "canonical")).toEqual([
        { rel: "canonical", href: `https://i-tools.shop/en${path}` },
      ]);
    }
  });
});

describe("multilingual SEO locales", () => {
  it("covers all 18 languages with BCP 47 and Open Graph locales", () => {
    expect(LANGUAGES).toHaveLength(18);
    for (const language of LANGUAGES) {
      expect(OG_LOCALE[language.code]).toMatch(/^[a-z]{2}_[A-Z]{2}$/);
      expect(HTML_LANG[language.code]).toMatch(/^[a-z]{2}-[A-Z]{2}$/);
      expect(getOgLocale(language.code)).toBe(OG_LOCALE[language.code]);
      expect(getHtmlLang(language.code)).toBe(HTML_LANG[language.code]);
      expect(translations[language.code].site.titleTemplate).toBe("%s — i-Tools");
    }
  });

  it("emits full hreflang tags for translated homepages", () => {
    const links = getHrefLangLinks("/");
    expect(links).toContainEqual({
      rel: "alternate",
      hrefLang: "x-default",
      href: "https://i-tools.shop/",
    });
    expect(links).toContainEqual({
      rel: "alternate",
      hrefLang: "pt-BR",
      href: "https://i-tools.shop/",
    });
    expect(links).toContainEqual({
      rel: "alternate",
      hrefLang: "en-US",
      href: "https://i-tools.shop/en/",
    });
    expect(links).toContainEqual({
      rel: "alternate",
      hrefLang: "zh-CN",
      href: "https://i-tools.shop/zh/",
    });
    expect(links.filter((link) => link.rel === "alternate")).toHaveLength(19);
  });

  it("advertises QR in every language with equivalent catalog content", () => {
    const languages = LANGUAGES.map((language) => language.code);
    expect(getPageLanguages("/qr")).toEqual(languages);
    expect(getPageLanguages("/meu-cep")).toEqual(languages);
    expect(getHrefLangLinks("/qr")).toContainEqual({
      rel: "alternate",
      hrefLang: "en-US",
      href: "https://i-tools.shop/en/qr",
    });
    expect(getHrefLangLinks("/qr").filter((link) => link.rel === "alternate")).toHaveLength(19);
  });

  it("does not advertise translations for pages without equivalent content", () => {
    expect(getPageLanguages("/json")).toEqual(["pt"]);
    expect(getPageLanguages("/sobre")).toEqual(["pt"]);
    const jsonLinks = getHrefLangLinks("/json");
    expect(jsonLinks.map((link) => link.hrefLang)).toEqual(["x-default", "pt-BR"]);
  });

  it("follows catalog.localized for tool language alternates", () => {
    for (const tool of tools) {
      const expected = tool.localized ? LANGUAGES.map((language) => language.code) : ["pt"];
      expect(getPageLanguages(`/${tool.slug}`)).toEqual(expected);
    }
  });

  it("builds WebSite JSON-LD with SearchAction per language", () => {
    const pt = websiteJsonLd("pt", "i-Tools", "Ferramentas online gratuitas");
    expect(pt["@type"]).toBe("WebSite");
    expect(pt.inLanguage).toBe("pt-BR");
    expect(pt.url).toBe("https://i-tools.shop/");
    expect(pt.potentialAction.target.urlTemplate).toBe("https://i-tools.shop/?q={search_term_string}");
    expect(pt.publisher).toEqual({ "@type": "Organization", name: "i-Tools", url: "https://i-tools.shop" });

    const ja = websiteJsonLd("ja", "i-Tools", "無料オンラインツール");
    expect(ja.inLanguage).toBe("ja-JP");
    expect(searchActionUrlTemplate("ja")).toBe("https://i-tools.shop/ja/?q={search_term_string}");
  });
});
