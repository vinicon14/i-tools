import { createFileRoute } from "@tanstack/react-router";
import { allowedMediaUrl } from "@/lib/video-download";

export const Route = createFileRoute("/api/public/video-file")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async ({ request }) => {
        const secret = process.env["VIDEO_DOWNLOAD_SIGNING_KEY"];
        if (!secret) return new Response("Serviço indisponível", { status: 503 });
        const { readTicket } = await import("@/lib/video-tickets.server");
        const ticket = await readTicket(
          new URL(request.url).searchParams.get("ticket") ?? "",
          secret,
        );
        if (!ticket)
          return new Response("Link inválido ou expirado. Prepare o vídeo novamente.", {
            status: 403,
          });
        try {
          let source = ticket.source;
          for (let redirects = 0; redirects < 5; redirects++) {
            if (!allowedMediaUrl(source))
              return new Response("Destino não permitido", { status: 502 });
            const response = await fetch(source, {
              redirect: "manual",
              signal: AbortSignal.timeout(45_000),
            });
            if ([301, 302, 303, 307, 308].includes(response.status)) {
              const next = response.headers.get("location");
              await response.body?.cancel();
              if (!next) break;
              source = new URL(next, source).href;
              continue;
            }
            if (!response.ok)
              return new Response("Vídeo indisponível ou link expirado. Prepare novamente.", {
                status: 502,
              });
            const contentType = response.headers.get("content-type") ?? "";
            if (!/^(video\/|application\/octet-stream)/i.test(contentType)) {
              await response.body?.cancel();
              return new Response("O serviço não retornou um arquivo de vídeo", { status: 502 });
            }
            return new Response(response.body, {
              headers: {
                "Content-Type": contentType,
                "Content-Disposition": `attachment; filename="${ticket.filename}"`,
                "Cache-Control": "no-store",
                "X-Content-Type-Options": "nosniff",
              },
            });
          }
          return new Response("Não foi possível acessar o arquivo", { status: 502 });
        } catch {
          return new Response("Não foi possível baixar o vídeo. Tente novamente.", { status: 502 });
        }
      },
    },
  },
});
