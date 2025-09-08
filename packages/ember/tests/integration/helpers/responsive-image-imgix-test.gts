import { imgix } from '@responsive-image/cdn';
import { module, test } from 'qunit';

import responsiveImageimgix from '../../../src/helpers/responsive-image-imgix.ts';

module('Integration | Helper | responsive-image-imgix', function () {
  test('it re-exports imgix provider from cdn package', function (assert) {
    assert.strictEqual(responsiveImageimgix, imgix);
  });
});
