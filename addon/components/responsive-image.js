import Ember from 'ember';

import getOwner from 'ember-getowner-polyfill';

const { computed } = Ember;

/**
 * Use this component to show the generated images from the source folder, just set the image property with the image name and optional a css-className
 * (e.g. {{responsive-image image="awesome.jpg" className="responsive-image-css" }}) and enjoy the generated img-Tag with srcset-attribute
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
   * @public
   */
  tagName: 'img',

  /**
   * @property classNameBindings
   * @type string
   * @readOnly
   * @public
   */
  classNameBindings: ['className'],

  /**
   * @property attributeBindings
   * @type string
   * @readOnly
   * @public
   */
  attributeBindings: ['src', 'srcset', 'alt', 'width', 'height', 'style', 'sizes'],

  /**
   * optional, the html style attribute of the img tag
   *
   * @property style
   * @type string
   * @public
   */
  style: null,

  /**
   * optional, the html width attribute of the img tag
   *
   * @property width
   * @type string
   * @public
   */
  width: null,

  /**
   * optional, the html height attribute of the img tag
   *
   * @property height
   * @type string
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


  assetsPath: computed.oneWay('_assetsFolder'),


  _assetsFolder: computed(function () {
    const config = getOwner(this)._lookupFactory('config:environment'),
      baseUrl = Ember.get(config, 'assetsURL') || '';
    return baseUrl;
  }),

  /**
   * the origin image name to display
   *
   * @property image
   * @type string
   * @public
   */
  image: null,

  /**
   * optional, the size, only vw supported now
   *
   * @property size
   * @type number
   * @public
   */
  size: null,


  /**
   * @todo provide a solution for a use case where the image has a size in px unit.
   */
  sizes: computed('size', function() {
    if (Ember.isPresent(this.get('size'))) {
      return this.get('size')+'vw';
    }
    return null;
  }),

  src: computed('_imageName', '_imageEnding', '_destinationPath', '_sourceWidth', function() {
    return `${this.get('_destinationPath')}${this.get('_imageName')}${this.get('_sourceWidth')}w.${this.get('_imageEnding')}`;
  }),

  supportedWidths: computed(function() {
    const config = getOwner(this)._lookupFactory('config:environment'),
    widths = Ember.get(config, 'kaliber5-responsive-image.supportedWidths');
    return widths;
  }),

  srcset: computed('_sources', function() {
    return this.get('_sources').join(', ');
  }),

  didInsertElement: function() {
    this._super();
  },

  /**
   * returns the width next to needed by display-size
   *
   * @property _sourceWidth
   * @type number
   * @readOnly
   * @private
   */
  _sourceWidth: computed('supportedWidths', '_destinationWidth', function () {
    return this.get('supportedWidths').reduce((prevValue, item)=> {
      if (item >= this.get('_destinationWidth') && prevValue >= this.get('_destinationWidth')) {
        return (item >= prevValue)?prevValue:item;
      } else {
        return (item >= prevValue) ? item : prevValue;
      }
    }, 0);
  }),

  /**
   * returns the width of the screen in px
   *
   * @property _physicalWidth
   * @type number
   * @readOnly
   * @private
   */
  _physicalWidth: screen.width * (window.devicePixelRatio || 1),

  /**
   * returns the calculated destination width if a size is given, or the physical width if not
   *
   * @property _destinationWidth
   * @type number
   * @readOnly
   * @private
   */
  _destinationWidth: computed('size', '_physicalWidth', function () {
    let factor = 1;
    if (Ember.isPresent(this.get('size'))) {
      factor = this.get('size') / 100;
    }
    return this.get('_physicalWidth') * factor;
  }),

  /**
   * an array of strings with the images and the width
   *
   * @property _sources
   * @type Array
   * @readOnly
   * @private
   */
  _sources: computed('_imageName', '_imageEnding', '_destinationPath', 'supportedWidths', function() {
    return this.get('supportedWidths').map((item) => {
      return `${this.get('_destinationPath')}${this.get('_imageName')}${item}w.${this.get('_imageEnding')} ${item}w`;
    }, this);
  }),

  /**
   * the path where the generated images will be
   *
   * @property _destinationPath
   * @type string
   * @readOnly
   * @private
   */
  _destinationPath: computed(function() {
    let config = getOwner(this)._lookupFactory('config:environment'),
      destinationDir = Ember.get(config, 'kaliber5-responsive-image.destinationDir'),
      assetsPath = this.get('assetsPath');

    // if assetPath is empty the first file path would lead to an absolute path, that might break things (e.g. cordova),
    // so check for empty assetPath!
    return Ember.isPresent(assetsPath) ? `${assetsPath}${destinationDir}/` : `${destinationDir}/`;
  }),

  /**
   * the name of the image without the file extension
   *
   * @property _imageEnding
   * @type string
   * @readOnly
   * @private
   */
  _imageName: computed('image', function() {
    return this.get('image').substr(0, this.get('image').lastIndexOf('.'));
  }),

  /**
   * the file extension of the image
   *
   * @property _imageEnding
   * @type string
   * @readOnly
   * @private
   */
  _imageEnding: computed('image', function() {
    return this.get('image').substr(this.get('image').lastIndexOf('.')+1);
  })
});
