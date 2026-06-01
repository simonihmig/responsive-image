import { describe, expect, test } from 'vitest';

import { generateLqipClassName } from '../src';

describe('generateLqipClassName', () => {
  test('it generates unique class names', () => {
    expect(generateLqipClassName('foo')).toBe('ri-dyn-acbd18db4cc2f85cedef654fccc4a4d8');
    expect(generateLqipClassName('bar')).toBe('ri-dyn-37b51d194a7513e45b56f6524f2d51f2');
    expect(generateLqipClassName('baz')).toBe('ri-dyn-73feffa4b7f6bb68e44cf984c85f6e88');

    expect(generateLqipClassName('foo')).toBe('ri-dyn-acbd18db4cc2f85cedef654fccc4a4d8');
    expect(generateLqipClassName('bar')).toBe('ri-dyn-37b51d194a7513e45b56f6524f2d51f2');
    expect(generateLqipClassName('baz')).toBe('ri-dyn-73feffa4b7f6bb68e44cf984c85f6e88');
  });
});
