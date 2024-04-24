import { dirname } from 'path';
import compiler from './compiler';
import { fileURLToPath } from 'url';

const _dirname = dirname(fileURLToPath(import.meta.url));

// make sure we remove any non-deterministic parts from the output
function sanitizeOutput(output: string | Buffer | undefined) {
  return String(output).replace(new RegExp(_dirname, 'g'), '');
}

test('it produces expected output', async () => {
  const stats = (
    await compiler('fixtures/image.jpg?responsive', _dirname, {})
  ).toJson({
    source: true,
  });

  expect(stats.modules).toBeDefined();
  expect(stats.modules![0]?.modules).toHaveLength(2);

  const output = stats.modules?.[0]?.modules?.[0]?.source;
  expect(sanitizeOutput(output)).toMatchSnapshot();
});

test('custom loader options are supported', async () => {
  const stats = (
    await compiler('fixtures/image.jpg?responsive', _dirname, {
      widths: [1000, 2000],
      formats: ['original', 'avif'],
      name: 'test-[width].[ext]',
      webPath: 'https://cdn.example.com/images',
    })
  ).toJson({
    source: true,
  });

  expect(stats.modules).toBeDefined();
  expect(stats.modules![0]?.modules).toHaveLength(2);

  const output = stats.modules?.[0]?.modules?.[0]?.source;
  expect(sanitizeOutput(output)).toMatchSnapshot();
});

test('custom query params are supported', async () => {
  const stats = (
    await compiler(
      'fixtures/image.jpg?lqip=color&widths=100,200&formats=webp&responsive',
      _dirname,
      {},
    )
  ).toJson({
    source: true,
  });

  expect(stats.modules).toBeDefined();
  expect(stats.modules![0]?.modules).toHaveLength(3);

  const output = stats.modules?.[0]?.modules?.[0]?.source;
  expect(sanitizeOutput(output)).toMatchSnapshot();
});

describe('LQIP', function () {
  test('color LQIP is supported', async () => {
    const stats = (
      await compiler('fixtures/image.jpg?responsive', _dirname, {
        lqip: { type: 'color' },
      })
    ).toJson({
      source: true,
    });

    expect(stats.modules).toBeDefined();
    expect(stats.modules![0]?.modules).toHaveLength(3);

    const output = stats.modules?.[0]?.modules?.[0]?.source;
    expect(sanitizeOutput(output)).toMatchSnapshot();
  });

  test('inline LQIP is supported', async () => {
    const stats = (
      await compiler('fixtures/image.jpg?responsive', _dirname, {
        lqip: { type: 'inline' },
      })
    ).toJson({
      source: true,
    });

    expect(stats.modules).toBeDefined();
    expect(stats.modules![0]?.modules).toHaveLength(3);

    const output = stats.modules?.[0]?.modules?.[0]?.source;
    expect(sanitizeOutput(output)).toMatchSnapshot();
  });

  test('blurhash LQIP is supported', async () => {
    const stats = (
      await compiler('fixtures/image.jpg?responsive', _dirname, {
        lqip: { type: 'blurhash' },
      })
    ).toJson({
      source: true,
    });

    expect(stats.modules).toBeDefined();
    expect(stats.modules![0]?.modules).toHaveLength(2);

    const output = stats.modules?.[0]?.modules?.[0]?.source;
    expect(sanitizeOutput(output)).toMatchSnapshot();
  });
});
