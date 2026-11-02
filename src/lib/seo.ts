import { LANGUAGES, DEFAULT_LANGUAGE, getPathWithLang, type LanguageCode } from "./i18n";

export const SITE_ORIGIN = "https://i-tools.shop";

/** Always identify the current public page, never a preview or another origin. */
export function pageUrl(path: string, lang?: LanguageCode): string {
  if (!path.startsWith("/") || path.startsWith("//") || /[?#\\]/.test(path)) {
    throw new Error("Expected a public page path");
  }
  const finalPath = lang ? getPathWithLang(path, lang) : path;
  return new URL(finalPath, SITE_ORIGIN).href;
}

export function getHrefLangLinks(path: string): Array<{ rel: string; hreflang: string; href: string }> {
  const links: Array<{ rel: string; hreflang: string; href: string }> = [];
  
  // Add x-default (pointing to default language - Portuguese at root)
  links.push({
    rel: "alternate",
    hreflang: "x-default",
    href: pageUrl(path, DEFAULT_LANGUAGE),
  });
  
  // Add all languages
  for (const language of LANGUAGES) {
    links.push({
      rel: "alternate",
      hreflang: language.code === "pt" ? "pt-BR" : language.code,
      href: pageUrl(path, language.code),
    });
  }
  
  return links;
}
