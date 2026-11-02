import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/components/site/ToolLayout";
import { VideoDownloader } from "@/components/site/VideoDownloader";

export const Route = createFileRoute("/baixar-video-instagram")({
  staticData: { sitemap: true },
  head: () => toolHead("baixar-video-instagram", "Baixar vídeo do Instagram e Reels grátis — i-Tools", "Baixe Reels e vídeos públicos do Instagram que sejam seus ou autorizados. Gratuito e sem cadastro."),
  component: () => <VideoDownloader platform="instagram" />,
});
