import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import ResponsiveImageService from 'ember-responsive-image/services/responsive-image';

interface ResponsiveImageComponentArgs {
  image: string;
  size?: number;
  sizes?: string;
}

interface PictureSource {
  srcset: string;
  type: string;
  sizes?: string;
}

export default class ResponsiveImageComponent extends Component<ResponsiveImageComponentArgs> {
  @service
  responsiveImage!: ResponsiveImageService;

  get sources(): PictureSource[] {
    return this.responsiveImage
      .getAvailableTypes(this.args.image)
      .map((type) => {
        const sources = this.responsiveImage
          .getImages(this.args.image, type)
          .map((imageMeta) => `${imageMeta.image} ${imageMeta.width}w`);

        return {
          srcset: sources.join(', '),
          sizes:
            this.args.sizes ??
            (this.args.size ? `${this.args.size}vw` : undefined),
          type: `image/${type}`,
        };
      });
  }

  /**
   * the image source which fits at best for the size and screen
   */
  get src(): string | undefined {
    return this.args.image
      ? this.responsiveImage.getImageBySize(this.args.image, this.args.size)
      : undefined;
  }
}
