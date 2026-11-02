import { useNavigate, useLocation } from "@tanstack/react-router";
import { Languages } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, extractLangFromPath, getPathWithLang, type LanguageCode } from "@/lib/i18n";

export function LanguageSwitcher() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, cleanPath } = extractLangFromPath(location.pathname);

  const handleLanguageChange = (newLang: string) => {
    const newPath = getPathWithLang(cleanPath, newLang as LanguageCode);
    navigate({ to: newPath });
  };

  return (
    <Select value={lang} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px] h-10 text-sm bg-background border-border">
        <Languages className="h-4 w-4 mr-2" aria-hidden />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((language) => (
          <SelectItem key={language.code} value={language.code}>
            {language.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
