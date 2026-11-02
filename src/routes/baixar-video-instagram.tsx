import { createFileRoute } from "@tanstack/react-router";
import { pageMeta } from "@/components/site/Layout";
import { VideoDownloader } from "@/components/site/VideoDownloader";

export const Route = createFileRoute("/baixar-video-instagram")({
  head: () =>
    pageMeta(
      "Baixar vídeo do Instagram e Reels — em preparação | i-Tools",
      "Ferramenta de download de vídeos do Instagram e Reels em preparação. Verifique o formato do link; downloads ainda não disponíveis.",
      "/baixar-video-instagram",
    ),
  component: () => <VideoDownloader platform="instagram" />,
});
