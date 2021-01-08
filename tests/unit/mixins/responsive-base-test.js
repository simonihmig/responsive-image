/* jshint expr:true */
import EmberObject from '@ember/object';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import ResponsiveBaseMixin from 'ember-responsive-image/mixins/responsive-base';

describe('ResponsiveBaseMixin', function () {
  // Replace this with your real tests.
  it('works', function () {
    let ResponsiveBaseObject = EmberObject.extend(ResponsiveBaseMixin);
    let subject = ResponsiveBaseObject.create();
    expect(subject).to.be.ok;
  });
});
