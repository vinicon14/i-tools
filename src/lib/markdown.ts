/** Small, XSS-safe Markdown subset for blog posts. No raw HTML is passed through. */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHref(href: string): string | null {
  const trimmed = href.trim();
  if (trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.includes(":")) return trimmed;
  try {
    const url = new URL(trimmed);
    if (url.protocol === "http:" || url.protocol === "https:" || url.protocol === "mailto:") {
      return url.href;
    }
  } catch {
    return null;
  }
  return null;
}

function inline(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => {
    const safe = safeHref(href.replace(/&amp;/g, "&"));
    if (!safe) return label;
    const external = /^https?:/i.test(safe);
    const rel = external ? ' rel="noopener noreferrer"' : "";
    const target = external ? ' target="_blank"' : "";
    return `<a href="${escapeHtml(safe)}"${rel}${target}>${label}</a>`;
  });
  return out;
}

export function renderMarkdown(source: string): string {
  const lines = (source || "").replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let i = 0;
  let para: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;

  const flushPara = () => {
    if (para.length) {
      html.push(`<p>${inline(para.join(" "))}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list) {
      const tag = list.type;
      html.push(`<${tag}>${list.items.map((item) => `<li>${inline(item)}</li>`).join("")}</${tag}>`);
      list = null;
    }
  };

  while (i < lines.length) {
    const line = lines[i] ?? "";
    if (line.startsWith("```")) {
      flushPara();
      flushList();
      const fence: string[] = [];
      i += 1;
      while (i < lines.length && !(lines[i] ?? "").startsWith("```")) {
        fence.push(lines[i] ?? "");
        i += 1;
      }
      html.push(`<pre><code>${escapeHtml(fence.join("\n"))}</code></pre>`);
      i += 1;
      continue;
    }
    if (/^\s*---+\s*$/.test(line)) {
      flushPara();
      flushList();
      html.push("<hr />");
      i += 1;
      continue;
    }
    const heading = /^(#{1,4})\s+(.+)$/.exec(line);
    if (heading) {
      flushPara();
      flushList();
      const marks = heading[1] ?? "#";
      const title = heading[2] ?? "";
      const level = marks.length;
      html.push(`<h${level}>${inline(title)}</h${level}>`);
      i += 1;
      continue;
    }
    const bq = /^>\s?(.*)$/.exec(line);
    if (bq) {
      flushPara();
      flushList();
      const quote: string[] = [bq[1] ?? ""];
      i += 1;
      while (i < lines.length) {
        const next = /^>\s?(.*)$/.exec(lines[i] ?? "");
        if (!next) break;
        quote.push(next[1] ?? "");
        i += 1;
      }
      html.push(`<blockquote>${inline(quote.join(" "))}</blockquote>`);
      continue;
    }
    const ul = /^[-*]\s+(.+)$/.exec(line);
    if (ul) {
      flushPara();
      if (!list || list.type !== "ul") {
        flushList();
        list = { type: "ul", items: [] };
      }
      list.items.push(ul[1] ?? "");
      i += 1;
      continue;
    }
    const ol = /^\d+\.\s+(.+)$/.exec(line);
    if (ol) {
      flushPara();
      if (!list || list.type !== "ol") {
        flushList();
        list = { type: "ol", items: [] };
      }
      list.items.push(ol[1] ?? "");
      i += 1;
      continue;
    }
    if (!line.trim()) {
      flushPara();
      flushList();
      i += 1;
      continue;
    }
    flushList();
    para.push(line.trim());
    i += 1;
  }
  flushPara();
  flushList();
  return html.join("\n");
}
