import { LANGUAGES, DEFAULT_LANGUAGE, getPathWithLang, type LanguageCode } from "./i18n";
import { getCategory, getTool } from "./catalog";

export const SITE_ORIGIN = "https://i-tools.shop";

/** Open Graph locales (underscore) for all 18 supported languages. */
export const OG_LOCALE: Record<LanguageCode, string> = {
  pt: "pt_BR",
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  de: "de_DE",
  it: "it_IT",
  nl: "nl_NL",
  pl: "pl_PL",
  ru: "ru_RU",
  uk: "uk_UA",
  tr: "tr_TR",
  ar: "ar_AR",
  hi: "hi_IN",
  id: "id_ID",
  ja: "ja_JP",
  ko: "ko_KR",
  zh: "zh_CN",
  vi: "vi_VN",
};

/** BCP 47 tags for html[lang], hreflang and JSON-LD inLanguage. */
export const HTML_LANG: Record<LanguageCode, string> = {
  pt: "pt-BR",
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  it: "it-IT",
  nl: "nl-NL",
  pl: "pl-PL",
  ru: "ru-RU",
  uk: "uk-UA",
  tr: "tr-TR",
  ar: "ar-AR",
  hi: "hi-IN",
  id: "id-ID",
  ja: "ja-JP",
  ko: "ko-KR",
  zh: "zh-CN",
  vi: "vi-VN",
};

export function getOgLocale(lang: LanguageCode): string {
  return OG_LOCALE[lang];
}

export function getHtmlLang(lang: LanguageCode): string {
  return HTML_LANG[lang];
}

export function getOgLocaleAlternates(path: string, lang: LanguageCode): string[] {
  return getPageLanguages(path)
    .filter((code) => code !== lang)
    .map((code) => OG_LOCALE[code]);
}

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

  links.push({
    rel: "alternate",
    hrefLang: "x-default",
    href: pageUrl(path, DEFAULT_LANGUAGE),
  });

  for (const language of LANGUAGES.filter(language => getPageLanguages(path).includes(language.code))) {
    links.push({
      rel: "alternate",
      hrefLang: getHtmlLang(language.code),
      href: pageUrl(path, language.code),
    });
  }

  return links;
}

/** Preserve canonical identity when a leaf adds language alternates. */
export function getSeoLinks(path: string, lang: LanguageCode = DEFAULT_LANGUAGE) {
  return [{ rel: "canonical", href: pageUrl(path, lang) }, ...getHrefLangLinks(path)];
}

export function searchActionUrlTemplate(lang: LanguageCode = DEFAULT_LANGUAGE): string {
  const home = pageUrl("/", lang);
  const base = home.endsWith("/") ? home : `${home}/`;
  return `${base}?q={search_term_string}`;
}

/** WebSite + SearchAction for homepages. Does not invent ratings or review counts. */
export function websiteJsonLd(lang: LanguageCode, name: string, description: string) {
  const url = pageUrl("/", lang);
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    description,
    inLanguage: getHtmlLang(lang),
    publisher: {
      "@type": "Organization",
      name: "i-Tools",
      url: SITE_ORIGIN,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: searchActionUrlTemplate(lang),
      },
      "query-input": "required name=search_term_string",
    },
  };
}
