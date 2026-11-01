import { Link } from "@tanstack/react-router";
import { Clock, Sparkles } from "lucide-react";
import type { PlannedTool } from "@/lib/tools";
import { getCategory } from "@/lib/tools";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-foreground" aria-label="ai-tools, página inicial">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" aria-hidden /></span>
          ai-tools
        </Link>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Em breve</span>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
        © 2026 ai-tools · Ferramentas gratuitas, mantidas apenas por anúncios. Sem conta, sem assinatura.
      </div>
    </footer>
  );
}

export function SoonBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
      <Clock className="h-3 w-3" aria-hidden /> Em breve
    </span>
  );
}

export function ToolCard({ tool }: { tool: PlannedTool }) {
  return (
    <li className="flex flex-col rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{getCategory(tool.category)?.name}</span>
        <SoonBadge />
      </div>
      <h3 className="text-lg font-semibold text-card-foreground">{tool.name}</h3>
      <p className="mt-1 flex-1 text-sm text-muted-foreground">{tool.summary}</p>
      <Link to="/tools/$slug" params={{ slug: tool.slug }} className="mt-4 text-sm font-semibold text-primary underline-offset-4 hover:underline">
        Saiba o que está planejado para {tool.name}
      </Link>
    </li>
  );
}
