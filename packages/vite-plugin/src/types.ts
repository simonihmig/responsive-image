import type { ImageOptions, LqipOptions } from '@responsive-image/build-utils';
import type { ImageType } from '@responsive-image/core';

export interface ViteOptions {
  /**
   * The template for the generated image files. The placeholders [name], [ext] and [width] are replaced with real values.
   * @default '[name]-[width]w.[ext]'
   */
  name: string;

  /**
   * Enable caching
   * @default true
   */
  cache: boolean;

  /**
   * Which image import paths should be included to be processed by the plugin
   * @default /^[^?]+\.(avif|gif|heif|jpeg|jpg|png|tiff|webp)\?.*responsive.*$/
   */
  include: string | RegExp | Array<string | RegExp>;

  /**
   * Which image import paths should be excluded from being processed by the plugin. Takes precedence over `include`.
   */
  exclude?: string | RegExp | Array<string | RegExp>;

  /**
   * Apply LQIP options on all image imports
   * @see https://responsive-image.dev/usage/lqip
   */
  lqip?: LqipOptions;

  /**
   * How (LQIP) CSS should be emitted. With `external` it will be bundled into an external CSS file, with `internal`
   * it is shipped with the JavaScript bundle and applied inline.
   * @default 'external'
   */
  styles: 'external' | 'inline';
}

export type Options = ViteOptions & ImageOptions;

export interface ServedImageData {
  data: () => Promise<Buffer>;
  format: ImageType;
}
