import { module, test } from 'qunit';
import {
  setup,
  visit /* mockServer */,
} from 'ember-cli-fastboot-testing/test-support';

module('FastBoot | Imgix', function (hooks) {
  setup(hooks);

  test('it renders an image', async function (assert) {
    await visit('/imgix');

    assert.dom('img[data-test-image]').exists();
    assert
      .dom('img[data-test-image]')
      .hasAttribute(
        'src',
        'https://responsive-image.imgix.net/aurora-original.jpg?auto=format&w=320&fit=max',
      );
  });
});
