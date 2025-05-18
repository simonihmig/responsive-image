import {
  generateLqipClassName,
  getPathname,
  safeString,
  type ImageLoaderChainedResult,
} from '@responsive-image/build-utils';

import { META_KEY, getInput, getViteOptions } from '../utils';
import { name as inlineCssPluginName } from './inline-css';

import type { Options } from '../types';
import type { Plugin } from 'vite';

export default function lqipLinlinePlugin(
  userOptions: Partial<Options> = {},
): Plugin {
  return {
    name: 'responsive-image/lqip/inline',
    async transform(code, id) {
      const input = getInput(this, id);

      // Bail out if our loader didn't handle this module
      if (!input) {
        return;
      }

      const options = getViteOptions(id, userOptions);

      if (options.lqip?.type !== 'inline') {
        return;
      }

      const pathname = getPathname(id);
      const className = generateLqipClassName(id);
      const targetPixels = options.lqip.targetPixels ?? 60;
      let importCSS: string;

      switch (options.styles) {
        case 'external':
          importCSS = `import '${
            pathname
          }.css?_plugin=${inlineCssPluginName}&className=${encodeURIComponent(className)}&targetPixels=${targetPixels}';`;
          break;
        case 'inline':
          importCSS = `import inlineStyles from '${
            pathname
          }.css?_plugin=${inlineCssPluginName}&className=${encodeURIComponent(className)}&targetPixels=${targetPixels}&inline';`;
          break;
        default:
          throw new Error(`Unknown styles option: ${options.styles}`);
      }

      const result = {
        ...input,
        lqip: { class: className, inlineStyles: safeString('inlineStyles') },
        imports: [...input.imports, importCSS],
      } satisfies ImageLoaderChainedResult;

      return {
        // Only the export plugin will actually return ESM code
        code: '',
        meta: {
          [META_KEY]: result,
        },
      };
    },
  };
}
