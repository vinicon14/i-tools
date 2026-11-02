import { Link } from "@tanstack/react-router";
import { categories } from "@/lib/catalog";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[2fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            Ferramentas online gratuitas, direto no navegador. Sem cadastro, sem assinatura —
            mantido por anúncios discretos.
          </p>
        </div>
        <nav aria-label="Categorias no rodapé">
          <h2 className="eyebrow">Categorias</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  to="/categorias/$categoria"
                  params={{ categoria: c.slug }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Institucional">
          <h2 className="eyebrow">i-Tools</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/sobre" className="text-muted-foreground hover:text-foreground">
                Sobre o projeto
              </Link>
            </li>
            <li>
              <Link to="/contato" className="text-muted-foreground hover:text-foreground">
                Contato
              </Link>
            </li>
            <li>
              <Link to="/privacidade" className="text-muted-foreground hover:text-foreground">
                Política de privacidade
              </Link>
            </li>
            <li>
              <Link to="/termos" className="text-muted-foreground hover:text-foreground">
                Termos de uso
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-4 py-5 font-mono text-xs text-muted-foreground sm:px-6">
          © 2026 i-Tools. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
