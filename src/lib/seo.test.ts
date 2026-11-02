import { describe, expect, it } from "vitest";
import { tools } from "./catalog";
import { pageUrl } from "./seo";

describe("individual public tool URLs", () => {
  it("uses the requested public domain for every tool's own address", () => {
    for (const tool of tools) {
      expect(pageUrl(`/${tool.slug}`)).toBe(`https://i-tools.shop/${tool.slug}`);
    }
  });
  it("rejects other origins and fragments", () => {
    for (const path of ["//other.example/qr", "https://other.example", "/#qr", "/qr?x=1"]) {
      expect(() => pageUrl(path)).toThrow();
    }
  });
});
