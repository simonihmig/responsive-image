import loaderPlugin from './loader';
import resizePlugin from './resize';
import exportPlugin from './export';
import servePlugin from './serve';
import lqipBlurhashPlugin from './lqip/blurhash';
import type { Options } from './types';
export type { Options, ImageLoaderChainedResult } from './types';

function setupPlugins(options?: Partial<Options>) {
  return [
    loaderPlugin(options),
    resizePlugin(options),
    lqipBlurhashPlugin(options),
    exportPlugin(options),
    servePlugin(options),
  ];
}

export { setupPlugins };
