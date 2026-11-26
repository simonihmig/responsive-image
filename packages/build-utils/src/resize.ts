import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

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

// Multiple modules can reference the same image (with the same configuration),
// and their transforms run concurrently. As they all share the same cache file,
// a reader could otherwise observe a cache file that is still being written,
// emitting empty or corrupted image data. Deduplicate the work per cache file
// and write the cache atomically.
const pendingCacheWrites = new Map<string, Promise<Buffer>>();
let tmpFileCounter = 0;

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

  const generateImage = async (): Promise<Buffer> => {
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

    return resizedImage.toBuffer();
  };

  const data = (): Promise<Buffer> => {
    if (!options.cache || !input.hash) {
      return generateImage();
    }

    const cacheDir = options.cacheDir ?? './node_modules/.cache';
    const cacheFile = getCacheFilename(input, config, format, cacheDir);

    const pending = pendingCacheWrites.get(cacheFile);
    if (pending) {
      return pending;
    }

    const promise = (async () => {
      await mkdir(dirname(cacheFile), { recursive: true });

      try {
        const buffer = await readFile(cacheFile);

        // Treat empty cache entries as a cache miss, as those might be left
        // behind by a failed (or interrupted) write
        if (buffer.length > 0) {
          return buffer;
        }
      } catch (e) {
        // Only a missing cache file is a regular cache miss. Other errors
        // (permissions, IO) should surface instead of being silently retried.
        if ((e as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw e;
        }
      }

      const resizedImageData = await generateImage();

      if (resizedImageData.length === 0) {
        // Fail loudly instead of emitting a broken asset silently
        throw new Error(
          `@responsive-image/build-utils generated an empty image for ${JSON.stringify(config)}`,
        );
      }

      // Write to a temporary file first and rename it, so concurrent readers
      // never see a partially written cache file
      const tmpFile = `${cacheFile}.${process.pid}-${tmpFileCounter++}.tmp`;

      try {
        await writeFile(tmpFile, resizedImageData);
        await rename(tmpFile, cacheFile);
      } finally {
        // no-op after a successful rename, but cleans up a failed write
        await rm(tmpFile, { force: true });
      }

      return resizedImageData;
    })().finally(() => {
      pendingCacheWrites.delete(cacheFile);
    });

    pendingCacheWrites.set(cacheFile, promise);

    return promise;
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
