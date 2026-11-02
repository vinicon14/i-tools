export const videoPlatforms = {
  youtube: {
    name: "YouTube",
    slug: "baixar-video-youtube",
    example: "https://www.youtube.com/watch?v=...",
    formats: "Vídeos e Shorts",
  },
  tiktok: {
    name: "TikTok",
    slug: "baixar-video-tiktok",
    example: "https://www.tiktok.com/@perfil/video/...",
    formats: "Vídeos públicos",
  },
  instagram: {
    name: "Instagram",
    slug: "baixar-video-instagram",
    example: "https://www.instagram.com/reel/...",
    formats: "Reels e publicações com vídeo",
  },
} as const;

export type VideoPlatform = keyof typeof videoPlatforms;
export type VideoLinkResult = { valid: true; url: string } | { valid: false; error: string };

/** Validate only the link shape; this does not establish availability or download rights. */
export function validateVideoLink(input: string, platform: VideoPlatform): VideoLinkResult {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return { valid: false, error: "Cole um link completo, começando com https://." };
  }
  if (url.protocol !== "https:" || url.username || url.password || url.port) {
    return { valid: false, error: "Use um link HTTPS sem dados de acesso ou porta personalizada." };
  }
  const host = url.hostname.toLowerCase();
  let supported = false;
  if (platform === "youtube") {
    if (host === "youtu.be") supported = /^\/[a-zA-Z0-9_-]{11}\/?$/.test(url.pathname);
    if (["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com"].includes(host)) {
      supported =
        (url.pathname === "/watch" &&
          /^[a-zA-Z0-9_-]{11}$/.test(url.searchParams.get("v") ?? "")) ||
        /^\/(shorts|live)\/[a-zA-Z0-9_-]{11}\/?$/.test(url.pathname);
    }
  } else if (platform === "tiktok") {
    if (["www.tiktok.com", "tiktok.com", "m.tiktok.com"].includes(host))
      supported = /^\/@[^/]+\/video\/\d+\/?$/.test(url.pathname);
    if (["vm.tiktok.com", "vt.tiktok.com"].includes(host))
      supported = /^\/[a-zA-Z0-9]+\/?$/.test(url.pathname);
    if (["www.tiktok.com", "tiktok.com"].includes(host))
      supported ||= /^\/t\/[a-zA-Z0-9]+\/?$/.test(url.pathname);
  } else if (["instagram.com", "www.instagram.com", "m.instagram.com"].includes(host)) {
    supported = /^\/(reel|reels|p)\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname);
  }
  if (!supported)
    return {
      valid: false,
      error: `Use um link de vídeo do ${videoPlatforms[platform].name}, não um perfil ou outra página.`,
    };
  url.hash = "";
  return { valid: true, url: url.toString() };
}
