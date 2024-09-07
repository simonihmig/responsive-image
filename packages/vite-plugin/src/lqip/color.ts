import type { Plugin } from 'vite';
import type { Options } from '../types';
import {
  META_KEY,
  generateLqipClassName,
  getInput,
  getOptions,
  getPathname,
} from '../utils';
import { name as colorCssPluginName } from './color-css';

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

      const options = getOptions(id, userOptions);

      if (options.lqip?.type !== 'color') {
        return;
      }

      const pathname = getPathname(id);
      const className = generateLqipClassName(id);
      const importCSS = `${
        pathname
      }.css?_plugin=${colorCssPluginName}&className=${encodeURIComponent(className)}`;

      const result = {
        ...input,
        lqip: { type: 'color', class: className },
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
