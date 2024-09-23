import type { Metadata } from 'sharp';
import type { LoaderContext } from 'webpack';
import type { Options } from '../types';
import { getWebpackOptions } from '../utils';
import { encode } from 'blurhash';
import {
  getAspectRatio,
  LazyImageLoaderChainedResult,
  normalizeInput,
} from '@responsive-image/build-utils';

export default function lqipBlurhashLoader(
  this: LoaderContext<Partial<Options>>,
  input: Buffer | LazyImageLoaderChainedResult,
) {
  const data = normalizeInput(input);
  const options = getWebpackOptions(this);
  if (options.lqip?.type !== 'blurhash') {
    return data;
  }

  const loaderCallback = this.async();

  process(data, options)
    .then((result) => {
      // @ts-expect-error wrong webpack types
      loaderCallback(null, result);
    })
    .catch((err) => loaderCallback(err));
}

lqipBlurhashLoader.raw = true;

async function process(
  data: LazyImageLoaderChainedResult,
  options: Options,
): Promise<LazyImageLoaderChainedResult> {
  const { sharp, sharpMeta } = data;

  if (!sharpMeta) {
    throw new Error('Expected sharp metadata to be available');
  }

  const targetPixels =
    (options.lqip?.type === 'blurhash' ? options.lqip?.targetPixels : 16) ?? 16;

  const { width, height } = await getLqipDimensions(targetPixels, sharpMeta);
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

  return {
    ...data,
    lqip: {
      type: 'blurhash',
      hash,
      width,
      height,
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
