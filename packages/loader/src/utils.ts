import baseN from 'base-n';
import sharp, { Metadata } from 'sharp';
import { LoaderContext } from 'webpack';
import { ImageLoaderChainedResult, LoaderOptions } from './types';

const b64 = baseN.create();

const defaultImageConfig: LoaderOptions = {
  quality: 80,
  widths: [2048, 1536, 1080, 750, 640],
  formats: ['original', 'webp'],
  name: '[name]-[width]w-[hash].[ext]',
  outputPath: 'assets/images',
};

export function parseQuery(query: string): Record<string, unknown> {
  const params = new URLSearchParams(query);
  return Object.fromEntries(
    [...params.entries()].map(([key, value]) => {
      switch (key) {
        case 'widths':
          return [key, value.split(',').map((v) => parseInt(v, 10))];
        case 'formats':
          return [key, value.split(',')];
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
    })
  );
}

export function getOptions(
  context: LoaderContext<Partial<LoaderOptions>>
): LoaderOptions {
  const parsedResourceQuery = parseQuery(context.resourceQuery);

  // Combines defaults, webpack options and query options,
  return {
    ...defaultImageConfig,
    ...context.getOptions(),
    ...parsedResourceQuery,
  };
}

export function normalizeInput(
  input: Buffer | ImageLoaderChainedResult
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
  base64 = false
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
