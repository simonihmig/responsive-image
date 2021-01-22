import { module, test } from 'qunit';
import {
  setup,
  visit /* mockServer */,
} from 'ember-cli-fastboot-testing/test-support';

module('FastBoot | image', function (hooks) {
  setup(hooks);

  test('it renders an image', async function (assert) {
    await visit('/image');

    assert.dom('img').exists();
    assert
      .dom('img')
      .hasAttribute(
        'src',
        '/assets/images/test640w.png'
      );
  });
});
