'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
    fingerprint: {
      enabled: true,
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'webp', 'avif'],
      exclude: ['testem.js'],
      customHash: '00e24234f1b58e32b935b1041432916f',
    },
    'responsive-image': [
      {
        include: 'assets/images/tests/**/*',
        exclude: [
          'assets/images/tests/small.png',
          'assets/images/tests/lqip/**/*',
        ],
        quality: 50,
        supportedWidths: [50, 100, 640],
        lqip: {
          type: 'color',
        },
        removeSource: true,
      },
      {
        include: 'assets/images/tests/small.png',
        quality: 10,
        removeSource: false,
        supportedWidths: [10, 25],
      },
      {
        include: 'assets/images/tests/lqip/inline.jpg',
        quality: 50,
        supportedWidths: [100, 640],
        lqip: {
          type: 'inline',
        },
        removeSource: true,
      },
      {
        include: 'assets/images/tests/lqip/color.jpg',
        quality: 50,
        supportedWidths: [100, 640],
        lqip: {
          type: 'color',
        },
        removeSource: true,
        justCopy: false,
      },
      {
        include: 'assets/images/tests/lqip/blurhash.jpg',
        quality: 50,
        supportedWidths: [100, 640],
        lqip: {
          type: 'blurhash',
        },
        removeSource: true,
      },
      {
        include: 'assets/images/docs/**/*',
        exclude: [
          'assets/images/docs/lqip-color.jpg',
          'assets/images/docs/lqip-blurhash.jpg',
        ],
        quality: 50,
        supportedWidths: [1920, 1280, 640, 320],
        lqip: {
          type: 'inline',
        },
        removeSource: true,
      },
      {
        include: 'assets/images/docs/lqip-color.jpg',
        quality: 50,
        supportedWidths: [1920, 1280, 640, 320],
        lqip: {
          type: 'color',
        },
        removeSource: true,
      },
      {
        include: 'assets/images/docs/lqip-blurhash.jpg',
        quality: 50,
        supportedWidths: [1920, 1280, 640, 320],
        lqip: {
          type: 'blurhash',
        },
        removeSource: true,
      },
    ],
  });

  /*
    This build file specifies the options for the dummy test app of this
    addon, located in `/tests/dummy`
    This build file does *not* influence how the addon or the app using it
    behave. You most likely want to be modifying `./index.js` or app's build file
  */

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};
