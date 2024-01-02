'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const { setupLoaders } = require('@ember-responsive-image/webpack');

const EmberResponsiveImageWebpackLoaders = setupLoaders();

module.exports = function (defaults) {
  let usesEmbroider =
    !!process.env.EMBROIDER_TEST_SETUP_OPTIONS ||
    process.env.EMBROIDER_TEST_SETUP_FORCE === 'embroider';

  let app = new EmberApp(defaults, {
    'ember-cli-babel': { enableTypeScriptTransform: true },
    autoImport: usesEmbroider
      ? {}
      : {
          watchDependencies: [
            'ember-responsive-image',
            '@ember-responsive-image/cloudinary',
            '@ember-responsive-image/imgix',
          ],
          allowAppImports: [
            'images/**/*.jpg',
            'images/**/*.jpeg',
            'images/**/*.png',
          ],
          webpack: {
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

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app, {
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
