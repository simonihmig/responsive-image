import { module, test } from 'qunit';
import {
  setup,
  visit /* mockServer */,
} from 'ember-cli-fastboot-testing/test-support';

// FastBoot does not not suppport Ember 5 yet :-(
module('FastBoot | Netlify', function (hooks) {
  setup(hooks);

  test('it renders an image', async function (assert) {
    await visit('/netlify');

    assert.dom('img[data-test-image]').exists();
    assert
      .dom('img[data-test-image]')
      .hasAttribute(
        'src',
        'https://responsive-image.dev/.netlify/images?url=%2Faurora-home.webp&w=320&fm=jpg',
      );
  });
});
