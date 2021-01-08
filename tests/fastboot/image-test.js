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
        '/assets/images/responsive/test640w-00e24234f1b58e32b935b1041432916f.png'
      );
  });
});
