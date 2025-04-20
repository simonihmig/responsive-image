import { decode2url } from './decode';

const LQIP_ATTRIBUTE = 'data-ri-lqip';

export function applySSR(): void {
  const images = document.querySelectorAll<HTMLImageElement>(
    `img[${LQIP_ATTRIBUTE}^="bh:"]`,
  );

  images.forEach((image) => {
    const value = image.getAttribute(LQIP_ATTRIBUTE);
    if (!value) {
      return;
    }

    const matches = /bh:([0-9]+):([0-9]+):(.+)/.exec(value);

    if (!matches) {
      return;
    }

    const [, width, height, hash] = matches;

    if (hash && width && height) {
      const url = decode2url(hash, parseInt(width, 10), parseInt(height, 10));
      if (url) {
        image.style.backgroundImage = `url("${url}")`;
      }
    }
  });
}
