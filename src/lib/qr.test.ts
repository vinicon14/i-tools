import { describe, expect, it } from "vitest";
import { LANGUAGES } from "./i18n";
import { isValidQrUrl } from "./qr";
import { getQrTranslations } from "./qr-translations";

describe("QR generator rules", () => {
  it("accepts complete http(s) URLs and rejects incomplete input", () => {
    expect(isValidQrUrl("https://i-tools.shop")).toBe(true);
    expect(isValidQrUrl("http://example.com/path")).toBe(true);
    expect(isValidQrUrl("https://")).toBe(false);
    expect(isValidQrUrl("not-a-url")).toBe(false);
  });

  it("has equivalent QR UI copy in every supported language", () => {
    for (const language of LANGUAGES) {
      const t = getQrTranslations(language.code);
      expect(t.intro.length).toBeGreaterThan(10);
      expect(t.label.length).toBeGreaterThan(0);
      expect(t.faq).toHaveLength(3);
      expect(t.alt("https://i-tools.shop")).toContain("https://i-tools.shop");
    }
  });
});
