import { decode2url } from './decode';

const BLURHASH_ATTRIBUTE = 'data-ri-bh';
const WIDTH_ATTRIBUTE = 'data-ri-bh-w';
const HEIGHT_ATTRIBUTE = 'data-ri-bh-h';

export function applySSR(): void {
  const images = document.querySelectorAll<HTMLImageElement>(
    `img[${BLURHASH_ATTRIBUTE}]`,
  );
  images.forEach((image) => {
    const hash = image.getAttribute(BLURHASH_ATTRIBUTE);
    const width = image.getAttribute(WIDTH_ATTRIBUTE);
    const height = image.getAttribute(HEIGHT_ATTRIBUTE);

    if (hash && width && height) {
      const url = decode2url(hash, parseInt(width, 10), parseInt(height, 10));
      if (url) {
        image.style.backgroundImage = `url("${url}")`;
        image.style.backgroundSize = 'cover';
      }
    }
  });
}
