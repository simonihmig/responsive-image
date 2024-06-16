import type { ImageType } from '@responsive-image/core';
import { ImageConfig } from 'imagetools-core';
import type { Metadata, Sharp } from 'sharp';
import { Plugin } from 'vite';
import type {
  ImageLoaderChainedResult,
  ImageProcessingResult,
  Options,
  OutputImageType,
} from './types';
import {
  META_KEY,
  getImagetoolsConfigs,
  getOptions,
  normalizeInput,
  parseURL,
} from './utils';
import { createFilter } from '@rollup/pluginutils';

const supportedTypes: ImageType[] = ['png', 'jpeg', 'webp', 'avif'];

// TODO split into loader (that normalizes the input) and imagesTransforms?
export default function imagesLoader(
  userOptions: Partial<Options> = {},
): Plugin {
  const filter = createFilter(userOptions.include, userOptions.exclude);

  return {
    name: 'responsive-image/images',
    // TODO do we need this?
    enforce: 'pre',
    async load(id) {
      if (!filter(id)) {
        return;
      }

      const url = parseURL(id);

      const options = getOptions(url, userOptions);
      const data = normalizeInput(id);
      const { sharp } = data;

      try {
        const sharpMeta = await sharp.metadata();

        const format = effectiveImageFormats(options.format, sharpMeta);
        const configs = await getImagetoolsConfigs({
          ...options,
          format,
        });

        const images = await Promise.all(
          configs.map((config) => generateResizedImage(sharp, config)),
        );

        const result = {
          sharpMeta,
          ...data,
          images,
        } satisfies ImageLoaderChainedResult;

        return {
          // Only the export plugin will actually return ESM code
          code: '',
          moduleSideEffects: false,
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
