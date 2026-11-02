import { describe, expect, it } from "vitest";
import { validateVideoLink } from "./video-links";

describe("video link validation", () => {
  it("accepts YouTube watch, shortened and Shorts links", () => {
    for (const url of ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", "https://youtu.be/dQw4w9WgXcQ", "https://youtube.com/shorts/dQw4w9WgXcQ"]) expect(validateVideoLink(url, "youtube").valid).toBe(true);
  });
  it("accepts TikTok video and shared links", () => {
    for (const url of ["https://www.tiktok.com/@perfil/video/7123456789012345678", "https://vm.tiktok.com/ZM123abc/", "https://www.tiktok.com/t/ZM123abc/"]) expect(validateVideoLink(url, "tiktok").valid).toBe(true);
  });
  it("accepts Instagram Reels and posts", () => {
    for (const url of ["https://www.instagram.com/reel/ABC_123/", "https://instagram.com/p/ABC_123/"]) expect(validateVideoLink(url, "instagram").valid).toBe(true);
  });
  it("rejects profiles and unsupported platforms", () => {
    expect(validateVideoLink("https://instagram.com/perfil/", "instagram").valid).toBe(false);
    expect(validateVideoLink("https://tiktok.com/@perfil", "tiktok").valid).toBe(false);
    expect(validateVideoLink("https://youtu.be/dQw4w9WgXcQ", "tiktok").valid).toBe(false);
  });
  it("rejects disguised hosts, unsafe schemes, credentials and ports", () => {
    for (const url of ["https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ", "http://youtube.com/watch?v=dQw4w9WgXcQ", "https://user:pass@youtube.com/watch?v=dQw4w9WgXcQ", "https://youtube.com:8443/watch?v=dQw4w9WgXcQ", "javascript:alert(1)"]) expect(validateVideoLink(url, "youtube").valid).toBe(false);
  });
});