/* jshint expr:true */
import { expect } from 'chai';
import {
  setupTest,
  it
} from 'ember-mocha';
import {
  describe
} from 'mocha';

describe(
  'ResponsiveImageService',
  function() {
    setupTest('service:responsive-image', {
    });
    // Replace this with your real tests.
    it('exists', function() {
      let service = this.subject();
      expect(service).to.be.ok;
    });
  }
);
