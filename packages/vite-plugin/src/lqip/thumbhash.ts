import { getAspectRatio, safeString } from '@responsive-image/build-utils';
import { rgbaToThumbHash } from 'thumbhash';

import { META_KEY, getInput, getViteOptions } from '../utils';

import type { Options } from '../types';
import type { ImageLoaderChainedResult } from '@responsive-image/build-utils';
import type { Metadata } from 'sharp';
import type { Plugin } from 'vite';

export default function lqipThumbhashPlugin(
  userOptions: Partial<Options> = {},
): Plugin {
  return {
    name: 'responsive-image/lqip/thumbhash',
    async transform(code, id) {
      const input = getInput(this, id);

      // Bail out if our loader didn't handle this module
      if (!input) {
        return;
      }

      const options = getViteOptions(id, userOptions);

      if (options.lqip?.type !== 'thumbhash') {
        return;
      }

      const { sharp, sharpMeta } = input;

      if (!sharpMeta) {
        throw new Error('Expected sharp metadata to be available');
      }

      const { width, height } = getLqipInputDimensions(sharpMeta);
      const lqi = sharp
        .clone()
        .ensureAlpha()
        .resize(width, height, {
          fit: 'fill',
        })
        .raw();

      const imageData = new Uint8ClampedArray(await lqi.toBuffer());
      const rawHash = rgbaToThumbHash(width, height, imageData);
      const hash = Buffer.from(rawHash).toString('base64');
      const decodeImport = `import { decode2url } from '@responsive-image/core/thumbhash/decode';`;

      const result = {
        ...input,
        imports: [...input.imports, decodeImport],
        lqip: {
          bgImage: safeString(`() => decode2url('${hash}')`),
          attribute: `th:${hash}`,
        },
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

function getLqipInputDimensions(meta: Metadata) {
  const aspectRatio = getAspectRatio(meta) ?? 1;
  let width: number;
  let height: number;

  if (aspectRatio > 1) {
    width = 100;
    height = Math.round(100 / aspectRatio);
  } else {
    width = Math.round(100 * aspectRatio);
    height = 100;
  }

  return { width, height };
}
