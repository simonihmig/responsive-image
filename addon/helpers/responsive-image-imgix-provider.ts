import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';
import ResponsiveImageService from 'ember-responsive-image/services/responsive-image';
import { ImageType, ProviderResult } from 'ember-responsive-image/types';
import { assert } from '@ember/debug';
import { normalizeSrc } from 'ember-responsive-image/utils/utils';

interface ResponsiveImageImgixProviderSignature {
  Args: {
    Positional: [string];
    Named: ImgixOptions;
  };
  Return: ProviderResult;
}

interface ImgixConfig {
  domain: string;
}

interface ImgixOptions {
  params?: Record<string, string | number>;
  formats?: ImageType[];
  quality?: number;
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
      // In the FastBoot sandbox, the URL global is shadowed by the `url` module. :-(
      // See https://github.com/ember-fastboot/ember-cli-fastboot/issues/816
      const URLConstructor: typeof URL =
        typeof URL === 'function' ? URL : (URL as { URL: typeof URL }).URL;

      const url = new URLConstructor(
        `https://${domain}/${normalizeSrc(image)}`
      );
      const params = url.searchParams;

      params.set('fm', formatMap[type] ?? type);
      params.set('w', String(width));
      params.set('fit', 'max');

      if (options.quality) {
        params.set('q', String(options.quality));
      }

      if (options.params) {
        for (const [key, value] of Object.entries(options.params)) {
          params.set(key, String(value));
        }
      }

      return url.toString();
    },
  };
};

export default class ResponsiveImageImgixProvider extends Helper<ResponsiveImageImgixProviderSignature> {
  @service
  responsiveImage!: ResponsiveImageService;

  compute([image]: [string], options: ImgixOptions): ProviderResult {
    return provider(image, this.responsiveImage, options);
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    'responsive-image-imgix-provider': typeof ResponsiveImageImgixProvider;
  }
}
