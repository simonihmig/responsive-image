import { module, test } from 'qunit';
import {
  setup,
  visit /* mockServer */,
} from 'ember-cli-fastboot-testing/test-support';

module('FastBoot | Fastly', function (hooks) {
  setup(hooks);

  test('it renders an image', async function (assert) {
    await visit('/fastly');

    assert.dom('img[data-test-image]').exists();
    assert
      .dom('img[data-test-image]')
      .hasAttribute(
        'src',
        'https://www.fastly.io/image.webp?format=auto&width=320',
      );
  });
});
