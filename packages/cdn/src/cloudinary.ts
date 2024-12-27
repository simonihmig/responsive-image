import { assert, getConfig } from '@responsive-image/core';
import type { ImageType, ImageData } from '@responsive-image/core';
import { Config, CoreOptions } from './types';

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

  const isFullUrl = image.match(URL_REGEX);

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

      const params = transformations
        .map((transformation) =>
          Object.entries(transformation)
            .map(([key, value]) => `${key}_${value}`)
            .join(','),
        )
        .join('/');

      return `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/${params}/${imageId}${
        deliveryType === 'upload' ? '.' + type : ''
      }`;
    },
  };

  if (options.aspectRatio) {
    imageData.aspectRatio = options.aspectRatio;
  }

  return imageData;
}
