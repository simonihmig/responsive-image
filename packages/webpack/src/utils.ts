import type { LoaderContext } from 'webpack';
import type { Options, WebpackLoaderOptions } from './types';
import { getOptions } from '@responsive-image/build-utils';

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
