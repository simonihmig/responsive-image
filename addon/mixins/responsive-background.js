import Mixin from '@ember/object/mixin';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import BaseMixin from 'ember-responsive-image/mixins/responsive-base';

/**
 * you can use this mixin to set a background image fits the size of the screen
 *
 * @class ResponsiveBackground
 * @namespace Mixins
 * @public
 */
export default Mixin.create(BaseMixin, {
  /**
   * @property attributeBindings
   * @type string[]
   * @readOnly
   * @protected
   */
  attributeBindings: ['style'],

  /**
   * insert the stylesheets with the background image to the consumer
   *
   * @property style
   * @type string
   * @protected
   */
  style: computed.reads('backgroundImage'),

  /**
   * the background image
   *
   * @property backgroundImage
   * @type string
   * @readOnly
   * @private
   */
  backgroundImage: computed('suitableSrc', function () {
    return this.suitableSrc
      ? htmlSafe(`background-image: url('${this.suitableSrc}');`)
      : undefined;
  }).readOnly(),
});
