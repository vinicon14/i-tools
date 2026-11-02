import { PDFDocument, StandardFonts } from 'pdf-lib';
import { encodeImage, readImage } from './image-tools';
export function checkPdfInput(file: Pick<File, 'size' | 'type' | 'name'>) {
  if (file.size > 30 * 1024 * 1024) throw new Error('Cada arquivo deve ter até 30 MB.');
  if (!['image/jpeg', 'image/png', 'image/webp', 'text/plain', 'application/pdf'].includes(file.type) && !/\.(pdf|txt)$/i.test(file.name)) throw new Error('Escolha JPG, PNG, WebP, TXT ou PDF.');
}
export function wrapPdfText(text: string, measure: (s: string) => number, width: number): string[] {
  const lines: string[] = [];
  for (const paragraph of text.replace(/\r\n?/g, '\n').replace(/\t/g, '    ').split('\n')) {
    let line = ''; for (const char of paragraph) { if (line && measure(line + char) > width) { lines.push(line); line = ''; } line += char; } lines.push(line);
  }
  return lines;
}
export async function createPdf(files: File[]) {
  if (files.length === 0 || files.length > 30) throw new Error('Escolha entre 1 e 30 arquivos.');
  const doc = await PDFDocument.create(); const font = await doc.embedFont(StandardFonts.Helvetica);
  for (const file of files) {
    checkPdfInput(file);
    if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) throw new Error('Para criar um PDF, escolha imagens ou TXT.');
    if (file.type === 'text/plain' || /\.txt$/i.test(file.name)) {
      const text = await file.text(); if (text.length > 200000) throw new Error('Use textos de até 200 mil caracteres.');
      try { font.encodeText(text.replace(/[\r\n\t]/g, '')); } catch { throw new Error('Este TXT contém caracteres não suportados. Use texto latino, sem emojis.'); }
      const lines = wrapPdfText(text, s => font.widthOfTextAtSize(s, 12), 499);
      for (let offset = 0; offset < lines.length; offset += 46) { const page = doc.addPage([595, 842]); lines.slice(offset, offset + 46).forEach((line, i) => { page.drawText(line, { x: 48, y: 786 - i * 16, size: 12, font }); }); }
    } else {
      const bitmap = await readImage(file);
      try { const png = await encodeImage(bitmap, bitmap.width, bitmap.height, 'image/png', 1); const image = await doc.embedPng(await png.arrayBuffer()); const landscape = image.width > image.height; const page = doc.addPage(landscape ? [842, 595] : [595, 842]); const scale = Math.min((page.getWidth() - 48) / image.width, (page.getHeight() - 48) / image.height); const width = image.width * scale, height = image.height * scale; page.drawImage(image, { x: (page.getWidth() - width) / 2, y: (page.getHeight() - height) / 2, width, height }); } finally { bitmap.close(); }
    }
  }
  return new Blob([new Uint8Array(await doc.save())], { type: 'application/pdf' });
}
export async function pdfToImages(file: File, progress: (current: number, total: number) => void) {
  checkPdfInput(file);
  const pdfjs = await import('pdfjs-dist');
  const worker = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const task = pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), isEvalSupported: false });
  try {
    const doc = await task.promise;
    if (doc.numPages > 50) throw new Error('Converta PDFs com até 50 páginas.');
    const images: { name: string; blob: Blob }[] = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i); const initial = page.getViewport({ scale: 1.5 }); const scale = Math.min(1.5, 4000 / Math.max(initial.width / 1.5, initial.height / 1.5)); const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
      await page.render({ canvas, viewport }).promise;
      const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Não foi possível converter esta página.')), 'image/png'));
      images.push({ name: `pagina-${String(i).padStart(3, '0')}.png`, blob }); canvas.width = 0; canvas.height = 0; page.cleanup(); progress(i, doc.numPages);
    }
    return images;
  } catch (e) { if (e instanceof Error && e.name === 'PasswordException') throw new Error('Este PDF tem senha. Remova a proteção antes de converter.'); throw e; } finally { await task.destroy(); }
}
