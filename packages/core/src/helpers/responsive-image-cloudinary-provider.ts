import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';
import ResponsiveImageService from '../services/responsive-image';
import { ImageType, OwnConfig, ProviderResult } from '../types';
import { assert } from '@ember/debug';
import { normalizeSrc } from '../utils/utils';
import { getOwnConfig } from '@embroider/macros';

interface CloudinaryOptions {
  transformations?: string;
  formats?: ImageType[];
  quality?: number;
}

interface ResponsiveImageCloudinaryProviderSignature {
  Args: {
    Positional: [string];
    Named: CloudinaryOptions;
  };
  Return: ProviderResult;
}

const URL_REGEX = /https?:/;

const formatMap: Record<string, string> = {
  jpeg: 'jpg',
};

export const provider = (
  image: string,
  _service: ResponsiveImageService,
  options: CloudinaryOptions
): ProviderResult => {
  const cloudName = getOwnConfig<OwnConfig | undefined>()?.providers?.cloudinary
    ?.cloudName;
  assert(
    'cloudName must be set for cloudinary provider!',
    typeof cloudName === 'string'
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
};

export default class ResponsiveImageCloudinaryProvider extends Helper<ResponsiveImageCloudinaryProviderSignature> {
  @service
  responsiveImage!: ResponsiveImageService;

  compute([image]: [string], options: CloudinaryOptions): ProviderResult {
    return provider(image, this.responsiveImage, options);
  }
}
