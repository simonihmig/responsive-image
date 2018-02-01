import { isPresent } from '@ember/utils';
import Component from '@ember/component';
import { computed } from '@ember/object';
import ResponsiveImageMixin from 'ember-responsive-image/mixins/responsive-image';

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
export default Component.extend(ResponsiveImageMixin, {

  /**
   * @property tagName
   * @type string
   * @readOnly
   * @protected
   */
  tagName: 'img',

  /**
   * @property classNameBindings
   * @type string[]
   * @readOnly
   * @protected
   */
  classNameBindings: ['className'],

  /**
   * @property attributeBindings
   * @type string[]
   * @readOnly
   * @protected
   */
  attributeBindings: ['srcset', 'alt', 'sizes', 'width', 'height'],

  /**
   * set the `width` attribute
   *
   * @property width
   * @type Number
   * @default null
   * @public
   */
  width: null,

  /**
   * set the `height` attribute
   *
   * @property height
   * @type Number
   * @default null
   * @public
   */
  height: null,

  /**
   * optional, the html alt attribute of the img tag
   *
   * @property alt
   * @type string
   * @public
   */
  alt: null,

  /**
   * optional, the html class attribute of the img tag for custom class names
   *
   * @property className
   * @type string
   * @public
   */
  className: null,

  /**
   * optional, the sizes, e.g. :(min-width: 700px) 700px, 100vw
   * @TODO provide a solution for media query parts
   *
   * @property sizes
   * @type string
   * @public
   */
  sizes: computed('size', function() {
    if (isPresent(this.get('size'))) {
      return this.get('size') + 'vw';
    }
    return null;
  }),

  /**
   * the generated source set
   *
   * @property srcset
   * @type number
   * @readonly
   * @private
   */
  srcset: computed('sources', function() {
    return this.get('sources').join(', ');
  }).readOnly(),

  /**
   * an array of strings with the images and the width
   *
   * @property sources
   * @type string[]
   * @readonly
   * @private
   */
  sources: computed('image', function() {
    return this.get('responsiveImage').getImages(this.get('image')).map((item) => {
      return `${item.image} ${item.width}w`;
    }, this);
  }).readOnly()
});
