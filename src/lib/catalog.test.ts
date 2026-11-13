import { describe, expect, it } from "vitest";
import { categories, getTool, searchTools, tools } from "./catalog";

describe("catalog", () => {
  it("has unique tool slugs", () => {
    expect(new Set(tools.map((t) => t.slug)).size).toBe(tools.length);
  });
  it("every tool belongs to an existing category", () => {
    for (const t of tools) expect(categories.some((c) => c.slug === t.category)).toBe(true);
  });
  it("marks all sixteen implemented tools live", () => {
    expect(
      tools
        .filter((t) => t.status === "live")
        .map((t) => t.slug)
        .sort(),
    ).toEqual([
      "baixar-video-instagram",
      "baixar-video-tiktok",
      "baixar-video-youtube",
      "comprimir-imagem",
      "contador-de-palavras",
      "cronometro",
      "json",
      "meu-cep",
      "meu-ip",
      "paleta-de-cores",
      "pdf",
      "porcentagem",
      "qr",
      "redimensionar-imagem",
      "senhas",
      "yami",
    ]);
  });
  it("search ignores accents and returns matching tools", () => {
    expect(searchTools("codigo").map((t) => t.slug)).toContain("qr");
    expect(searchTools("xyz-inexistente")).toHaveLength(0);
  });
  it("QR tool lives at /qr", () => {
    expect(getTool("qr")?.name).toBe("Gerador de QR Code");
  });
  it("marks tools with equivalent localized pages", () => {
    expect(getTool("qr")?.localized).toBe(true);
    expect(getTool("meu-cep")?.localized).toBe(true);
    for (const slug of ["baixar-video-youtube", "baixar-video-tiktok", "baixar-video-instagram"]) {
      expect(getTool(slug)?.localized).toBe(true);
    }
    expect(getTool("json")?.localized).toBeFalsy();
  });
  it("marks video downloads live after real files were verified", () => {
    for (const slug of ["baixar-video-youtube", "baixar-video-tiktok", "baixar-video-instagram"])
      expect(getTool(slug)?.status).toBe("live");
  });
});
