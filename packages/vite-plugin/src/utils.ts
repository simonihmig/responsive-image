import type { PluginContext } from 'rollup';
import type { ResolvedConfig } from 'vite';
import {
  getOptions,
  type ImageLoaderChainedResult,
} from '@responsive-image/build-utils';

import type { ViteOptions, Options } from './types';

export const META_KEY = 'responsive-image';

export const defaultViteOptions = {
  name: '[name]-[width]w.[ext]',
};

export const viteOptionKeys: Array<keyof ViteOptions> = [
  'exclude',
  'include',
  'lqip',
  'name',
];

export function getViteOptions(
  id: string | URL,
  loaderOptions: Partial<Options>,
): Options {
  return getOptions<ViteOptions>(id, defaultViteOptions, loaderOptions);
}

export function getInput(
  context: PluginContext,
  id: string,
): ImageLoaderChainedResult | undefined {
  const info = context.getModuleInfo(id);
  return info?.meta[META_KEY];
}

export function onlyUnique<T>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index;
}

export function getViteBasePath(viteConfig: ResolvedConfig): string {
  return `${
    viteConfig.base.endsWith('/')
      ? viteConfig.base.slice(0, -1)
      : viteConfig.base
  }/@responsive-image/vite-plugin/`;
}
