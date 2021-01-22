import { isPresent } from '@ember/utils';
import Component from '@ember/component';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
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
export default Component.extend({
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

  /**
   * takes the image which fits at best and bind to the src attribute
   *
   * @property src
   * @type string
   * @private
   */
  src: readOnly('suitableSrc'),

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
  attributeBindings: ['src', 'srcset', 'alt', 'sizes', 'width', 'height'],

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
  sizes: computed('size', function () {
    if (isPresent(this.size)) {
      return this.size + 'vw';
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
  srcset: computed('sources', function () {
    return this.sources.join(', ');
  }).readOnly(),

  /**
   * an array of strings with the images and the width
   *
   * @property sources
   * @type string[]
   * @readonly
   * @private
   */
  sources: computed('image', 'responsiveImage', function () {
    return this.responsiveImage.getImages(this.image).map((item) => {
      return `${item.image} ${item.width}w`;
    }, this);
  }).readOnly(),
});
