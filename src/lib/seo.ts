export const SITE_ORIGIN = "https://jeito-facil-ferramentas-livres.lovable.app";

/** Always identify the current public page, never a preview or another origin. */
export function pageUrl(path: string): string {
  if (!path.startsWith("/") || path.startsWith("//") || /[?#\\]/.test(path)) {
    throw new Error("Expected a public page path");
  }
  return new URL(path, SITE_ORIGIN).href;
}