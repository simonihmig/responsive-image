import type { Lqip, LqipBlurhash, LqipThumbhash } from './types';

export function isLqipBlurhash(lqip: Lqip | undefined): lqip is LqipBlurhash {
  return lqip?.type === 'blurhash';
}

export function isLqipThumbhash(lqip: Lqip | undefined): lqip is LqipThumbhash {
  return lqip?.type === 'thumbhash';
}
