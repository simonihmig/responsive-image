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

  const sortedAssets = assets.toSorted((a, b) =>
    a.fileName.localeCompare(b.fileName),
  );

  expect(sortedAssets.map((a) => a.fileName)).toEqual(
    [
      'images/image-640w.png',
      'images/image-640w.webp',
      'images/image-750w.png',
      'images/image-750w.webp',
      'images/image-828w.png',
      'images/image-828w.webp',
      'images/image-1080w.png',
      'images/image-1080w.webp',
      'images/image-1200w.png',
      'images/image-1200w.webp',
      'images/image-1920w.png',
      'images/image-1920w.webp',
      'images/image-2048w.png',
      'images/image-2048w.webp',
      'images/image-3840w.png',
      'images/image-3840w.webp',
    ].sort(),
  );

  expect(
    assets.find((a) => a.fileName === 'images/image-640w.png')?.source,
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

  expect(assets.map((a) => a.fileName)).toEqual([
    'images/test-100.png',
    'images/test-200.png',
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
    'images/image-100w.png',
    'images/image-200w.png',
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
    'images/image-100w.png',
    'images/image-200w.png',
  ]);

  for (const image of assets) {
    expect(image.source).toMatchImageSnapshot();
  }
});

describe('LQIP', function () {
  //   test('color LQIP is supported', async () => {
  //     const { stats } = await compiler(
  //       'fixtures/image.jpg?responsive',
  //       _dirname,
  //       {
  //         lqip: { type: 'color' },
  //       },
  //     );

  //     expect(stats.modules).toBeDefined();
  //     expect(stats.modules![0]?.modules).toHaveLength(3);

  //     const output = stats.modules?.[0]?.modules?.[0]?.source;
  //     expect(sanitizeOutput(output)).toMatchSnapshot();
  //   });

  //   test('inline LQIP is supported', async () => {
  //     const { stats } = await compiler(
  //       'fixtures/image.jpg?responsive',
  //       _dirname,
  //       {
  //         lqip: { type: 'inline' },
  //       },
  //     );

  //     expect(stats.modules).toBeDefined();
  //     expect(stats.modules![0]?.modules).toHaveLength(3);

  //     const output = stats.modules?.[0]?.modules?.[0]?.source;
  //     expect(sanitizeOutput(output)).toMatchSnapshot();
  //   });

  test('blurhash LQIP is supported', async () => {
    const { source } = await compile('image.jpg', {
      include: '**/*.jpg',
      w: [100, 200],
      lqip: { type: 'blurhash' },
    });

    expect(source).toMatchSnapshot();
  });
});
