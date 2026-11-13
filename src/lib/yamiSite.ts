/** Site próprio da YAMI. Compra, conta, download e painel remoto ficam lá. */
export const YAMI_SITE_URL =
  "https://yami-site-pi.vercel.app";

export function yamiHref(path = "/", content?: string): string {
  const url = new URL(path, YAMI_SITE_URL);
  url.searchParams.set("utm_source", "itools");
  url.searchParams.set("utm_medium", "referral");
  url.searchParams.set("utm_campaign", "yami");
  if (content) url.searchParams.set("utm_content", content);
  return url.toString();
}
