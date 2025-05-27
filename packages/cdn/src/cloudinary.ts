import { assert, getConfig } from '@responsive-image/core';

import type { Config, CoreOptions } from './types';
import type { ImageData, ImageUrlForType } from '@responsive-image/core';

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
    imageUrlFor(width: number, type: ImageUrlForType = 'jpeg'): string {
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

      if (type === 'auto') {
        pathParameters.push('f_auto');
      }

      const params = pathParameters.join('/');

      // Omit the extension when using auto for the upload delivery method
      // https://cloudinary.com/documentation/transformation_reference#_lt_extension_gt
      const extension =
        deliveryType === 'upload' && type !== 'auto' ? '.' + type : '';

      return `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/${params}/${imageId}${
        extension
      }`;
    },
  };

  if (options.aspectRatio) {
    imageData.aspectRatio = options.aspectRatio;
  }

  return imageData;
}
