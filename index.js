'use strict';
const path = require('path');
const Funnel = require('broccoli-funnel');
const Writer = require('./lib/image-writer');
const CssWriter = require('./lib/css-writer');
const fs = require('fs-extra');
const map = require('broccoli-stew').map;
const mergeTrees = require('broccoli-merge-trees');
const SilentError = require('silent-error');
const minimatch = require('minimatch');
const walk = require('walk-sync');

const defaultDeviceWidths = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];

const defaultImageConfig = {
  exclude: [],
  quality: 80,
  widths: [2048, 1536, 1080, 750, 640],
  formats: ['original', 'webp' /*, 'avif'*/],
  removeSource: true,
  justCopy: false,
  destinationDir: '/',
};

/**
 * Ember Addon, generate resized images on build time
 */
module.exports = {
  name: require('./package').name,
  metaData: {},
  configData: {},
  app: null,
  cssExtensions: [],
  metadataExtensions: [],
  extendedMetaData: null,
  imagePreProcessors: [],
  imagePostProcessors: [],
  plugins: [],
  usesBlurhash: false,

  options: {
    '@embroider/macros': {
      setOwnConfig: {},
    },
  },

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

  addCssExtension(callback, target) {
    this.cssExtensions.push({ callback, target });
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
    this.extendedMetaData = {
      deviceWidths: this.addonOptions.deviceWidths || defaultDeviceWidths,
      images: {},
    };

    // Add image data to meta
    Object.keys(this.metaData).forEach((key) => {
      if (
        this.configData[key] &&
        Object.prototype.hasOwnProperty.call(this.extendedMetaData, key) ===
          false
      ) {
        this.extendedMetaData.images[key] = this.metadataExtensions.reduce(
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

    if (this.addonOptions.providers) {
      this.extendedMetaData.providers = this.addonOptions.providers;
    }
    return this.extendedMetaData;
  },

  included(app) {
    this._super.included.apply(this, arguments);
    this.app = app;
    this.initConfig();
    this.setupFingerprinting();
    this.initPlugins();
    this.processingTree = this.createProcessingTree();

    this.usesBlurhash = this.addonOptions.images.some(
      (imageConfig) => imageConfig.lqip && imageConfig.lqip.type === 'blurhash'
    );
    this.options['@embroider/macros'].setOwnConfig.usesBlurhash =
      this.usesBlurhash;
  },

  initConfig() {
    this.addonOptions = this.app.options['responsive-image'];

    if (!this.addonOptions) {
      this.ui.writeWarnLine(
        'Could not find config for ember-responsive-image, skipping image processing...'
      );
      this.addonOptions = { images: [] };
    }

    if (
      !Array.isArray(this.addonOptions.images) &&
      !this.addonOptions.providers
    ) {
      if (!this.addonOptions.providers) {
        throw new SilentError(
          'Config for ember-responsive-image must include an `images` array or configure `providers`.'
        );
      }

      this.addonOptions.images = [];
    }

    this.addonOptions.images = (this.addonOptions.images || []).map((item) => {
      this.validateConfigItem(item);
      let extendedConfig = { ...defaultImageConfig, ...item };
      // extendedConfig.rootURL = url;
      if (!Array.isArray(extendedConfig.include)) {
        extendedConfig.include = [extendedConfig.include];
      }

      if (!Array.isArray(extendedConfig.exclude)) {
        extendedConfig.exclude = [extendedConfig.exclude];
      }

      return extendedConfig;
    });
  },

  initPlugins() {
    walk(path.join(__dirname, 'lib/plugins'), { globs: ['*.js'] }).forEach(
      (file) => {
        const Plugin = require(`./lib/plugins/${file}`);
        this.plugins.push(new Plugin(this));
      }
    );
  },

  setupFingerprinting() {
    if (this.app.project.findAddonByName('broccoli-asset-rev')) {
      const assetRevOptions = this.app.options.fingerprint;
      this.addonOptions.fingerprint =
        this.addonOptions.fingerprint !== undefined
          ? this.addonOptions.fingerprint
          : assetRevOptions === false
          ? false
          : assetRevOptions && assetRevOptions.enabled !== undefined
          ? assetRevOptions.enabled
          : this.app.env === 'production';

      if (this.addonOptions.fingerprint) {
        // exclude our own images from broccoli-asset-rev, as we will handle fingerprinting on our own

        const excludeGlobs = this.addonOptions.images.reduce(
          (globs, imageConfig) => [...globs, ...imageConfig.include],
          []
        );

        assetRevOptions.exclude = assetRevOptions.exclude
          ? [...assetRevOptions.exclude, ...excludeGlobs]
          : excludeGlobs;
      }
    } else {
      this.addonOptions.fingerprint =
        this.addonOptions.fingerprint !== undefined
          ? this.addonOptions.fingerprint
          : this.app.env === 'production';
    }
  },

  validateConfigItem(config) {
    if (!config.include) {
      throw new SilentError(
        'include pattern must be given for responsive image config!'
      );
    }
  },

  resizeImages(tree, options) {
    let funnel = new Funnel(tree, {
      include: options.include,
      exclude: options.exclude,
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
    if (type === 'body-footer') {
      return [
        '<script id="ember_responsive_image_meta" type="application/json">',
        JSON.stringify(this.extendMetadata()),
        '</script>',
      ].join('\n');
    }

    // add blurhash script before app scripts, to process blurhash images before all of the app get's loaded
    // This makes blurhash - which requires a JS-based decoding step - reasonable to use in a SSR/FastBoot setup.
    if (this.usesBlurhash && type === 'body') {
      return `<script src="${this._getRootURL()}assets/blurhash.js"></script>\n`;
    }
  },

  _getRootURL() {
    if (this._projectRootURL) {
      return this._projectRootURL;
    }

    let config = this._getConfig();
    let rootURL = config.rootURL || config.baseURL || '/';

    return (this._projectRootURL = rootURL);
  },

  _getConfig() {
    return this.project.config(this.app.env);
  },

  treeForAddonStyles(tree) {
    const dynTree = new CssWriter(
      [this.processingTree],
      () => this.metaData,
      this.cssExtensions
    );
    return mergeTrees([tree, dynTree]);
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
    const trees = [this.processingTree];

    // Blurhash support requires a special JS script for SSR support
    if (this.usesBlurhash) {
      const rollup = require('broccoli-rollup');
      const resolve = require('@rollup/plugin-node-resolve');
      const cjs = require('@rollup/plugin-commonjs');

      const babelAddon = this.addons.find(
        (addon) => addon.name === 'ember-cli-babel'
      );

      const transpiledBlurhashScriptTree = babelAddon.transpileTree(
        this.treeGenerator(path.join(__dirname, 'vendor')),
        {
          'ember-cli-babel': {
            compileModules: false,
          },
        }
      );

      const bundledBlurhashScriptTree = rollup(transpiledBlurhashScriptTree, {
        rollup: {
          input: 'blurhash-script.js',
          output: {
            format: 'iife',
            file: 'blurhash.js',
            name: '__eri_blurhash',
          },
          plugins:
            process.env.EMBER_ENV === 'production'
              ? [resolve(), cjs(), require('rollup-plugin-terser').terser()]
              : [resolve(), cjs()],
        },
      });

      trees.push(
        new Funnel(bundledBlurhashScriptTree, {
          destDir: 'assets',
        })
      );
    }

    return mergeTrees(trees);
  },

  createProcessingTree() {
    const tree = this._findHost().trees.public;
    const { fingerprint } = this.addonOptions;
    const trees = this.addonOptions.images.map((options) => {
      return this.resizeImages(tree, { ...options, fingerprint });
    });

    return mergeTrees(trees, { overwrite: true });
  },

  postBuild(result) {
    // remove original images that have `removeSource` set
    const processedImages = Object.keys(this.metaData);
    this.addonOptions.images.forEach((options) => {
      if (options.removeSource) {
        const globs = processedImages
          .filter((file) => {
            for (let pattern of options.include) {
              if (!minimatch(file, pattern)) {
                return false;
              }
            }
            for (let pattern of options.exclude) {
              if (minimatch(file, pattern)) {
                return false;
              }
            }

            return true;
          })
          .map((file) => {
            const [filename, ext] = file.split('.');
            const hashedFile = `${filename}-*.${ext}`;
            return [file, hashedFile];
          })
          .reduce((result, arr) => [...result, ...arr], []); // flatMap

        walk(result.directory, { globs }).forEach((file) =>
          fs.removeSync(path.join(result.directory, file))
        );
      }
    });
  },
};
