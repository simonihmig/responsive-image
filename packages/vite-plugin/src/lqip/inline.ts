import type { Plugin } from 'vite';
import type { Options } from '../types';
import {
  META_KEY,
  generateLqipClassName,
  getInput,
  getOptions,
  getPathname,
} from '../utils';
import { name as inlineCssPluginName } from './inline-css';

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

      const options = getOptions(id, userOptions);

      if (options.lqip?.type !== 'inline') {
        return;
      }

      const pathname = getPathname(id);
      const className = generateLqipClassName(id);
      const targetPixels = options.lqip.targetPixels ?? 60;
      const importCSS = `${
        pathname
      }.css?_plugin=${inlineCssPluginName}&className=${encodeURIComponent(className)}&targetPixels=${targetPixels}`;

      const result = {
        ...input,
        lqip: { type: 'inline', class: className },
        imports: [...input.imports, importCSS],
      };

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