import Application from '@ember/application';
import compatModules from '@embroider/core/entrypoint';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from './config/environment';
import { setConfig } from '@responsive-image/core';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver.withModules(compatModules);
}

setConfig('cdn', {
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

loadInitializers(App, config.modulePrefix, compatModules);
