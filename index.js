var path = require('path');
var Funnel = require('broccoli-funnel');
var Writer = require('./broccoli-image-writer');
var rimraf = require('rimraf');
var extend = require('util')._extend;
var chalk = require('chalk');


/*jshint node:true*/


function defaultConfig(env) {
  var defaultConfig = {
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
};

/**
 * Ember Addon, generate resized images on build time
 *
 *
 */
module.exports = {
  name: 'ember-kaliber5-responsive-image',
  options: {},
  addonOptions: {},

  included: function(app) {
    this.addonOptions = app.options;
  },

  config: function(env, baseConfig) {
    if (!env)
      return;
    this.options = extend(defaultConfig(env), baseConfig['kaliber5-responsive-image']);
    this.addonOptions['responsive'] = this.options;
  },

  treeForPublic: function (tree) {
    var options = this.options;
    var funnel = new Funnel('public', {
      srcDir: options.sourceDir,
      destDir: '/'
    });
    return new Writer([funnel], this.addonOptions, this.ui);
  },

  postBuild: function(result) {
    if (this.options.removeSourceDir) {
      // remove folder with source files
      rimraf.sync(path.join(result.directory, this.options.sourceDir));
    }
  }
};
