import { expect, test } from 'vitest';

import { getConfig, setConfig } from '../src';

test('setConfig and getConfig work', () => {
  const dummyConfig = { foo: 'bar' };

  setConfig('dummy', dummyConfig);

  expect(getConfig('dummy')).toBe(dummyConfig);
});
