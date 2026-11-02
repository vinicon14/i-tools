import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useId, useState } from "react";
import { searchTools, getCategory } from "@/lib/catalog";
import { StatusBadge } from "./StatusBadge";

type Props = { autoFocus?: boolean; onNavigate?: () => void; size?: "lg" | "md" };

export function SearchPanel({ autoFocus, onNavigate, size = "md" }: Props) {
  const [query, setQuery] = useState("");
  const id = useId();
  const results = searchTools(query);
  const hasQuery = query.trim().length > 0;

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor={id} className="sr-only">
          Buscar ferramentas
        </label>
        <div
          className={`flex items-center gap-3 rounded-md border border-input bg-card px-4 shadow-sm transition-colors focus-within:border-foreground ${size === "lg" ? "h-14" : "h-12"}`}
        >
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            id={id}
            type="search"
            autoFocus={autoFocus}
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar: QR Code, PDF, comprimir imagem…"
            className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
          />
        </div>
      </form>
      <div aria-live="polite">
        {hasQuery && (
          <div className="mt-2 overflow-hidden rounded-md border border-border bg-card text-left">
            {results.length > 0 ? (
              <ul>
                {results.map((t) => (
                  <li key={t.slug} className="border-b border-border last:border-0">
                    <Link
                      to="/$tool"
                      params={{ tool: t.slug }}
                      onClick={onNavigate}
                      className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-muted focus-visible:bg-muted"
                    >
                      <span>
                        <span className="block text-sm font-medium text-foreground">{t.name}</span>
                        <span className="block text-xs text-muted-foreground">
                          {getCategory(t.category)?.name}
                        </span>
                      </span>
                      <StatusBadge status={t.status} />
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-4 py-3 text-sm text-muted-foreground">
                Nenhuma ferramenta encontrada para “{query}”.
              </p>
            )}
            <p className="border-t border-border bg-muted px-4 py-2 text-xs text-muted-foreground">
              Ferramentas marcadas "Em breve" ainda estão em preparação.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
