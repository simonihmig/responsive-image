/* jshint expr:true */
import Application from '@ember/application';

import { run } from '@ember/runloop';
import { expect } from 'chai';
import {
  describe,
  it,
  beforeEach
} from 'mocha';
import { initialize } from 'ember-responsive-image/instance-initializers/responsive-meta';

describe('ResponsiveMetaInstanceInitializer', function() {
  let appInstance;

  beforeEach(function() {
    run(function() {
      const application = Application.create();
      appInstance = application.buildInstance();
    });
  });

  // Replace this with your real tests.
  it('works', function() {
    initialize(appInstance);

    // you would normally confirm the results of the initializer here
    expect(true).to.be.ok;
  });
});
