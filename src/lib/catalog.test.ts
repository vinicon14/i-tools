import { describe, expect, it } from "vitest";
import { categories, getTool, searchTools, tools } from "./catalog";

describe("catalog", () => {
  it("has unique tool slugs", () => {
    expect(new Set(tools.map((t) => t.slug)).size).toBe(tools.length);
  });
  it("every tool belongs to an existing category", () => {
    for (const t of tools) expect(categories.some((c) => c.slug === t.category)).toBe(true);
  });
  it("no tool is marked live yet", () => {
    expect(tools.filter((t) => t.status === "live")).toHaveLength(0);
  });
  it("search ignores accents and returns planned tools only", () => {
    expect(searchTools("codigo").map((t) => t.slug)).toContain("qr");
    expect(searchTools("xyz-inexistente")).toHaveLength(0);
  });
  it("QR tool lives at /qr", () => {
    expect(getTool("qr")?.name).toBe("Gerador de QR Code");
  });
});
