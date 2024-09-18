import type { Options } from './types';

const defaultLoaders: string[] = [
  '@responsive-image/webpack/export',
  '@responsive-image/webpack/lqip/blurhash',
  '@responsive-image/webpack/lqip/inline',
  '@responsive-image/webpack/lqip/color',
  '@responsive-image/webpack/images',
];

function setupLoaders(options?: Partial<Options>) {
  if (options) {
    return defaultLoaders.map((loader) => ({ loader, options }));
  }

  return defaultLoaders;
}

export { setupLoaders };
