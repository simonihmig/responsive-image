/* jshint expr:true */
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import ResponsiveBaseMixin from 'ember-responsive-image/mixins/responsive-base';

module('ResponsiveBaseMixin', function () {
  // Replace this with your real tests.
  test('works', function (assert) {
    let ResponsiveBaseObject = EmberObject.extend(ResponsiveBaseMixin);
    let subject = ResponsiveBaseObject.create();
    assert.ok(subject);
  });
});
