import loaderPlugin from './loader';
import resizePlugin from './resize';
import exportPlugin from './export';
import servePlugin from './serve';
import lqipBlurhashPlugin from './lqip/blurhash';
import lqipColorPlugin from './lqip/color';
import lqipColorCssPlugin from './lqip/color-css';
import type { Options } from './types';
export type { Options, ImageLoaderChainedResult } from './types';

function setupPlugins(options?: Partial<Options>) {
  return [
    loaderPlugin(options),
    resizePlugin(options),
    lqipBlurhashPlugin(options),
    lqipColorPlugin(options),
    lqipColorCssPlugin(options),
    exportPlugin(options),
    servePlugin(options),
  ];
}

export { setupPlugins };
