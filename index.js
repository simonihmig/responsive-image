'use strict';
const path = require('path');
const Funnel = require('broccoli-funnel');
const Writer = require('./broccoli-image-writer');
const fs = require('fs-extra');
const map = require('broccoli-stew').map;
const find = require('broccoli-stew').find;
const mergeTrees = require('broccoli-merge-trees');

function defaultConfig() {
  let defaultConfig = {
    sourceDir: 'assets/images/generate',
    destinationDir: 'assets/images/responsive',
    quality: 80,
    supportedWidths: [2048, 1536, 1080, 750, 640],
    removeSourceDir: true,
    justCopy: false,
    extensions: ['jpg', 'jpeg', 'png', 'gif']
  };

  //if (env !== 'production') {
  //  defaultConfig.justCopy = true;
  //}
  return defaultConfig;
}

/**
 * Ember Addon, generate resized images on build time
 */
module.exports = {
  name: require('./package').name,
  options: {},
  metaData: {},
  configData: {},
  app: null,
  metadataExtensions: [],
  extendedMetaData: null,
  imagePreProcessors: [],
  imagePostProcessors: [],

  /**
   * Add a callback function to change the generated metaData per origin image.
   * The callback method you provide must have the following signature:
   * ```javascript
   * function(image, metadata, configuration);
   * ```
   * - `image` the name of the origin image file
   * - `metadata` object with the metaData of the generated images
   * - `configuration` the configuration for the image generation
   *
   * It should return an object with the changed metaDatas.
   * Note that in addition to a callback, you can also pass an optional target
   * object that will be set as `this` on the context. This is a good way
   * to give your function access to the current object.
   *
   * @method addMetadataExtension
   * @param {Function} callback The callback to execute
   * @param {Object} [target] The target object to use
   * @public
   */
  addMetadataExtension(callback, target) {
    this.metadataExtensions.push({ callback, target });
  },

  /**
   * Add a callback function to hook into image processing before the addon's image processes are executed.
   * The callback method you provide must have the following signature:
   * ```javascript
   * function(sharp, image, width, configuration);
   * ```
   * - `sharp` sharp object with the current origin image
   * - `image` the name of the origin image file
   * - `width` the width of the resulting resized image of the current processing
   * - `configuration` the configuration for the current image processing
   *
   * It should return a `sharp`-object or a Promise wich resolves to it.
   * Note that in addition to the callback, you can also pass an optional target
   * object that will be set as `this` on the context. This is a good way
   * to give your function access to the current object.
   *
   * @method addImagePreProcessor
   * @param {Function} callback The callback to execute
   * @param {Object} [target] The target object to use
   * @public
   */
  addImagePreProcessor(callback, target) {
    this.imagePreProcessors.push({ callback, target });
  },

  /**
   * Add a callback function to hook into image processing after the addon's image processes are executed.
   * The callback method you provide must have the following signature:
   * ```javascript
   * function(sharp, image, width, configuration);
   * ```
   * - `sharp` sharp object with the current origin image
   * - `image` the name of the origin image file
   * - `width` the width of the resulting resized image of the current processing
   * - `configuration` the configuration for the current image processing
   *
   * It should return a `sharp`-object or a Promise wich resolves to it.
   * Note that in addition to the callback, you can also pass an optional target
   * object that will be set as `this` on the context. This is a good way
   * to give your function access to the current object.
   *
   * @method addImagePreProcessor
   * @param {Function} callback The callback to execute
   * @param {Object} [target] The target object to use
   * @public
   */
  addImagePostProcessor(callback, target) {
    this.imagePostProcessors.push({ callback, target });
  },

  /**
   * calls the metadata extensions
   *
   * @method extendMetadata
   * @return {Object} the new metadata
   * @private
   */
  extendMetadata() {
    // Call the hooks only once
    if (this.extendedMetaData) {
      return this.extendedMetaData;
    }
    this.extendedMetaData = {};
    Object.keys(this.metaData).forEach((key) => {
      if (this.configData[key] && this.extendedMetaData.hasOwnProperty(key) === false) {
        this.extendedMetaData[key] = this.metadataExtensions.reduce((data, extension) => {
          return extension.callback.call(extension.target, key, data, this.configData[key]);
        }, this.metaData[key]);
      }
    });

    return this.extendedMetaData;
  },

  included(app, parentAddon) {
    this._super.included.apply(this, arguments);
    this.app = (parentAddon || app);
  },

  config(env, baseConfig) {
    if (!env) {
      return;
    }
    let config = baseConfig['responsive-image'];
    let url = baseConfig.rootURL || baseConfig.baseURL || '';
    this.addonOptions = [];

    if (Array.isArray(config) === false) {
      config = [config];
    }
    config.forEach((item) => {
      let extendedConfig = Object.assign({}, defaultConfig(env), item);
      extendedConfig.rootURL = url;
      this.addonOptions.push(extendedConfig);
    });
  },

  resizeImages(tree, options) {
    let extensions = options.extensions.join('|');
    let funnel = new Funnel(tree, {
      srcDir: options.sourceDir,
      include: [`**/*.+(${extensions})`],
      allowEmpty: true,
      destDir: '/'
    });
    return new Writer([funnel], options, this.metaData, this.configData, this.imagePreProcessors, this.imagePostProcessors, this.ui);
  },

  contentFor(type) {
    if (type === 'head-footer') {
      let txt = [
        '<script id="ember_responsive_image_meta" type="application/json">',
        '\'__ember_responsive_image_meta__\'',
        '</script>'
      ];
      return txt.join("\n");
    }
  },

  postprocessTree(type, tree) {
    if (type === 'all') {
      this.metaData.prepend = '';
      if (this.app && this.app.options && this.app.options.fingerprint) {
        this.metaData.prepend = this.app.options.fingerprint.prepend;
      }
      let trees = [];
      this.addonOptions.forEach((options) => {
        let imageTree = this.resizeImages(tree, options)
        trees.push(imageTree);
      });

      let pattern = /["']__ember_responsive_image_meta__["']/;
      let mapMeta = (content) => content.replace(pattern, JSON.stringify(this.extendMetadata()));

      trees = trees.concat([
          tree,
          map(find(tree, '**/*.js'), mapMeta),
          map(find(tree, '**/index.html'), mapMeta)
        ]
      );
      return mergeTrees(trees, { overwrite: true });
    }

    return tree;
  },

  postBuild(result) {
    this.addonOptions.forEach((options) => {
      if (options.removeSourceDir) {
        // remove folder with source files
        fs.removeSync(path.join(result.directory, options.sourceDir));
      }
    });
  }
};
