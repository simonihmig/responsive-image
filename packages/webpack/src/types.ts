import type {
  ImageType,
  LqipBlurhash,
  LqipColor,
  LqipInline,
} from '@responsive-image/core';
import type { Metadata, Sharp } from 'sharp';

export type OutputImageType = 'original' | ImageType;

export interface LqipBaseLoaderOptions {
  type: string;
}

export interface LqipColorLoaderOptions extends LqipBaseLoaderOptions {
  type: 'color';
}

export interface LqipInlineLoaderOptions extends LqipBaseLoaderOptions {
  type: 'inline';
  targetPixels?: number;
}

export interface LqipBlurhashLoaderOptions extends LqipBaseLoaderOptions {
  type: 'blurhash';
  targetPixels?: number;
}

export type LqipLoaderOptions =
  | LqipColorLoaderOptions
  | LqipInlineLoaderOptions
  | LqipBlurhashLoaderOptions;

export interface WebpackLoaderOptions {
  name: string;
  webPath?: string;
  outputPath: string;
  lqip?: LqipLoaderOptions;
}
export interface ImageLoaderOptions {
  w: number[];
  quality: number;
  format: OutputImageType[];
  [key: string]: unknown;
}

export type LoaderOptions = WebpackLoaderOptions & ImageLoaderOptions;

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
