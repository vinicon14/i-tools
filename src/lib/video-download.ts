import { z } from "zod";
import { validateVideoLink } from "./video-links";

export const videoRequestSchema = z.object({
  platform: z.enum(["youtube", "tiktok", "instagram"]),
  url: z.string().max(2048),
  quality: z.enum(["360p", "480p", "720p", "1080p"]),
  authorized: z.literal(true),
}).superRefine((data, ctx) => {
  const result = validateVideoLink(data.url, data.platform);
  if (!result.valid) ctx.addIssue({ code: "custom", message: result.error, path: ["url"] });
});

export type VideoDownloadResult = { ok: true; files: { url: string; filename: string }[] } | { ok: false; error: string };

export function allowedMediaUrl(value: string): boolean {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password || url.port) return false;
    const host = url.hostname.toLowerCase();
    if (host === "api.fastsaver.io") return url.pathname === "/v1/tunnel";
    if (host === "drogon.fastsaver.io") return url.pathname === "/dl";
    return ["cdninstagram.com", "fbcdn.net", "tiktokcdn.com", "tiktokcdn-us.com", "tiktokcdn-eu.com", "byteoversea.com", "ibyteimg.com", "ibytedtos.com"].some((domain) => host.endsWith(`.${domain}`));
  } catch { return false; }
}

export function safeFilename(value: unknown, fallback = "video.mp4"): string {
  if (typeof value !== "string") return fallback;
  const clean = value.replace(/[^a-zA-Z0-9._ -]/g, "_").slice(0, 120);
  return clean && /\.mp4$/i.test(clean) ? clean : fallback;
}

export function mediaFiles(body: unknown): { source: string; filename: string }[] {
  const record = z.object({ ok: z.literal(true), type: z.string().optional(), download_url: z.string().optional(), filename: z.string().optional(), items: z.array(z.object({ type: z.string(), download_url: z.string() })).optional() }).parse(body);
  const items = record.type === "album" ? (record.items ?? []).filter((item) => item.type === "video") : record.type === undefined || record.type === "video" ? [{ download_url: record.download_url }] : [];
  return items.flatMap((item, index) => item.download_url && allowedMediaUrl(item.download_url) ? [{ source: item.download_url, filename: safeFilename(record.filename, `video-${index + 1}.mp4`) }] : []).slice(0, 20);
}
