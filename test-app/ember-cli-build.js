'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['ember-responsive-image'],
    },
    '@embroider/macros': {
      setConfig: {
        '@ember-responsive-image/core': {
          providers: {
            cloudinary: {
              cloudName: 'kaliber5',
            },
            imgix: {
              domain: 'kaliber5.imgix.net',
            },
          },
        },
      },
    },
  });

  // const { maybeEmbroider } = require('@embroider/test-setup');
  // return maybeEmbroider(app);

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    packagerOptions: {
      webpackConfig: {
        module: {
          rules: [
            {
              test: /\.(png|jpe?g)$/,
              use: [
                '@ember-responsive-image/loader/export',
                {
                  loader: '@ember-responsive-image/loader/color',
                  options: {
                    // Set options for all transforms
                  },
                },
                {
                  loader: '@ember-responsive-image/loader/images',
                  options: {
                    // Set options for all transforms
                  },
                },
              ],
              type: 'javascript/auto',
            },
          ],
        },
      },
    },
  });
};
