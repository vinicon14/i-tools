import { statusLabel, type ToolStatus } from "@/lib/catalog";

export function StatusBadge({ status }: { status: ToolStatus }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-accent">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      {statusLabel(status)}
    </span>
  );
}
