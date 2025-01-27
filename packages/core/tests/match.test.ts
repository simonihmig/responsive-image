import { describe, expect, test } from 'vitest';

import { findMatchingImage } from '../src';

import type { ImageOutputResult } from '../src';

describe('findMatchingImage', function () {
  test('find matching image', function () {
    const images: ImageOutputResult[] = [
      { url: 'jpg100', width: 100, format: 'jpeg' },
      { url: 'jpg200', width: 200, format: 'jpeg' },
      { url: 'jpg300', width: 300, format: 'jpeg' },
      { url: 'jpg400', width: 400, format: 'jpeg' },
      { url: 'webp100', width: 100, format: 'webp' },
      { url: 'webp200', width: 200, format: 'webp' },
      { url: 'webp300', width: 300, format: 'webp' },
      { url: 'webp400', width: 400, format: 'webp' },
    ];

    expect(findMatchingImage(images, 200, 'jpeg')?.url).toBe('jpg200');
    expect(findMatchingImage(images, 201, 'jpeg')?.url).toBe('jpg300');
    expect(findMatchingImage(images, 200, 'webp')?.url).toBe('webp200');
  });
});
