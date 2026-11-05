import { LANGUAGES, DEFAULT_LANGUAGE, getPathWithLang, type LanguageCode } from "./i18n";
import { getCategory, getTool } from "./catalog";

export const SITE_ORIGIN = "https://i-tools.shop";

/** Advertise translations only where the page offers equivalent, usable content. */
export function getPageLanguages(path: string): LanguageCode[] {
  const slug = path.slice(1);
  const localizedTool = ["meu-cep", "baixar-video-youtube", "baixar-video-tiktok", "baixar-video-instagram"].includes(slug);
  const localizedCategory = path.startsWith("/categorias/") && Boolean(getCategory(path.slice(12)));
  return path === "/" || localizedCategory || (getTool(slug) && localizedTool)
    ? LANGUAGES.map(language => language.code)
    : [DEFAULT_LANGUAGE];
}

/** Always identify the current public page, never a preview or another origin. */
export function pageUrl(path: string, lang?: LanguageCode): string {
  if (!path.startsWith("/") || path.startsWith("//") || /[?#\\]/.test(path)) {
    throw new Error("Expected a public page path");
  }
  const finalPath = lang ? getPathWithLang(path, lang) : path;
  return new URL(finalPath, SITE_ORIGIN).href;
}

export function getHrefLangLinks(path: string): Array<{ rel: string; hrefLang: string; href: string }> {
  const links: Array<{ rel: string; hrefLang: string; href: string }> = [];
  
  // Add x-default (pointing to default language - Portuguese at root)
  links.push({
    rel: "alternate",
    hrefLang: "x-default",
    href: pageUrl(path, DEFAULT_LANGUAGE),
  });
  
  // Add all languages
  for (const language of LANGUAGES.filter(language => getPageLanguages(path).includes(language.code))) {
    links.push({
      rel: "alternate",
      hrefLang: language.code === "pt" ? "pt-BR" : language.code,
      href: pageUrl(path, language.code),
    });
  }
  
  return links;
}

/** Preserve canonical identity when a leaf adds language alternates. */
export function getSeoLinks(path: string, lang: LanguageCode = DEFAULT_LANGUAGE) {
  return [{ rel: 'canonical', href: pageUrl(path, lang) }, ...getHrefLangLinks(path)];
}
