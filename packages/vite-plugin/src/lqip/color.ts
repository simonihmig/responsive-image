import {
  generateLqipClassName,
  getPathname,
  safeString,
  type ImageLoaderChainedResult,
} from '@responsive-image/build-utils';

import { META_KEY, getInput, getViteOptions } from '../utils';
import { name as colorCssPluginName } from './color-css';

import type { Options } from '../types';
import type { Plugin } from 'vite';

export default function lqipColorPlugin(
  userOptions: Partial<Options> = {},
): Plugin {
  return {
    name: 'responsive-image/lqip/color',
    async transform(code, id) {
      const input = getInput(this, id);

      // Bail out if our loader didn't handle this module
      if (!input) {
        return;
      }

      const options = getViteOptions(id, userOptions);

      if (options.lqip?.type !== 'color') {
        return;
      }

      const pathname = getPathname(id);
      const className = generateLqipClassName(id);
      let importCSS: string;

      switch (options.styles) {
        case 'external':
          importCSS = `import '${
            pathname
          }.css?_plugin=${colorCssPluginName}&className=${encodeURIComponent(className)}';`;
          break;
        case 'inline':
          importCSS = `import inlineStyles from '${
            pathname
          }.xyz?_plugin=${colorCssPluginName}&inline=1';`;
          break;
        default:
          throw new Error(`Unknown styles option: ${options.styles}`);
      }

      const result = {
        ...input,
        lqip:
          options.styles === 'inline'
            ? { inlineStyles: safeString('inlineStyles') }
            : { class: className },
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
