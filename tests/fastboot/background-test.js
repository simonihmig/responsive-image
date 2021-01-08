import { module, test } from 'qunit';
import {
  setup,
  visit /* mockServer */,
} from 'ember-cli-fastboot-testing/test-support';

module('FastBoot | background', function (hooks) {
  setup(hooks);

  test('it renders a background image', async function (assert) {
    await visit('/background');

    assert.dom('div.bg').exists();
    assert
      .dom('div.bg')
      .hasAttribute(
        'style',
        "background-image: url('/assets/images/responsive/test640w-00e24234f1b58e32b935b1041432916f.png');"
      );
  });
});
