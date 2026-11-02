import { Link } from "@tanstack/react-router";
import { Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categories } from "@/lib/catalog";
import { SearchPanel } from "./SearchPanel";
import { Logo } from "./Logo";

export function SiteHeader() {
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
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm animate-fade-in">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:rounded-md focus:bg-foreground focus:px-3 focus:py-2 focus:text-background"
      >
        Pular para o conteúdo
      </a>
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Logo />
        <nav aria-label="Categorias" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/categorias/$categoria"
                  params={{ categoria: c.slug }}
                  className="rounded-md px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  activeProps={{ className: "text-foreground" }}
                >
                  {c.name.split(" ")[0]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            aria-label="Buscar ferramentas"
          >
            <Search className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">Buscar</span>
            <kbd className="hidden rounded border border-border px-1.5 font-mono text-[11px] sm:inline">
              /
            </kbd>
          </button>
          <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                className="grid h-9 w-9 place-items-center rounded-md border border-border lg:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-4 w-4" aria-hidden />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-background">
              <SheetTitle className="eyebrow">Categorias</SheetTitle>
              <nav aria-label="Menu principal" className="mt-6">
                <ul className="divide-y divide-border border-y border-border">
                  {categories.map((c, i) => (
                    <li key={c.slug}>
                      <Link
                        to="/categorias/$categoria"
                        params={{ categoria: c.slug }}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-baseline gap-3 py-3 text-foreground hover:text-primary"
                      >
                        <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                        {c.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      to="/sobre"
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-foreground"
                    >
                      Sobre o i-Tools
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contato"
                      onClick={() => setMenuOpen(false)}
                      className="hover:text-foreground"
                    >
                      Contato
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
          <DialogTitle className="sr-only">Buscar ferramentas</DialogTitle>
          <DialogDescription className="sr-only">
            Digite para filtrar as ferramentas planejadas.
          </DialogDescription>
          <SearchPanel autoFocus onNavigate={() => setSearchOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
