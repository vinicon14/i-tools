/** Accept complete http(s) addresses the QR generator can encode. */
export function isValidQrUrl(url: string): boolean {
  return /^https?:\/\/\S+\.\S+/.test(url.trim());
}
