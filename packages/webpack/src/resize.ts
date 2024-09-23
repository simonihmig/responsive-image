import {
  effectiveImageFormats,
  generateResizedImage,
  getImagetoolsConfigs,
  type LazyImageLoaderChainedResult,
} from '@responsive-image/build-utils';
import type { LoaderContext } from 'webpack';
import type { Options } from './types';
import { assertInput, getWebpackOptions, webpackOptionKeys } from './utils';

export default function resizeLoader(
  this: LoaderContext<Partial<Options>>,
  input: LazyImageLoaderChainedResult,
): void {
  assertInput(input);

  const loaderCallback = this.async();

  const options = getWebpackOptions(this);

  process(input, options, this)
    .then((result) => {
      // @ts-expect-error wrong webpack types
      loaderCallback(null, result);
    })
    .catch((err) => loaderCallback(err));
}

async function process(
  data: LazyImageLoaderChainedResult,
  options: Options,
  context: LoaderContext<Partial<Options>>,
): Promise<LazyImageLoaderChainedResult> {
  const { sharp } = data;
  try {
    const sharpMeta = await sharp.metadata();

    const format = effectiveImageFormats(options.format, sharpMeta);
    const configs = await getImagetoolsConfigs(
      {
        ...options,
        format,
      },
      webpackOptionKeys,
    );

    const images = await Promise.all(
      configs.map((config) => generateResizedImage(sharp, config)),
    );

    return {
      sharpMeta,
      ...data,
      images,
    };
  } catch (e) {
    throw new Error(
      `@responsive-image/webpack failed to generate image data for ${context.resource}: ${e}`,
    );
  }
}
