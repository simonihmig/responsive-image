import { resolveImage } from '@responsive-image/core';
import { module, test } from 'qunit';

import responsiveImageResolve from '../../../src/helpers/responsive-image-resolve.ts';

module('Helper: responsive-image-resolve', function () {
  test('it re-exports resolve function from code package', function (assert) {
    assert.strictEqual(responsiveImageResolve, resolveImage);
  });
});
