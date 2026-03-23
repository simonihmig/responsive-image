import { configureToMatchImageSnapshot } from 'jest-image-snapshot';
import { describe, expect, test } from 'vitest';

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
      w: [640, 1024, 1920],
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
    w: [640, 1080, 1920],
  });

  expect(source).toMatchSnapshot();

  expect(assets.map((a) => a.fileName)).toEqual(
    [
      'image-640w.png',
      'image-640w.webp',
      'image-1080w.png',
      'image-1080w.webp',
      'image-1920w.png',
      'image-1920w.webp',
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

test('different aspect ratio', async () => {
  const { source, assets } = await compile(
    'image.jpg?w=100;200&format=png&aspect=2:3',
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
      'vite-plugin.css',
    ]);

    expect(source).toMatchSnapshot();

    const style = assets.find((a) => a.fileName === 'vite-plugin.css');
    expect(style?.source).toMatchSnapshot();
  });

  test('color LQIP with inline styles is supported', async () => {
    const { source, assets } = await compile('image.jpg', {
      include: '**/*.jpg',
      w: [100, 200],
      lqip: { type: 'color' },
      styles: 'inline',
    });

    expect(assets.map((a) => a.fileName)).toEqual([
      'image-100w.jpg',
      'image-100w.webp',
      'image-200w.jpg',
      'image-200w.webp',
    ]);

    expect(source).toMatchSnapshot();
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
      'vite-plugin.css',
    ]);

    expect(source).toMatchSnapshot();

    const style = assets.find((a) => a.fileName === 'vite-plugin.css');
    expect(style?.source).toMatchSnapshot();
  });

  test('inline LQIP with inline styles is supported', async () => {
    const { source, assets } = await compile('image.jpg', {
      include: '**/*.jpg',
      w: [100, 200],
      lqip: { type: 'inline' },
      styles: 'inline',
    });

    expect(assets.map((a) => a.fileName)).toEqual([
      'image-100w.jpg',
      'image-100w.webp',
      'image-200w.jpg',
      'image-200w.webp',
    ]);

    expect(source).toMatchSnapshot();
  });

  test('blurhash LQIP is supported', async () => {
    const { source } = await compile('image.jpg', {
      include: '**/*.jpg',
      w: [100, 200],
      lqip: { type: 'blurhash' },
    });

    expect(source).toMatchSnapshot();
  });

  test('thumbhash LQIP is supported', async () => {
    const { source } = await compile('image.jpg', {
      include: '**/*.jpg',
      w: [100, 200],
      lqip: { type: 'thumbhash' },
    });

    expect(source).toMatchSnapshot();
  });
});
