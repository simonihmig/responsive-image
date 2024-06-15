import imagesLoader from './images';
import exportPlugin from './export';
import type { Options } from './types';
export type { Options, ImageLoaderChainedResult } from './types';

function setupPlugins(options?: Partial<Options>) {
  return [imagesLoader(options), exportPlugin(options)];
}

export { setupPlugins };
