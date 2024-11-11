import { decode } from 'blurhash';

const BLURHASH_SCALE_FACTOR = 4;

export function decode2url(
  hash: string,
  width: number,
  height: number,
): string | undefined {
  const blurWidth = width * BLURHASH_SCALE_FACTOR;
  const blurHeight = height * BLURHASH_SCALE_FACTOR;
  const pixels = decode(hash, blurWidth, blurHeight);
  const canvas = document.createElement('canvas');
  canvas.width = blurWidth;
  canvas.height = blurHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return undefined;
  }

  const imageData = ctx.createImageData(blurWidth, blurHeight);
  imageData.data.set(pixels);
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}
