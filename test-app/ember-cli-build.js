'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const EmberResponsiveImageWebpackLoaders =
  require('@ember-responsive-image/webpack').loaders;

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: [
        'ember-responsive-image',
        '@ember-responsive-image/cloudinary',
        '@ember-responsive-image/imgix',
      ],
    },
    '@embroider/macros': {
      setConfig: {
        '@ember-responsive-image/cloudinary': {
          cloudName: 'kaliber5',
        },
        '@ember-responsive-image/imgix': {
          domain: 'kaliber5.imgix.net',
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
              resourceQuery: /responsive/,
              use: EmberResponsiveImageWebpackLoaders,
            },
          ],
        },
      },
    },
  });
};
