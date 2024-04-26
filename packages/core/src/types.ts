export type ImageType = 'png' | 'jpeg' | 'webp' | 'avif';

export interface LqipBase {
  type: string;
}

export interface LqipInline extends LqipBase {
  type: 'inline';
  class: string;
}

export interface LqipColor extends LqipBase {
  type: 'color';
  class: string;
}

export interface LqipBlurhash extends LqipBase {
  type: 'blurhash';
  hash: string;
  width: number;
  height: number;
}

export interface ImageData {
  imageTypes: ImageType[];
  availableWidths?: number[];
  aspectRatio?: number;
  imageUrlFor(width: number, type?: ImageType): string;
  fingerprint?: string;
  lqip?: LqipInline | LqipColor | LqipBlurhash;
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
