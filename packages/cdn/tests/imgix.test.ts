import { beforeAll, describe, expect, test } from 'vitest';
import type { Config } from '../src';
import { imgix } from '../src';
import { setConfig } from '@responsive-image/core';

describe('imgix', function () {
  beforeAll(() => {
    setConfig<Config>('cdn', { imgix: { domain: 'dummy.imgix.net' } });
  });

  test('it supports webp, avif image types by default', function () {
    const result = imgix('foo/bar.jpg');

    expect(result?.imageTypes).toEqual(['webp', 'avif']);
  });

  test('it supports custom image types', function () {
    const result = imgix('foo/bar.jpg', { formats: ['jpeg', 'webp'] });

    expect(result?.imageTypes).toEqual(['jpeg', 'webp']);
  });

  test('it returns correct image URLs', function () {
    const result = imgix('foo/bar.jpg');

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://dummy.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max',
    );

    expect(result.imageUrlFor(1000, 'webp')).toBe(
      'https://dummy.imgix.net/foo/bar.jpg?fm=webp&w=1000&fit=max',
    );
  });

  test('it returns custom params', function () {
    const result = imgix('foo/bar.jpg', {
      params: {
        monochrome: '44768B',
        px: 10,
      },
    });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://dummy.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max&monochrome=44768B&px=10',
    );
  });

  test('it supports custom quality setting', function () {
    const result = imgix('foo/bar.jpg', {
      quality: 50,
    });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://dummy.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max&q=50',
    );
  });

  test('it supports custom aspectRatio', function () {
    const result = imgix('foo/bar.jpg', {
      aspectRatio: 2,
    });

    expect(result.aspectRatio).toBe(2);
  });
});
