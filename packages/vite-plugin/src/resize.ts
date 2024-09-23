import {
  type ImageLoaderChainedResult,
  effectiveImageFormats,
  generateResizedImage,
  getImagetoolsConfigs,
} from '@responsive-image/build-utils';
import type { Plugin } from 'vite';
import type { Options } from './types';
import { META_KEY, getInput, getViteOptions, viteOptionKeys } from './utils';

export default function resizePlugin(
  userOptions: Partial<Options> = {},
): Plugin {
  return {
    name: 'responsive-image/resize',
    // TODO do we need this?
    enforce: 'pre',
    async transform(code, id) {
      const input = getInput(this, id);

      // Bail out if our loader didn't handle this module
      if (!input) {
        return;
      }

      const options = getViteOptions(id, userOptions);
      const { sharp } = input;

      try {
        const sharpMeta = await sharp.metadata();

        const format = effectiveImageFormats(options.format, sharpMeta);
        const configs = await getImagetoolsConfigs(
          {
            ...options,
            format,
          },
          viteOptionKeys,
        );

        const images = await Promise.all(
          configs.map((config) => generateResizedImage(sharp, config)),
        );

        const result = {
          sharpMeta,
          ...input,
          images,
        } satisfies ImageLoaderChainedResult;

        return {
          // Only the export plugin will actually return ESM code
          code: '',
          meta: {
            [META_KEY]: result,
          },
        };
      } catch (e) {
        throw new Error(
          `@responsive-image/vite-plugin failed to generate image data for ${id}: ${e}`,
        );
      }
    },
  };
}
