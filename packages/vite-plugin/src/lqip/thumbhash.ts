import type { Metadata } from 'sharp';
import type { Plugin } from 'vite';
import type { Options } from '../types';
import { META_KEY, getInput, getViteOptions } from '../utils';
import {
  getAspectRatio,
  ImageLoaderChainedResult,
} from '@responsive-image/build-utils';
import { rgbaToThumbHash } from 'thumbhash';

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

      const { width, height } = await getLqipInputDimensions(sharpMeta);
      const lqi = sharp
        .clone()
        .ensureAlpha()
        .resize(width, height, {
          fit: 'fill',
        })
        .raw();

      const imageData = new Uint8ClampedArray(await lqi.toBuffer());
      const rawHash = rgbaToThumbHash(width, height, imageData);

      const result = {
        ...input,
        lqip: {
          type: 'thumbhash',
          hash: Buffer.from(rawHash).toString('base64'),
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
