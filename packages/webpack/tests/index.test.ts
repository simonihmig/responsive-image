import compiler from './compiler';

test('it produces expected output', async () => {
  const stats = (await compiler('fixtures/image.jpg?responsive', {})).toJson({
    source: true,
  });

  expect(stats.modules).toBeDefined();
  expect(stats.modules![0]?.modules).toHaveLength(2);

  const output = stats.modules?.[0]?.modules?.[0]?.source;
  expect(output).toMatchSnapshot();
});

test('custom loader options are supported', async () => {
  const stats = (
    await compiler('fixtures/image.jpg?responsive', {
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
  expect(output).toMatchSnapshot();
});

test('custom query params are supported', async () => {
  const stats = (
    await compiler(
      'fixtures/image.jpg?lqip=color&widths=100,200&formats=webp&responsive',
      {},
    )
  ).toJson({
    source: true,
  });

  expect(stats.modules).toBeDefined();
  expect(stats.modules![0]?.modules).toHaveLength(3);

  const output = stats.modules?.[0]?.modules?.[0]?.source;
  expect(output).toMatchSnapshot();
});

describe('LQIP', function () {
  test('color LQIP is supported', async () => {
    const stats = (
      await compiler('fixtures/image.jpg?responsive', {
        lqip: { type: 'color' },
      })
    ).toJson({
      source: true,
    });

    expect(stats.modules).toBeDefined();
    expect(stats.modules![0]?.modules).toHaveLength(3);

    const output = stats.modules?.[0]?.modules?.[0]?.source;
    expect(output).toMatchSnapshot();
  });

  test('inline LQIP is supported', async () => {
    const stats = (
      await compiler('fixtures/image.jpg?responsive', {
        lqip: { type: 'inline' },
      })
    ).toJson({
      source: true,
    });

    expect(stats.modules).toBeDefined();
    expect(stats.modules![0]?.modules).toHaveLength(3);

    const output = stats.modules?.[0]?.modules?.[0]?.source;
    expect(output).toMatchSnapshot();
  });

  test('blurhash LQIP is supported', async () => {
    const stats = (
      await compiler('fixtures/image.jpg?responsive', {
        lqip: { type: 'blurhash' },
      })
    ).toJson({
      source: true,
    });

    expect(stats.modules).toBeDefined();
    expect(stats.modules![0]?.modules).toHaveLength(2);

    const output = stats.modules?.[0]?.modules?.[0]?.source;
    expect(output).toMatchSnapshot();
  });
});
