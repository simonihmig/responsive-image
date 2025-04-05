import {
  generateLqipClassName,
  getPathname,
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
      const importCSS = `import '${
        pathname
      }.css?_plugin=${colorCssPluginName}&className=${encodeURIComponent(className)}';`;

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
