import type { ImageOptions, LqipOptions } from '@responsive-image/build-utils';

export interface WebpackLoaderOptions {
  name: string;
  webPath?: string;
  outputPath: string;
  lqip?: LqipOptions;
  cache: boolean;
  styles: 'external' | 'inline';
}

export type Options = WebpackLoaderOptions & ImageOptions;
