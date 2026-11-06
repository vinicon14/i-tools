import { Download } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useId, useState } from "react";
import { useAnalytics } from "@/hooks/use-analytics";
import type { LanguageCode } from "@/lib/i18n";
import { getQrTranslations } from "@/lib/qr-translations";
import { isValidQrUrl } from "@/lib/qr";
import { getTool } from "@/lib/catalog";
import { getTranslations } from "@/lib/translations";
import { btnPrimary, btnSecondary, panel, ToolLayout } from "./ToolLayout";

export function LocalizedQrGenerator({ lang }: { lang: LanguageCode }) {
  useAnalytics("qr", lang);
  const id = useId();
  const copy = getQrTranslations(lang);
  const t = getTranslations(lang);
  const tool = getTool("qr");
  const toolTranslation = t.tools.qr;
  const categoryTranslation = tool
    ? t.categories[tool.category as keyof typeof t.categories]
    : undefined;
  const [url, setUrl] = useState("https://");
  const [dataUrl, setDataUrl] = useState("");
  const [svg, setSvg] = useState("");
  const valid = isValidQrUrl(url);

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
      intro={copy.intro}
      faq={copy.faq}
      lang={lang}
      toolName={toolTranslation?.name}
      categoryName={categoryTranslation?.name}
      translations={{
        home: t.nav.home,
        faq: t.common.faq,
        alsoIn: t.common.alsoIn,
      }}
    >
      <div className={`${panel} grid gap-8 md:grid-cols-[1fr_auto]`}>
        <div>
          <label htmlFor={id} className="text-sm font-semibold">
            {copy.label}
          </label>
          <input
            id={id}
            type="url"
            inputMode="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={copy.placeholder}
            aria-invalid={!valid && url.length > 8}
            className="mt-2 h-12 w-full rounded-md border border-input bg-background px-4 font-mono text-sm outline-none focus:border-foreground"
          />
          <p className="mt-2 text-xs text-muted-foreground">{valid ? copy.validHint : copy.invalidHint}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={dataUrl || undefined}
              download="qrcode.png"
              aria-disabled={!dataUrl}
              className={`${btnPrimary} ${!dataUrl ? "pointer-events-none opacity-50" : ""}`}
            >
              <Download className="h-4 w-4" aria-hidden /> {copy.downloadPng}
            </a>
            <button type="button" onClick={downloadSvg} disabled={!svg} className={btnSecondary}>
              {copy.downloadSvg}
            </button>
          </div>
        </div>
        <div className="grid h-56 w-56 place-items-center justify-self-center rounded-md border border-border bg-background">
          {dataUrl ? (
            <img src={dataUrl} alt={copy.alt(url)} width={208} height={208} />
          ) : (
            <span className="px-6 text-center text-xs text-muted-foreground">{copy.emptyPreview}</span>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
