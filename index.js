'use strict';
const path = require('path');
const Funnel = require('broccoli-funnel');
const Writer = require('./lib/image-writer');
const fs = require('fs-extra');
const map = require('broccoli-stew').map;
const mergeTrees = require('broccoli-merge-trees');

function defaultConfig() {
  let defaultConfig = {
    sourceDir: 'assets/images/generate',
    destinationDir: 'assets/images/responsive',
    quality: 80,
    supportedWidths: [2048, 1536, 1080, 750, 640],
    removeSourceDir: true,
    justCopy: false,
    recursive: false,
    extensions: ['jpg', 'jpeg', 'png', 'gif'],
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
      if (
        this.configData[key] &&
        Object.prototype.hasOwnProperty.call(this.extendedMetaData, key) ===
          false
      ) {
        this.extendedMetaData[key] = this.metadataExtensions.reduce(
          (data, extension) => {
            return extension.callback.call(
              extension.target,
              key,
              data,
              this.configData[key]
            );
          },
          this.metaData[key]
        );
      }
    });

    return this.extendedMetaData;
  },

  included(app, parentAddon) {
    this._super.included.apply(this, arguments);
    this.app = parentAddon || app;
    this.processingTree = this.createProcessingTree();
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
      destDir: '/',
    });
    return new Writer(
      [funnel],
      options,
      this.metaData,
      this.configData,
      this.imagePreProcessors,
      this.imagePostProcessors,
      this.ui
    );
  },

  contentFor(type) {
    // we write our image meta data as a script tag into the app's index.html, which the service will read from
    // (that happens only in the browser, where we have easy access to the DOM. For FastBoot this is different, see below)
    if (type === 'head-footer') {
      return [
        '<script id="ember_responsive_image_meta" type="application/json">',
        JSON.stringify(this.extendMetadata()),
        '</script>',
      ].join('\n');
    }
  },

  treeForFastBoot() {
    // we have to rename our own fastboot tree so that our dummy app works correctly, due to this bug in ember-cli-fastboot:
    // https://github.com/ember-fastboot/ember-cli-fastboot/issues/807
    const tree = this.treeGenerator(path.join(__dirname, '-fastboot'));
    const pattern = /["']__ember_responsive_image_meta__["']/;
    // we replace our placeholder token with the image meta data generated from our broccoli plugin, so the meta data
    // is part of the FastBoot specific service within the generated fastboot.js bundle. See `-fastboot/services/responsive-image.js`
    const mapMeta = (content) =>
      content.replace(pattern, JSON.stringify(this.extendMetadata()));

    // This is some ugly hack to make sure the image processing happened before the FastBoot tree is emitted, as we need
    // its meta data here. This is normally not the case, due to the timing of these hooks.
    // So we merge the processingTree into our fastboot tree, and remove it later, to make sure it gets consumed.
    return new Funnel(
      map(mergeTrees([tree, this.processingTree]), '**/*.js', mapMeta),
      {
        include: ['**/*.js'],
      }
    );
  },

  treeForPublic() {
    return this.processingTree;
  },

  createProcessingTree() {
    const tree = this._findHost().trees.public;
    this.metaData.prepend = '';
    if (this.app && this.app.options && this.app.options.fingerprint) {
      this.metaData.prepend = this.app.options.fingerprint.prepend;
    }
    const trees = this.addonOptions.map((options) => {
      return this.resizeImages(tree, options);
    });

    return mergeTrees(trees, { overwrite: true });
  },

  postBuild(result) {
    this.addonOptions.forEach((options) => {
      if (options.removeSourceDir) {
        // remove folder with source files
        fs.removeSync(path.join(result.directory, options.sourceDir));
      }
    });
  },
};
