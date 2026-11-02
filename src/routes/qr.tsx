import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useId, useState } from "react";
import {
  btnPrimary,
  btnSecondary,
  panel,
  ToolLayout,
  toolHead,
} from "@/components/site/ToolLayout";

export const Route = createFileRoute("/qr")({
  staticData: { sitemap: true },
  head: () =>
    toolHead(
      "qr",
      "Gerador de QR Code grátis a partir de link — i-Tools",
      "Crie um QR Code a partir de qualquer URL e baixe em PNG ou SVG. Grátis, sem cadastro e feito no seu navegador.",
    ),
  component: QrPage,
});

const faq = [
  {
    q: "O QR Code expira?",
    a: "Não. O código aponta diretamente para o link que você digitou e funciona para sempre.",
  },
  {
    q: "Meus links são enviados para algum servidor?",
    a: "Não. O QR Code é gerado inteiramente no seu navegador.",
  },
  {
    q: "Qual formato devo baixar?",
    a: "PNG para uso digital e redes sociais; SVG para impressão em qualquer tamanho sem perder qualidade.",
  },
];

function QrPage() {
  const id = useId();
  const [url, setUrl] = useState("https://");
  const [dataUrl, setDataUrl] = useState("");
  const [svg, setSvg] = useState("");
  const valid = /^https?:\/\/\S+\.\S+/.test(url.trim());

  useEffect(() => {
    if (!valid) {
      setDataUrl("");
      setSvg("");
      return;
    }
    const opts = { margin: 2, width: 512, errorCorrectionLevel: "M" as const };
    QRCode.toDataURL(url.trim(), opts).then(setDataUrl);
    QRCode.toString(url.trim(), { ...opts, type: "svg" }).then(setSvg);
  }, [url, valid]);

  const downloadSvg = () => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    a.download = "qrcode.svg";
    a.click();
  };

  return (
    <ToolLayout
      slug="qr"
      intro="Cole um link e o QR Code aparece na hora. Baixe em PNG ou SVG."
      faq={faq}
    >
      <div className={`${panel} grid gap-8 md:grid-cols-[1fr_auto]`}>
        <div>
          <label htmlFor={id} className="text-sm font-semibold">
            Endereço (URL)
          </label>
          <input
            id={id}
            type="url"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://seusite.com.br"
            aria-invalid={!valid && url.length > 8}
            className="mt-2 h-12 w-full rounded-md border border-input bg-background px-4 font-mono text-sm outline-none focus:border-foreground"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            {valid
              ? "Pronto! Escaneie com a câmera do celular para testar."
              : "Digite um endereço completo, começando com http:// ou https://"}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={dataUrl || undefined}
              download="qrcode.png"
              aria-disabled={!dataUrl}
              className={`${btnPrimary} ${!dataUrl ? "pointer-events-none opacity-50" : ""}`}
            >
              <Download className="h-4 w-4" aria-hidden /> Baixar PNG
            </a>
            <button type="button" onClick={downloadSvg} disabled={!svg} className={btnSecondary}>
              Baixar SVG
            </button>
          </div>
        </div>
        <div className="grid h-56 w-56 place-items-center justify-self-center rounded-md border border-border bg-background">
          {dataUrl ? (
            <img src={dataUrl} alt={`QR Code para ${url}`} width={208} height={208} />
          ) : (
            <span className="px-6 text-center text-xs text-muted-foreground">
              O QR Code aparecerá aqui
            </span>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
