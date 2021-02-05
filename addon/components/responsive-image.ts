import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import ResponsiveImageService from 'ember-responsive-image/services/responsive-image';

interface ResponsiveImageComponentArgs {
  image: string;
  size?: number;
  sizes?: string;
}

export default class ResponsiveImageComponent extends Component<ResponsiveImageComponentArgs> {
  @service
  responsiveImage!: ResponsiveImageService;

  /**
   * the image source which fits at best for the size and screen
   */
  get src(): string | undefined {
    return this.args.image
      ? this.responsiveImage.getImageBySize(this.args.image, this.args.size)
      : undefined;
  }

  /**
   * the generated source set
   */
  get srcset(): string {
    const sources = this.responsiveImage
      .getImages(this.args.image)
      .map((item) => {
        return `${item.image} ${item.width}w`;
      }, this);
    return sources.join(', ');
  }
}
