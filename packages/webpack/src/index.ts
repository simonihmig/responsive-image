import { createRequire } from 'node:module';
export { getAspectRatio, getOptions, normalizeInput } from './utils';

import type { LoaderOptions } from './types';
export type { LoaderOptions, ImageLoaderChainedResult } from './types';

const require = createRequire(import.meta.url);

const IMAGES_LOADER = '@responsive-image/webpack/images';
const EXPORT_LOADER = '@responsive-image/webpack/export';
const COLOR_LOADER = '@responsive-image/webpack/lqip/color';
const INLINE_LOADER = '@responsive-image/webpack/lqip/inline';
let BLURHASH_LOADER = undefined;

try {
  BLURHASH_LOADER = require.resolve('@responsive-image/blurhash/webpack')
    ? '@responsive-image/blurhash/webpack'
    : undefined;
} catch (e) {
  // do nothing if package is not available
}

const defaultLoaders: string[] = [
  EXPORT_LOADER,
  COLOR_LOADER,
  INLINE_LOADER,
  BLURHASH_LOADER,
  IMAGES_LOADER,
].filter(Boolean) as string[];

function setupLoaders(options?: Partial<LoaderOptions>) {
  if (options) {
    return defaultLoaders.map((loader) => ({ loader, options }));
  }

  return defaultLoaders;
}

export { setupLoaders };
