import type {
  ImageType,
  LqipBlurhash,
  LqipColor,
  LqipInline,
} from '@responsive-image/core';
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

export type LqipOptions =
  | LqipColorOptions
  | LqipInlineOptions
  | LqipBlurhashOptions;

export interface ViteOptions {
  name: string;
  include?: string | RegExp | Array<string | RegExp>;
  exclude?: string | RegExp | Array<string | RegExp>;
  lqip?: LqipOptions;
}
export interface ImageOptions {
  w: number[];
  quality: number;
  format: OutputImageType[];
  [key: string]: unknown;
}

export type Options = ViteOptions & ImageOptions;

export interface ImageProcessingResult {
  data: Buffer;
  width: number;
  format: ImageType;
}

export interface ImageLoaderChainedResult {
  lqip?: LqipInline | LqipColor | LqipBlurhash;
  images: ImageProcessingResult[];
  sharp: Sharp;
  imports: string[];
  sharpMeta?: Metadata;
}
