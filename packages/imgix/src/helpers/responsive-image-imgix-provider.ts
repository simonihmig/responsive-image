import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';
import { assert } from '@ember/debug';
import { getOwnConfig } from '@embroider/macros';
import { ImgixConfig } from '../types';

import type {
  ResponsiveImageService,
  ImageType,
  ProviderResult,
} from 'ember-responsive-image';

interface ImgixProviderSignature {
  Args: {
    Positional: [string];
    Named: ImgixOptions;
  };
  Return: ProviderResult;
}

interface ImgixOptions {
  params?: Record<string, string | number>;
  formats?: ImageType[];
  quality?: number;
}

const formatMap: Record<string, string> = {
  jpeg: 'jpg',
};

function normalizeSrc(src: string): string {
  return src[0] === '/' ? src.slice(1) : src;
}

export const provider = (
  image: string,
  _service: ResponsiveImageService,
  options: ImgixOptions
): ProviderResult => {
  const domain = getOwnConfig<ImgixConfig | undefined>()?.domain;
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

export default class ImgixProvider extends Helper<ImgixProviderSignature> {
  @service
  responsiveImage!: ResponsiveImageService;

  compute([image]: [string], options: ImgixOptions): ProviderResult {
    return provider(image, this.responsiveImage, options);
  }
}
