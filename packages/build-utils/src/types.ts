import type { SAFE_STRING } from './serialize';
import type { ImageType } from '@responsive-image/core';
import type { Metadata, Sharp } from 'sharp';

export type OutputImageType = 'original' | ImageType;

export interface LqipBaseOptions {
  /**
   * The type of the LQIP technique.
   * @see https://responsive-image.dev/usage/lqip
   */
  type: string;
}

export interface LqipColorOptions extends LqipBaseOptions {
  type: 'color';
}

export interface LqipInlineOptions extends LqipBaseOptions {
  type: 'inline';

  /**
   * The number of pixels the inlined placeholder image should have. You can customize this to balance size vs. quality.
   * The build plugin will try to get close to this, based on the aspect ratio of the image.
   * @default: 60
   */
  targetPixels?: number;
}

export interface LqipBlurhashOptions extends LqipBaseOptions {
  type: 'blurhash';

  /**
   * The number of pixels the blurhash placeholder should have. You can customize this to balance size vs. quality.
   * The build plugin will try to get close to this, based on the aspect ratio of the image.
   * @default: 16
   */
  targetPixels?: number;
}

export interface LqipThumbhashOptions extends LqipBaseOptions {
  type: 'thumbhash';
}

export type LqipOptions =
  | LqipColorOptions
  | LqipInlineOptions
  | LqipBlurhashOptions
  | LqipThumbhashOptions;

export interface ImageOptions {
  /**
   * The image widths to be generated. For responsive images this should match the typical device sizes
   * @default [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
   */
  w: number[];

  /**
   * Adjust the image quality (1 - 100). Higher number means better quality but also larger file size.
   */
  quality?: number;

  /**
   * The image formats to generate.
   * @default ['original', 'webp']
   * @see https://responsive-image.dev/usage/image-formats
   */
  format: OutputImageType[];

  /**
   * Resize the image to have a specific aspect ratio.
   */
  aspect?: number;

  // TODO can we type this better
  [key: string]: unknown;
}

export interface ImageProcessingResult {
  data: () => Promise<Buffer>;
  width: number;
  format: ImageType;
}

export type SafeString = string & {
  [SAFE_STRING]: true;
};

export type StringLike<T> = T | SafeString;

export interface Lqip {
  class?: StringLike<string>;
  attribute?: string;
  inlineStyles?: Record<string, string> | SafeString;
}

export interface ImageLoaderChainedResult {
  lqip?: Lqip;
  images: ImageProcessingResult[];
  sharp: Sharp;
  imports: string[];
  sharpMeta?: Metadata;
  hash?: string;
}
