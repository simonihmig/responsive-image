/*jshint node:true*/
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function(defaults) {
  var app = new EmberAddon(defaults, {
    // Add options here
    fingerprint: {
      // exclude: ['assets/images/responsive'], // or whatever your destination folder is
      enabled: true,
      generateAssetMap: true,
      fingerprintAssetMap: true,
      extensions: ['png'],
      customHash: '00e24234f1b58e32b935b1041432916f'
    }
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  return app.toTree();
};
