import Ember from 'ember';
import BaseMixin from 'ember-responsive-image/mixins/responsive-base';

const {computed} = Ember;

/**
 * The ResponsiveImage Mixin for components, sets the src attribute
 *
 * @class ResponsiveImage
 * @namespace Mixins
 * @public
 */
export default Ember.Mixin.create(BaseMixin, {

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
  src: computed.readOnly('suitableSrc')
});
