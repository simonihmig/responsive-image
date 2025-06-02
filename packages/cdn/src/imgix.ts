import { assert, getConfig } from '@responsive-image/core';

import type { Config, CoreOptions } from './types';
import type { ImageData, ImageUrlForType } from '@responsive-image/core';

export interface ImgixConfig {
  domain: string;
}

export interface ImgixOptions extends CoreOptions {
  params?: Record<string, string | number>;
}

const formatMap: Record<string, string> = {
  jpeg: 'jpg',
};

function normalizeSrc(src: string): string {
  return src[0] === '/' ? src.slice(1) : src;
}

export function imgix(image: string, options: ImgixOptions = {}): ImageData {
  const domain = getConfig<Config>('cdn')?.imgix?.domain;
  assert('domain must be set for imgix provider!', typeof domain === 'string');

  const imageData: ImageData = {
    imageTypes: options.formats ?? 'auto',
    imageUrlFor(width: number, type: ImageUrlForType = 'jpeg'): string {
      const url = new URL(`https://${domain}/${normalizeSrc(image)}`);
      const params = url.searchParams;

      if (type === 'auto') {
        params.set('auto', 'format');
      } else {
        params.set('fm', formatMap[type] ?? type);
      }
      params.set('w', String(width));
      params.set('fit', 'max');

      if (options.quality) {
        params.set('q', String(options.quality));
      }

      if (options.params) {
        for (const [key, value] of Object.entries(options.params)) {
          params.set(key, String(value));
        }
      }

      return url.toString();
    },
  };

  if (options.aspectRatio) {
    imageData.aspectRatio = options.aspectRatio;
  }

  return imageData;
}
