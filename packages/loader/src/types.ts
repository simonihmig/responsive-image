import type {
  ImageType,
  LqipBlurhash,
  LqipColor,
  LqipInline,
} from '@ember-responsive-image/core/types';
import { Metadata, Sharp } from 'sharp';

export type OutputImageType = 'original' | ImageType;

export interface LqipBaseLoaderOptions {
  type: string;
}

export interface LqipColorLoaderOptions extends LqipBaseLoaderOptions {
  type: 'color';
}

export interface LqipInlineLoaderOptions extends LqipBaseLoaderOptions {
  type: 'inline';
  width: number;
  height: number;
}

export interface LqipBlurhashLoaderOptions extends LqipBaseLoaderOptions {
  type: 'blurhash';
  width: number;
  height: number;
}

export type LqipLoaderOptions =
  | LqipColorLoaderOptions
  | LqipInlineLoaderOptions
  | LqipBlurhashLoaderOptions;

export interface LoaderOptions {
  widths: number[];
  formats: OutputImageType[];
  quality: number;
  name: string;
  webPath?: string;
  outputPath: string;
  lqip?: LqipLoaderOptions;
}

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
