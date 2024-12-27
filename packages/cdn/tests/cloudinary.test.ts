import { beforeAll, describe, expect, test } from 'vitest';
import { cloudinary, Config } from '../src';
import { setConfig } from '@responsive-image/core';

describe('cloudinary', function () {
  beforeAll(() => {
    setConfig<Config>('cdn', { cloudinary: { cloudName: 'dummy' } });
  });

  test('it supports webp, avif image types by default', function () {
    const result = cloudinary('foo/bar.jpg');

    expect(result?.imageTypes).toEqual(['webp', 'avif']);
  });

  test('it supports custom image types', function () {
    const result = cloudinary('foo/bar.jpg', {
      formats: ['jpeg', 'webp'],
    });

    expect(result?.imageTypes).toEqual(['jpeg', 'webp']);
  });

  test('it returns correct fetch image URLs', function () {
    const result = cloudinary('https://via.placeholder.com/150');

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://res.cloudinary.com/dummy/image/fetch/w_100,c_limit,q_auto,f_jpg/https%3A%2F%2Fvia.placeholder.com%2F150',
    );

    expect(result.imageUrlFor(1000, 'webp')).toBe(
      'https://res.cloudinary.com/dummy/image/fetch/w_1000,c_limit,q_auto,f_webp/https%3A%2F%2Fvia.placeholder.com%2F150',
    );
  });

  test('it returns correct upload image URLs', function () {
    const result = cloudinary('foo/bar.jpg');

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://res.cloudinary.com/dummy/image/upload/w_100,c_limit,q_auto/foo/bar.jpeg',
    );

    expect(result.imageUrlFor(1000, 'webp')).toBe(
      'https://res.cloudinary.com/dummy/image/upload/w_1000,c_limit,q_auto/foo/bar.webp',
    );
  });

  test('it returns custom params', function () {
    const result = cloudinary('foo/bar.jpg', {
      transformations: { co: 'rgb:20a020', e: 'colorize:50' },
    });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://res.cloudinary.com/dummy/image/upload/co_rgb:20a020,e_colorize:50/w_100,c_limit,q_auto/foo/bar.jpeg',
    );
  });

  test('it returns custom chained params', function () {
    const result = cloudinary('foo/bar.jpg', {
      transformations: [
        { co: 'rgb:20a020', e: 'colorize:50' },
        { ar: '1.0', c: 'fill', w: '150' },
        { r: 'max' },
      ],
    });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://res.cloudinary.com/dummy/image/upload/co_rgb:20a020,e_colorize:50/ar_1.0,c_fill,w_150/r_max/w_100,c_limit,q_auto/foo/bar.jpeg',
    );
  });

  test('it supports custom quality setting', function () {
    const result = cloudinary('foo/bar.jpg', {
      quality: 50,
    });

    expect(result.imageUrlFor(100, 'jpeg')).toBe(
      'https://res.cloudinary.com/dummy/image/upload/w_100,c_limit,q_50/foo/bar.jpeg',
    );
  });

  test('it supports custom aspectRatio', function () {
    const result = cloudinary('foo/bar.jpg', {
      aspectRatio: 2,
    });

    expect(result.aspectRatio).toBe(2);
  });
});
