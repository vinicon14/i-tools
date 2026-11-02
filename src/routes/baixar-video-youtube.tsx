import { createFileRoute } from "@tanstack/react-router";
import { toolHead } from "@/components/site/ToolLayout";
import { VideoDownloader } from "@/components/site/VideoDownloader";

export const Route = createFileRoute("/baixar-video-youtube")({
  staticData: { sitemap: true },
  head: () => toolHead("baixar-video-youtube", "Baixar vídeo do YouTube e Shorts grátis — i-Tools", "Baixe vídeos públicos autorizados do YouTube e Shorts. Escolha a qualidade desejada e baixe o arquivo gratuitamente, sem cadastro."),
  component: () => <VideoDownloader platform="youtube" />,
});
