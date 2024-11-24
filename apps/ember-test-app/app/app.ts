import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'ember-test-app/config/environment';
import { setConfig } from '@responsive-image/core';
import type { Config } from '@responsive-image/cdn';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

setConfig<Config>('cdn', {
  cloudinary: {
    cloudName: 'responsive-image',
  },
  imgix: {
    domain: 'responsive-image.imgix.net',
  },
  netlify: {
    domain: 'responsive-image.dev',
  },
});

loadInitializers(App, config.modulePrefix);
