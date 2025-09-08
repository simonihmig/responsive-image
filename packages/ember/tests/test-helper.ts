import EmberApp from '@ember/application';
import EmberRouter from '@ember/routing/router';
import { setApplication } from '@ember/test-helpers';
import { setConfig } from '@responsive-image/core';
import { start as qunitStart, setupEmberOnerrorValidation } from 'ember-qunit';
import Resolver from 'ember-resolver';
import * as QUnit from 'qunit';
import { setup } from 'qunit-dom';

import type { Config } from '@responsive-image/cdn';

class Router extends EmberRouter {
  location = 'none';
  rootURL = '/';
}

class TestApp extends EmberApp {
  modulePrefix = 'test-app';
  Resolver = Resolver.withModules({
    'test-app/router': { default: Router },
    // add any custom services here
  });
}

setConfig<Config>('cdn', {
  cloudinary: {
    cloudName: 'responsive-image',
  },
  fastly: {
    domain: 'www.fastly.io',
  },
  imgix: {
    domain: 'responsive-image.imgix.net',
  },
  netlify: {
    domain: 'responsive-image.dev',
  },
});

Router.map(function () {});

export function start() {
  setApplication(
    TestApp.create({
      autoboot: false,
      rootElement: '#ember-testing',
    }),
  );
  setup(QUnit.assert);
  setupEmberOnerrorValidation();
  qunitStart();
}
