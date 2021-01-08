import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';

/**
 * The Base Mixin for the responsive mixins
 *
 * @class ResponsiveBase
 * @namespace Mixins
 * @private
 */
export default Mixin.create({
  /**
   * @property responsiveImage
   * @protected
   */
  responsiveImage: service(),

  /**
   * the origin image name to display
   *
   * @property image
   * @type string
   * @public
   */
  image: null,

  /**
   * optional, the size in vw (only vw supported now)
   * @TODO provide a solution for a use case where the image has a size in px unit.
   *
   * @property size
   * @type number
   * @public
   */
  size: null,

  /**
   * the image source which fits at best for the size and screen
   *
   * @property suitableSrc
   * @readonly
   * @type string
   * @private
   */
  suitableSrc: computed('image', 'size', function () {
    return this.image
      ? this.responsiveImage.getImageBySize(this.image, this.size)
      : undefined;
  }).readOnly(),
});
