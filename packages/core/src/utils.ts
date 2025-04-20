import type { NonFunction, ValueOrCallback } from './types';

export function getValueOrCallback<T extends NonFunction>(
  valueOrCb: ValueOrCallback<T>,
): T {
  if (typeof valueOrCb === 'function') {
    return valueOrCb();
  } else {
    return valueOrCb;
  }
}
