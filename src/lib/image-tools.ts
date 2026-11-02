export type ImageFormat = "image/jpeg" | "image/png" | "image/webp";
export function imageDimensions(
  width: number,
  height: number,
  target: number,
  axis: "width" | "height",
) {
  if (![width, height, target].every((n) => Number.isInteger(n) && n > 0 && n <= 12000))
    throw new Error("Use dimensões inteiras entre 1 e 12.000 pixels.");
  const result =
    axis === "width"
      ? { width: target, height: Math.max(1, Math.round((height * target) / width)) }
      : { width: Math.max(1, Math.round((width * target) / height)), height: target };
  validateDimensions(result.width, result.height);
  return result;
}
export function validateDimensions(width: number, height: number) {
  if (
    ![width, height].every((n) => Number.isInteger(n) && n > 0 && n <= 12000) ||
    width * height > 24000000
  )
    throw new Error("Use até 12.000 pixels por lado e 24 megapixels no total.");
}
export function checkImage(file: Pick<File, "size" | "type">) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type))
    throw new Error("Escolha uma imagem JPG, PNG ou WebP.");
  if (file.size > 30 * 1024 * 1024) throw new Error("Escolha uma imagem de até 30 MB.");
}
export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
export async function readImage(file: File) {
  checkImage(file);
  const image = await createImageBitmap(file);
  try {
    validateDimensions(image.width, image.height);
    return image;
  } catch (e) {
    image.close();
    throw e;
  }
}
export async function encodeImage(
  image: CanvasImageSource,
  width: number,
  height: number,
  format: ImageFormat,
  quality: number,
) {
  validateDimensions(width, height);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Seu navegador não permite editar imagens.");
  if (format === "image/jpeg") {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(image, 0, 0, width, height);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Não foi possível salvar a imagem."))),
      format,
      quality,
    ),
  );
  if (blob.type !== format) throw new Error("Este formato não é suportado pelo seu navegador.");
  return blob;
}
export const imageExtension = (format: ImageFormat) =>
  format === "image/jpeg" ? "jpg" : format === "image/png" ? "png" : "webp";
export const fileSize = (bytes: number) =>
  bytes < 1024
    ? `${bytes} B`
    : bytes < 1048576
      ? `${(bytes / 1024).toFixed(1)} KB`
      : `${(bytes / 1048576).toFixed(2)} MB`;
