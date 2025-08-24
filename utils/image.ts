import { createHash } from "crypto";

export default async function getImageData(
  image: File
): Promise<{ dataUrl: string; hash: string }> {
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64String = buffer.toString("base64");
  const mimeType = image.type;

  const dataUrl = `data:${mimeType};base64,${base64String}`;

  return { dataUrl, hash: getHash(buffer) };
}

function getHash(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}
