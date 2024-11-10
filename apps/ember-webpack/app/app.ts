import Application from '@ember/application';
import Resolver from 'ember-resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'ember-webpack/config/environment';
import { setConfig } from '@responsive-image/core';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

setConfig('cloudinary', {
  cloudName: 'kaliber5',
});
setConfig('imgix', {
  domain: 'kaliber5.imgix.net',
});

loadInitializers(App, config.modulePrefix);
