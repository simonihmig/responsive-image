import { fastly } from '@responsive-image/cdn';
import { module, test } from 'qunit';

import responsiveImageFastly from '../../../src/helpers/responsive-image-fastly.ts';

module('Integration | Helper | responsive-image-fastly', function () {
  test('it re-exports fastly provider from cdn package', function (assert) {
    assert.strictEqual(responsiveImageFastly, fastly);
  });
});
