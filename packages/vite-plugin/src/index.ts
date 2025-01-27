import exportPlugin from './export';
import loaderPlugin from './loader';
import lqipBlurhashPlugin from './lqip/blurhash';
import lqipColorPlugin from './lqip/color';
import lqipColorCssPlugin from './lqip/color-css';
import lqipInlinePlugin from './lqip/inline';
import lqipInlineCssPlugin from './lqip/inline-css';
import resizePlugin from './resize';
import servePlugin from './serve';

import type { Options } from './types';

function setupPlugins(options?: Partial<Options>) {
  return [
    loaderPlugin(options),
    resizePlugin(options),
    lqipBlurhashPlugin(options),
    lqipColorPlugin(options),
    lqipColorCssPlugin(options),
    lqipInlinePlugin(options),
    lqipInlineCssPlugin(options),
    exportPlugin(options),
    servePlugin(options),
  ];
}

export { setupPlugins };
