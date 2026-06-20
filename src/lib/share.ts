/** Turn a data URL into a File for sharing/downloading. */
function dataUrlToFile(dataUrl: string, filename: string): File {
  const [head, b64] = dataUrl.split(",");
  const mime = /data:(.*?);/.exec(head)?.[1] ?? "image/png";
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

export type ShareResult = "shared" | "downloaded";

/**
 * Share a banner image via the Web Share API when files are supported,
 * otherwise trigger a download. Either way the user ends up with the PNG.
 */
export async function shareImage(dataUrl: string, filename: string, text: string): Promise<ShareResult> {
  const file = dataUrlToFile(dataUrl, filename);

  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (nav.share && nav.canShare?.({ files: [file] })) {
    try {
      await nav.share({ files: [file], text, title: "Pocket Trainer" });
      return "shared";
    } catch (err) {
      // User cancelled — don't fall through to a download.
      if (err instanceof DOMException && err.name === "AbortError") return "shared";
    }
  }

  download(dataUrl, filename);
  return "downloaded";
}

export function download(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
