import { assert, getConfig } from '@responsive-image/core';

import type { Config, CoreOptions } from './types';
import type { ImageData, ImageUrlForType } from '@responsive-image/core';

export interface BunnyConfig {
  /**
   * The hostname of your Pull Zone with Bunny Optimizer enabled,
   * e.g. `my-zone.b-cdn.net` or a custom hostname.
   */
  domain: string;
}

export interface BunnyOptions extends CoreOptions {
  /**
   * Additional Bunny Optimizer query parameters, e.g. `crop`, `sharpen`, `blur`.
   * @see https://bunny.net/docs/optimizer/dynamic-images
   */
  params?: Record<string, string | number>;
}

const URL_REGEX = /^https?:\/\//;

function normalizeSrc(src: string): string {
  return src[0] === '/' ? src.slice(1) : src;
}

export function bunny(image: string, options: BunnyOptions = {}): ImageData {
  let baseUrl: string;

  if (URL_REGEX.test(image)) {
    baseUrl = image;
  } else {
    const domain = getConfig<Config>('cdn')?.bunny?.domain;
    assert(
      'domain must be set for the bunny provider!',
      typeof domain === 'string',
    );
    baseUrl = `https://${domain}/${normalizeSrc(image)}`;
  }

  const imageData: ImageData = {
    imageTypes: options.formats ?? 'auto',
    imageUrlFor(width: number, type: ImageUrlForType = 'jpeg'): string {
      const url = new URL(baseUrl);
      const params = url.searchParams;

      params.set('width', String(width));

      // Bunny Optimizer has no `format=auto`. Omitting `format` lets it
      // negotiate WebP based on browser support (when enabled in the Pull Zone).
      if (type !== 'auto') {
        params.set('format', type);
      }

      if (options.quality) {
        params.set('quality', String(options.quality));
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
