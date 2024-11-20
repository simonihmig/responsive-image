import { getConfig } from '@responsive-image/core';
import type { ImageType, ImageData } from '@responsive-image/core';
import { Config } from './types';

export interface NetlifyConfig {
  /**
   * Domain of the Netlify site. If not set, use relative URLs
   */
  domain?: string;
}

export interface NetlifyOptions {
  formats?: ImageType[];
  quality?: number;
}

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

  return {
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
}
