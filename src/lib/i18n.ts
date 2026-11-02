export const LANGUAGES = [
  { code: "pt", name: "Português", dir: "ltr" },
  { code: "en", name: "English", dir: "ltr" },
  { code: "es", name: "Español", dir: "ltr" },
  { code: "fr", name: "Français", dir: "ltr" },
  { code: "de", name: "Deutsch", dir: "ltr" },
  { code: "it", name: "Italiano", dir: "ltr" },
  { code: "nl", name: "Nederlands", dir: "ltr" },
  { code: "pl", name: "Polski", dir: "ltr" },
  { code: "ru", name: "Русский", dir: "ltr" },
  { code: "uk", name: "Українська", dir: "ltr" },
  { code: "tr", name: "Türkçe", dir: "ltr" },
  { code: "ar", name: "العربية", dir: "rtl" },
  { code: "hi", name: "हिन्दी", dir: "ltr" },
  { code: "id", name: "Bahasa Indonesia", dir: "ltr" },
  { code: "ja", name: "日本語", dir: "ltr" },
  { code: "ko", name: "한국어", dir: "ltr" },
  { code: "zh", name: "简体中文", dir: "ltr" },
  { code: "vi", name: "Tiếng Việt", dir: "ltr" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "pt";

export function getLanguage(code: string | undefined): (typeof LANGUAGES)[number] {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang ?? LANGUAGES[0];
}

export function getLanguageDir(code: LanguageCode): "ltr" | "rtl" {
  return getLanguage(code).dir;
}

export function isValidLanguage(code: string): code is LanguageCode {
  return LANGUAGES.some((l) => l.code === code);
}

export function getPathWithLang(path: string, lang: LanguageCode): string {
  if (lang === DEFAULT_LANGUAGE) return path;
  return `/${lang}${path}`;
}

export function extractLangFromPath(path: string): { lang: LanguageCode; cleanPath: string } {
  const match = path.match(/^\/([a-z]{2})(\/.*)?$/);
  if (match && isValidLanguage(match[1])) {
    return { lang: match[1], cleanPath: match[2] || "/" };
  }
  return { lang: DEFAULT_LANGUAGE, cleanPath: path };
}
