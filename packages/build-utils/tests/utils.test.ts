import { describe, expect, test } from 'vitest';

import { generateLqipClassName } from '../src';

describe('generateLqipClassName', () => {
  test('it generates unique class names', () => {
    expect(generateLqipClassName('foo')).toBe('ri-dyn-3r6bSI');
    expect(generateLqipClassName('bar')).toBe('ri-dyn-p7rkT');
    expect(generateLqipClassName('baz')).toBe('ri-dyn-2A--VP');

    expect(generateLqipClassName('foo')).toBe('ri-dyn-3r6bSI');
    expect(generateLqipClassName('bar')).toBe('ri-dyn-p7rkT');
    expect(generateLqipClassName('baz')).toBe('ri-dyn-2A--VP');
  });
});
