import { stringify } from 'javascript-stringify';

import type { SafeString } from './types';

export const SAFE_STRING = Symbol();

export function serialize(value: unknown) {
  return stringify(
    value,
    (value, _space, next) => {
      if (typeof value === 'object' && isSafeString(value)) {
        return value;
      }

      return next(value);
    },
    2,
  );
}

/**
 * Represents a string that is safe to use as a POJO value, without escaping quotes. E.g. a function definition like '() => true'
 */
export function safeString(value: string): SafeString {
  const safeValue = Object.assign(value, { [SAFE_STRING]: true as const });

  return safeValue;
}

export function isSafeString(value: string | SafeString): boolean {
  return (value as SafeString)[SAFE_STRING] === true;
}
