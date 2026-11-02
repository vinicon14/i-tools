import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import { checkImage, imageDimensions, validateDimensions } from './image-tools';
import { contrastRatio, hexToRgb, makePalette } from './palette-tools';
import { countdownDuration, elapsedTime, formatTime, pomodoroDuration, remainingTime } from './timer-tools';
import { checkPdfInput, createPdf, wrapPdfText } from './pdf-tools';
describe('image processing rules', () => {
  it('preserves aspect ratio in both axes', () => { expect(imageDimensions(800, 400, 200, 'width')).toEqual({ width: 200, height: 100 }); expect(imageDimensions(800, 400, 100, 'height')).toEqual({ width: 200, height: 100 }); });
  it('rejects unsafe and fractional canvas dimensions', () => { for (const [w, h] of [[0, 1], [1.5, 2], [12001, 1], [6000, 6000]] as const) expect(() => validateDimensions(w, h)).toThrow(); });
  it('accepts supported formats and rejects large or unsupported files', () => { expect(() => checkImage({ size: 100, type: 'image/webp' })).not.toThrow(); expect(() => checkImage({ size: 31 * 1024 * 1024, type: 'image/png' })).toThrow(); expect(() => checkImage({ size: 1, type: 'image/svg+xml' })).toThrow(); });
});
describe('palette transformations', () => {
  it('converts HEX to concrete RGB values', () => { expect(hexToRgb('#FF5A1F')).toEqual({ r: 255, g: 90, b: 31 }); expect(() => hexToRgb('#XYZ123')).toThrow(); });
  it('creates five colors with the selected base for each harmony', () => { for (const mode of ['analogous', 'complementary', 'monochrome'] as const) { const colors = makePalette('#FF5A1F', mode); expect(colors).toHaveLength(5); expect(colors[2]).toBe('#FF5A1F'); expect(new Set(colors).size).toBe(5); colors.forEach(hexToRgb); } });
  it('calculates black and white contrast as 21', () => expect(contrastRatio('#000000', '#FFFFFF')).toBe(21));
});
describe('timer calculations', () => {
  it('uses elapsed wall time and freezes when paused', () => { expect(elapsedTime(500, 1000, 3500)).toBe(3000); expect(elapsedTime(500, null, 3500)).toBe(500); });
  it('never displays negative remaining time', () => expect(remainingTime(2000, 3000)).toBe(0));
  it('validates countdown input', () => { expect(countdownDuration(0, 2)).toBe(2000); expect(() => countdownDuration(0, 0)).toThrow(); expect(() => countdownDuration(1, 60)).toThrow(); });
  it('uses 25-minute focus and 5-minute breaks', () => { expect(pomodoroDuration('focus')).toBe(1500000); expect(pomodoroDuration('break')).toBe(300000); });
  it('formats hours without losing elapsed time', () => expect(formatTime(3661000)).toBe('01:01:01'));
});
describe('PDF conversion', () => {
  it('wraps long text and preserves blank lines', () => expect(wrapPdfText('abcdef\n\nxy', s => s.length, 3)).toEqual(['abc', 'def', '', 'xy']));
  it('produces a readable PDF from Portuguese text', async () => { const file = { size: 10, type: 'text/plain', name: 'texto.txt', text: async () => 'Olá, ação e café.' } as File; const blob = await createPdf([file]); const bytes = await new Promise<ArrayBuffer>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => reader.result instanceof ArrayBuffer ? resolve(reader.result) : reject(new Error('Invalid PDF')); reader.onerror = reject; reader.readAsArrayBuffer(blob); }); const doc = await PDFDocument.load(new Uint8Array(bytes)); expect(doc.getPageCount()).toBe(1); });
  it('rejects unsupported Word files instead of implying conversion', () => expect(() => checkPdfInput({ size: 10, type: 'application/msword', name: 'arquivo.doc' })).toThrow());
  it('rejects an empty selection', async () => await expect(createPdf([])).rejects.toThrow());
});
