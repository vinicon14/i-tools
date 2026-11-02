import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { getCategory, type Tool } from "@/lib/catalog";
import { StatusBadge } from "./StatusBadge";
import { categoryAppearance } from "./tool-appearance";
import { useI18n } from "@/lib/use-i18n";

export function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const Icon = tool.icon;
  const { t } = useI18n();
  
  const toolTranslation = t.tools[tool.slug as keyof typeof t.tools];
  const categoryTranslation = t.categories[tool.category as keyof typeof t.categories];
  
  const toolName = toolTranslation?.name || tool.name;
  const toolSummary = toolTranslation?.summary || tool.summary;
  const categoryName = categoryTranslation?.name || getCategory(tool.category)?.name;
  
  return (
    <li
      data-reveal
      className="tool-card group relative flex min-w-0 flex-col rounded-lg border border-border bg-card p-6 animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index, 8) * 0.06}s` }}
    >
      <div className="flex items-start justify-between">
        <span className={`tool-icon grid h-11 w-11 place-items-center rounded-lg transition-transform duration-300 ${categoryAppearance[tool.category] ?? "bg-muted text-foreground"}`}>
          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </span>
        <StatusBadge status={tool.status} />
      </div>
      <h3 className="mt-5 text-base font-semibold leading-snug">
        <Link
          to={t.lang === "pt" ? "/$tool" : "/$lang/$tool"}
          params={t.lang === "pt" ? { tool: tool.slug } : { lang: t.lang, tool: tool.slug }}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {toolName}
        </Link>
      </h3>
      <p className="mt-2 min-h-10 flex-1 text-sm leading-relaxed text-muted-foreground">{toolSummary}</p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-4 text-xs text-muted-foreground">
        <span>{categoryName}</span>
        <ArrowUpRight
          className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden
        />
      </div>
      <span
        className="pointer-events-none absolute inset-0 ring-primary group-has-[:focus-visible]:ring-2"
        aria-hidden
      />
    </li>
  );
}

export function ToolGrid({ tools }: { tools: Tool[] }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((t, i) => (
        <ToolCard key={t.slug} tool={t} index={i} />
      ))}
    </ul>
  );
}
