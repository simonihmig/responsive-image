import { inject as service } from '@ember/service';
import Helper from '@ember/component/helper';
import { ImageType, ProviderResult } from 'ember-responsive-image/types';
import ResponsiveImageLocalService from 'ember-responsive-image/services/responsive-image-local';

export const provider = (
  image: string,
  service: ResponsiveImageLocalService
): ProviderResult => {
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
  responsiveImageLocal!: ResponsiveImageLocalService;

  compute([image]: [string]): ProviderResult {
    return provider(image, this.responsiveImageLocal);
  }
}
