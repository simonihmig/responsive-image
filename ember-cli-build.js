'use strict';

const EmberAddon = require('ember-cli/lib/broccoli/ember-addon');

module.exports = function (defaults) {
  let app = new EmberAddon(defaults, {
    // Add options here
    fingerprint: {
      enabled: true,
      extensions: ['js', 'css', 'png', 'jpg', 'gif', 'map', 'webp', 'avif'],
      exclude: ['testem.js'],
    },
    'responsive-image': {
      fingerprint:
        // used only for testing here, to override the md5 fingerprint with a constant (for deterministic testing)
        process.env.ERI_FINGERPRINT !== undefined
          ? process.env.ERI_FINGERPRINT
          : true,
      images: [
        {
          include: 'assets/images/tests/**/*',
          exclude: [
            'assets/images/tests/small.png',
            'assets/images/tests/lqip/**/*',
          ],
          quality: 50,
          widths: [50, 100, 640],
          formats: ['original', 'webp', 'avif'],
          lqip: {
            type: 'color',
          },
          removeSource: true,
        },
        {
          include: 'assets/images/tests/small.png',
          quality: 10,
          removeSource: false,
          widths: [10, 25],
          formats: ['original', 'webp', 'avif'],
        },
        {
          include: 'assets/images/tests/lqip/inline.jpg',
          quality: 50,
          widths: [100, 640],
          formats: ['original', 'webp', 'avif'],
          lqip: {
            type: 'inline',
          },
          removeSource: true,
        },
        {
          include: 'assets/images/tests/lqip/color.jpg',
          quality: 50,
          widths: [100, 640],
          formats: ['original', 'webp', 'avif'],
          lqip: {
            type: 'color',
          },
          removeSource: true,
          justCopy: false,
        },
        {
          include: 'assets/images/tests/lqip/blurhash.jpg',
          quality: 50,
          widths: [100, 640],
          formats: ['original', 'webp', 'avif'],
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
          widths: [1920, 1280, 640, 320],
          formats: ['original', 'webp', 'avif'],
          lqip: {
            type: 'inline',
          },
          removeSource: true,
        },
        {
          include: 'assets/images/docs/lqip-color.jpg',
          quality: 50,
          widths: [1920, 1280, 640, 320],
          formats: ['original', 'webp', 'avif'],
          lqip: {
            type: 'color',
          },
          removeSource: true,
        },
        {
          include: 'assets/images/docs/lqip-blurhash.jpg',
          quality: 50,
          widths: [1920, 1280, 640, 320],
          formats: ['original', 'webp', 'avif'],
          lqip: {
            type: 'blurhash',
          },
          removeSource: true,
        },
      ],
    },
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
