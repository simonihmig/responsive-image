import { mkdir, readFile, writeFile } from 'node:fs/promises';

import { getCacheFilename } from './utils';

import type {
  ImageLoaderChainedResult,
  ImageOptions,
  ImageProcessingResult,
  OutputImageType,
} from './types';
import type { ImageType } from '@responsive-image/core';
import type { ImageConfig } from 'imagetools-core';
import type { Metadata } from 'sharp';

export async function generateResizedImage(
  input: ImageLoaderChainedResult,
  config: ImageConfig,
  options: { cache?: boolean; cacheDir?: string } = {},
): Promise<ImageProcessingResult> {
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
    let cacheFile: string | undefined = undefined;

    if (options.cache && input.hash) {
      const cacheDir = options.cacheDir ?? './node_modules/.cache';

      cacheFile = getCacheFilename(input, config, format, cacheDir);

      await mkdir(cacheDir, { recursive: true });

      try {
        const buffer = await readFile(cacheFile);

        return buffer;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // do nothing
      }
    }

    const imagetools = await import('imagetools-core');

    const { transforms } = imagetools.generateTransforms(
      config,
      imagetools.builtins,
      new URLSearchParams(),
    );

    const { image: resizedImage } = await imagetools.applyTransforms(
      transforms,
      input.sharp,
    );

    const resizedImageData = await resizedImage.toBuffer();

    if (options.cache && cacheFile) {
      // console.log(
      //   `writing to cache file ${cacheFile} for ${JSON.stringify(config)}`,
      // );
      await writeFile(cacheFile, resizedImageData);
    }

    return resizedImageData;
  };

  return {
    data,
    width: parseInt(w, 10),
    format: format as ImageType,
  };
}

export function effectiveImageFormats(
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

const supportedTypes: ImageType[] = ['png', 'jpeg', 'webp', 'avif'];

function assertSupportedType(type: unknown): asserts type is ImageType {
  // @ts-expect-error we want to handle wrong times at runtime
  if (!supportedTypes.includes(type)) {
    throw new Error(`Unknown image type "${type}"`);
  }
}

export async function getImagetoolsConfigs<
  BUILDOPTIONS extends Record<string, unknown>,
>(
  options: ImageOptions & BUILDOPTIONS,
  buildKeys: Array<keyof BUILDOPTIONS>,
): Promise<ImageConfig[]> {
  const imagetools = await import('imagetools-core');

  const entries = Object.entries(options)
    .filter(([key]) => !buildKeys.includes(key))
    .map(([key, value]) => {
      // imagetools expects this type
      const stringarrayifiedValue = Array.isArray(value)
        ? value.map((v) => String(v))
        : [String(value)];

      return [key, stringarrayifiedValue] satisfies [string, string[]];
    });

  return imagetools.resolveConfigs(entries, imagetools.builtinOutputFormats);
}
