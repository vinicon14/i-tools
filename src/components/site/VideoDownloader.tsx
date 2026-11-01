import { Link } from "@tanstack/react-router";
import { CheckCircle2, ExternalLink, Link2, Video, X } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { validateVideoLink, videoPlatforms, type VideoPlatform, type VideoLinkResult } from "@/lib/video-links";
import { panel, ToolLayout } from "./ToolLayout";

export function VideoDownloader({ platform }: { platform: VideoPlatform }) {
  const info = videoPlatforms[platform];
  const id = useId();
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<VideoLinkResult | null>(null);
  function check(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setResult(validateVideoLink(url, platform));
  }
  const faq = [
    { q: `Já posso baixar vídeos do ${info.name}?`, a: "Ainda não. A página está em preparação e o serviço de download não foi conectado. A verificação confere apenas o formato do link; não consulta nem baixa o vídeo." },
    { q: "Quais vídeos poderei baixar?", a: "Somente conteúdo próprio ou com autorização do titular, respeitando as regras da plataforma. Conteúdo privado, protegido, pago ou com restrições de acesso não será contornado." },
    { q: "Será necessário criar uma conta no i-Tools?", a: "Não. O objetivo é oferecer a ferramenta gratuitamente, sem cadastro e mantida por publicidade." },
    { q: "Meus links são armazenados?", a: "Nesta etapa, a verificação acontece no navegador e o i-Tools não envia nem armazena o link. Antes da ativação, o uso de um serviço externo será informado." },
  ];

  return (
    <ToolLayout slug={info.slug} intro={`${info.formats}. Download em preparação — ainda não disponível.`} faq={faq}>
      <nav aria-label="Plataformas de vídeo" className="mb-6 flex flex-wrap gap-x-6 gap-y-3 border-b border-border pb-4 text-sm">
        {(Object.keys(videoPlatforms) as VideoPlatform[]).map((key) => (
          <Link key={key} to="/$tool" params={{ tool: videoPlatforms[key].slug }} aria-current={key === platform ? "page" : undefined}
            className={key === platform ? "font-semibold text-primary underline underline-offset-8" : "text-muted-foreground hover:text-foreground"}>
            {videoPlatforms[key].name}
          </Link>
        ))}
      </nav>
      <div className={`${panel} max-w-3xl`}>
        <div className="mb-6 flex items-start gap-3 border-b border-border pb-5">
          <Video className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" aria-hidden />
          <div>
            <h2 className="font-sans text-base font-semibold">Download ainda indisponível</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Aguardando conexão do serviço de download. Nenhum arquivo será gerado nesta etapa.</p>
          </div>
        </div>
        <form onSubmit={check} noValidate>
          <label htmlFor={id} className="text-sm font-semibold">Link do vídeo do {info.name}</label>
          <div className="mt-2 flex min-w-0 items-center rounded-md border border-input bg-background focus-within:ring-2 focus-within:ring-ring">
            <Link2 className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <input id={id} type="url" inputMode="url" autoComplete="off" value={url} placeholder={info.example}
              aria-invalid={result?.valid === false} aria-describedby={`${id}-status`}
              onChange={(event) => { setUrl(event.target.value); setResult(null); }}
              className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm outline-none" />
            {url && <Button type="button" size="icon" variant="ghost" className="mr-1 shrink-0" aria-label="Limpar link" title="Limpar link" onClick={() => { setUrl(""); setResult(null); }}><X aria-hidden /></Button>}
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button type="submit" size="lg" disabled={!url.trim()}><Link2 aria-hidden />Verificar link</Button>
            {result?.valid && <Button asChild variant="outline" size="lg"><a href={result.url} target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden />Abrir original</a></Button>}
          </div>
          <div id={`${id}-status`} className="mt-4 min-h-12 text-sm" aria-live="polite" role={result?.valid === false ? "alert" : "status"}>
            {result?.valid === false && <p className="text-destructive">{result.error}</p>}
            {result?.valid && <div className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden /><p>Formato de link reconhecido. O vídeo não foi consultado e o download ainda não está disponível.</p></div>}
          </div>
        </form>
        <p className="mt-3 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">Baixe apenas vídeos seus ou com autorização. O i-Tools não é afiliado ao {info.name}.</p>
      </div>
    </ToolLayout>
  );
}