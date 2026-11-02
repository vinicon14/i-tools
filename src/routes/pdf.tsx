import { createFileRoute } from "@tanstack/react-router";
import { useAnalytics } from "@/hooks/use-analytics";
import { useState } from "react";
import { ArrowDown, ArrowUp, Download, FilePlus, LoaderCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToolLayout, toolHead, panel } from "@/components/site/ToolLayout";
import { checkPdfInput, createPdf, pdfToImages } from "@/lib/pdf-tools";
import { fileSize, saveBlob } from "@/lib/image-tools";
export const Route = createFileRoute("/pdf")({
  staticData: { sitemap: true },
  head: () =>
    toolHead(
      "pdf",
      "Converter imagens e texto para PDF ou PDF em PNG — i-Tools",
      "Converta JPG, PNG, WebP e TXT em PDF ou exporte páginas de PDF como imagens PNG. Conversor gratuito, local, sem cadastro.",
    ),
  component: PdfPage,
});
function PdfPage() {
  useAnalytics('pdf');

  const [mode, setMode] = useState<"create" | "images">("create");
  const [files, setFiles] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<{ blob: Blob; name: string } | null>(null);
  function reset() {
    setResult(null);
    setError("");
    setProgress("");
  }
  function select(selected: FileList | null) {
    reset();
    setFiles([]);
    if (!selected) return;
    try {
      const next = Array.from(selected);
      if (next.length > 30) throw new Error("Escolha no máximo 30 arquivos.");
      next.forEach(checkPdfInput);
      setFiles(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Arquivo inválido.");
    }
  }
  function move(index: number, delta: number) {
    const next = [...files];
    const target = index + delta;
    const file = next[index];
    if (!file || target < 0 || target >= files.length) return;
    next.splice(index, 1);
    next.splice(target, 0, file);
    setFiles(next);
    reset();
  }
  async function convert() {
    setBusy(true);
    reset();
    try {
      if (mode === "create") setResult({ blob: await createPdf(files), name: "documento.pdf" });
      else {
        const file = files[0];
        if (!file) throw new Error("Escolha um PDF.");
        const pages = await pdfToImages(file, (i, total) => setProgress(`Página ${i} de ${total}`));
        const first = pages[0];
        if (!first) throw new Error("O PDF está vazio.");
        if (pages.length === 1) setResult({ blob: first.blob, name: first.name });
        else {
          const { zipSync } = await import("fflate");
          const entries: Record<string, Uint8Array> = {};
          for (const page of pages)
            entries[page.name] = new Uint8Array(await page.blob.arrayBuffer());
          setResult({
            blob: new Blob([new Uint8Array(zipSync(entries, { level: 0 }))], {
              type: "application/zip",
            }),
            name: "paginas-pdf.zip",
          });
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Não foi possível converter este arquivo.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <ToolLayout
      slug="pdf"
      intro="Imagens e texto em PDF. Páginas de PDF em imagens. Tudo no seu navegador."
      faq={[
        {
          q: "Quais conversões estão disponíveis?",
          a: "JPG, PNG, WebP e TXT para PDF; PDF para PNG. Várias páginas são baixadas juntas em ZIP. Conversão Word/DOCX não está disponível.",
        },
        {
          q: "Como as páginas são organizadas?",
          a: "Cada imagem ocupa uma página A4 com proporção preservada. Arquivos TXT são divididos em páginas; você pode reorganizar os arquivos antes de converter.",
        },
        {
          q: "Existem limites?",
          a: "Cada arquivo deve ter até 30 MB. Crie um PDF com até 30 arquivos. Exporte PDFs com até 50 páginas, sem senha. TXT aceita até 200 mil caracteres latinos, sem emojis.",
        },
        {
          q: "Os arquivos são enviados?",
          a: "Não. A conversão acontece no navegador e os arquivos não são enviados para processamento.",
        },
      ]}
    >
      <div className={`${panel} max-w-3xl`}>
        <label htmlFor="pdf-mode" className="text-sm font-semibold">
          Conversão
        </label>
        <select
          id="pdf-mode"
          disabled={busy}
          value={mode}
          onChange={(e) => {
            setMode(e.target.value as "create" | "images");
            setFiles([]);
            reset();
          }}
          className="mt-2 h-12 w-full rounded-md border border-input bg-background px-3"
        >
          <option value="create">Imagens ou TXT → PDF</option>
          <option value="images">PDF → imagens PNG</option>
        </select>
        <label htmlFor="pdf-files" className="mt-6 block text-sm font-semibold">
          {mode === "create" ? "Imagens ou arquivos TXT" : "Arquivo PDF"}
        </label>
        <input
          key={mode}
          id="pdf-files"
          type="file"
          disabled={busy}
          multiple={mode === "create"}
          accept={
            mode === "create" ? "image/jpeg,image/png,image/webp,.txt" : ".pdf,application/pdf"
          }
          onChange={(e) => select(e.target.files)}
          className="mt-3 block w-full min-w-0 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-3 file:text-secondary-foreground"
        />
        <ol className="mt-5 divide-y divide-border">
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`} className="flex items-center gap-2 py-3">
              <span className="min-w-0 flex-1 break-all text-sm">
                {i + 1}. {file.name}
                <span className="mt-1 block text-xs text-muted-foreground">
                  {fileSize(file.size)}
                </span>
              </span>
              {mode === "create" && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Subir ${file.name}`}
                    title="Subir"
                    disabled={busy || i === 0}
                    onClick={() => move(i, -1)}
                  >
                    <ArrowUp aria-hidden />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Descer ${file.name}`}
                    title="Descer"
                    disabled={busy || i === files.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    <ArrowDown aria-hidden />
                  </Button>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remover ${file.name}`}
                title="Remover"
                disabled={busy}
                onClick={() => {
                  setFiles(files.filter((_, n) => n !== i));
                  reset();
                }}
              >
                <Trash2 aria-hidden />
              </Button>
            </li>
          ))}
        </ol>
        <Button className="mt-5" disabled={busy || !files.length} onClick={() => void convert()}>
          {busy ? <LoaderCircle aria-hidden className="animate-spin" /> : <FilePlus aria-hidden />}
          {busy ? "Convertendo…" : "Converter"}
        </Button>
        <div aria-live="polite" className="mt-6">
          {busy && progress && <p className="text-sm text-muted-foreground">{progress}</p>}
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          {result && (
            <div className="flex flex-wrap items-center gap-4 border-t border-border pt-5">
              <p className="text-sm">
                {result.name} · {fileSize(result.blob.size)}
              </p>
              <Button onClick={() => saveBlob(result.blob, result.name)}>
                <Download aria-hidden />
                Baixar arquivo
              </Button>
            </div>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
