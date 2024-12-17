import { describe, expect, it } from 'vitest';
import { isServer, renderToString } from 'solid-js/web';
import { ResponsiveImage } from '../src';
import { type ImageData } from '@responsive-image/core';

describe('environment', () => {
  it('runs on server', () => {
    expect(typeof window).toBe('undefined');
    expect(isServer).toBe(true);
  });
});

describe('ResponsiveImage', () => {
  const defaultImageData: ImageData = {
    imageTypes: ['jpeg', 'webp', 'avif'],
    imageUrlFor(width, type = 'jpeg') {
      return `/provider/w${width}/image.${type}`;
    },
  };

  it('renders a hello component', () => {
    const string = renderToString(() => (
      <ResponsiveImage src={defaultImageData} />
    ));
    expect(string).toMatchInlineSnapshot(`"<picture></picture>"`);
  });
});
