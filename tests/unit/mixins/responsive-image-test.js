/* jshint expr:true */
import EmberObject from '@ember/object';
import { module, test } from 'qunit';
import ResponsiveImageMixin from 'ember-responsive-image/mixins/responsive-image';

module('ResponsiveImageMixin', function () {
  // Replace this with your real tests.
  test('works', function (assert) {
    let ResponsiveImageObject = EmberObject.extend(ResponsiveImageMixin);
    let subject = ResponsiveImageObject.create();
    assert.ok(subject);
  });
});
