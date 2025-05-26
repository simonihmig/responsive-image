import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import responsiveImageFastly from '@responsive-image/ember/helpers/responsive-image-fastly';
import type { ImageData } from '@responsive-image/ember';

module('Integration | Helper | responsive-image-fastly', function (hooks) {
  setupRenderingTest(hooks);

  let data: ImageData | undefined;
  const dump = (argument: ImageData) => {
    data = argument;
  };

  test('it supports default image types', async function (assert) {
    await render(
      <template>{{dump (responsiveImageFastly "image.webp")}}</template>,
    );

    assert.deepEqual(data?.imageTypes, ['webp']);
  });

  test('it returns correct upload image URLs', async function (assert) {
    await render(
      <template>{{dump (responsiveImageFastly "image.webp")}}</template>,
    );

    assert.strictEqual(
      data?.imageUrlFor(100, 'avif'),
      'https://www.fastly.io/image.webp?format=avif&width=100',
    );
  });
});
