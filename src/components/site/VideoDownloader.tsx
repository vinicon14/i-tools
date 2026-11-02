import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Download, ExternalLink, Link2, LoaderCircle, X } from "lucide-react";
import { useId, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { validateVideoLink, videoPlatforms, type VideoPlatform } from "@/lib/video-links";
import { prepareVideo } from "@/lib/video-download.functions";
import type { VideoDownloadResult } from "@/lib/video-download";
import { panel, ToolLayout } from "./ToolLayout";

export function VideoDownloader({ platform }: { platform: VideoPlatform }) {
  const info = videoPlatforms[platform];
  const id = useId();
  const [url, setUrl] = useState("");
  const [quality, setQuality] = useState<"360p" | "480p" | "720p" | "1080p">("720p");
  const [authorized, setAuthorized] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<VideoDownloadResult | null>(null);
  const prepare = useServerFn(prepareVideo);
  const revision = useRef(0);
  function reset() {
    revision.current++;
    setResult(null);
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const link = validateVideoLink(url, platform);
    if (!link.valid) {
      setResult({ ok: false, error: link.error });
      return;
    }
    if (!authorized) {
      setResult({
        ok: false,
        error: "Confirme que o vídeo é seu ou que você tem autorização para baixá-lo.",
      });
      return;
    }
    const current = ++revision.current;
    setBusy(true);
    setResult(null);
    try {
      const response = await prepare({
        data: { platform, url: link.url, quality, authorized: true },
      });
      if (current === revision.current) setResult(response);
    } catch {
      if (current === revision.current)
        setResult({ ok: false, error: "Não foi possível preparar o vídeo. Tente novamente." });
    } finally {
      setBusy(false);
    }
  }
  return (
    <ToolLayout
      slug={info.slug}
      intro={`${info.formats}. Cole o link de um vídeo seu ou autorizado para preparar o arquivo.`}
      faq={[
        {
          q: `Como baixar um vídeo do ${info.name}?`,
          a: "Cole o link público, confirme que tem autorização e prepare o vídeo. Quando o arquivo estiver pronto, use o botão de download.",
        },
        {
          q: "Posso baixar vídeos privados ou protegidos?",
          a: "Não. A ferramenta não contorna login, pagamento ou proteção de conteúdo. Respeite os direitos autorais e as regras da plataforma.",
        },
        {
          q: "É gratuito e sem cadastro?",
          a: "Sim, para os visitantes do i-Tools. A disponibilidade depende dos créditos e limites do serviço de download.",
        },
        {
          q: "Meus links são enviados a outro serviço?",
          a: "Sim. O link é enviado ao FastSaver para obter o arquivo. Não envie links que contenham informações privadas ou credenciais.",
        },
        {
          q: "Por que o link de download expirou?",
          a: "Os arquivos são disponibilizados temporariamente. Baixe logo após preparar; se o link expirar, prepare o vídeo novamente.",
        },
      ]}
    >
      <nav
        aria-label="Plataformas de vídeo"
        className="mb-6 flex flex-wrap gap-x-6 gap-y-3 border-b border-border pb-4 text-sm"
      >
        {(Object.keys(videoPlatforms) as VideoPlatform[]).map((key) => (
          <Link
            key={key}
            to="/$tool"
            params={{ tool: videoPlatforms[key].slug }}
            aria-current={key === platform ? "page" : undefined}
            className={
              key === platform
                ? "font-semibold text-primary underline underline-offset-8"
                : "text-muted-foreground hover:text-foreground"
            }
          >
            {videoPlatforms[key].name}
          </Link>
        ))}
      </nav>
      <div className={`${panel} max-w-3xl`}>
        <form onSubmit={submit} noValidate>
          <label htmlFor={id} className="text-sm font-semibold">
            Link do vídeo do {info.name}
          </label>
          <div className="mt-2 flex min-w-0 items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
            <Link2 className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input
              id={id}
              type="url"
              inputMode="url"
              autoComplete="off"
              value={url}
              placeholder={info.example}
              aria-invalid={result?.ok === false}
              aria-describedby={`${id}-status`}
              onChange={(event) => {
                setUrl(event.target.value);
                reset();
              }}
              className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none"
            />
            {url && (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="mr-1 shrink-0"
                aria-label="Limpar link"
                title="Limpar link"
                onClick={() => {
                  setUrl("");
                  reset();
                }}
              >
                <X aria-hidden />
              </Button>
            )}
          </div>
          {platform === "youtube" && (
            <div className="mt-5">
              <label htmlFor={`${id}-quality`} className="text-sm font-semibold">
                Qualidade desejada
              </label>
              <select
                id={`${id}-quality`}
                value={quality}
                onChange={(e) => {
                  setQuality(e.target.value as typeof quality);
                  reset();
                }}
                className="ml-3 h-10 rounded-md border border-input bg-background px-3"
              >
                {["360p", "480p", "720p", "1080p"].map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
          )}
          <label className="mt-5 flex items-start gap-3 text-sm leading-relaxed">
            <input
              type="checkbox"
              checked={authorized}
              onChange={(e) => {
                setAuthorized(e.target.checked);
                reset();
              }}
              className="mt-1 h-4 w-4 shrink-0 accent-primary"
            />
            Este vídeo é meu ou tenho autorização para baixá-lo.
          </label>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={busy || !url.trim()}>
              {busy ? (
                <LoaderCircle className="animate-spin motion-reduce:animate-none" aria-hidden />
              ) : (
                <Download aria-hidden />
              )}
              {busy ? "Preparando vídeo…" : "Preparar download"}
            </Button>
            {validateVideoLink(url, platform).valid && (
              <Button asChild variant="outline" size="lg">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink aria-hidden />
                  Abrir original
                </a>
              </Button>
            )}
          </div>
          <div
            id={`${id}-status`}
            className="mt-5 min-h-12 text-sm"
            aria-live="polite"
            role={result?.ok === false ? "alert" : "status"}
          >
            {busy && (
              <p className="text-muted-foreground">Aguardando o arquivo do serviço de download…</p>
            )}
            {result?.ok === false && <p className="text-destructive">{result.error}</p>}
            {result?.ok && (
              <div className="space-y-3">
                <p className="text-accent">
                  Arquivo pronto. Baixe agora; o link expira em poucos minutos.
                </p>
                {result.files.map((file, i) => (
                  <div key={file.url} className="flex flex-wrap items-center gap-3">
                    <Button asChild>
                      <a href={file.url} download={file.filename}>
                        <Download aria-hidden />
                        Baixar vídeo{result.files.length > 1 ? ` ${i + 1}` : ""}
                      </a>
                    </Button>
                    <span className="min-w-0 break-all text-xs text-muted-foreground">
                      {file.filename}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>
        <p className="mt-3 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
          Baixe apenas vídeos seus ou com autorização. O i-Tools não é afiliado ao {info.name}.
          Processamento por FastSaver.
        </p>
      </div>
    </ToolLayout>
  );
}
