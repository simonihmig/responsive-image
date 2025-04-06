import type { ImageType } from '@responsive-image/core';
import type { Metadata, Sharp } from 'sharp';

export type OutputImageType = 'original' | ImageType;

export interface LqipBaseOptions {
  type: string;
}

export interface LqipColorOptions extends LqipBaseOptions {
  type: 'color';
}

export interface LqipInlineOptions extends LqipBaseOptions {
  type: 'inline';
  targetPixels?: number;
}

export interface LqipBlurhashOptions extends LqipBaseOptions {
  type: 'blurhash';
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
  w: number[];
  quality?: number;
  format: OutputImageType[];
  aspect?: number;
  [key: string]: unknown;
}

export interface ImageProcessingResult {
  data: () => Promise<Buffer>;
  width: number;
  format: ImageType;
}

// TODO
type SafeString = string;

export type ValueOrCallback<T> = T | SafeString;

export interface Lqip {
  class?: ValueOrCallback<string>;
  bgImage?: ValueOrCallback<string>;
}

export interface ImageLoaderChainedResult {
  lqip?: Lqip;
  images: ImageProcessingResult[];
  sharp: Sharp;
  imports: string[];
  sharpMeta?: Metadata;
  hash?: string;
}
