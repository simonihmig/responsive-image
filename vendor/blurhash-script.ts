import { decode } from 'blurhash';

const BLURHASH_ATTRIBUTE = 'data-eri-bh';
const WIDTH_ATTRIBUTE = 'data-eri-bh-w';
const HEIGHT_ATTRIBUTE = 'data-eri-bh-h';

declare const FastBoot: unknown | undefined;

function bh2url(
  hash: string,
  width: number,
  height: number
): string | undefined {
  const blurWidth = width * 40;
  const blurHeight = height * 40;
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
  const uri = canvas.toDataURL('image/png');

  return `url("${uri}")`;
}

function applySSR(): void {
  const images = document.querySelectorAll<HTMLImageElement>(
    `img[${BLURHASH_ATTRIBUTE}]`
  );
  images.forEach((image) => {
    const hash = image.getAttribute(BLURHASH_ATTRIBUTE);
    const width = image.getAttribute(WIDTH_ATTRIBUTE);
    const height = image.getAttribute(HEIGHT_ATTRIBUTE);

    if (hash && width && height) {
      const url = bh2url(hash, parseInt(width, 10), parseInt(height, 10));
      if (url) {
        image.style.backgroundImage = url;
        image.style.backgroundSize = 'cover';
      }
    }
  });
}

export { bh2url, applySSR };

if (typeof FastBoot === 'undefined') {
  applySSR();
}
