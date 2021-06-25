import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import Helper from '@ember/component/helper';
import ResponsiveImageService from 'ember-responsive-image/services/responsive-image';
import { ImageType } from 'ember-responsive-image/types';

/**
 * @class responsiveImageResolve
 * @namespace Helpers
 * @extends Ember.Helper
 * @public
 */
export default class ResponsiveImageResolve extends Helper {
  @service
  responsiveImage!: ResponsiveImageService;

  compute(
    [image]: [string],
    { size, format }: { size?: number; format?: ImageType }
  ): ReturnType<typeof htmlSafe> | undefined {
    const responsive = this.responsiveImage.getImageMetaBySize(
      image,
      size,
      format
    )?.image;

    return responsive ? htmlSafe(responsive) : undefined;
  }
}
