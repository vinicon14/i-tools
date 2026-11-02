import { createFileRoute } from "@tanstack/react-router";
import { Calculator } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { ToolLayout, toolHead, panel } from "@/components/site/ToolLayout";
import { calculatePercentage, type PercentageMode } from "@/lib/everyday-tools";

export const Route = createFileRoute("/porcentagem")({
  staticData: { sitemap: true },
  head: () =>
    toolHead(
      "porcentagem",
      "Calculadora de porcentagem, descontos e aumentos — i-Tools",
      "Calcule porcentagens, preço com desconto, aumentos e variação percentual. Grátis, sem cadastro e direto no navegador.",
    ),
  component: PercentagePage,
});
const modes: { value: PercentageMode; label: string }[] = [
  { value: "portion", label: "Porcentagem de um valor" },
  { value: "discount", label: "Preço com desconto" },
  { value: "increase", label: "Valor com aumento" },
  { value: "change", label: "Variação percentual" },
];
function PercentagePage() {
  const [mode, setMode] = useState<PercentageMode>("portion");
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState("");
  function clearResult() {
    setResult(null);
    setError("");
  }
  function calculate(e: FormEvent) {
    e.preventDefault();
    try {
      if (!first.trim() || !second.trim()) throw new Error("Preencha os dois valores.");
      const parse = (v: string) =>
        /^[-+]?\d+(?:[.,]\d+)?$/.test(v.trim()) ? Number(v.trim().replace(",", ".")) : NaN;
      setResult(calculatePercentage(mode, parse(first), parse(second)));
      setError("");
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Confira os valores.");
    }
  }
  return (
    <ToolLayout
      slug="porcentagem"
      intro="De descontos a aumentos: os números, sem complicação."
      faq={[
        {
          q: "Como calcular uma porcentagem?",
          a: "Multiplique o valor pela porcentagem e divida por 100. Por exemplo, 15% de 200 é 30.",
        },
        {
          q: "Como calcular a variação percentual?",
          a: "Dividimos a diferença entre os valores pelo módulo do valor inicial e multiplicamos por 100. O valor inicial não pode ser zero.",
        },
        {
          q: "Posso usar vírgula nos decimais?",
          a: "Sim. Use vírgula ou ponto como separador decimal, sem separadores de milhar. O resultado é arredondado para até seis casas decimais.",
        },
      ]}
    >
      <form onSubmit={calculate} noValidate className={`${panel} max-w-3xl`}>
        <label htmlFor="percentage-mode" className="text-sm font-semibold">
          Cálculo
        </label>
        <select
          id="percentage-mode"
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as PercentageMode);
            clearResult();
          }}
          className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3"
        >
          {modes.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="percentage-first" className="text-sm font-semibold">
              {mode === "change" ? "Valor inicial" : "Valor"}
            </label>
            <input
              id="percentage-first"
              inputMode="decimal"
              value={first}
              onChange={(e) => {
                setFirst(e.target.value);
                clearResult();
              }}
              placeholder="200"
              className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3 font-mono"
            />
          </div>
          <div>
            <label htmlFor="percentage-second" className="text-sm font-semibold">
              {mode === "change" ? "Valor final" : "Porcentagem (%)"}
            </label>
            <input
              id="percentage-second"
              inputMode="decimal"
              value={second}
              onChange={(e) => {
                setSecond(e.target.value);
                clearResult();
              }}
              placeholder={mode === "change" ? "230" : "15"}
              className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3 font-mono"
            />
          </div>
        </div>
        <Button type="submit" className="mt-6">
          <Calculator aria-hidden />
          Calcular
        </Button>
        <div aria-live="polite" className="mt-6 min-h-24 border-t border-border pt-5">
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {result !== null && (
            <>
              <p className="text-sm text-muted-foreground">Resultado</p>
              <output className="mt-2 block break-all font-mono text-3xl tabular-nums">
                {result.toLocaleString("pt-BR", { maximumFractionDigits: 6 })}
                {mode === "change" ? "%" : ""}
              </output>
            </>
          )}
        </div>
      </form>
    </ToolLayout>
  );
}
