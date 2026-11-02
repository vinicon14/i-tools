import { createServerFn } from "@tanstack/react-start";
import { mediaFiles, videoRequestSchema, type VideoDownloadResult } from "./video-download";

export const prepareVideo = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => videoRequestSchema.parse(input))
  .handler(async ({ data }): Promise<VideoDownloadResult> => {
    const key = process.env['UDC_FASTSAVER_API_KEY'];
    const gatewayKey = process.env['LOVABLE_API_KEY'];
    const signingKey = process.env['VIDEO_DOWNLOAD_SIGNING_KEY'];
    if (!key || !gatewayKey || !signingKey) return { ok: false, error: "Serviço de download não configurado." };
    try {
      const youtube = data.platform === "youtube";
      const path = youtube ? "/v1/youtube/download" : `/v1/fetch?url=${encodeURIComponent(data.url)}`;
      const response = await fetch(`https://connector-gateway.lovable.dev/udc_fastsaver${path}`, {
        method: youtube ? "POST" : "GET",
        headers: { Authorization: `Bearer ${gatewayKey}`, "X-Connection-Api-Key": key, ...(youtube ? { "Content-Type": "application/json" } : {}) },
        ...(youtube ? { body: JSON.stringify({ url: data.url, format: data.quality }) } : {}),
        signal: AbortSignal.timeout(45_000),
      });
      const text = await response.text();
      let body;
      try { body = JSON.parse(text); } catch { body = null; }
      if (!response.ok || body?.ok !== true) {
        console.error("Video provider failure", response.status, text);
        const detail = JSON.stringify(body ?? text);
        const error = /credit/i.test(detail) ? "O serviço atingiu seu limite de créditos. Tente novamente mais tarde." : response.status === 429 ? "Muitas solicitações no momento. Aguarde um pouco e tente novamente." : "Não foi possível obter este vídeo. Confira se ele é público e tente outro link.";
        return { ok: false, error };
      }
      const media = mediaFiles(body);
      if (!media.length) return { ok: false, error: "Nenhum vídeo disponível nesta publicação ou formato não suportado." };
      const { createTicket } = await import("./video-tickets.server");
      const files = await Promise.all(media.map(async (file) => ({ filename: file.filename, url: `/api/public/video-file?ticket=${encodeURIComponent(await createTicket(file.source, file.filename, signingKey))}` })));
      return { ok: true, files };
    } catch (error) {
      console.error("Video preparation failure", error);
      return { ok: false, error: "O serviço demorou demais ou está indisponível. Tente novamente." };
    }
  });
