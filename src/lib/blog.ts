import { renderMarkdown } from "./markdown";

export const BLOG_CATEGORIES = [
  "tecnologia",
  "ia",
  "automacao",
  "investimentos",
  "ferramentas",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  tecnologia: "Tecnologia",
  ia: "Inteligência artificial",
  automacao: "Automação",
  investimentos: "Investimentos",
  ferramentas: "Ferramentas",
};

export const INVESTMENT_DISCLAIMER =
  "Este texto é apenas informativo e educacional. Não é recomendação de investimento.";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: BlogCategory;
  tags: string[];
  body: string;
  html: string;
  path: string;
}

const rawPosts = import.meta.glob("../../content/blog/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function isCategory(value: string): value is BlogCategory {
  return (BLOG_CATEGORIES as readonly string[]).includes(value);
}

function parseTags(value: string): string[] {
  const inner = value.trim().replace(/^\[/, "").replace(/\]$/, "");
  return inner
    .split(",")
    .map((tag) => tag.trim().replace(/^["']|["']$/g, ""))
    .filter(Boolean)
    .slice(0, 8);
}

function slugFromFilename(path: string): string {
  const name = path.split("/").pop() ?? path;
  return name.replace(/\.md$/i, "");
}

/** Parse a Markdown file with YAML-like frontmatter. Exported for tests. */
export function parseBlogMarkdown(filename: string, raw: string): BlogPost | null {
  const text = raw.replace(/^\uFEFF/, "").replace(/\r\n/g, "\n");
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(text);
  if (!match) return null;
  const fm = match[1] ?? "";
  const body = (match[2] ?? "").trim();
  const fields: Record<string, string> = {};
  for (const line of fm.split("\n")) {
    const idx = line.indexOf(":");
    if (idx <= 0) continue;
    fields[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  const title = (fields["title"] || "").replace(/^["']|["']$/g, "").trim();
  const description = (fields["description"] || "").replace(/^["']|["']$/g, "").trim();
  const date = (fields["date"] || "").trim();
  const categoryRaw = (fields["category"] || "").replace(/^["']|["']$/g, "").trim().toLowerCase();
  if (!title || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date) || !isCategory(categoryRaw)) {
    return null;
  }
  const slug = (fields["slug"] || slugFromFilename(filename)).trim();
  if (!slug || /[^a-z0-9-]/i.test(slug)) return null;
  return {
    slug,
    title,
    description,
    date,
    category: categoryRaw,
    tags: parseTags(fields["tags"] || ""),
    body,
    html: renderMarkdown(body),
    path: `/blog/${slug}`,
  };
}

function loadAll(): BlogPost[] {
  const posts: BlogPost[] = [];
  for (const [path, raw] of Object.entries(rawPosts)) {
    if (typeof raw !== "string") continue;
    const post = parseBlogMarkdown(path, raw);
    if (post) posts.push(post);
  }
  return posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.slug.localeCompare(b.slug)));
}

let cache: BlogPost[] | null = null;

export function listBlogPosts(category?: BlogCategory): BlogPost[] {
  if (!cache) cache = loadAll();
  if (!category) return cache;
  return cache.filter((post) => post.category === category);
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return listBlogPosts().find((post) => post.slug === slug);
}

export function formatBlogDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return date;
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(Date.UTC(year, month - 1, day, 12)));
}
