import { createFileRoute } from "@tanstack/react-router";
import { SITE_ORIGIN } from "@/lib/seo";
import { listBlogPosts } from "@/lib/blog";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}


const WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

function rfc822(date: string): string {
  const parts = date.split("-").map(Number);
  const year = parts[0] ?? 0;
  const month = parts[1] ?? 1;
  const day = parts[2] ?? 1;
  const utc = new Date(Date.UTC(year, month - 1, day, 15, 0, 0)); // 12:00 in America/Sao_Paulo (UTC-3)
  const monthName = MONTH[month - 1] ?? "Jan";
  return `${WEEK[utc.getUTCDay()]}, ${String(day).padStart(2, "0")} ${monthName} ${year} 12:00:00 -0300`;
}

function rssXml(): string {
  const posts = listBlogPosts();
  const channelLink = `${SITE_ORIGIN}/blog`;
  const items = posts
    .map((post) => {
      const link = `${SITE_ORIGIN}${post.path}`;
      const pub = rfc822(post.date);
      return (
        `<item>` +
        `<title>${escapeXml(post.title)}</title>` +
        `<link>${escapeXml(link)}</link>` +
        `<guid isPermaLink="true">${escapeXml(link)}</guid>` +
        `<pubDate>${escapeXml(pub)}</pubDate>` +
        `<category>${escapeXml(post.category)}</category>` +
        `<description>${escapeXml(post.description || post.title)}</description>` +
        `</item>`
      );
    })
    .join("");
  return (
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0">` +
    `<channel>` +
    `<title>Blog do i-Tools</title>` +
    `<link>${escapeXml(channelLink)}</link>` +
    `<description>Tecnologia, inteligência artificial, automação, investimentos e ferramentas.</description>` +
    `<language>pt-BR</language>` +
    items +
    `</channel>` +
    `</rss>`
  );
}

export const Route = createFileRoute("/blog/rss.xml")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      GET: async () =>
        new Response(rssXml(), {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
