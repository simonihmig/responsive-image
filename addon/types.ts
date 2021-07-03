import ResponsiveImageService from 'ember-responsive-image/services/responsive-image';

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

export interface Image {
  image: string;
  width: number;
  height: number;
  type: ImageType;
}

export interface ImageMeta {
  widths: number[];
  formats: ImageType[];
  aspectRatio: number;
  fingerprint?: string;
  lqip?: LqipInline | LqipColor | LqipBlurhash;
}

export interface Meta {
  deviceWidths: number[];
  providers?: Record<string, Record<string, unknown>>;
  images: Record<string, ImageMeta>;
}

export interface Provider<OPTIONS = unknown> {
  (
    image: string,
    service: ResponsiveImageService,
    options?: OPTIONS
  ): ProviderResult;
}

export interface ProviderResult {
  imageTypes: ImageType[];
  availableWidths?: number[];
  aspectRatio?: number;
  imageUrlFor(width: number, type?: ImageType): string;
  fingerprint?: string;
  lqip?: LqipInline | LqipColor | LqipBlurhash;
}
