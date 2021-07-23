import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';
import ResponsiveImageService from 'ember-responsive-image/services/responsive-image';
import { ImageType, ProviderResult } from 'ember-responsive-image/types';
import { assert } from '@ember/debug';
import { normalizeSrc } from 'ember-responsive-image/utils/utils';

interface ImgixConfig {
  domain: string;
}

interface ImgixOptions {
  formats?: ImageType[];
}

const formatMap: Record<string, string> = {
  jpeg: 'jpg',
};

export const provider = (
  image: string,
  service: ResponsiveImageService,
  options: ImgixOptions
): ProviderResult => {
  const domain = service.getProviderConfig<ImgixConfig>('imgix').domain;
  assert('domain must be set for imgix provider!', typeof domain === 'string');

  return {
    imageTypes: options.formats ?? ['png', 'jpeg', 'webp'],
    imageUrlFor(width: number, type: ImageType = 'jpeg'): string {
      const url = new URL(`https://${domain}/${normalizeSrc(image)}`);
      const params = url.searchParams;

      params.set('fm', formatMap[type] ?? type);
      params.set('w', String(width));
      params.set('fit', 'max');

      return url.toString();
    },
  };
};

export default class ResponsiveImageCloudinaryProvider extends Helper {
  @service
  responsiveImage!: ResponsiveImageService;

  compute([image]: [string], options: ImgixOptions): ProviderResult {
    return provider(image, this.responsiveImage, options);
  }
}
