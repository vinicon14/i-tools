import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { Tool } from "@/lib/catalog";
import { StatusBadge } from "./StatusBadge";

export function ToolCard({ tool, index = 0 }: { tool: Tool; index?: number }) {
  const Icon = tool.icon;
  return (
    <li
      className="group relative flex flex-col bg-card p-6 transition-colors hover:bg-background animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index, 8) * 0.06}s` }}
    >
      <div className="flex items-start justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-md border border-border bg-background text-foreground transition-all duration-300 group-hover:border-primary group-hover:bg-primary/10 group-hover:text-primary group-hover:scale-110">
          <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
        </span>
        <StatusBadge status={tool.status} />
      </div>
      <h3 className="mt-6 text-base font-semibold">
        <Link
          to="/$tool"
          params={{ tool: tool.slug }}
          className="after:absolute after:inset-0 focus-visible:outline-none"
        >
          {tool.name}
        </Link>
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{tool.summary}</p>
      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 font-mono text-xs text-muted-foreground">
        <span>itools.com.br/{tool.slug}</span>
        <ArrowUpRight
          className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden
        />
      </div>
      <span
        className="pointer-events-none absolute inset-0 ring-primary group-has-[:focus-visible]:ring-2"
        aria-hidden
      />
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(400px circle at var(--x, 50%) var(--y, 50%), color-mix(in oklch, var(--color-primary) 8%, transparent), transparent 70%)",
        }}
        aria-hidden
      />
    </li>
  );
}

export function ToolGrid({ tools }: { tools: Tool[] }) {
  return (
    <ul className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((t, i) => (
        <ToolCard key={t.slug} tool={t} index={i} />
      ))}
    </ul>
  );
}
