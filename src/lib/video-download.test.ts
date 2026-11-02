import { describe, it, expect } from "vitest";
import { allowedMediaUrl, mediaFiles, videoRequestSchema } from "./video-download";
import { createTicket, readTicket } from "./video-tickets.server";

describe("video downloads", () => {
  it("requires ownership or authorization confirmation", () => {
    expect(videoRequestSchema.safeParse({ platform: "youtube", url: "https://youtu.be/6dG1WWjew8s", quality: "720p", authorized: false }).success).toBe(false);
  });
  it("rejects profiles before provider calls", () => {
    expect(videoRequestSchema.safeParse({ platform: "instagram", url: "https://instagram.com/profile", quality: "720p", authorized: true }).success).toBe(false);
  });
  it("rejects arbitrary and private destinations", () => {
    for (const url of ["https://127.0.0.1/video", "https://example.com/a.mp4", "https://api.fastsaver.io/v1/balance", "https://cdninstagram.com.evil.test/video", "http://a.cdninstagram.com/video"]) expect(allowedMediaUrl(url)).toBe(false);
  });
  it("keeps only videos from mixed posts", () => {
    expect(mediaFiles({ ok: true, type: "album", items: [{ type: "photo", download_url: "https://a.cdninstagram.com/photo" }, { type: "video", download_url: "https://a.cdninstagram.com/video" }] })).toHaveLength(1);
  });
  it("accepts a provider-signed youtube tunnel", () => {
    expect(mediaFiles({ ok: true, download_url: "https://api.fastsaver.io/v1/tunnel?id=example" })).toHaveLength(1);
    expect(mediaFiles({ ok: true, download_url: "https://drogon.fastsaver.io/dl?id=example" })).toHaveLength(1);
  });
  it("requires a valid signature and rejects tampering", async () => {
    const token = await createTicket("https://a.cdninstagram.com/video", "video.mp4", "test-only-signing-value");
    expect(await readTicket(token, "test-only-signing-value")).toEqual({ source: "https://a.cdninstagram.com/video", filename: "video.mp4" });
    expect(await readTicket(token, "wrong-signing-value")).toBeNull();
    expect(await readTicket(token + "0", "test-only-signing-value")).toBeNull();
  });
});
