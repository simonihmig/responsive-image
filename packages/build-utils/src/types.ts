import type { SAFE_STRING } from './serialize';
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
