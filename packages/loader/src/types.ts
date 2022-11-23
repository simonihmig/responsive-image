import type {
  ImageType,
  LqipBlurhash,
  LqipColor,
  LqipInline,
} from '@ember-responsive-image/core/types';
import { Sharp } from 'sharp';

export type OutputImageType = 'original' | ImageType;

export interface LoaderOptions {
  widths: number[];
  formats: OutputImageType[];
  quality: number;
  name: string;
  webPath?: string;
  outputPath?: string;
  lqip?: string;

  // lqip?: LqipInline | LqipColor | LqipBlurhash;
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
