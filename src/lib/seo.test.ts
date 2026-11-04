import { describe, expect, it } from "vitest";
import { tools } from "./catalog";
import { pageUrl, getSeoLinks } from "./seo";

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
  it("preserves one self-referencing canonical with language alternates", () => {
    for (const path of ['/', '/qr', '/categorias/imagens']) {
      expect(getSeoLinks(path).filter(link => link.rel === 'canonical')).toEqual([{ rel: 'canonical', href: `https://i-tools.shop${path}` }]);
      expect(getSeoLinks(path, 'en').filter(link => link.rel === 'canonical')).toEqual([{ rel: 'canonical', href: `https://i-tools.shop/en${path === '/' ? '' : path}` }]);
    }
  });
});
