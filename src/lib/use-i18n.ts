import { useLocation } from "@tanstack/react-router";
import { extractLangFromPath, type LanguageCode, getLanguageDir } from "./i18n";
import { getTranslations } from "./translations";

export function useI18n() {
  const location = useLocation();
  const { lang } = extractLangFromPath(location.pathname);
  const t = getTranslations(lang);
  const dir = getLanguageDir(lang);

  return { lang, t, dir };
}
