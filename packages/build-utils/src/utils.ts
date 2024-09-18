import baseN from 'base-n';
import sharp, { type Metadata } from 'sharp';
import type {
  ImageLoaderChainedResult,
  ImageOptions,
  LazyImageLoaderChainedResult,
} from './types';
import type { ImageConfig } from 'imagetools-core';

const b64 = baseN.create();

const defaultImageConfig: ImageOptions = {
  quality: 80,
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
  input: string | Buffer | LazyImageLoaderChainedResult,
): LazyImageLoaderChainedResult;
export function normalizeInput(
  input: string | Buffer | ImageLoaderChainedResult,
): ImageLoaderChainedResult;
export function normalizeInput(
  input:
    | string
    | Buffer
    | ImageLoaderChainedResult
    | LazyImageLoaderChainedResult,
): ImageLoaderChainedResult | LazyImageLoaderChainedResult {
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

const generatedClassNames = new Map<string, string>();

export function generateLqipClassName(resource: string): string {
  if (generatedClassNames.has(resource)) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return generatedClassNames.get(resource)!;
  } else {
    const className = `eri-dyn-${b64.encode(generatedClassNames.size)}`;
    generatedClassNames.set(resource, className);

    return className;
  }
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

export function blurrySvg(src: string, width: number, height: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${width} ${height}">
<filter id="b" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation=".5"></feGaussianBlur><feComponentTransfer><feFuncA type="discrete" tableValues="1 1"></feFuncA></feComponentTransfer></filter>
<image filter="url(#b)" preserveAspectRatio="none" height="100%" width="100%" xlink:href="${src}"></image>
</svg>`;
}
