import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';
import {
  ImageType,
  Provider,
  ProviderResult,
} from 'ember-responsive-image/types';
import ResponsiveImageService from 'ember-responsive-image/services/responsive-image';

export const provider: Provider = (image, service) => {
  return {
    imageTypes: service.getAvailableTypes(image),
    availableWidths: service.getAvailableWidths(image),
    aspectRatio: service.getAspectRatio(image),
    imageUrlFor(width: number, type?: ImageType): string {
      return service.getImageMetaByWidth(image, width, type).image;
    },
    fingerprint: service.getMeta(image).fingerprint,
    lqip: service.getMeta(image).lqip,
  };
};

export default class ResponsiveImageLocalProvider extends Helper {
  @service
  responsiveImage!: ResponsiveImageService;

  compute([image]: [string]): ProviderResult {
    return provider(image, this.responsiveImage);
  }
}
