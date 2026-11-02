import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/catalog";
import { Logo } from "./Logo";
import { useI18n } from "@/lib/use-i18n";

export function SiteFooter() {
  const { t } = useI18n();
  
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div data-reveal className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div className="col-span-2 md:col-span-1">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {t.site.description}
          </p>
        </div>
        <nav aria-label={t.nav.categories}>
          <h2 className="eyebrow">{t.nav.categories}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => {
              const categoryTranslation = t.categories[c.slug as keyof typeof t.categories];
              const categoryName = categoryTranslation?.name || c.name;
              return (
                <li key={c.slug}>
                  <Link
                    to={t.lang === "pt" ? "/categorias/$categoria" : "/$lang/categorias/$categoria"}
                    params={t.lang === "pt" ? { categoria: c.slug } : { lang: t.lang, categoria: c.slug }}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {categoryName}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <nav aria-label="Institucional">
          <h2 className="eyebrow">i-Tools</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to={t.lang === "pt" ? "/sobre" : `/${t.lang}/sobre`} className="text-muted-foreground hover:text-foreground">
                {t.nav.about}
              </Link>
            </li>
            <li>
              <Link to={t.lang === "pt" ? "/contato" : `/${t.lang}/contato`} className="text-muted-foreground hover:text-foreground">
                {t.nav.contact}
              </Link>
            </li>
            <li>
              <Link to={t.lang === "pt" ? "/privacidade" : `/${t.lang}/privacidade`} className="text-muted-foreground hover:text-foreground">
                {t.nav.privacy}
              </Link>
            </li>
            <li>
              <Link to={t.lang === "pt" ? "/termos" : `/${t.lang}/termos`} className="text-muted-foreground hover:text-foreground">
                {t.nav.terms}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-5 font-mono text-xs text-muted-foreground sm:px-6">
          © 2026 i-Tools.
        </p>
      </div>
    </footer>
  );
}
