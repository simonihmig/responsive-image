import { describe, expect, test } from 'vitest';

import { isSafeString, safeString, serialize } from '../src';

describe('safeString', () => {
  test('safeString returns a safe string', () => {
    expect(isSafeString('foo')).toBe(false);
    expect(isSafeString(safeString('foo'))).toBe(true);
  });
});

describe('serialize', () => {
  test('serializes simple string', () => {
    expect(serialize({ foo: 'bar' })).toBe(`{
  foo: 'bar'
}`);
  });

  test('serializes safe string', () => {
    expect(serialize({ cb: safeString(`() => 'foo'`) })).toBe(
      `{
  cb: () => 'foo'
}`,
    );
  });

  test('serializes pojo', () => {
    expect(serialize({ valid: true, foo: 'bar', nothing: undefined })).toBe(
      `{
  valid: true,
  foo: 'bar',
  nothing: undefined
}`,
    );
  });
});
