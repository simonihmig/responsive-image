import { getConfig } from '@responsive-image/core';
import type { ImageType, ImageData } from '@responsive-image/core';
import { Config, CoreOptions } from './types';

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
    imageUrlFor(width: number, type: ImageType = 'jpeg'): string {
      const params = new URLSearchParams({
        url,
        w: String(width),
        fm: formatMap[type] ?? type,
      });

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
