import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/components/site/ToolLayout";
import { VideoDownloader } from "@/components/site/VideoDownloader";

export const Route = createFileRoute("/baixar-video-tiktok")({
  staticData: { sitemap: true },
  head: () => toolHead("baixar-video-tiktok", "Baixar vídeo do TikTok grátis — i-Tools", "Baixe vídeos públicos do TikTok que sejam seus ou autorizados. Grátis, sem cadastro e com download direto do arquivo."),
  component: () => <VideoDownloader platform="tiktok" />,
});
