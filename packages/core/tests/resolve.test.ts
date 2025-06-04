import { describe, expect, test } from 'vitest';

import { resolveImage } from '../src';

import type { ImageData } from '../src';

describe('resolveImage', () => {
  const imageData: ImageData = {
    imageTypes: ['webp', 'avif'],
    imageUrlFor(width, type = 'jpeg') {
      return `/${width}.${type}`;
    },
  };

  test('returns image matching device width with no args', () => {
    expect(resolveImage(imageData)).toBe('/3840.webp');
  });

  test('supports size', () => {
    expect(resolveImage(imageData, { size: 10 })).toBe('/384.webp');
  });

  test('supports width', () => {
    expect(resolveImage(imageData, { width: 1024 })).toBe('/1024.webp');
  });

  test('supports format', () => {
    expect(resolveImage(imageData, { format: 'avif' })).toBe('/3840.avif');
  });
});
