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
  name: 'ember-responsive-image',
  options: {},
  metaData: {},
  configData: {},
  app: null,
  metaExtensions: [],
  extendedMetaData: null,

  /**
   * Add a callback function to change the generated metaData per origin image.
   * The callback method you provide must have the following signature:
   * ```javascript
   * function(image, metaData, configuration);
   * ```
   * - `image` the name of the origin image file
   * - `metaData` array with the metaData of the generated images
   * - `configuration` the configuration for the image generation
   *
   * It should return an array with the changed metaDatas.
   * Note that in addition to a callback, you can also pass an optional target
   * object that will be set as `this` on the context. This is a good way
   * to give your function access to the current object.
   *
   * @method addMetaExtension
   * @param {Function} callback The callback to execute
   * @param {Object} [target] The target object to use
   * @public
   */
  addMetaExtension(callback, target) {
    this.metaExtensions.push({ callback, target });
  },

  /**
   * calls the add MetaExtensions
   *
   * @return {Object} the new metadata
   * @private
   */
  callMetaExtensions() {
    // Call the hooks only once
    if (this.extendedMetaData) {
      return this.extendedMetaData;
    }
    Object.keys(this.metaData).forEach((key) => {
      if (this.extendedMetaData.hasOwnProperty(key) === false) {
        this.extendedMetaData[key] = this.metaExtensions.reduce((data, extension) => {
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
    return new Writer([funnel], options, this.metaData, this.configData, this.ui);
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
      let mapMeta = (content) => content.replace(pattern, JSON.stringify(this.callMetaExtensions()));

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
