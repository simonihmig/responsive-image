import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import Helper from '@ember/component/helper';
import { ImageType } from '../types';
import ResponsiveImageLocalService from '../services/responsive-image-local';

interface ResponsiveImageResolveSignature {
  Args: {
    Positional: [string];
    Named: {
      size?: number;
      format?: ImageType;
    };
  };
  Return: ReturnType<typeof htmlSafe> | undefined;
}

/**
 * @class responsiveImageResolve
 * @namespace Helpers
 * @extends Ember.Helper
 * @public
 */
export default class ResponsiveImageResolve extends Helper<ResponsiveImageResolveSignature> {
  @service
  responsiveImageLocal!: ResponsiveImageLocalService;

  compute(
    [image]: [string],
    { size, format }: { size?: number; format?: ImageType }
  ): ReturnType<typeof htmlSafe> | undefined {
    const responsive = this.responsiveImageLocal.getImageMetaBySize(
      image,
      size,
      format
    )?.image;

    return responsive ? htmlSafe(responsive) : undefined;
  }
}
