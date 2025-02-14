import { module, test } from 'qunit';
import {
  setup,
  visit /* mockServer */,
} from 'ember-cli-fastboot-testing/test-support';

module('FastBoot | Cloudinary', function (hooks) {
  setup(hooks);

  test('it renders an image', async function (assert) {
    await visit('/cloudinary');

    assert.dom('img[data-test-image]').exists();
    assert
      .dom('img[data-test-image]')
      .hasAttribute(
        'src',
        'https://res.cloudinary.com/responsive-image/image/upload/w_320,c_limit,q_auto/aurora-original_w0sk6h.jpeg',
      );
  });
});
