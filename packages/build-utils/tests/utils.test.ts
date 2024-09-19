import { describe, expect, test } from 'vitest';
import { generateLqipClassName } from '../src/utils';

describe('generateLqipClassName', () => {
  test('it generates unique class names', () => {
    expect(generateLqipClassName('foo')).toBe('ri-dyn-0');
    expect(generateLqipClassName('bar')).toBe('ri-dyn-1');
    expect(generateLqipClassName('baz')).toBe('ri-dyn-2');

    expect(generateLqipClassName('foo')).toBe('ri-dyn-0');
    expect(generateLqipClassName('bar')).toBe('ri-dyn-1');
    expect(generateLqipClassName('baz')).toBe('ri-dyn-2');
  });
});
