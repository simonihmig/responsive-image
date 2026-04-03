import type { ImageOptions, LqipOptions } from '@responsive-image/build-utils';

export interface WebpackLoaderOptions {
  /**
   * The template for the generated image files. The placeholders [name], [ext] and [width] are replaced with real values.
   * @default '[name]-[width]w-[hash].[ext]'
   */
  name: string;

  /**
   * The public URL image assets will be loaded from, e.g. 'https://cdn.example.com/assets/'
   *
   * @default: `output.publicPath` webpack config
   * @see https://webpack.js.org/configuration/output/#outputpublicpath
   */
  webPath?: string;

  /**
   * A custom output path of image assets, relative to `output.path` webpack config (e.g. `dist`)
   *
   * @default 'assets'
   */
  outputPath: string;

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

  /**
   *
   * @private
   * @internal
   */
  cache: boolean;
}

export type Options = WebpackLoaderOptions & ImageOptions;
