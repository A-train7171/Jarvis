/**
 * Center-crop an image File to a square and downscale it to a JPEG data URL.
 *
 * Uses createImageBitmap with EXIF orientation handling when available (so
 * iPhone photos aren't rotated), falling back to an <img> decode. Throws a
 * clear error if the file can't be decoded (e.g. an unsupported HEIC on a
 * browser that can't read it) so the caller can tell the user.
 */
export async function processAvatar(file: File, target = 256): Promise<string> {
  const source = await decode(file);
  const sw = "width" in source ? source.width : 0;
  const sh = "height" in source ? source.height : 0;
  if (!sw || !sh) throw new Error("Could not read that image.");

  const side = Math.min(sw, sh);
  const sx = (sw - side) / 2;
  const sy = (sh - side) / 2;

  const canvas = document.createElement("canvas");
  canvas.width = target;
  canvas.height = target;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported on this device.");
  ctx.drawImage(source as CanvasImageSource, sx, sy, side, side, 0, 0, target, target);
  if ("close" in source) (source as ImageBitmap).close();

  return canvas.toDataURL("image/jpeg", 0.85);
}

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");
  // Preferred path: respects EXIF orientation and decodes more formats.
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      /* fall through to <img> */
    }
  }
  return loadImage(file);
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that photo. Try a JPG or PNG."));
    };
    img.src = url;
  });
}
