import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import sharp, { type Metadata } from 'sharp';

import type { ImageOptions, ImageLoaderChainedResult } from './types';
import type { ImageConfig } from 'imagetools-core';

const defaultImageConfig: ImageOptions = {
  w: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  // TODO: remove this, needs fixing tests
  allowUpscale: 'true',
  format: ['original', 'webp'],
};

const queryArraySeparator = ';';

export const META_KEY = 'responsive-image';

export function parseURL(id: string) {
  return new URL(id, 'file://');
}

export function getPathname(id: string) {
  const url = parseURL(id);
  return decodeURIComponent(url.pathname);
}

export function parseQuery(
  query: string | URLSearchParams,
): Partial<ImageOptions> {
  const params =
    query instanceof URLSearchParams ? query : new URLSearchParams(query);
  return Object.fromEntries(
    [...params.entries()].map(([key, value]) => {
      switch (key) {
        case 'w':
          return [
            key,
            value.split(queryArraySeparator).map((v) => parseInt(v, 10)),
          ];
        case 'format':
          return [key, value.split(queryArraySeparator)];
        case 'quality':
          return [key, parseInt(value, 10)];
        case 'aspect':
          return [key, parseAspect(value)];
        case 'lqip': {
          const parsedValue =
            value.charAt(0) === '{' ? JSON.parse(value) : value;

          return [
            key,
            typeof parsedValue === 'string'
              ? { type: parsedValue }
              : parsedValue,
          ];
        }

        default:
          return [key, value];
      }
    }),
  );
}

export function getOptions<BUILDOPTIONS>(
  id: string | URL,
  defaultOptions: BUILDOPTIONS,
  loaderOptions: Partial<BUILDOPTIONS>,
): ImageOptions & BUILDOPTIONS {
  const url = id instanceof URL ? id : parseURL(id);
  const parsedResourceQuery = parseQuery(url.searchParams);

  // Combines defaults, webpack options and query options,
  return {
    ...defaultImageConfig,
    ...defaultOptions,
    ...loaderOptions,
    ...parsedResourceQuery,
  } as ImageOptions & BUILDOPTIONS;
}

export function normalizeInput(
  input: string | Buffer | ImageLoaderChainedResult,
  options: { generateHash?: boolean } = {},
): ImageLoaderChainedResult {
  if (typeof input === 'string') {
    const filename = getPathname(input);
    input = readFileSync(filename);
  }

  if (Buffer.isBuffer(input)) {
    return {
      images: [],
      sharp: sharp(input),
      imports: [],
      hash: options.generateHash ? hash([input]) : undefined,
    };
  }

  return input;
}

// taken from imagetools, which we cannot reuse since it is not exported
export function parseAspect(aspect: string): number | undefined {
  const parts = aspect.split(':');

  let aspectRatio;
  if (parts.length === 1) {
    // the string was a float
    aspectRatio = parseFloat(parts[0]);
  } else if (parts.length === 2) {
    // the string was a colon delimited aspect ratio
    const [width, height] = parts.map((str) => parseInt(str));

    if (!width || !height) return undefined;

    aspectRatio = width / height;
  }
  if (!aspectRatio || aspectRatio <= 0) return undefined;
  return aspectRatio;
}

export function getAspectRatio(meta: Metadata): number | undefined {
  if (meta.height && meta.width && meta.height > 0) {
    return Math.round((meta.width / meta.height) * 100) / 100;
  }
}

export function onlyUnique<T>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index;
}

export function dataUri(
  data: string | Buffer,
  type: string,
  base64 = false,
): string {
  return `data:${type};base64,${
    base64 ? data : Buffer.from(data).toString('base64')
  }`;
}

export function hash(datas: Array<string | object | Buffer>): string {
  const hash = createHash('md5');

  for (let data of datas) {
    if (typeof data === 'object') {
      data = JSON.stringify(data);
    }

    hash.update(data);
  }

  return hash.digest('hex');
}

export function getCacheFilename(
  input: ImageLoaderChainedResult,
  config: ImageConfig,
  extension: string,
  cacheDir: string,
): string {
  if (!input.hash) {
    throw new Error('Expected hash to be availiable');
  }

  return join(cacheDir, `${hash([config, input.hash])}.${extension}`);
}
