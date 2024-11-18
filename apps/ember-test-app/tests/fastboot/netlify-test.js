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
      .hasAttribute('src', new RegExp('https://res.cloudinary.com/kaliber5/'));
  });
});
