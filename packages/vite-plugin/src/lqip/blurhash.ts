import { getAspectRatio } from '@responsive-image/build-utils';
import { encode } from 'blurhash';

import { META_KEY, getInput, getViteOptions } from '../utils';

import type { Options } from '../types';
import type { ImageLoaderChainedResult } from '@responsive-image/build-utils';
import type { Metadata } from 'sharp';
import type { Plugin } from 'vite';

export default function lqipBlurhashPlugin(
  userOptions: Partial<Options> = {},
): Plugin {
  return {
    name: 'responsive-image/lqip/blurhash',
    async transform(code, id) {
      const input = getInput(this, id);

      // Bail out if our loader didn't handle this module
      if (!input) {
        return;
      }

      const options = getViteOptions(id, userOptions);

      if (options.lqip?.type !== 'blurhash') {
        return;
      }

      const { sharp, sharpMeta } = input;

      if (!sharpMeta) {
        throw new Error('Expected sharp metadata to be available');
      }

      const targetPixels =
        (options.lqip?.type === 'blurhash' ? options.lqip?.targetPixels : 16) ??
        16;

      const { width, height } = await getLqipDimensions(
        targetPixels,
        sharpMeta,
      );
      const rawWidth = width * 8;
      const rawHeight = height * 8;
      const lqi = sharp
        .clone()
        .ensureAlpha()
        .resize(rawWidth, rawHeight, {
          fit: 'fill',
        })
        .raw();

      const imageData = new Uint8ClampedArray(await lqi.toBuffer());
      const hash = encode(imageData, rawWidth, rawHeight, width, height);

      const result = {
        ...input,
        lqip: {
          type: 'blurhash',
          hash,
          width,
          height,
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

function getLqipDimensions(targetPixels: number, meta: Metadata) {
  const aspectRatio = getAspectRatio(meta) ?? 1;

  // taken from https://github.com/google/eleventy-high-performance-blog/blob/5ed39db7fd3f21ae82ac1a8e833bf283355bd3d0/_11ty/blurry-placeholder.js#L74-L92
  let bitmapHeight = targetPixels / aspectRatio;
  bitmapHeight = Math.sqrt(bitmapHeight);
  let bitmapWidth = targetPixels / bitmapHeight;

  // Blurhash has a limit of 9 "components"
  bitmapHeight = Math.min(9, Math.round(bitmapHeight));
  bitmapWidth = Math.min(9, Math.round(bitmapWidth));
  return { width: Math.round(bitmapWidth), height: Math.round(bitmapHeight) };
}
