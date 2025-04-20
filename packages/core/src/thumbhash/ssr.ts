import { decode2url } from './decode';

const LQIP_ATTRIBUTE = 'data-ri-lqip';

export function applySSR(): void {
  const images = document.querySelectorAll<HTMLImageElement>(
    `img[${LQIP_ATTRIBUTE}^="th:"]`,
  );

  images.forEach((image) => {
    const value = image.getAttribute(LQIP_ATTRIBUTE);
    if (!value) {
      return;
    }

    const matches = /th:(.+)/.exec(value);

    if (!matches) {
      return;
    }

    const [, hash] = matches;

    if (hash) {
      const url = decode2url(hash);
      if (url) {
        image.style.backgroundImage = `url("${url}")`;
      }
    }
  });
}
