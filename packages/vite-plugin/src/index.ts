import loaderPlugin from './loader';
import resizePlugin from './resize';
import exportPlugin from './export';
import type { Options } from './types';
export type { Options, ImageLoaderChainedResult } from './types';

function setupPlugins(options?: Partial<Options>) {
  return [loaderPlugin(options), resizePlugin(options), exportPlugin(options)];
}

export { setupPlugins };
