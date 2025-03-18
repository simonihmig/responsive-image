'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { setupLoaders } = require('@responsive-image/webpack');

const EmberResponsiveImageWebpackLoaders = setupLoaders();

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    'ember-cli-babel': {
      enableTypeScriptTransform: true,
    },
  });

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    skipBabel: [
      {
        package: 'qunit',
      },
    ],
    // This breaks with ember-cli-fastboot: https://github.com/ember-fastboot/ember-cli-fastboot/issues/925
    staticEmberSource: false,
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
