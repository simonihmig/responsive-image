import { autorender } from '@responsive-image/cdn';
import { module, test } from 'qunit';

import responsiveImageAutorender from '../../../src/helpers/responsive-image-autorender.ts';

module('Integration | Helper | responsive-image-autorender', function () {
  test('it re-exports autorender provider from cdn package', function (assert) {
    assert.strictEqual(responsiveImageAutorender, autorender);
  });
});
