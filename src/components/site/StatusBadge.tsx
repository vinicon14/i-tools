import { type ToolStatus } from "@/lib/catalog";
import { useI18n } from "@/lib/use-i18n";

export function StatusBadge({ status }: { status: ToolStatus }) {
  const { t } = useI18n();
  const label = status === "live" ? t.common.available : t.common.comingSoon;
  
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium text-accent">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
      {label}
    </span>
  );
}
