import { useEffect, useRef, useState } from "react";
import { Download, ImagePlus, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  checkImage,
  encodeImage,
  fileSize,
  imageDimensions,
  imageExtension,
  readImage,
  saveBlob,
  validateDimensions,
  type ImageFormat,
} from "@/lib/image-tools";
import { panel } from "./ToolLayout";

export function ImageEditor({ mode }: { mode: "compress" | "resize" }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [original, setOriginal] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [locked, setLocked] = useState(true);
  const [format, setFormat] = useState<ImageFormat>("image/webp");
  const [quality, setQuality] = useState(80);
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const version = useRef(0);
  useEffect(() => {
    if (!file) {
      setPreview("");
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  async function selectFile(selected?: File) {
    const request = ++version.current;
    setResult(null);
    setError("");
    setFile(null);
    if (!selected) return;
    setBusy(true);
    try {
      checkImage(selected);
      const image = await readImage(selected);
      if (request === version.current) {
        setOriginal({ width: image.width, height: image.height });
        setWidth(image.width);
        setHeight(image.height);
        setFile(selected);
      }
      image.close();
    } catch (e) {
      if (request === version.current)
        setError(e instanceof Error ? e.message : "Imagem inválida.");
    } finally {
      if (request === version.current) setBusy(false);
    }
  }
  function dimension(value: number, axis: "width" | "height") {
    setResult(null);
    setError("");
    if (axis === "width") setWidth(value);
    else setHeight(value);
    if (locked && value > 0) {
      try {
        const size = imageDimensions(original.width, original.height, value, axis);
        setWidth(size.width);
        setHeight(size.height);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Tamanho inválido.");
      }
    }
  }
  async function process() {
    if (!file) return;
    const request = ++version.current;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      validateDimensions(width, height);
      const image = await readImage(file);
      try {
        const blob = await encodeImage(image, width, height, format, quality / 100);
        if (request === version.current) setResult(blob);
      } finally {
        image.close();
      }
    } catch (e) {
      if (request === version.current)
        setError(e instanceof Error ? e.message : "Não foi possível processar a imagem.");
    } finally {
      if (request === version.current) setBusy(false);
    }
  }
  return (
    <div className={`${panel} max-w-4xl`}>
      <label htmlFor="image-file" className="flex items-center gap-2 text-sm font-semibold">
        <ImagePlus aria-hidden className="size-5" />
        Imagem JPG, PNG ou WebP
      </label>
      <input
        id="image-file"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={busy}
        onChange={(e) => void selectFile(e.target.files?.[0])}
        className="mt-3 block w-full min-w-0 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-4 file:py-3 file:text-secondary-foreground"
      />
      <p className="mt-2 text-xs text-muted-foreground">Até 30 MB · até 24 megapixels</p>
      {file && (
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="min-w-0">
            <div className="grid h-64 place-items-center overflow-hidden rounded-md border border-border bg-muted">
              {preview && (
                <img
                  src={preview}
                  alt="Imagem selecionada"
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
            <p className="mt-3 break-all text-sm text-muted-foreground">
              {file.name} · {original.width} × {original.height} px · {fileSize(file.size)}
            </p>
          </div>
          <div className="space-y-5">
            {mode === "resize" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="image-width" className="text-sm font-semibold">
                      Largura (px)
                    </label>
                    <input
                      id="image-width"
                      type="number"
                      min="1"
                      max="12000"
                      disabled={busy}
                      value={width || ""}
                      onChange={(e) => dimension(Number(e.target.value), "width")}
                      className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3"
                    />
                  </div>
                  <div>
                    <label htmlFor="image-height" className="text-sm font-semibold">
                      Altura (px)
                    </label>
                    <input
                      id="image-height"
                      type="number"
                      min="1"
                      max="12000"
                      disabled={busy}
                      value={height || ""}
                      onChange={(e) => dimension(Number(e.target.value), "height")}
                      className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3"
                    />
                  </div>
                </div>
                <label className="flex gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={locked}
                    disabled={busy}
                    onChange={(e) => {
                      setLocked(e.target.checked);
                      if (e.target.checked) dimension(width, "width");
                      setResult(null);
                    }}
                  />
                  Manter proporção
                </label>
              </>
            )}
            <div>
              <label htmlFor="image-format" className="text-sm font-semibold">
                Formato de saída
              </label>
              <select
                id="image-format"
                disabled={busy}
                value={format}
                onChange={(e) => {
                  setFormat(e.target.value as ImageFormat);
                  setResult(null);
                }}
                className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3"
              >
                <option value="image/webp">WebP</option>
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
              </select>
            </div>
            {format !== "image/png" && (
              <div>
                <label htmlFor="image-quality" className="text-sm font-semibold">
                  Qualidade: {quality}%
                </label>
                <input
                  id="image-quality"
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  disabled={busy}
                  onChange={(e) => {
                    setQuality(Number(e.target.value));
                    setResult(null);
                  }}
                  className="mt-3 w-full accent-primary"
                />
              </div>
            )}
            <Button onClick={() => void process()} disabled={busy}>
              {busy ? (
                <LoaderCircle aria-hidden className="animate-spin" />
              ) : (
                <ImagePlus aria-hidden />
              )}
              {busy ? "Processando…" : mode === "compress" ? "Comprimir imagem" : "Redimensionar"}
            </Button>
          </div>
        </div>
      )}
      <div aria-live="polite" className="mt-5">
        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}
        {result && file && (
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-5">
            <div>
              <p className="font-mono text-lg">{fileSize(result.size)}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {result.size < file.size
                  ? `${Math.round((1 - result.size / file.size) * 100)}% menor que o original`
                  : "O arquivo ficou maior que o original; tente WebP ou menor qualidade."}{" "}
                · {width} × {height} px
              </p>
            </div>
            <Button
              onClick={() =>
                saveBlob(
                  result,
                  `${file.name.replace(/\.[^.]+$/, "")}-${mode === "compress" ? "comprimida" : "redimensionada"}.${imageExtension(format)}`,
                )
              }
            >
              <Download aria-hidden />
              Baixar imagem
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
