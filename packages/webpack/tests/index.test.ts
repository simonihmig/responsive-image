import compiler from './compiler';

test('it produces expected output', async () => {
  const stats = (await compiler('fixtures/image.jpg', {})).toJson({
    source: true,
  });

  expect(stats.modules).toBeDefined();
  expect(stats.modules![0]?.modules).toHaveLength(2);

  const output = stats.modules?.[0]?.modules?.[0]?.source;
  expect(output).toMatchSnapshot();
});
