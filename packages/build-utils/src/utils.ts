import sharp, { type Metadata } from 'sharp';
import type { ImageOptions, ImageLoaderChainedResult } from './types';

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
): ImageLoaderChainedResult;
export function normalizeInput(
  input: string | Buffer | ImageLoaderChainedResult,
): ImageLoaderChainedResult;
export function normalizeInput(
  input: string | Buffer | ImageLoaderChainedResult | ImageLoaderChainedResult,
): ImageLoaderChainedResult | ImageLoaderChainedResult {
  if (typeof input === 'string') {
    return {
      images: [],
      sharp: sharp(getPathname(input)),
      imports: [],
    };
  }

  if (Buffer.isBuffer(input)) {
    return {
      images: [],
      sharp: sharp(input),
      imports: [],
    };
  }

  return input;
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
