import {
  generateLqipClassName,
  getPathname,
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
      const importCSS = `import '${
        pathname
      }.css?_plugin=${inlineCssPluginName}&className=${encodeURIComponent(className)}&targetPixels=${targetPixels}';`;

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
