import { readOnly } from '@ember/object/computed';
import Mixin from '@ember/object/mixin';
import BaseMixin from 'ember-responsive-image/mixins/responsive-base';

/**
 * The ResponsiveImage Mixin for components, sets the src attribute
 *
 * @class ResponsiveImage
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
  attributeBindings: ['src'],

  /**
   * takes the image which fits at best and bind to the src attribute
   *
   * @property src
   * @type string
   * @private
   */
  src: readOnly('suitableSrc')
});
