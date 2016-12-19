import Ember from 'ember';
import ResponsiveBackgroundMixin from 'ember-responsive-image/mixins/responsive-background';

/**
 * Use this component to show a generated images from the source folder as a background image for this, just set the image property with the image
 * name and optional a size
 * (e.g. {{responsive-background image="awesome.jpg" }})
 *
 *
 * @class ResponsiveBackground
 * @extends Ember.Component
 * @namespace Components
 * @public
 */
export default Ember.Component.extend(ResponsiveBackgroundMixin, {
});
