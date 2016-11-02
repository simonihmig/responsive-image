import Ember from 'ember';

import getOwner from 'ember-getowner-polyfill';

const { computed } = Ember;

/**
 * Use this component to show the generated images from the source folder, just set the image property with the image
 * name and optional a css-className
 * (e.g. {{responsive-image image="awesome.jpg" className="responsive-image-css" }}) and enjoy the generated img-Tag
 * with srcset-attribute
 *
 *
 * @class ResponsiveImage
 * @extends Ember.Component
 * @namespace Components
 * @public
 */
export default Ember.Component.extend({

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
  attributeBindings: ['src', 'srcset', 'alt', 'sizes'],

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
   * optional, the sizes, e.g. :(min-width: 700px) 700px, 100vw
   * @TODO provide a solution for media query parts
   *
   * @property sizes
   * @type string
   * @public
   */
  sizes: computed('size', function() {
    if (Ember.isPresent(this.get('size'))) {
      return this.get('size') + 'vw';
    }
    return null;
  }),

  /**
   * the path to the assets, if the baseURL points to something
   *
   * @property assetsPath
   * @type string
   * @private
   */
  assetsPath: computed(function() {
    let config = getOwner(this)._lookupFactory('config:environment'),
      baseUrl = Ember.get(config, 'baseURL') || '';
    return baseUrl;
  }),

  /**
   * the fallback src, takes the image which fits at best
   *
   * @property src
   * @type string
   * @private
   */
  src: computed('imageName', 'imageEnding', 'destinationPath', 'sourceWidth', function() {
    return `${this.get('destinationPath')}${this.get('imageName')}${this.get('sourceWidth')}w.${this.get('imageEnding')}`;
  }),

  /**
   * the supported widths from the configuration
   *
   * @property supportedWidths
   * @type string
   * @private
   */
  supportedWidths: computed(function() {
    let config = getOwner(this)._lookupFactory('config:environment'),
      widths = Ember.get(config, 'responsive-image.supportedWidths');
    return widths;
  }),

  /**
   * the generated source set
   *
   * @property srcset
   * @type number
   * @readOnly
   * @private
   */
  srcset: computed('sources', function() {
    return this.get('sources').join(', ');
  }),

  /**
   * returns the width next to needed by display-size
   *
   * @property sourceWidth
   * @type number
   * @readOnly
   * @private
   */
  sourceWidth: computed('supportedWidths', 'destinationWidth', function() {
    return this.get('supportedWidths').reduce((prevValue, item)=> {
      if (item >= this.get('destinationWidth') && prevValue >= this.get('destinationWidth')) {
        return (item >= prevValue) ? prevValue : item;
      } else {
        return (item >= prevValue) ? item : prevValue;
      }
    }, 0);
  }),

  /**
   * returns the width of the screen in px
   *
   * @property physicalWidth
   * @type number
   * @readOnly
   * @private
   */
  physicalWidth: screen.width * (window.devicePixelRatio || 1),

  /**
   * returns the calculated destination width if a size is given, or the physical width if not
   *
   * @property destinationWidth
   * @type number
   * @readOnly
   * @private
   */
  destinationWidth: computed('size', 'physicalWidth', function() {
    let factor = 1;
    if (Ember.isPresent(this.get('size'))) {
      factor = this.get('size') / 100;
    }
    return this.get('physicalWidth') * factor;
  }),

  /**
   * an array of strings with the images and the width
   *
   * @property sources
   * @type string[]
   * @readOnly
   * @private
   */
  sources: computed('imageName', 'imageEnding', 'destinationPath', 'supportedWidths', function() {
    return this.get('supportedWidths').map((item) => {
      return `${this.get('destinationPath')}${this.get('imageName')}${item}w.${this.get('imageEnding')} ${item}w`;
    }, this);
  }),

  /**
   * the path where the generated images will be
   *
   * @property destinationPath
   * @type string
   * @readOnly
   * @private
   */
  destinationPath: computed(function() {
    let config = getOwner(this)._lookupFactory('config:environment'),
      destinationDir = Ember.get(config, 'responsive-image.destinationDir'),
      assetsPath = this.get('assetsPath');

    // if assetPath is empty the first file path would lead to an absolute path, that might break things (e.g. cordova),
    // so check for empty assetPath!
    return Ember.isPresent(assetsPath) ? `${assetsPath}${destinationDir}/` : `${destinationDir}/`;
  }),

  /**
   * the name of the image without the file extension
   *
   * @property imageEnding
   * @type string
   * @readOnly
   * @private
   */
  imageName: computed('image', function() {
    return this.get('image').substr(0, this.get('image').lastIndexOf('.'));
  }),

  /**
   * the file extension of the image
   *
   * @property imageEnding
   * @type string
   * @readOnly
   * @private
   */
  imageEnding: computed('image', function() {
    return this.get('image').substr(this.get('image').lastIndexOf('.') + 1);
  })
});
