import type { ImageType } from '@responsive-image/core';
import { ImageConfig } from 'imagetools-core';
import type { Metadata, Sharp } from 'sharp';
import { Plugin } from 'vite';
import type {
  ImageLoaderChainedResult,
  LazyImageProcessingResult,
  Options,
  OutputImageType,
} from './types';
import { META_KEY, getImagetoolsConfigs, getInput, getOptions } from './utils';

const supportedTypes: ImageType[] = ['png', 'jpeg', 'webp', 'avif'];

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

      const options = getOptions(id, userOptions);
      const { sharp } = input;

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

async function generateResizedImage(
  image: Sharp,
  config: ImageConfig,
): Promise<LazyImageProcessingResult> {
  const { w, format } = config;

  if (typeof w !== 'string') {
    throw new Error(
      'Expected width to be in image config. Looks like an internal bug in @responsive-image/vite-plugin.',
    );
  }

  if (typeof format !== 'string') {
    throw new Error(
      'Expected format to be in image config. Looks like an internal bug in @responsive-image/vite-plugin.',
    );
  }

  const data = async () => {
    const imagetools = await import('imagetools-core');

    const { transforms } = imagetools.generateTransforms(
      config,
      imagetools.builtins,
      new URLSearchParams(),
    );

    const { image: resizedImage } = await imagetools.applyTransforms(
      transforms,
      image,
    );

    return resizedImage.toBuffer();
  };

  return {
    data,
    width: parseInt(w, 10),
    format: format as ImageType,
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
