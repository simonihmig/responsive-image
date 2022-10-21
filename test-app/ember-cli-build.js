'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['ember-responsive-image'],
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
                {
                  loader: '@ember-responsive-image/loader',
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
