import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/components/site/Layout";
import { VideoDownloader } from "@/components/site/VideoDownloader";

export const Route = createFileRoute("/baixar-video-tiktok")({
  staticData: { sitemap: true },
  head: () => pageMeta("Baixar vídeo do TikTok — em preparação | i-Tools", "Ferramenta de download de vídeos públicos do TikTok em preparação. Verifique o formato do link; downloads ainda não disponíveis.", "/baixar-video-tiktok"),
  component: () => <VideoDownloader platform="tiktok" />,
});