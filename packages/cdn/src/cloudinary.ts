import { assert, getConfig } from '@responsive-image/core';

import type { Config, CoreOptions } from './types';
import type { ImageType, ImageData } from '@responsive-image/core';

export interface CloudinaryConfig {
  cloudName: string;
}

type CloudinaryTransformation = Record<string, string | number>;

export interface CloudinaryOptions extends CoreOptions {
  transformations?: CloudinaryTransformation | CloudinaryTransformation[];
}

const URL_REGEX = /https?:/;

const formatMap: Record<string, string> = {
  jpeg: 'jpg',
};

function normalizeSrc(src: string): string {
  return src[0] === '/' ? src.slice(1) : src;
}

export function cloudinary(
  image: string,
  options: CloudinaryOptions = {},
): ImageData {
  const cloudName = getConfig<Config>('cdn')?.cloudinary?.cloudName;
  assert(
    'cloudName must be set for cloudinary provider!',
    typeof cloudName === 'string',
  );
  let imageId: string;
  let deliveryType: 'upload' | 'fetch';

  const isFullUrl = URL_REGEX.test(image);

  if (isFullUrl) {
    imageId = encodeURIComponent(image);
    deliveryType = 'fetch';
  } else {
    imageId = normalizeSrc(image).replace(/\.[^/.]+$/, '');
    deliveryType = 'upload';
  }

  const imageData: ImageData = {
    imageTypes: options.formats ?? ['webp', 'avif'],
    imageUrlFor(width: number, type: ImageType = 'jpeg'): string {
      const resizeParams: CloudinaryTransformation = {
        w: width,
        c: 'limit',
        q: options.quality ?? 'auto',
      };
      if (deliveryType !== 'upload') {
        resizeParams['f'] = formatMap[type] ?? type;
      }

      const transformations = options.transformations
        ? Array.isArray(options.transformations)
          ? options.transformations
          : [options.transformations]
        : [];

      transformations.push(resizeParams);

      const pathParameters = transformations.map((transformation) =>
        Object.entries(transformation)
          .map(([key, value]) => `${key}_${value}`)
          .join(','),
      );

      if (options.auto === 'format') {
        pathParameters.push('f_auto');
      }

      const params = pathParameters.join('/');

      return `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/${params}/${imageId}${
        deliveryType === 'upload' ? '.' + type : ''
      }`;
    },
  };

  if (options.auto) {
    imageData.auto = options.auto;
  }
  if (options.aspectRatio) {
    imageData.aspectRatio = options.aspectRatio;
  }

  return imageData;
}
