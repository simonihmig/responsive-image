import { describe, expect, test } from 'vitest';

import type { ImageData } from '../src';
import { resolveImage } from '../src';

describe('resolveImage', () => {
  const imageData: ImageData = {
    imageTypes: ['webp', 'avif'],
    imageUrlFor(width, type = 'jpeg') {
      return `/${width}.${type}`;
    },
  };

  test('returns image matching device width with no args', () => {
    expect(resolveImage(imageData)).toBe('/320.webp');
  });

  test('supports size', () => {
    expect(resolveImage(imageData, { size: 10 })).toBe('/32.webp');
  });

  test('supports width', () => {
    expect(resolveImage(imageData, { width: 1024 })).toBe('/1024.webp');
  });

  test('supports format', () => {
    expect(resolveImage(imageData, { format: 'avif' })).toBe('/320.avif');
  });
});
