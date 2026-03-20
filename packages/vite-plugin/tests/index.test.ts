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
    expect(style?.source).toMatchInlineSnapshot(
      `
      ".ri-dyn-0{background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMjQwMCAxNjAzIj4KPGZpbHRlciBpZD0iYiIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIuNSI+PC9mZUdhdXNzaWFuQmx1cj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjEgMSI+PC9mZUZ1bmNBPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj4KPGltYWdlIGZpbHRlcj0idXJsKCNiKSIgcHJlc2VydmVBc3BlY3RSYXRpbz0ibm9uZSIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSIgeGxpbms6aHJlZj0iZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBa0FBQUFHQ0FJQUFBQ2VwU09TQUFBQUNYQklXWE1BQUFzVEFBQUxFd0VBbXB3WUFBQUFzRWxFUVZSNG5HTmdOamRtMTlEbmxOTmlrOVZrMFRKZ2NiTm50YlprMWpGZzFEZGdZUFp6NFBKdzR0VzE0Rll5NXRBejV3N3pZWE4zNG5LdzR3MXpaMkQxYytYT0NSR0tEeGF3ZE9NemNaWE1pWk9LQ1ZaSkMrTDNzbVpnTTdQbThiQVhqWFZVS2dvMnpRcEoycEJqVlJZaWFHZkJvcXpDd0tLcnpxR2p3YVdoSXVPdGI1NW5acDVqSWVoZ3ltNWt4S3Fwd2NBc0w4c2lMOG1xSzh0am95cmhxS3BUcVNNZXBNMWhhc1JpWWdnQXM0QWVMZm5QR3hZQUFBQUFTVVZPUks1Q1lJST0iPjwvaW1hZ2U+Cjwvc3ZnPg==)}
      "
    `,
    );
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
