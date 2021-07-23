import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';
import ResponsiveImageService from 'ember-responsive-image/services/responsive-image';
import { ImageType, ProviderResult } from 'ember-responsive-image/types';
import { assert } from '@ember/debug';
import { normalizeSrc } from 'ember-responsive-image/utils/utils';

interface CloudinaryConfig {
  cloudName: string;
}

interface CloudinaryOptions {
  transformations?: string;
  formats?: ImageType[];
}

const URL_REGEX = /https?:/;

export const provider = (
  image: string,
  service: ResponsiveImageService,
  options: CloudinaryOptions
): ProviderResult => {
  const cloudName =
    service.getProviderConfig<CloudinaryConfig>('cloudinary').cloudName;
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
      const params = [
        `w_${width}`,
        'c_limit',
        'q_auto',
        deliveryType !== 'upload' ? `f_${type}` : undefined,
        options.transformations,
      ];
      return `https://res.cloudinary.com/${cloudName}/image/${deliveryType}/${params
        .filter(Boolean)
        .join(',')}/${imageId}${deliveryType === 'upload' ? '.' + type : ''}`;
    },
  };
};

export default class ResponsiveImageCloudinaryProvider extends Helper {
  @service
  responsiveImage!: ResponsiveImageService;

  compute([image]: [string], options: CloudinaryOptions): ProviderResult {
    return provider(image, this.responsiveImage, options);
  }
}
