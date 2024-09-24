import type { ImageOptions, LqipOptions } from '@responsive-image/build-utils';
import type { ImageType } from '@responsive-image/core';

export interface ViteOptions {
  name: string;
  cache: boolean;
  include?: string | RegExp | Array<string | RegExp>;
  exclude?: string | RegExp | Array<string | RegExp>;
  lqip?: LqipOptions;
}

export type Options = ViteOptions & ImageOptions;

export interface ServedImageData {
  data: () => Promise<Buffer>;
  format: ImageType;
}
