'use strict';
const path = require('path');
const Funnel = require('broccoli-funnel');
const Writer = require('./broccoli-image-writer');
const rimraf = require('rimraf');
const extend = require('util')._extend;
const map = require('broccoli-stew').map;
const filterInitializers = require('fastboot-filter-initializers');
const mergeTrees = require('broccoli-merge-trees');


/*jshint node:true*/


function defaultConfig(env) {
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
 *
 *
 */
module.exports = {
  name: 'ember-responsive-image',
  options: {},
  metaData: {},
  app: null,

  included(app, parentAddon) {
    this._super.included.apply(this, arguments);
    this.app = (parentAddon || app);
  },

  config(env, baseConfig) {
    if (!env)
      return;
    let config = baseConfig['responsive-image'];
    let url = baseConfig.rootURL || baseConfig.baseURL || '';
    this.addonOptions = [];

    if (Array.isArray(config) === false) {
      config = [config];
    }
    config.forEach((item) => {
      let extendedConfig = extend(defaultConfig(env), item);
      extendedConfig.rootURL = url;
      this.addonOptions.push(extendedConfig);
    })
  },

  preconcatTree: function(tree) {
    return filterInitializers(tree, this.app.name);
  },

  resizeImages(tree, options) {
    let extensions = options.extensions.join('|');
    let funnel = new Funnel(tree, {
      srcDir: options.sourceDir,
      include: [`**/*.+(${extensions})`],
      allowEmpty: true,
      destDir: '/'
    });
    return new Writer([funnel], options, this.metaData, this.ui);
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

      let pattern = '\'__ember_responsive_image_meta__\'';
      if (process.env.EMBER_CLI_FASTBOOT) {
        tree = map(tree, '**/*.js', (content, path) => {
          let metaData = JSON.stringify(this.metaData);
          return content.replace(pattern, metaData);
        });
      } else {
        tree = map(tree, '**/index.html', (content, path) => {
          let metaData = JSON.stringify(this.metaData);
          return content.replace(pattern, metaData);
        });
      }
      trees.push(tree);
      return mergeTrees(trees);
    }

    return tree;
  },

  postBuild(result) {
    this.addonOptions.forEach((options) => {
      if (options.removeSourceDir) {
        // remove folder with source files
        rimraf.sync(path.join(result.directory, options.sourceDir));
      }
    });
  }
};
