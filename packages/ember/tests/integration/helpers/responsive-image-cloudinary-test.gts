import { cloudinary } from '@responsive-image/cdn';
import { module, test } from 'qunit';

import responsiveImageCloudinary from '../../../src/helpers/responsive-image-cloudinary.ts';

module('Integration | Helper | responsive-image-cloudinary', function () {
  test('it re-exports cloudinary provider from cdn package', function (assert) {
    assert.strictEqual(responsiveImageCloudinary, cloudinary);
  });
});
