import { setConfig } from '@responsive-image/core';
import { beforeAll, describe, expect, test } from 'vitest';

import { autorender } from '../src';

import type { Config } from '../src';

describe('autorender', function () {
  beforeAll(() => {
    setConfig<Config>('cdn', {
      autorender: { domain: 'assets.autorender.io', workspace: 'wB5HrlVhGq' },
    });
  });

  test('it lets the CDN choose image type by default', function () {
    const result = autorender('products/chair.jpg');

    expect(result?.imageTypes).toEqual('auto');
  });

  test('it supports custom image types', function () {
    const result = autorender('products/chair.jpg', {
      formats: ['jpeg', 'webp'],
    });

    expect(result?.imageTypes).toEqual(['jpeg', 'webp']);
  });

  test('it returns correct image URLs', function () {
    const result = autorender('products/chair.jpg');

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://assets.autorender.io/wB5HrlVhGq/w_100,f_jpeg/products/chair.jpg',
    );

    expect(result.imageUrlFor(1000, 'webp')).toBe(
      'https://assets.autorender.io/wB5HrlVhGq/w_1000,f_webp/products/chair.jpg',
    );
  });

  test('it normalizes a leading slash in the source path', function () {
    const result = autorender('/products/chair.jpg');

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://assets.autorender.io/wB5HrlVhGq/w_100,f_jpeg/products/chair.jpg',
    );
  });

  test('it emits f_auto for the auto type', function () {
    const result = autorender('products/chair.jpg', { formats: 'auto' });

    expect(result.imageUrlFor(100, 'auto')).toBe(
      'https://assets.autorender.io/wB5HrlVhGq/w_100,f_auto/products/chair.jpg',
    );
  });

  test('it supports custom quality setting', function () {
    const result = autorender('products/chair.jpg', { quality: 50 });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://assets.autorender.io/wB5HrlVhGq/w_100,f_jpeg,q_50/products/chair.jpg',
    );
  });

  test('it appends custom transform tokens', function () {
    const result = autorender('products/chair.jpg', {
      transforms: ['e_sharpen', 'br_16'],
    });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://assets.autorender.io/wB5HrlVhGq/e_sharpen,br_16,w_100,f_jpeg/products/chair.jpg',
    );
  });

  test('it applies the requested width after custom transforms', function () {
    const result = autorender('products/chair.jpg', {
      transforms: ['w_50'],
    });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://assets.autorender.io/wB5HrlVhGq/w_50,w_100,f_jpeg/products/chair.jpg',
    );
  });

  test('it supports custom aspectRatio', function () {
    const result = autorender('products/chair.jpg', { aspectRatio: 2 });

    expect(result.aspectRatio).toBe(2);
  });

  test('it rejects absolute URLs', function () {
    expect(() => autorender('https://images.example.com/chair.jpg')).toThrow(
      'absolute URLs are not supported by the autorender provider!',
    );
  });
});
