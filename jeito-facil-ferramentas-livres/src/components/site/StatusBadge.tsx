import { statusLabel, type ToolStatus } from "@/lib/catalog";

export function StatusBadge({ status }: { status: ToolStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-accent">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      {statusLabel(status)}
    </span>
  );
}
