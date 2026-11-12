import { describe, expect, it } from "vitest";
import { renderMarkdown } from "./markdown";
import {
  BLOG_CATEGORIES,
  INVESTMENT_DISCLAIMER,
  formatBlogDate,
  getBlogPost,
  listBlogPosts,
  parseBlogMarkdown,
} from "./blog";

describe("parseBlogMarkdown", () => {
  const raw = `---
title: Título de teste
description: Uma descrição curta.
date: 2026-11-11
category: ferramentas
tags: [um, dois]
---

Primeiro parágrafo com um [link](/qr).

## Subtítulo

Texto.
`;

  it("reads frontmatter and body", () => {
    const post = parseBlogMarkdown("titulo-de-teste.md", raw);
    expect(post).not.toBeNull();
    expect(post?.title).toBe("Título de teste");
    expect(post?.description).toBe("Uma descrição curta.");
    expect(post?.date).toBe("2026-11-11");
    expect(post?.category).toBe("ferramentas");
    expect(post?.tags).toEqual(["um", "dois"]);
    expect(post?.path).toBe("/blog/titulo-de-teste");
    expect(post?.body).toContain("Primeiro parágrafo");
    expect(post?.html).toContain("<h2>");
    expect(post?.html).toContain('href="/qr"');
  });

  it("rejects unknown categories and bad dates", () => {
    expect(
      parseBlogMarkdown(
        "x.md",
        "---\ntitle: A\ndescription: B\ndate: 11/11/2026\ncategory: ferramentas\n---\nOi\n",
      ),
    ).toBeNull();
    expect(
      parseBlogMarkdown(
        "x.md",
        "---\ntitle: A\ndescription: B\ndate: 2026-11-11\ncategory: futebol\n---\nOi\n",
      ),
    ).toBeNull();
  });
});

describe("renderMarkdown", () => {
  it("escapes raw HTML", () => {
    const html = renderMarkdown('Olá <script>alert("x")</script>');
    expect(html).not.toContain("<script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("ignores javascript: links", () => {
    const html = renderMarkdown("[x](javascript:alert(1))");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("x");
  });
});

describe("shipped posts", () => {
  it("has one post in every category", () => {
    const posts = listBlogPosts();
    expect(posts.length).toBeGreaterThanOrEqual(BLOG_CATEGORIES.length);
    for (const category of BLOG_CATEGORIES) {
      expect(listBlogPosts(category).length).toBeGreaterThan(0);
    }
  });

  it("gives investment posts the disclaimer", () => {
    const posts = listBlogPosts("investimentos");
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(post.body).toContain(INVESTMENT_DISCLAIMER);
    }
  });

  it("finds a post by slug", () => {
    const first = listBlogPosts()[0];
    expect(first).toBeDefined();
    if (!first) return;
    expect(getBlogPost(first.slug)?.title).toBe(first.title);
    expect(getBlogPost("nao-existe")).toBeUndefined();
  });

  it("formats dates in pt-BR", () => {
    expect(formatBlogDate("2026-11-11")).toMatch(/novembro/i);
    expect(formatBlogDate("2026-11-11")).toContain("2026");
  });
});
