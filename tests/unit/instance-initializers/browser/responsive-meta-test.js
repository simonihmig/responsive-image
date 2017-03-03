/* jshint expr:true */
import { expect } from 'chai';
import {
  describe,
  it,
  beforeEach
} from 'mocha';
import Ember from 'ember';
import { initialize } from 'ember-responsive-image/instance-initializers/browser/responsive-meta';

describe('ResponsiveMetaInstanceInitializer', function() {
  let appInstance;

  beforeEach(function() {
    Ember.run(function() {
      const application = Ember.Application.create();
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
