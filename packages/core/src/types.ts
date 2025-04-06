export type ImageType = 'png' | 'jpeg' | 'webp' | 'avif';

export type ValueOrCallback<T> = T | (() => T);

export interface Lqip {
  class?: ValueOrCallback<string>;
  bgImage?: ValueOrCallback<string>;
}

export interface ImageData {
  imageTypes: ImageType[];
  availableWidths?: number[];
  aspectRatio?: number;
  imageUrlFor(width: number, type?: ImageType): string | undefined;
  fingerprint?: string;
  lqip?: Lqip;
}

export interface ImageOutputResult {
  url: string;
  width: number;
  format: ImageType;
}

export interface Env {
  screenWidth: number;
  physicalWidth: number;
  devicePixelRatio: number;
  deviceWidths: number[];
}

export interface EnvConfig {
  deviceWidths?: number[];
}
