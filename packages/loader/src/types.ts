import type {
  ImageType,
  LqipBlurhash,
  LqipColor,
  LqipInline,
} from '@ember-responsive-image/core/types';
import { Sharp } from 'sharp';

export type OutputImageType = 'original' | ImageType;

interface LqipBaseLoaderOptions {
  type: string;
}

interface LqipColorLoaderOptions extends LqipBaseLoaderOptions {
  type: 'color';
}

interface LqipInlineLoaderOptions extends LqipBaseLoaderOptions {
  type: 'inline';
  width: number;
  height: number;
}

interface LqipBlurhashLoaderOptions extends LqipBaseLoaderOptions {
  type: 'blurhash';
  width: number;
  height: number;
}

type LqipLoaderOptions =
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
}
