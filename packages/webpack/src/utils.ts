import type { LoaderContext } from 'webpack';
import type { Options, WebpackLoaderOptions } from './types';
import {
  getOptions,
  LazyImageLoaderChainedResult,
} from '@responsive-image/build-utils';

export const defaultWebpackOptions = {
  name: '[name]-[width]w-[hash].[ext]',
  outputPath: 'images',
};

export const webpackOptionKeys = [
  'lqip',
  'name',
  'outputPath',
  'webPath',
] satisfies Array<keyof WebpackLoaderOptions>;

export function getWebpackOptions(
  context: LoaderContext<Partial<Options>>,
): Options {
  return getOptions<WebpackLoaderOptions>(
    context.resource,
    defaultWebpackOptions,
    context.getOptions(),
  );
}

export function onlyUnique<T>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index;
}

export function assertInput(
  input: string | Buffer | LazyImageLoaderChainedResult,
): asserts input is LazyImageLoaderChainedResult {
  if (Buffer.isBuffer(input) || typeof input === 'string') {
    throw new Error(
      'You cannot run this webpack loader on raw data, at least @responsive-image/loader is missing in the loader chain!',
    );
  }
}
