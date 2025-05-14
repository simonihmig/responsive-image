import { setConfig } from '@responsive-image/core';
import { beforeAll, describe, expect, test } from 'vitest';

import { fastly } from '../src';

import type { Config } from '../src';

describe('fastly', function () {
  beforeAll(() => {
    setConfig<Config>('cdn', { fastly: { domain: 'image.mydomain.com' } });
  });

  test('it uses the auto format by default', function () {
    const result = fastly('foo/bar.jpg');

    expect(result?.imageTypes).toEqual(['auto']);
  });

  test('can set custom default formats', function () {
    setConfig<Config>('cdn', {
      fastly: {
        domain: 'image.mydomain.com',
        defaultFormats: ['webp', 'avif'],
      },
    });

    const result = fastly('foo/bar.jpg');

    expect(result?.imageTypes).toEqual(['webp', 'avif']);
  });

  test('it supports custom image types', function () {
    const result = fastly('foo/bar.jpg', {
      formats: ['jpeg', 'webp'],
    });

    expect(result?.imageTypes).toEqual(['jpeg', 'webp']);
  });

  test('it returns custom params', function () {
    const result = fastly('foo/bar.jpg', {
      trimColor: 'auto',
    });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://image.mydomain.com/foo/bar.jpg?format=jpeg&width=100&trim-color=auto',
    );
  });

  test('it supports custom quality setting', function () {
    const result = fastly('foo/bar.jpg', {
      quality: 50,
    });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://image.mydomain.com/foo/bar.jpg?format=jpeg&width=100&quality=50',
    );
  });

  test('it supports custom aspectRatio', function () {
    const result = fastly('foo/bar.jpg', {
      aspectRatio: 2,
    });

    expect(result.aspectRatio).toBe(2);
  });
});
