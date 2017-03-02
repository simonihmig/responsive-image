'use strict';
const path = require('path');
const Funnel = require('broccoli-funnel');
const Writer = require('./broccoli-image-writer');
const rimraf = require('rimraf');
const extend = require('util')._extend;
const map = require('broccoli-stew').map;
const log = require('broccoli-stew').log;
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
      justCopy: false
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
    this.options = extend(defaultConfig(env), baseConfig['responsive-image']);
    this.options.rootURL = baseConfig.rootURL || baseConfig.baseURL || '';
  },

  preconcatTree: function(tree) {
    return filterInitializers(tree, this.app.name);
  },

  treeForPublic(tree) {
    tree = this._super.treeForPublic.apply(this, arguments);
    let options = this.options;
    let funnel = new Funnel('public', {
      srcDir: options.sourceDir,
      allowEmpty: true,
      destDir: '/'
    });

    this.metaData.prepend = '';
    if (this.app && this.app.options && this.app.options.fingerprint) {
      this.metaData.prepend = this.app.options.fingerprint.prepend;
    }
    let responseTree = new Writer([funnel], this.options, this.metaData, this.ui);
    return mergeTrees([tree, responseTree]);
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
      let pattern = '\'__ember_responsive_image_meta__\'';
      if (process.env.EMBER_CLI_FASTBOOT) {
        tree = map(tree, '**/*.js', (content, path) => {
          let metaData = JSON.stringify(this.metaData);
          return content.replace(pattern, metaData);
        })
      } else {
        tree = map(tree, '**/index.html', (content, path) => {
          let metaData = JSON.stringify(this.metaData);
          return content.replace(pattern, metaData);
        })
      }
    }

    return tree;
  }
};
