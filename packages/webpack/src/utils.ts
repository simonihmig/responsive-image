import baseN from 'base-n';
import sharp, { type Metadata } from 'sharp';
import type { LoaderContext } from 'webpack';
import type {
  ImageLoaderChainedResult,
  LoaderOptions,
  WebpackLoaderOptions,
} from './types';
import type { ImageConfig } from 'imagetools-core';

const b64 = baseN.create();

const defaultImageConfig: LoaderOptions = {
  quality: 80,
  w: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  // TODO: remove this, needs fixing tests
  allowUpscale: 'true',
  format: ['original', 'webp'],
  name: '[name]-[width]w-[hash].[ext]',
  outputPath: 'images',
};

const webpackLoaderKeys: string[] = [
  'lqip',
  'name',
  'outputPath',
  'webPath',
] satisfies Array<keyof WebpackLoaderOptions>;
const queryArraySeparator = /[,;]/;

export function parseQuery(query: string): Partial<LoaderOptions> {
  const params = new URLSearchParams(query);
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

export async function getImagetoolsConfigs(
  options: LoaderOptions,
): Promise<ImageConfig[]> {
  const imagetools = await import('imagetools-core');

  const entries = Object.entries(options)
    .filter(([key]) => !webpackLoaderKeys.includes(key))
    .map(([key, value]) => {
      // imagetools expects this type
      const stringarrayifiedValue = Array.isArray(value)
        ? value.map((v) => String(v))
        : [String(value)];

      return [key, stringarrayifiedValue] satisfies [string, string[]];
    });

  return imagetools.resolveConfigs(entries, imagetools.builtinOutputFormats);
}

export function getOptions(
  context: LoaderContext<Partial<LoaderOptions>>,
): LoaderOptions {
  const parsedResourceQuery = parseQuery(context.resourceQuery);

  // Combines defaults, webpack options and query options,
  return {
    ...defaultImageConfig,
    ...context.getOptions(),
    ...parsedResourceQuery,
  } as LoaderOptions;
}

export function normalizeInput(
  input: Buffer | ImageLoaderChainedResult,
): ImageLoaderChainedResult {
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
