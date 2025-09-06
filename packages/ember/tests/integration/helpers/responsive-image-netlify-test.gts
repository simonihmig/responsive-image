import { netlify } from '@responsive-image/cdn';
import { module, test } from 'qunit';

import responsiveImagenetlify from '../../../src/helpers/responsive-image-netlify.ts';

module('Integration | Helper | responsive-image-netlify', function () {
  test('it re-exports netlify provider from cdn package', function (assert) {
    assert.strictEqual(responsiveImagenetlify, netlify);
  });
});
