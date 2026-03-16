import type { Options } from './types';

const defaultLoaders: string[] = [
  '@responsive-image/webpack/export',
  '@responsive-image/webpack/lqip/blurhash',
  '@responsive-image/webpack/lqip/thumbhash',
  '@responsive-image/webpack/lqip/inline',
  '@responsive-image/webpack/lqip/color',
  '@responsive-image/webpack/resize',
  '@responsive-image/webpack/loader',
];

function responsiveImage(options?: Partial<Options>) {
  if (options) {
    return defaultLoaders.map((loader) => ({ loader, options }));
  }

  return defaultLoaders;
}

export {
  responsiveImage,
  // For backwards compatibility, we keep the setupLoaders export in place.
  // No need to eagerly deprecate, as this has no maintenance cost
  responsiveImage as setupLoaders,
};
