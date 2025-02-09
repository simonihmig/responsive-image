import { decode2url } from './decode';

const THUMBHASH_ATTRIBUTE = 'data-ri-th';

export function applySSR(): void {
  const images = document.querySelectorAll<HTMLImageElement>(
    `img[${THUMBHASH_ATTRIBUTE}]`,
  );
  images.forEach((image) => {
    const hash = image.getAttribute(THUMBHASH_ATTRIBUTE);

    if (hash) {
      const url = decode2url(hash);
      if (url) {
        image.style.backgroundImage = `url("${url}")`;
        image.style.backgroundSize = 'cover';
      }
    }
  });
}
