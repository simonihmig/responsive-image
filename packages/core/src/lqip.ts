import { Lqip, LqipBlurhash } from './types';

export function isLqipBlurhash(lqip: Lqip | undefined): lqip is LqipBlurhash {
  return lqip?.type === 'blurhash';
}
