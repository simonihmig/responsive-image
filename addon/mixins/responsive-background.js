import Ember from 'ember';
import BaseMixin from 'ember-responsive-image/mixins/responsive-base';

const {computed} = Ember;

/**
 * you can use this mixin to set a background image fits the size of the screen
 *
 * @class ResponsiveBackground
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
  attributeBindings: ['style'],

  /**
   * insert the stylesheets with the background image to the consumer
   *
   * @property style
   * @type string
   * @protected
   */
  style: computed('backgroundImage', function() {
    return this.get('backgroundImage');
  }),

  /**
   * the background image
   *
   * @property backgroundImage
   * @type string
   * @readOnly
   * @private
   */
  backgroundImage: computed('suitableSrc', function() {
    return `background-image: url('${this.get('suitableSrc')}');`;
  }).readOnly()
});
