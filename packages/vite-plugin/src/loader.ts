import { normalizeInput } from '@responsive-image/build-utils';
import { createFilter } from 'vite';

import { getViteOptions, META_KEY } from './utils';

import type { Options } from './types';
import type { Plugin } from 'vite';

export default function loaderPlugin(
  userOptions: Partial<Options> = {},
): Plugin {
  const options = getViteOptions('', userOptions);
  const { include, exclude } = options;
  const filter = createFilter(include, exclude);

  return {
    name: 'responsive-image/loader',
    // TODO do we need this?
    enforce: 'pre',
    load: {
      // Filter on the Rust-side when used with rolldown: https://rolldown.rs/apis/plugin-api/hook-filters#plugin-hook-filters
      filter: {
        id: {
          include,
          exclude,
        },
      },
      async handler(id) {
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
    },
  };
}
