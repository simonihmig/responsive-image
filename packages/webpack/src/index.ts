import { createRequire } from 'node:module';
export { getAspectRatio, getOptions, normalizeInput } from './utils';

import type { LoaderOptions } from './types';
export type { LoaderOptions, ImageLoaderChainedResult } from './types';

const defaultLoaders: string[] = [
  '@responsive-image/webpack/images',
  '@responsive-image/webpack/export',
  '@responsive-image/webpack/lqip/color',
  '@responsive-image/webpack/lqip/inline',
  '@responsive-image/webpack/lqip/blurhash',
];

function setupLoaders(options?: Partial<LoaderOptions>) {
  if (options) {
    return defaultLoaders.map((loader) => ({ loader, options }));
  }

  return defaultLoaders;
}

export { setupLoaders };
