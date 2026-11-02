import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/components/site/Layout";
import { VideoDownloader } from "@/components/site/VideoDownloader";

export const Route = createFileRoute("/baixar-video-youtube")({
  staticData: { sitemap: true },
  head: () => pageMeta("Baixar vídeo do YouTube e Shorts — em preparação | i-Tools", "Ferramenta de download de vídeos do YouTube e Shorts em preparação. Verifique o formato do link; downloads ainda não disponíveis.", "/baixar-video-youtube"),
  component: () => <VideoDownloader platform="youtube" />,
});