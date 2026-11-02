import { describe, expect, it } from "vitest";
import { calculatePercentage, formatJson, generatePassword, passwordGroups, textStats } from "./everyday-tools";

describe("passwords", () => {
  it("generates the requested length with every selected group", () => {
    const groups = ["lowercase", "uppercase", "numbers", "symbols"] as const;
    const password = generatePassword(20, [...groups]);
    expect(password).toHaveLength(20);
    for (const group of groups) expect([...password].some((c) => passwordGroups[group].includes(c))).toBe(true);
  });
  it("uses only selected characters", () => { expect(generatePassword(32, ["numbers"])).toMatch(/^\d{32}$/); });
  it("rejects invalid length or no groups", () => { expect(() => generatePassword(7, ["numbers"])).toThrow(); expect(() => generatePassword(129, ["numbers"])).toThrow(); expect(() => generatePassword(20, [])).toThrow(); });
});
describe("text statistics", () => {
  it("counts words, Unicode characters and paragraphs", () => { expect(textStats("Olá mundo\n\nOi 😀")).toEqual({ words: 4, characters: 15, withoutSpaces: 11, paragraphs: 2, readingMinutes: 1 }); });
  it("counts empty text as zero", () => { expect(textStats("").words).toBe(0); expect(textStats("").readingMinutes).toBe(0); });
  it("estimates reading time at 200 words per minute", () => { expect(textStats(Array(201).fill("palavra").join(" ")).readingMinutes).toBe(2); });
});
describe("JSON", () => {
  it("formats and compacts valid JSON", () => { expect(formatJson('{"a":1}', 2)).toBe('{\n  "a": 1\n}'); expect(formatJson('{ "a": 1 }', undefined)).toBe('{"a":1}'); });
  it("rejects invalid JSON", () => { expect(() => formatJson('{"a":}', 2)).toThrow(); });
});
describe("percentages", () => {
  it("calculates a portion", () => { expect(calculatePercentage("portion", 200, 15)).toBe(30); });
  it("calculates a discount", () => { expect(calculatePercentage("discount", 200, 15)).toBe(170); });
  it("calculates an increase", () => { expect(calculatePercentage("increase", 200, 15)).toBeCloseTo(230); });
  it("calculates percentage change", () => { expect(calculatePercentage("change", 200, 230)).toBe(15); expect(calculatePercentage("change", 200, 170)).toBe(-15); });
  it("rejects a zero baseline", () => { expect(() => calculatePercentage("change", 0, 10)).toThrow(); });
  it("rejects nonfinite results", () => { expect(() => calculatePercentage("portion", Infinity, 2)).toThrow(); });
});