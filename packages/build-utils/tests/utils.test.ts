import { describe, expect, test } from 'vitest';

import { generateLqipClassName } from '../src';

describe('generateLqipClassName', () => {
  test('it generates unique class names', () => {
    expect(generateLqipClassName('foo')).toBe('ri-dyn-acbd18db');
    expect(generateLqipClassName('bar')).toBe('ri-dyn-37b51d19');
    expect(generateLqipClassName('baz')).toBe('ri-dyn-73feffa4');

    expect(generateLqipClassName('foo')).toBe('ri-dyn-acbd18db');
    expect(generateLqipClassName('bar')).toBe('ri-dyn-37b51d19');
    expect(generateLqipClassName('baz')).toBe('ri-dyn-73feffa4');
  });
});
