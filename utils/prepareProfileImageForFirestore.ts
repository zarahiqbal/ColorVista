import { File } from "expo-file-system";

/** Firestore document ~1 MiB; keep image payload well under after other fields. */
const MAX_BASE64_CHARS = 600_000;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  let binary = "";
  for (let i = 0; i < bytes.length; i += chunk) {
    const sub = bytes.subarray(i, i + chunk);
    binary += String.fromCharCode.apply(null, sub as unknown as number[]);
  }
  return btoa(binary);
}

function sniffMime(buf: ArrayBuffer): string {
  const b = new Uint8Array(buf.slice(0, 12));
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    b.length >= 8 &&
    b[0] === 0x89 &&
    b[1] === 0x50 &&
    b[2] === 0x4e &&
    b[3] === 0x47
  ) {
    return "image/png";
  }
  if (b.length >= 4 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) {
    return "image/gif";
  }
  if (b.length >= 4 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46) {
    return "image/webp";
  }
  return "image/jpeg";
}

/**
 * Reads a local image URI as base64 for Firestore (no native image-manipulator).
 * Use a lower `quality` in ImagePicker to stay under size limits, or pick a smaller photo.
 */
export async function prepareProfileImageForFirestore(
  localUri: string,
): Promise<{ base64: string; mime: string }> {
  const file = new File(localUri);
  const buf = await file.arrayBuffer();
  const mime = sniffMime(buf);
  const base64 = arrayBufferToBase64(buf);

  if (base64.length > MAX_BASE64_CHARS) {
    throw new Error(
      "This photo is too large for your profile. Choose a smaller image, or take a new photo with the camera (cropped square helps).",
    );
  }

  return { base64, mime };
}
