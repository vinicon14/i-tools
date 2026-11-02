export const passwordGroups = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%&*+-=?_",
} as const;

export type PasswordGroup = keyof typeof passwordGroups;

function randomIndex(max: number): number {
  const ceiling = Math.floor(0x100000000 / max) * max;
  const buffer = new Uint32Array(1);
  do {
    globalThis.crypto.getRandomValues(buffer);
  } while ((buffer[0] ?? ceiling) >= ceiling);
  return (buffer[0] ?? 0) % max;
}

export function generatePassword(length: number, groups: PasswordGroup[]): string {
  const selected = [...new Set(groups)];
  if (!Number.isInteger(length) || length < 8 || length > 128)
    throw new Error("Escolha entre 8 e 128 caracteres.");
  if (!selected.length) throw new Error("Selecione pelo menos um tipo de caractere.");
  const pool = selected.map((key) => passwordGroups[key]).join("");
  const result = selected.map((key) => {
    const chars = passwordGroups[key];
    return chars[randomIndex(chars.length)];
  });
  while (result.length < length) result.push(pool[randomIndex(pool.length)]);
  for (let i = result.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result.join("");
}

export function textStats(text: string) {
  const words = text.trim() ? text.trim().split(/\s+/u).length : 0;
  return {
    words,
    characters: Array.from(text).length,
    withoutSpaces: Array.from(text.replace(/\s/gu, "")).length,
    paragraphs: text.split(/\n\s*\n/u).filter((p) => p.trim()).length,
    readingMinutes: Math.ceil(words / 200),
  };
}

export function formatJson(input: string, indent: number | undefined) {
  return JSON.stringify(JSON.parse(input), null, indent);
}

export type PercentageMode = "portion" | "discount" | "increase" | "change";
export function calculatePercentage(mode: PercentageMode, first: number, second: number): number {
  if (!Number.isFinite(first) || !Number.isFinite(second))
    throw new Error("Informe dois números válidos.");
  if (mode === "change") {
    if (first === 0) throw new Error("O valor inicial não pode ser zero.");
    const result = ((second - first) / Math.abs(first)) * 100;
    if (!Number.isFinite(result)) throw new Error("Os valores excedem o limite de cálculo.");
    return result;
  }
  const result =
    mode === "portion"
      ? (first * second) / 100
      : first * (1 + (mode === "discount" ? -second : second) / 100);
  if (!Number.isFinite(result)) throw new Error("Os valores excedem o limite de cálculo.");
  return result;
}
