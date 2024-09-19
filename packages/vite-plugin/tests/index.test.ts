import { describe, expect, test } from 'vitest';
import { configureToMatchImageSnapshot } from 'jest-image-snapshot';
import { compile } from './utils';

const customConfig = { threshold: 0.1 };
const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: customConfig,
});

expect.extend({ toMatchImageSnapshot });

describe('filter', () => {
  test('it operates on included assets', async () => {
    const { source } = await compile('image.jpg', {
      include: '**/*.jpg',
    });

    expect(source).toMatchSnapshot();
  });

  test('it skips non-matches', async () => {
    const { source, assets } = await compile('image.jpg', {
      include: '**/*.png',
    });

    expect(source).not.toContain('imageUrlFor');
    expect(assets).toHaveLength(0);
  });

  test('it skips excluded assets', async () => {
    const { source, assets } = await compile('image.jpg', {
      include: '**/*.jpg',
      exclude: '**/image.jpg',
    });

    expect(source).not.toContain('imageUrlFor');
    expect(assets).toHaveLength(0);
  });
});

test('it produces expected output', async () => {
  const { source, assets } = await compile('image.jpg', {
    format: ['png', 'webp'],
    include: '**/*.jpg',
  });

  expect(source).toMatchSnapshot();

  expect(assets.map((a) => a.fileName)).toEqual(
    [
      'image-640w.png',
      'image-640w.webp',
      'image-750w.png',
      'image-750w.webp',
      'image-828w.png',
      'image-828w.webp',
      'image-1080w.png',
      'image-1080w.webp',
      'image-1200w.png',
      'image-1200w.webp',
      'image-1920w.png',
      'image-1920w.webp',
      'image-2048w.png',
      'image-2048w.webp',
      'image-3840w.png',
      'image-3840w.webp',
    ].sort(),
  );

  expect(
    assets.find((a) => a.fileName === 'image-640w.png')?.source,
  ).toMatchImageSnapshot();
});

test('custom loader options are supported', async () => {
  const { source, assets } = await compile('image.jpg', {
    w: [100, 200],
    format: ['png'],
    name: 'test-[width].[ext]',
    include: '**/*.jpg',
  });

  expect(source).toMatchSnapshot();

  expect(assets.toSorted().map((a) => a.fileName)).toEqual([
    'test-100.png',
    'test-200.png',
  ]);

  for (const image of assets) {
    expect(image.source).toMatchImageSnapshot();
  }
});

test('custom query params are supported', async () => {
  const { source, assets } = await compile('image.jpg?w=100;200&format=png', {
    include: /^[^?]+\.jpg(\?.*)?$/,
  });

  expect(source).toMatchSnapshot();

  expect(assets.map((a) => a.fileName)).toEqual([
    'image-100w.png',
    'image-200w.png',
  ]);

  for (const image of assets) {
    expect(image.source).toMatchImageSnapshot();
  }
});

test('imagetools params are supported', async () => {
  const { source, assets } = await compile(
    'image.jpg?w=100;200&format=png&grayscale',
    {
      include: /^[^?]+\.jpg(\?.*)?$/,
    },
  );

  expect(source).toMatchSnapshot();

  expect(assets.map((a) => a.fileName)).toEqual([
    'image-100w.png',
    'image-200w.png',
  ]);

  for (const image of assets) {
    expect(image.source).toMatchImageSnapshot();
  }
});

describe('LQIP', async () => {
  test('color LQIP is supported', async () => {
    const { source, assets } = await compile('image.jpg', {
      include: '**/*.jpg',
      w: [100, 200],
      lqip: { type: 'color' },
    });

    expect(assets.map((a) => a.fileName)).toEqual([
      'image-100w.jpg',
      'image-100w.webp',
      'image-200w.jpg',
      'image-200w.webp',
      'style.css',
    ]);

    expect(source).toMatchSnapshot();

    const style = assets.find((a) => a.fileName === 'style.css');
    expect(style?.source).toMatchInlineSnapshot(`
      ".ri-dyn-0{background-color:#083838}
      "
    `);
  });

  test('inline LQIP is supported', async () => {
    const { source, assets } = await compile('image.jpg', {
      include: '**/*.jpg',
      w: [100, 200],
      lqip: { type: 'inline' },
    });

    expect(assets.map((a) => a.fileName)).toEqual([
      'image-100w.jpg',
      'image-100w.webp',
      'image-200w.jpg',
      'image-200w.webp',
      'style.css',
    ]);

    expect(source).toMatchSnapshot();

    const style = assets.find((a) => a.fileName === 'style.css');
    expect(style?.source).toMatchInlineSnapshot(`
      ".ri-dyn-0{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNjQwIDQyNyI+CjxmaWx0ZXIgaWQ9ImIiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+PGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iLjUiPjwvZmVHYXVzc2lhbkJsdXI+PGZlQ29tcG9uZW50VHJhbnNmZXI+PGZlRnVuY0EgdHlwZT0iZGlzY3JldGUiIHRhYmxlVmFsdWVzPSIxIDEiPjwvZmVGdW5jQT48L2ZlQ29tcG9uZW50VHJhbnNmZXI+PC9maWx0ZXI+CjxpbWFnZSBmaWx0ZXI9InVybCgjYikiIHByZXNlcnZlQXNwZWN0UmF0aW89Im5vbmUiIGhlaWdodD0iMTAwJSIgd2lkdGg9IjEwMCUiIHhsaW5rOmhyZWY9ImRhdGE6aW1hZ2UvcG5nO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQWtBQUFBR0NBSUFBQUNlcFNPU0FBQUFDWEJJV1hNQUFBc1RBQUFMRXdFQW1wd1lBQUFBc0VsRVFWUjRuR05nTlRmaDFERGlrdFBoa05WbTB6UmlkWE5pczdaaDFURm0xamRpWVBWMzR2Rnc0ZGUxNWxVeTQ5SzM1QTN6NDNCMzVYRnc0QS96WkdEemMrZkxEaGVKQ3hXMjhCQXdkcFBLU1pDTkRWTlBDeFh5c21mZ01MUGw4M1NVakhkVktReTF5QTVOMlpoclhSWW1iR2ZGcHFMT3dLYW54YVdudzZ1cEx1dGxaSlpwWVpGaEkrWmt3V2xveks2cHpjQWlMODhxTDgydXA4Qm5yeVh2cVduWVlDQVpyTWR0WnNwbWFnSUFBaFFmUDJab1lSQUFBQUFBU1VWT1JLNUNZSUk9Ij48L2ltYWdlPgo8L3N2Zz4=)}
      "
    `);
  });

  test('blurhash LQIP is supported', async () => {
    const { source } = await compile('image.jpg', {
      include: '**/*.jpg',
      w: [100, 200],
      lqip: { type: 'blurhash' },
    });

    expect(source).toMatchSnapshot();
  });
});
