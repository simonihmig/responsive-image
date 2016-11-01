import Ember from 'ember';

import getOwner from 'ember-getowner-polyfill';

/**
 * Use this component to show the generated images from the source folder, just set the image property with the image name and optional a css-className
 * (e.g. {{responsive-image image="awesome.jpg" className="responsive-image-css" }}) and enjoy the generated img-Tag with srcset-attribute
 *
 */
export default Ember.Component.extend({

  tagName: 'img',
  classNameBindings: ['className'],
  attributeBindings: ['src', 'srcset', 'alt', 'width', 'height', 'style', 'sizes'],
  style: null,
  width: null,
  height: null,
  alt: null,
  className: null,
  assetsPath: Ember.computed.oneWay('_assetsFolder'),
  _assetsFolder: function () {
    const config = getOwner(this)._lookupFactory('config:environment'),
      baseUrl = Ember.get(config, 'assetsURL') || '';
    return baseUrl;
  }.property(),
  image: null,
  size: null,


  /**
   * @todo provide a solution for a use case where the image has a size in px unit.
   */
  sizes: function() {
    if (Ember.isPresent(this.get('size'))) {
      return this.get('size')+'vw';
    }
    return null;
  }.property('size'),

  src: function() {
    return `${this.get('_destinationPath')}${this.get('_imageName')}${this.get('_sourceWidth')}w.${this.get('_imageEnding')}`;
  }.property('_imageName', '_imageEnding', '_destinationPath','_sourceWidth'),

  supportedWidths: function() {
    const config = getOwner(this)._lookupFactory('config:environment'),
    widths = Ember.get(config, 'kaliber5-responsive-image.supportedWidths');
    return widths;
  }.property(),

  srcset: function() {
    return this.get('_sources').join(', ');
  }.property('_sources'),

  didInsertElement: function() {
    this._super();
  },

  /**
   * returns the width next to needed by display-size
   */
  _sourceWidth: function () {
    return this.get('supportedWidths').reduce((prevValue, item)=> {
      if (item >= this.get('_destinationWidth') && prevValue >= this.get('_destinationWidth')) {
        return (item >= prevValue)?prevValue:item;
      } else {
        return (item >= prevValue) ? item : prevValue;
      }
    }, 0);
  }.property('supportedWidths', '_destinationWidth'),

  _physicalWidth: screen.width * (window.devicePixelRatio || 1),
  _destinationWidth: function () {
    var factor = 1;
    if (Ember.isPresent(this.get('size'))) {
      factor = this.get('size') / 100;
    }
    return this.get('_physicalWidth') * factor;
  }.property('size', '_physicalWidth'),

  _sources: function() {
    return this.get('supportedWidths').map((item) => {
      return `${this.get('_destinationPath')}${this.get('_imageName')}${item}w.${this.get('_imageEnding')} ${item}w`;
    }, this);
  }.property('_imageName', '_imageEnding', '_destinationPath', 'supportedWidths'),

  _destinationPath: function() {
    let config = getOwner(this)._lookupFactory('config:environment'),
      destinationDir = Ember.get(config, 'kaliber5-responsive-image.destinationDir'),
      assetsPath = this.get('assetsPath');

    // if assetPath is empty the first file path would lead to an absolute path, that might break things (e.g. cordova),
    // so check for empty assetPath!
    return Ember.isPresent(assetsPath) ? `${assetsPath}${destinationDir}/` : `${destinationDir}/`;
  }.property(),

  _imageName: function() {
    return this.get('image').substr(0, this.get('image').lastIndexOf('.'));
  }.property('image'),

  _imageEnding: function() {
    return this.get('image').substr(this.get('image').lastIndexOf('.')+1);
  }.property('image')

});
