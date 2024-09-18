import type { ImageType } from '@responsive-image/core';
import { ImageConfig } from 'imagetools-core';
import type { Metadata, Sharp } from 'sharp';
import type { LoaderContext } from 'webpack';
import type { Options } from './types';
import { getWebpackOptions, webpackOptionKeys } from './utils';
import {
  getImagetoolsConfigs,
  ImageLoaderChainedResult,
  ImageProcessingResult,
  normalizeInput,
  OutputImageType,
} from '@responsive-image/build-utils';

const supportedTypes: ImageType[] = ['png', 'jpeg', 'webp', 'avif'];

export default function imagesLoader(
  this: LoaderContext<Partial<Options>>,
  input: Buffer | ImageLoaderChainedResult,
): void {
  const loaderCallback = this.async();

  const options = getWebpackOptions(this);
  const data = normalizeInput(input);

  process(data, options, this)
    .then((result) => {
      // @ts-expect-error wrong webpack types
      loaderCallback(null, result);
    })
    .catch((err) => loaderCallback(err));
}

async function process(
  data: ImageLoaderChainedResult,
  options: Options,
  context: LoaderContext<Partial<Options>>,
): Promise<ImageLoaderChainedResult> {
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

// receive input as Buffer
imagesLoader.raw = true;

async function generateResizedImage(
  image: Sharp,
  config: ImageConfig,
): Promise<ImageProcessingResult> {
  const imagetools = await import('imagetools-core');

  const { transforms } = imagetools.generateTransforms(
    config,
    imagetools.builtins,
    new URLSearchParams(),
  );

  const { image: resizedImage, metadata } = await imagetools.applyTransforms(
    transforms,
    image,
  );

  const data = await resizedImage.toBuffer();

  return {
    data,
    width: metadata.width!,
    format: metadata.format as ImageType,
  };
}

function effectiveImageFormats(
  formats: OutputImageType[],
  meta: Metadata,
): ImageType[] {
  return (
    formats
      .map((format) => {
        if (format === 'original') {
          assertSupportedType(meta.format);
          return meta.format;
        } else {
          return format;
        }
      })
      // unique values
      .filter((value, index, self) => {
        return self.indexOf(value) === index;
      })
  );
}

function assertSupportedType(type: unknown): asserts type is ImageType {
  // @ts-expect-error we want to handle wrong times at runtime
  if (!supportedTypes.includes(type)) {
    throw new Error(`Unknown image type "${type}"`);
  }
}
