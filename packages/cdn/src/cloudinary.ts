import { assert } from '@ember-responsive-image/core';
import { getOwnConfig } from '@embroider/macros';
import type { ImageType, ImageData } from '@ember-responsive-image/core';

export interface CloudinaryConfig {
  cloudName: string;
}

interface CloudinaryOptions {
  transformations?: string;
  formats?: ImageType[];
  quality?: number;
}

const URL_REGEX = /https?:/;

const formatMap: Record<string, string> = {
  jpeg: 'jpg',
};

function normalizeSrc(src: string): string {
  return src[0] === '/' ? src.slice(1) : src;
}

export default function CloudinaryProvider(
  image: string,
  options: CloudinaryOptions = {},
): ImageData {
  const cloudName = getOwnConfig<CloudinaryConfig | undefined>()?.cloudName;
  assert(
    'cloudName must be set for cloudinary provider!',
    typeof cloudName === 'string',
  );
  let imageId: string;
  let deliveryType: 'upload' | 'fetch';

  const isFullUrl = image.match(URL_REGEX);

  if (isFullUrl) {
    imageId = encodeURIComponent(image);
    deliveryType = 'fetch';
  } else {
    imageId = normalizeSrc(image).replace(/\.[^/.]+$/, '');
    deliveryType = 'upload';
  }

  return {
    imageTypes: options.formats ?? ['png', 'jpeg', 'webp', 'avif'],
    imageUrlFor(width: number, type: ImageType = 'jpeg'): string {
      let resizeParams = `w_${width},c_limit,q_${options.quality ?? 'auto'}`;
      if (deliveryType !== 'upload') {
        resizeParams += `,f_${formatMap[type] ?? type}`;
      }

      const params = options.transformations
        ? `${options.transformations}/${resizeParams}`
        : resizeParams;

      return `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/${params}/${imageId}${
        deliveryType === 'upload' ? '.' + type : ''
      }`;
    },
  };
}
