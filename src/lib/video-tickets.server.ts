import { allowedMediaUrl, safeFilename } from "./video-download";

async function signature(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}
export async function createTicket(source: string, filename: string, secret: string): Promise<string> {
  const payload = btoa(JSON.stringify({ source, filename: safeFilename(filename), expires: Date.now() + 240_000 }));
  return `${payload}.${await signature(payload, secret)}`;
}
export async function readTicket(token: string, secret: string): Promise<{ source: string; filename: string } | null> {
  try {
    if (token.length > 14000) return null;
    const [payload, sig] = token.split(".");
    if (!payload || !sig || token.split(".").length !== 2) return null;
    const expected = await signature(payload, secret);
    if (expected.length !== sig.length) return null;
    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) mismatch |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
    if (mismatch) return null;
    const data = JSON.parse(atob(payload));
    if (typeof data.source !== "string" || typeof data.expires !== "number" || data.expires <= Date.now() || !allowedMediaUrl(data.source)) return null;
    return { source: data.source, filename: safeFilename(data.filename) };
  } catch { return null; }
}
