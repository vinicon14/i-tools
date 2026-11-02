export type PaletteMode = 'analogous' | 'complementary' | 'monochrome';
export function hexToRgb(hex: string) {
  if (!/^#[\da-f]{6}$/i.test(hex)) throw new Error('Use um código HEX com seis dígitos, como #FF5A1F.');
  const value = parseInt(hex.slice(1), 16); return { r: value >> 16, g: (value >> 8) & 255, b: value & 255 };
}
function hslToHex(h: number, s: number, l: number) {
  h = (h % 360 + 360) % 360; s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const channel = (n: number) => { const k = (n + h / 30) % 12; return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0'); };
  return `#${channel(0)}${channel(8)}${channel(4)}`.toUpperCase();
}
export function makePalette(hex: string, mode: PaletteMode): string[] {
  const rgb = hexToRgb(hex); const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min, l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  const h = d === 0 ? 0 : 60 * (max === r ? ((g - b) / d + (g < b ? 6 : 0)) : max === g ? ((b - r) / d + 2) : ((r - g) / d + 4));
  return [-2, -1, 0, 1, 2].map(i => i === 0 ? hex.toUpperCase() : mode === 'monochrome' ? hslToHex(h, s * 100, Math.max(8, Math.min(92, l * 100 + i * 18))) : hslToHex(h + (mode === 'analogous' ? i * 25 : i < 0 ? i * 15 : 180 + (i - 1) * 20), Math.max(s * 100, 35), Math.max(25, Math.min(75, l * 100 + i * 6))));
}
export function contrastRatio(first: string, second: string) {
  const lum = (hex: string) => { const rgb = hexToRgb(hex); const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(v => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return r * 0.2126 + g * 0.7152 + b * 0.0722; };
  const a = lum(first), b = lum(second); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
export function randomColor() { const a = new Uint8Array(3); crypto.getRandomValues(a); return '#' + Array.from(a, v => v.toString(16).padStart(2, '0')).join('').toUpperCase(); }
