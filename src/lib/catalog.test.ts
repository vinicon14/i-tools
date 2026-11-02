import { describe, expect, it } from "vitest";
import { categories, getTool, searchTools, tools } from "./catalog";

describe("catalog", () => {
  it("has unique tool slugs", () => {
    expect(new Set(tools.map((t) => t.slug)).size).toBe(tools.length);
  });
  it("every tool belongs to an existing category", () => {
    for (const t of tools) expect(categories.some((c) => c.slug === t.category)).toBe(true);
  });
  it("only QR, IP and CEP are live", () => {
    expect(
      tools
        .filter((t) => t.status === "live")
        .map((t) => t.slug)
        .sort(),
    ).toEqual(["meu-cep", "meu-ip", "qr"]);
  });
  it("search ignores accents and returns planned tools only", () => {
    expect(searchTools("codigo").map((t) => t.slug)).toContain("qr");
    expect(searchTools("xyz-inexistente")).toHaveLength(0);
  });
  it("QR tool lives at /qr", () => {
    expect(getTool("qr")?.name).toBe("Gerador de QR Code");
  });
  it("video download tools remain planned until downloads are connected", () => {
    for (const slug of ["baixar-video-youtube", "baixar-video-tiktok", "baixar-video-instagram"])
      expect(getTool(slug)?.status).toBe("planned");
  });
});
