export default async function getDataUrl(image: File): Promise<string> {
  const arrayBuffer = await image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64String = buffer.toString("base64");
  const mimeType = image.type;

  const dataUrl = `data:${mimeType};base64,${base64String}`;

  return dataUrl;
}
