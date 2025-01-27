import { normalizeInput } from '@responsive-image/build-utils';
import { createFilter } from '@rollup/pluginutils';

import { getViteOptions, META_KEY } from './utils';

import type { Options } from './types';
import type { Plugin } from 'vite';

export default function loaderPlugin(
  userOptions: Partial<Options> = {},
): Plugin {
  const filter = createFilter(userOptions.include, userOptions.exclude);

  return {
    name: 'responsive-image/loader',
    // TODO do we need this?
    enforce: 'pre',
    async load(id) {
      if (!filter(id)) {
        return;
      }

      const options = getViteOptions(id, userOptions);
      const data = normalizeInput(id, { generateHash: options.cache });

      return {
        // Only the export plugin will actually return ESM code
        code: '',
        moduleSideEffects: false,
        meta: {
          [META_KEY]: data,
        },
      };
    },
  };
}
