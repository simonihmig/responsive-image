import { ImageOutputResult } from '@ember-responsive-image/core/types';
import { findMatchingImage } from '@ember-responsive-image/core/utils/utils';
import { module, test } from 'qunit';

module('Unit | Utility | utils', function (hooks) {
  module('findMatchingImage', function () {
    test('find matching image', function (assert) {
      const images: ImageOutputResult[] = [
        { url: 'jpg100', width: 100, format: 'jpeg' },
        { url: 'jpg200', width: 200, format: 'jpeg' },
        { url: 'jpg300', width: 300, format: 'jpeg' },
        { url: 'jpg400', width: 400, format: 'jpeg' },
        { url: 'webp100', width: 100, format: 'webp' },
        { url: 'webp200', width: 200, format: 'webp' },
        { url: 'webp300', width: 300, format: 'webp' },
        { url: 'webp400', width: 400, format: 'webp' },
      ];

      assert.strictEqual(findMatchingImage(images, 200, 'jpeg')?.url, 'jpg200');
      assert.strictEqual(findMatchingImage(images, 201, 'jpeg')?.url, 'jpg300');
      assert.strictEqual(
        findMatchingImage(images, 200, 'webp')?.url,
        'webp200'
      );
    });
  });
});
