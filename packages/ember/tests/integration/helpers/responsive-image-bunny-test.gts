import { bunny } from '@responsive-image/cdn';
import { module, test } from 'qunit';

import responsiveImagebunny from '../../../src/helpers/responsive-image-bunny.ts';

module('Integration | Helper | responsive-image-bunny', function () {
  test('it re-exports bunny provider from cdn package', function (assert) {
    assert.strictEqual(responsiveImagebunny, bunny);
  });
});
