import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

/**
 * Use this component to show the generated images from the source folder, just set the image property with the image
 * name and optional a css-className
 * (e.g. `{{responsive-image image="awesome.jpg" className="responsive-image-css"}}`) and enjoy the generated img-Tag
 * with srcset-attribute
 *
 *
 * @class ResponsiveImage
 * @extends Ember.Component
 * @namespace Components
 * @public
 */
export default class ResponsiveImageComponent extends Component {
  @service
  responsiveImage;

  /**
   * the image source which fits at best for the size and screen
   *
   * @property suitableSrc
   * @readonly
   * @type string
   * @private
   */
  get src() {
    return this.args.image
      ? this.responsiveImage.getImageBySize(this.args.image, this.args.size)
      : undefined;
  }

  /**
   * the generated source set
   *
   * @property srcset
   * @type number
   * @readonly
   * @private
   */
  get srcset() {
    const sources = this.responsiveImage
      .getImages(this.args.image)
      .map((item) => {
        return `${item.image} ${item.width}w`;
      }, this);
    return sources.join(', ');
  }
}
