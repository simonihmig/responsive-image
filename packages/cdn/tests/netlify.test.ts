import { setConfig } from '@responsive-image/core';
import { beforeAll, describe, expect, test } from 'vitest';

import { netlify } from '../src';

import type { Config } from '../src';

describe('netlify', function () {
  beforeAll(() => {
    setConfig<Config>('cdn', { netlify: { domain: 'dummy.netlify.app' } });
  });

  test('it lets the CDN choose image type by default', function () {
    const result = netlify('/foo/bar.jpg');

    expect(result?.imageTypes).toEqual('auto');
  });

  test('it supports custom image types', function () {
    const result = netlify('/foo/bar.jpg', {
      formats: ['jpeg', 'webp'],
    });

    expect(result?.imageTypes).toEqual(['jpeg', 'webp']);
  });

  test('it returns correct relative image URLs', function () {
    const result = netlify('/foo/bar.jpg');

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://dummy.netlify.app/.netlify/images?url=%2Ffoo%2Fbar.jpg&w=100&fm=jpg',
    );

    expect(result.imageUrlFor(1000, 'webp')).toBe(
      'https://dummy.netlify.app/.netlify/images?url=%2Ffoo%2Fbar.jpg&w=1000&fm=webp',
    );
  });

  test('it returns correct remote image URLs', function () {
    const result = netlify('https://example.com/foo/bar.jpg');

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://dummy.netlify.app/.netlify/images?url=https%3A%2F%2Fexample.com%2Ffoo%2Fbar.jpg&w=100&fm=jpg',
    );

    expect(result.imageUrlFor(1000, 'webp')).toBe(
      'https://dummy.netlify.app/.netlify/images?url=https%3A%2F%2Fexample.com%2Ffoo%2Fbar.jpg&w=1000&fm=webp',
    );
  });

  test('it supports custom quality setting', function () {
    const result = netlify('/foo/bar.jpg', {
      quality: 50,
    });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://dummy.netlify.app/.netlify/images?url=%2Ffoo%2Fbar.jpg&w=100&fm=jpg&q=50',
    );
  });

  test('it supports custom aspectRatio', function () {
    const result = netlify('foo/bar.jpg', {
      aspectRatio: 2,
    });

    expect(result.aspectRatio).toBe(2);
  });

  test('it supports auto format', function () {
    const result = netlify('/foo/bar.jpg', {
      formats: 'auto',
    });

    expect(result.imageUrlFor(100, 'auto')).toBe(
      'https://dummy.netlify.app/.netlify/images?url=%2Ffoo%2Fbar.jpg&w=100',
    );
  });
});
