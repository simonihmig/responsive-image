import { module, test } from 'qunit';
import {
  setup,
  visit /* mockServer */,
} from 'ember-cli-fastboot-testing/test-support';

module('FastBoot | Netlify', function (hooks) {
  setup(hooks);

  test('it renders an image', async function (assert) {
    await visit('/netlify');

    assert.dom('img[data-test-image]').exists();
    assert
      .dom('img[data-test-image]')
      .hasAttribute(
        'src',
        'https://responsive-image.dev/.netlify/images?url=aurora-original.jpg&w=320',
      );
  });
});
