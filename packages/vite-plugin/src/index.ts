import configPlugin from './config';
import exportPlugin from './export';
import loaderPlugin from './loader';
import lqipBlurhashPlugin from './lqip/blurhash';
import lqipColorPlugin from './lqip/color';
import lqipColorCssPlugin from './lqip/color-css';
import lqipInlinePlugin from './lqip/inline';
import lqipInlineCssPlugin from './lqip/inline-css';
import lqipThumbhashPlugin from './lqip/thumbhash';
import resizePlugin from './resize';
import servePlugin from './serve';

import type { Options } from './types';

function setupPlugins(options?: Partial<Options>) {
  return [
    loaderPlugin(options),
    resizePlugin(options),
    lqipBlurhashPlugin(options),
    lqipThumbhashPlugin(options),
    lqipColorPlugin(options),
    lqipColorCssPlugin(options),
    lqipInlinePlugin(options),
    lqipInlineCssPlugin(options),
    exportPlugin(options),
    servePlugin(options),
    configPlugin(),
  ];
}

export { setupPlugins };
