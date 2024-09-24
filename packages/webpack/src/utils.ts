import type { LoaderContext } from 'webpack';
import type { Options, WebpackLoaderOptions } from './types';
import {
  getOptions,
  type ImageLoaderChainedResult,
} from '@responsive-image/build-utils';

export const defaultWebpackOptions = {
  name: '[name]-[width]w-[hash].[ext]',
  outputPath: 'images',
  cache: true,
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

export function assertInput(
  input: string | Buffer | ImageLoaderChainedResult,
): asserts input is ImageLoaderChainedResult {
  if (Buffer.isBuffer(input) || typeof input === 'string') {
    throw new Error(
      'You cannot run this webpack loader on raw data, at least @responsive-image/loader is missing in the loader chain!',
    );
  }
}
