import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/site/CopyButton";
import { ToolLayout, toolHead, panel } from "@/components/site/ToolLayout";
import { textStats } from "@/lib/everyday-tools";

export const Route = createFileRoute("/contador-de-palavras")({
  staticData: { sitemap: true },
  head: () =>
    toolHead(
      "contador-de-palavras",
      "Contador de palavras e caracteres grátis — i-Tools",
      "Conte palavras, caracteres com e sem espaços, parágrafos e tempo de leitura em tempo real. Grátis e sem enviar seu texto.",
    ),
  component: WordCounterPage,
});
function WordCounterPage() {
  const [text, setText] = useState("");
  const stats = textStats(text);
  const metrics: [string, number][] = [
    ["Palavras", stats.words],
    ["Caracteres", stats.characters],
    ["Sem espaços", stats.withoutSpaces],
    ["Parágrafos", stats.paragraphs],
    ["Leitura (min)", stats.readingMinutes],
  ];
  return (
    <ToolLayout
      slug="contador-de-palavras"
      intro="As contagens acompanham seu texto, em tempo real."
      faq={[
        {
          q: "Como são contadas as palavras?",
          a: "Cada trecho separado por espaços ou quebras de linha conta como uma palavra. Textos vazios não contam.",
        },
        {
          q: "Como é estimado o tempo de leitura?",
          a: "Usamos 200 palavras por minuto, arredondando para o próximo minuto. É uma estimativa, não uma medição individual.",
        },
        {
          q: "O texto fica salvo?",
          a: "Não. Ele fica somente nesta página e não é enviado pelo i-Tools. Ao recarregar, o texto é apagado.",
        },
      ]}
    >
      <div
        className="mb-6 grid grid-cols-2 gap-4 border-y border-border py-6 sm:grid-cols-3 lg:grid-cols-5"
        aria-live="polite"
      >
        {metrics.map(([label, value]) => (
          <div key={label}>
            <p className="font-mono text-3xl tabular-nums">{value.toLocaleString("pt-BR")}</p>
            <p className="mt-1 text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
      <div className={panel}>
        <label htmlFor="count-text" className="text-sm font-semibold">
          Seu texto
        </label>
        <textarea
          id="count-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Digite ou cole seu texto…"
          className="mt-3 min-h-72 w-full resize-y rounded-md border border-input bg-background p-4 text-base leading-relaxed"
        />
        <div className="mt-4 flex flex-wrap gap-3">
          <CopyButton key={text} value={text} />
          <Button variant="ghost" disabled={!text} onClick={() => setText("")}>
            <Trash2 aria-hidden />
            Limpar
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
