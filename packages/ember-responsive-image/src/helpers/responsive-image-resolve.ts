import { inject as service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import Helper from '@ember/component/helper';
import { ImageType, ImageData } from '../types';
import ResponsiveImageService from '../services/responsive-image';

interface ResponsiveImageResolveSignature {
  Args: {
    Positional: [ImageData];
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
  responsiveImage!: ResponsiveImageService;

  compute(
    [data]: [ImageData],
    { size, format = data.imageTypes[0] }: { size?: number; format?: ImageType }
  ): ReturnType<typeof htmlSafe> | undefined {
    const width = this.responsiveImage.getDestinationWidthBySize(size ?? 0);

    return htmlSafe(data.imageUrlFor(width, format));
  }
}
