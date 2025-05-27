import { getConfig } from '@responsive-image/core';

import type { Config, CoreOptions } from './types';
import type { ImageData, ImageUrlForType } from '@responsive-image/core';

export interface NetlifyConfig {
  /**
   * Domain of the Netlify site. If not set, use relative URLs
   */
  domain?: string;
}

export type NetlifyOptions = CoreOptions;

const formatMap: Record<string, string> = {
  jpeg: 'jpg',
};

export function netlify(
  image: string,
  options: NetlifyOptions = {},
): ImageData {
  const domain = getConfig<Config>('cdn')?.netlify?.domain;
  const origin = domain ? `https://${domain}` : '';
  const url = image;

  const imageData: ImageData = {
    imageTypes: options.formats ?? ['webp', 'avif'],
    imageUrlFor(width: number, type: ImageUrlForType = 'jpeg'): string {
      const params = new URLSearchParams({
        url,
        w: String(width),
      });

      // In Netlify omiting the format parameter
      // lets the CDN pick a format based on the Accept header
      // https://docs.netlify.com/image-cdn/overview/#format
      if (type !== 'auto') {
        params.set('fm', formatMap[type] ?? type);
      }

      if (options.quality) {
        params.set('q', String(options.quality));
      }

      return `${origin}/.netlify/images?${params}`;
    },
  };

  if (options.aspectRatio) {
    imageData.aspectRatio = options.aspectRatio;
  }

  return imageData;
}
