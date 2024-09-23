import type { ImageConfig } from 'imagetools-core';
import type { Metadata, Sharp } from 'sharp';
import type {
  ImageOptions,
  ImageProcessingResult,
  OutputImageType,
} from './types';
import type { ImageType } from '@responsive-image/core';

export async function generateResizedImage(
  image: Sharp,
  config: ImageConfig,
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
