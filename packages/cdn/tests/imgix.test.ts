import { beforeAll, describe, expect, test } from 'vitest';
import { ImgixConfig, imgixProvider } from '../src';
import { setConfig } from '@responsive-image/core';

describe('imgix', function () {
  beforeAll(() => {
    setConfig<ImgixConfig>('imgix', { domain: 'dummy.imgix.net' });
  });

  test('it supports jpg, png and webp image types by default', function () {
    const result = imgixProvider('foo/bar.jpg');

    expect(result?.imageTypes).toEqual(['png', 'jpeg', 'webp']);
  });

  test('it supports custom image types', function () {
    const result = imgixProvider('foo/bar.jpg', { formats: ['webp'] });

    expect(result?.imageTypes).toEqual(['webp']);
  });

  test('it returns correct image URLs', function () {
    const result = imgixProvider('foo/bar.jpg');

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://dummy.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max',
    );

    expect(result.imageUrlFor(1000, 'webp')).toBe(
      'https://dummy.imgix.net/foo/bar.jpg?fm=webp&w=1000&fit=max',
    );
  });

  test('it returns custom params', function () {
    const result = imgixProvider('foo/bar.jpg', {
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
    const result = imgixProvider('foo/bar.jpg', {
      quality: 50,
    });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://dummy.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max&q=50',
    );
  });
});
