import { type ImageData } from '@responsive-image/core';
import { createSignal } from 'solid-js';
import { render } from '@solidjs/web';
import { afterEach, describe, expect, it } from 'vitest';

import { ResponsiveImage } from '@responsive-image/solid';

const defaultImageData: ImageData = {
  imageTypes: ['jpeg', 'webp', 'avif'],
  imageUrlFor(width, type = 'jpeg') {
    return `/provider/w${width}/image.${type}`;
  },
  aspectRatio: 1.5,
};

// The `@fs`-prefixed URL points at the image fixture inside the package,
// served by the Vitest dev server. Loading it once caches it in the browser,
// so subsequent renders see `img.complete === true` immediately.
const fixtureUrl = new URL(
  '../../test-assets/test-image.jpg',
  import.meta.url,
).toString();

function loadImage(imageUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load ${imageUrl}`));
    img.src = imageUrl;
  });
}

function getImg(container: HTMLElement): HTMLImageElement {
  const img = container.querySelector('img');
  if (!img) {
    throw new Error('No <img> found');
  }
  return img;
}

// Solid 2 updates the DOM asynchronously after a signal write (e.g. the
// LQIP class/style getters after `load`), so tests must yield a tick for
// the reactive flush to be applied before asserting.
const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('ResponsiveImage (Solid 2 client runtime)', () => {
  let container: HTMLDivElement | undefined;

  afterEach(() => {
    container?.remove();
    container = undefined;
  });

  function renderImage(imageData: ImageData) {
    container = document.createElement('div');
    document.body.appendChild(container);
    render(() => <ResponsiveImage src={imageData} />, container);
    return getImg(container);
  }

  it('applies LQIP styles and removes them once the image loads', async () => {
    const imageData: ImageData = {
      ...defaultImageData,
      lqip: {
        class: 'lqip-test-class',
        inlineStyles: { 'border-left': 'solid 10px red' },
      },
    };

    const img = renderImage(imageData);
    await flush();
    expect(img.classList).toContain('lqip-test-class');
    expect(img.getAttribute('style')).toContain('border-left');

    img.dispatchEvent(new Event('load'));
    await flush();

    expect(img.classList).not.toContain('lqip-test-class');
    expect(img.getAttribute('style')).toBe(null);
  });

  it('removes LQIP when the image is already loaded', async () => {
    const imageData: ImageData = {
      imageTypes: ['jpeg'],
      imageUrlFor() {
        return fixtureUrl;
      },
      aspectRatio: 1.5,
      lqip: {
        class: 'lqip-test-class',
      },
    };

    await loadImage(fixtureUrl);

    const img = renderImage(imageData);
    await flush();
    expect(img.classList).not.toContain('lqip-test-class');
  });

  it('reapplies LQIP after src changes', async () => {
    const imageData: ImageData = {
      ...defaultImageData,
      lqip: {
        class: 'lqip-test-class',
      },
    };
    const changed: ImageData = {
      ...imageData,
      imageUrlFor(width, type = 'jpeg') {
        return `/changed/w${width}/image.${type}`;
      },
    };

    const [src, setSrc] = createSignal(imageData);
    container = document.createElement('div');
    document.body.appendChild(container);
    render(() => <ResponsiveImage src={src()} />, container);

    const first = getImg(container);
    await flush();
    expect(first.classList).toContain('lqip-test-class');
    first.dispatchEvent(new Event('load'));
    await flush();
    expect(first.classList).not.toContain('lqip-test-class');

    setSrc(changed);
    await flush();

    const second = getImg(container);
    expect(second).not.toBe(first);
    await flush();
    expect(second.classList).toContain('lqip-test-class');
  });
});
