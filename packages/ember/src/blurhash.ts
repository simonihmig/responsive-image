import { decode } from 'blurhash';

const BLURHASH_ATTRIBUTE = 'data-ri-bh';
const WIDTH_ATTRIBUTE = 'data-ri-bh-w';
const HEIGHT_ATTRIBUTE = 'data-ri-bh-h';

const BLURHASH_SCALE_FACTOR = 4;

export function bh2url(
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

export function applySSR(): void {
  const images = document.querySelectorAll<HTMLImageElement>(
    `img[${BLURHASH_ATTRIBUTE}]`,
  );
  images.forEach((image) => {
    const hash = image.getAttribute(BLURHASH_ATTRIBUTE);
    const width = image.getAttribute(WIDTH_ATTRIBUTE);
    const height = image.getAttribute(HEIGHT_ATTRIBUTE);

    if (hash && width && height) {
      const url = bh2url(hash, parseInt(width, 10), parseInt(height, 10));
      if (url) {
        image.style.backgroundImage = `url("${url}")`;
        image.style.backgroundSize = 'cover';
      }
    }
  });
}
