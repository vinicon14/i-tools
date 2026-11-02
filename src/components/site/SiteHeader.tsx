import { Link } from "@tanstack/react-router";
import { Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/catalog";
import { SearchPanel } from "./SearchPanel";
import { Logo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useI18n } from "@/lib/use-i18n";

export function SiteHeader() {
  const { t } = useI18n();
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea, [contenteditable]");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur-sm">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
      >
        {t.nav.skipToContent}
      </a>
      <div className="mx-auto flex h-[72px] max-w-6xl items-center gap-8 px-4 sm:px-6">
        <Logo />
        <nav aria-label={t.nav.categories} className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {categories.map((c) => {
              const categoryTranslation = t.categories[c.slug as keyof typeof t.categories];
              const categoryName = categoryTranslation?.name || c.name;
              return (
                <li key={c.slug}>
                  <Link
                    to={t.lang === "pt" ? "/categorias/$categoria" : "/$lang/categorias/$categoria"}
                    params={t.lang === "pt" ? { categoria: c.slug } : { lang: t.lang, categoria: c.slug }}
                    className="rounded-md px-2 py-2 text-[13px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    activeProps={{ className: "text-foreground" }}
                  >
                    {categoryName.split(" ")[0]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            variant="ghost"
            type="button"
            onClick={() => setSearchOpen(true)}
            className="h-10 gap-2 px-3 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label={t.nav.search}
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">{t.nav.search}</span>
            <kbd className="hidden rounded border border-border px-1.5 font-mono text-[11px] sm:inline">
              /
            </kbd>
          </Button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="h-10 w-10 hover:bg-muted hover:text-foreground lg:hidden"
                aria-label={t.nav.openMenu}
              >
                <Menu className="h-4 w-4" aria-hidden />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background">
              <SheetTitle className="eyebrow">{t.nav.categories}</SheetTitle>
              <nav aria-label="Menu principal" className="mt-6">
                <ul className="divide-y divide-border border-y border-border">
                  {categories.map((c, i) => {
                    const categoryTranslation = t.categories[c.slug as keyof typeof t.categories];
                    const categoryName = categoryTranslation?.name || c.name;
                    return (
                      <li key={c.slug}>
                        <Link
                          to={t.lang === "pt" ? "/categorias/$categoria" : "/$lang/categorias/$categoria"}
                          params={t.lang === "pt" ? { categoria: c.slug } : { lang: t.lang, categoria: c.slug }}
                          onClick={() => setMenuOpen(false)}
                          className="flex items-baseline gap-3 py-3 text-foreground hover:text-primary"
                        >
                          <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                          {categoryName}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      to={t.lang === "pt" ? "/sobre" : `/${t.lang}/sobre`}
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-foreground"
                    >
                      {t.nav.about}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to={t.lang === "pt" ? "/contato" : `/${t.lang}/contato`}
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-foreground"
                    >
                      {t.nav.contact}
                    </Link>
                  </li>
                </ul>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-[15%] translate-y-0 border-border bg-background p-4 sm:max-w-xl">
          <DialogTitle className="sr-only">{t.nav.search}</DialogTitle>
          <DialogDescription className="sr-only">
            {t.site.description}
          </DialogDescription>
          <SearchPanel autoFocus onNavigate={() => setSearchOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
