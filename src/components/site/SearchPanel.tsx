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
          className={`search-field flex items-center gap-3 rounded-lg border border-input bg-card px-4 transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 ${size === "lg" ? "h-16 sm:px-5" : "h-12"}`}
        >
          <Search className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.5} aria-hidden />
          <input
            id={id}
            type="search"
            autoFocus={autoFocus}
            autoComplete="off"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Qual ferramenta você precisa?"
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
          </div>
        )}
      </div>
    </div>
  );
}
