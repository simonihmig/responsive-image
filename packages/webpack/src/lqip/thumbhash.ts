import {
  getAspectRatio,
  type ImageLoaderChainedResult,
  normalizeInput,
  safeString,
} from '@responsive-image/build-utils';

import { getWebpackOptions } from '../utils';

import type { Options } from '../types';
import type { Metadata } from 'sharp';
import type { LoaderContext } from 'webpack';

export default function lqipThumbhashLoader(
  this: LoaderContext<Partial<Options>>,
  input: Buffer | ImageLoaderChainedResult,
) {
  const data = normalizeInput(input);
  const options = getWebpackOptions(this);
  if (options.lqip?.type !== 'thumbhash') {
    return data;
  }

  const loaderCallback = this.async();

  process(data)
    .then((result) => {
      // @ts-expect-error wrong webpack types
      loaderCallback(null, result);
    })
    .catch((err) => loaderCallback(err));
}

lqipThumbhashLoader.raw = true;

async function process(
  data: ImageLoaderChainedResult,
): Promise<ImageLoaderChainedResult> {
  const { sharp, sharpMeta } = data;

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
  const { rgbaToThumbHash } = await import('thumbhash');

  const rawHash = rgbaToThumbHash(width, height, imageData);
  const hash = Buffer.from(rawHash).toString('base64');
  const decodeImport = `import { decode2url } from '@responsive-image/core/thumbhash/decode';`;

  return {
    ...data,
    imports: [...data.imports, decodeImport],
    lqip: {
      bgImage: safeString(`() => decode2url('${hash}', ${width}, ${height})`),
      attribute: `th:${hash}`,
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
