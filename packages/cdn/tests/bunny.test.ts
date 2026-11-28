import { setConfig } from '@responsive-image/core';
import { beforeAll, describe, expect, test } from 'vitest';

import { bunny } from '../src';

import type { Config } from '../src';

describe('bunny', function () {
  beforeAll(() => {
    setConfig<Config>('cdn', { bunny: { domain: 'my-zone.b-cdn.net' } });
  });

  test('it lets the CDN choose image type by default', function () {
    const result = bunny('foo/bar.jpg');

    expect(result?.imageTypes).toEqual('auto');
  });

  test('it supports custom image types', function () {
    const result = bunny('foo/bar.jpg', { formats: ['jpeg', 'webp'] });

    expect(result?.imageTypes).toEqual(['jpeg', 'webp']);
  });

  test('it returns correct image URLs', function () {
    const result = bunny('/foo/bar.jpg');

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://my-zone.b-cdn.net/foo/bar.jpg?width=100&format=jpeg',
    );

    expect(result.imageUrlFor(1000, 'avif')).toBe(
      'https://my-zone.b-cdn.net/foo/bar.jpg?width=1000&format=avif',
    );
  });

  test('it omits format for auto', function () {
    const result = bunny('foo/bar.jpg');

    expect(result.imageUrlFor(100, 'auto')).toBe(
      'https://my-zone.b-cdn.net/foo/bar.jpg?width=100',
    );
  });

  test('it supports full URLs', function () {
    const result = bunny('https://other-zone.b-cdn.net/foo/bar.jpg?v=2');

    expect(result.imageUrlFor(100, 'webp')).toBe(
      'https://other-zone.b-cdn.net/foo/bar.jpg?v=2&width=100&format=webp',
    );
  });

  test('it supports custom quality setting', function () {
    const result = bunny('foo/bar.jpg', { quality: 50 });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://my-zone.b-cdn.net/foo/bar.jpg?width=100&format=jpeg&quality=50',
    );
  });

  test('it returns custom params', function () {
    const result = bunny('foo/bar.jpg', {
      params: { sharpen: 'true', crop_gravity: 'north' },
    });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://my-zone.b-cdn.net/foo/bar.jpg?width=100&format=jpeg&sharpen=true&crop_gravity=north',
    );
  });

  test('it supports custom aspectRatio', function () {
    const result = bunny('foo/bar.jpg', { aspectRatio: 2 });

    expect(result.aspectRatio).toBe(2);
  });
});
