import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { configureToMatchImageSnapshot } from 'jest-image-snapshot';
import { describe, expect, test } from 'vitest';

import compiler from './compiler';

const customConfig = { threshold: 0.1 };
const toMatchImageSnapshot = configureToMatchImageSnapshot({
  customDiffConfig: customConfig,
});

expect.extend({ toMatchImageSnapshot });

const _dirname = dirname(fileURLToPath(import.meta.url));

// make sure we remove any non-deterministic parts from the output
function sanitizeOutput(output: string | Buffer | undefined) {
  return String(output).replace(new RegExp(_dirname, 'g'), '');
}

test('it produces expected output', async () => {
  const { stats, fs } = await compiler(
    'fixtures/image.jpg?responsive',
    _dirname,
    {
      format: ['png', 'webp'],
    },
  );

  expect(stats.modules).toBeDefined();
  expect(stats.modules![0]?.modules).toHaveLength(2);

  const output = stats.modules?.[0]?.modules?.[0]?.source;
  expect(sanitizeOutput(output)).toMatchSnapshot();

  const imageAssets = stats.modules![0]!.assets!;
  expect(imageAssets.toSorted()).toEqual(
    [
      'assets/image-640w.png',
      'assets/image-640w.webp',
      'assets/image-750w.png',
      'assets/image-750w.webp',
      'assets/image-828w.png',
      'assets/image-828w.webp',
      'assets/image-1080w.png',
      'assets/image-1080w.webp',
      'assets/image-1200w.png',
      'assets/image-1200w.webp',
      'assets/image-1920w.png',
      'assets/image-1920w.webp',
      'assets/image-2048w.png',
      'assets/image-2048w.webp',
      'assets/image-3840w.png',
      'assets/image-3840w.webp',
    ].toSorted(),
  );

  expect(
    fs.readFileSync(
      join(
        _dirname,
        imageAssets.find((fileName) => fileName === 'assets/image-640w.png')!,
      ),
    ),
  ).toMatchImageSnapshot();
});

test('custom loader options are supported', async () => {
  const { stats, fs } = await compiler(
    'fixtures/image.jpg?responsive',
    _dirname,
    {
      w: [100, 200],
      format: ['png'],
      name: 'test-[width].[ext]',
      webPath: 'https://cdn.example.com/images',
    },
  );

  expect(stats.modules).toBeDefined();
  expect(stats.modules![0]?.modules).toHaveLength(2);

  const output = stats.modules?.[0]?.modules?.[0]?.source;
  expect(sanitizeOutput(output)).toMatchSnapshot();

  const imageAssets = stats.modules![0]!.assets!.toSorted();
  expect(imageAssets).toEqual(['assets/test-100.png', 'assets/test-200.png']);

  for (const image of imageAssets) {
    expect(
      fs.readFileSync(join(_dirname, image as string)),
    ).toMatchImageSnapshot();
  }
});

test('custom query params are supported', async () => {
  const { stats, fs } = await compiler(
    'fixtures/image.jpg?w=100;200&format=png&responsive',
    _dirname,
    {},
  );

  expect(stats.modules).toBeDefined();
  // expect(stats.modules![0]?.modules).toHaveLength(3);

  const output = stats.modules?.[0]?.modules?.[0]?.source;
  expect(sanitizeOutput(output)).toMatchSnapshot();

  const imageAssets = stats.modules![0]!.assets!.toSorted();
  expect(imageAssets).toEqual([
    'assets/image-100w.png',
    'assets/image-200w.png',
  ]);

  for (const image of imageAssets) {
    expect(
      fs.readFileSync(join(_dirname, image as string)),
    ).toMatchImageSnapshot();
  }
});

test('imagetools params are supported', async () => {
  const { stats, fs } = await compiler(
    'fixtures/image.jpg?w=100;200&format=png&grayscale&responsive',
    _dirname,
    {},
  );

  expect(stats.modules).toBeDefined();

  const output = stats.modules?.[0]?.modules?.[0]?.source;
  expect(sanitizeOutput(output)).toMatchSnapshot();

  const imageAssets = stats.modules![0]!.assets!.toSorted();
  expect(imageAssets).toEqual([
    'assets/image-100w.png',
    'assets/image-200w.png',
  ]);

  for (const image of imageAssets) {
    expect(
      fs.readFileSync(join(_dirname, image as string)),
    ).toMatchImageSnapshot();
  }
});

test('different aspect ratio', async () => {
  const { stats, fs } = await compiler(
    'fixtures/image.jpg?w=100;200&format=png&aspect=2:3&responsive',
    _dirname,
    {},
  );

  expect(stats.modules).toBeDefined();

  const output = stats.modules?.[0]?.modules?.[0]?.source;
  expect(sanitizeOutput(output)).toMatchSnapshot();

  const imageAssets = stats.modules![0]!.assets!.toSorted();
  expect(imageAssets).toEqual([
    'assets/image-100w.png',
    'assets/image-200w.png',
  ]);

  for (const image of imageAssets) {
    expect(
      fs.readFileSync(join(_dirname, image as string)),
    ).toMatchImageSnapshot();
  }
});

describe('LQIP', function () {
  test('color LQIP is supported', async () => {
    const { stats } = await compiler(
      'fixtures/image.jpg?responsive',
      _dirname,
      {
        lqip: { type: 'color' },
      },
    );

    expect(stats.modules).toBeDefined();
    expect(stats.modules![0]?.modules).toHaveLength(3);

    const output = stats.modules?.[0]?.modules?.[0]?.source;
    expect(sanitizeOutput(output)).toMatchSnapshot();
  });

  test('color LQIP with inline styles is supported', async () => {
    const { stats } = await compiler(
      'fixtures/image.jpg?responsive',
      _dirname,
      {
        lqip: { type: 'color' },
        styles: 'inline',
      },
    );

    expect(stats.modules).toBeDefined();
    expect(stats.modules![0]?.modules).toHaveLength(3);

    const output = stats.modules?.[0]?.modules?.[0]?.source;
    expect(sanitizeOutput(output)).toMatchSnapshot();
  });

  test('inline LQIP is supported', async () => {
    const { stats } = await compiler(
      'fixtures/image.jpg?responsive',
      _dirname,
      {
        lqip: { type: 'inline' },
      },
    );

    expect(stats.modules).toBeDefined();
    expect(stats.modules![0]?.modules).toHaveLength(3);

    const output = stats.modules?.[0]?.modules?.[0]?.source;
    expect(sanitizeOutput(output)).toMatchSnapshot();
  });

  test('inline LQIP with inline styles is supported', async () => {
    const { stats } = await compiler(
      'fixtures/image.jpg?responsive',
      _dirname,
      {
        lqip: { type: 'inline' },
        styles: 'inline',
      },
    );

    expect(stats.modules).toBeDefined();
    expect(stats.modules![0]?.modules).toHaveLength(3);

    const output = stats.modules?.[0]?.modules?.[0]?.source;
    expect(sanitizeOutput(output)).toMatchSnapshot();
  });

  test('blurhash LQIP is supported', async () => {
    const { stats } = await compiler(
      'fixtures/image.jpg?responsive',
      _dirname,
      {
        lqip: { type: 'blurhash' },
      },
    );

    expect(stats.modules).toBeDefined();
    expect(stats.modules![0]?.modules).toHaveLength(4);

    const output = stats.modules?.[0]?.modules?.[0]?.source;
    expect(sanitizeOutput(output)).toMatchSnapshot();
  });

  test('thumbhash LQIP is supported', async () => {
    const { stats } = await compiler(
      'fixtures/image.jpg?responsive',
      _dirname,
      {
        lqip: { type: 'thumbhash' },
      },
    );

    expect(stats.modules).toBeDefined();
    expect(stats.modules![0]?.modules).toHaveLength(5);

    const output = stats.modules?.[0]?.modules?.[0]?.source;
    expect(sanitizeOutput(output)).toMatchSnapshot();
  });
});
