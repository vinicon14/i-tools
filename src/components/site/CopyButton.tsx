import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyButton({ value, label = "Copiar" }: { value: string; label?: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  async function copy() {
    try { await navigator.clipboard.writeText(value); setStatus("copied"); }
    catch { setStatus("failed"); }
  }
  return <div className="flex flex-wrap items-center gap-3">
    <Button type="button" variant="outline" disabled={!value} onClick={copy}>
      {status === "copied" ? <Check aria-hidden /> : <Copy aria-hidden />}{label}
    </Button>
    <span role="status" className="text-xs text-muted-foreground">{status === "copied" ? "Copiado!" : status === "failed" ? "Não foi possível copiar. Selecione o texto e copie manualmente." : ""}</span>
  </div>;
}