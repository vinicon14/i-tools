import { createFileRoute } from "@tanstack/react-router";
import { useAnalytics } from "@/hooks/use-analytics";
import { Braces, Download, Minimize2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/site/CopyButton";
import { ToolLayout, toolHead, panel } from "@/components/site/ToolLayout";
import { formatJson } from "@/lib/everyday-tools";

export const Route = createFileRoute("/json")({
  staticData: { sitemap: true },
  head: () =>
    toolHead(
      "json",
      "Formatador e validador JSON grátis — i-Tools",
      "Valide, formate, compacte e baixe seu JSON no navegador. Escolha indentação de 2 ou 4 espaços. Grátis e sem cadastro.",
    ),
  component: JsonPage,
});
function JsonPage() {
  useAnalytics('json');

  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState("");
  function run(compact: boolean) {
    try {
      setOutput(formatJson(input, compact ? undefined : indent));
      setError("");
    } catch (e) {
      setOutput("");
      setError(e instanceof Error ? `JSON inválido: ${e.message}` : "JSON inválido.");
    }
  }
  function download() {
    const url = URL.createObjectURL(new Blob([output], { type: "application/json" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatado.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <ToolLayout
      slug="json"
      intro="JSON organizado, válido e pronto para usar."
      faq={[
        {
          q: "Meus dados são enviados?",
          a: "Não. A validação e formatação são feitas inteiramente no navegador, sem armazenar seu JSON.",
        },
        {
          q: "O que é um JSON válido?",
          a: "JSON exige aspas duplas em chaves e textos. Não aceita comentários, vírgulas finais nem valores como undefined.",
        },
        {
          q: "Posso usar números muito grandes?",
          a: "Este formatador usa o interpretador JSON do navegador. Inteiros além da precisão segura do JavaScript podem ser arredondados; use strings para identificadores longos.",
        },
      ]}
    >
      <div className={panel}>
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <Button disabled={!input.trim()} onClick={() => run(false)}>
            <Braces aria-hidden />
            Formatar
          </Button>
          <Button variant="outline" disabled={!input.trim()} onClick={() => run(true)}>
            <Minimize2 aria-hidden />
            Compactar
          </Button>
          <label className="flex items-center gap-2 text-sm">
            Indentação
            <select
              aria-label="Indentação"
              value={indent}
              onChange={(e) => {
                setIndent(Number(e.target.value));
                setOutput("");
              }}
              className="h-9 rounded-md border border-input bg-background px-2"
            >
              <option value={2}>2 espaços</option>
              <option value={4}>4 espaços</option>
            </select>
          </label>
          <Button
            variant="ghost"
            disabled={!input}
            onClick={() => {
              setInput("");
              setOutput("");
              setError("");
            }}
          >
            <Trash2 aria-hidden />
            Limpar
          </Button>
        </div>
        <div className="grid min-w-0 gap-5 lg:grid-cols-2">
          <div className="min-w-0">
            <label htmlFor="json-input" className="text-sm font-semibold">
              JSON original
            </label>
            <textarea
              id="json-input"
              spellCheck={false}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setOutput("");
                setError("");
              }}
              placeholder={'{"nome": "i-Tools", "gratuito": true}'}
              className="mt-2 min-h-80 w-full resize-y rounded-md border border-input bg-background p-4 font-mono text-sm"
            />
          </div>
          <div className="min-w-0">
            <label htmlFor="json-output" className="text-sm font-semibold">
              Resultado
            </label>
            <textarea
              id="json-output"
              readOnly
              spellCheck={false}
              value={output}
              className="mt-2 min-h-80 w-full resize-y rounded-md border border-input bg-background p-4 font-mono text-sm"
            />
          </div>
        </div>
        <p
          role={error ? "alert" : "status"}
          className={`my-4 min-h-5 break-words text-sm ${error ? "text-destructive" : "text-accent"}`}
        >
          {error || (output ? "JSON válido." : "")}
        </p>
        <div className="flex flex-wrap gap-3">
          <CopyButton key={output} value={output} />
          <Button variant="outline" disabled={!output} onClick={download}>
            <Download aria-hidden />
            Baixar JSON
          </Button>
        </div>
      </div>
    </ToolLayout>
  );
}
