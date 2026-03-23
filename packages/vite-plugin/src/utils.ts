import {
  getOptions,
  type ImageLoaderChainedResult,
} from '@responsive-image/build-utils';

import type { Options, ViteOptions } from './types';
import type { ResolvedConfig, Rollup } from 'vite';

export const META_KEY = 'responsive-image';

export const defaultViteOptions = {
  include: /^[^?]+\.(avif|gif|heif|jpeg|jpg|png|tiff|webp)\?.*responsive.*$/,
  name: '[name]-[width]w.[ext]',
  cache: true,
  styles: 'external',
} satisfies ViteOptions;

export const viteOptionKeys = [
  'exclude',
  'include',
  'lqip',
  'name',
  'styles',
] satisfies Array<keyof ViteOptions>;

export function getViteOptions(
  id: string | URL,
  loaderOptions: Partial<Options>,
): Options {
  return getOptions<ViteOptions>(id, defaultViteOptions, loaderOptions);
}

export function getInput(
  context: Rollup.PluginContext,
  id: string,
): ImageLoaderChainedResult | undefined {
  const info = context.getModuleInfo(id);
  return info?.meta[META_KEY];
}

export function getViteBasePath(viteConfig: ResolvedConfig): string {
  return `${
    viteConfig.base.endsWith('/')
      ? viteConfig.base.slice(0, -1)
      : viteConfig.base
  }/@responsive-image/vite-plugin/`;
}
