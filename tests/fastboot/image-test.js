import { module, test } from 'qunit';
import {
  setup,
  visit /* mockServer */,
} from 'ember-cli-fastboot-testing/test-support';

module('FastBoot | image', function (hooks) {
  setup(hooks);

  test('it renders an image', async function (assert) {
    await visit('/image');

    assert.dom('img[data-test-simple-image]').exists();
    assert
      .dom('img[data-test-simple-image]')
      .hasAttribute('src', '/assets/images/tests/test640w.png');
  });

  test('it renders lqip color', async function (assert) {
    await visit('/image');

    assert.dom('img[data-test-lqip-image=color]').exists();
    assert
      .dom('img[data-test-lqip-image=color]')
      .hasStyle({ 'background-color': 'rgb(88, 72, 56)' });
  });

  test('it renders lqip inline', async function (assert) {
    await visit('/image');

    assert.dom('img[data-test-lqip-image=inline]').exists();
    assert
      .dom('img[data-test-lqip-image=inline]')
      .hasStyle({ 'background-size': 'cover' });
    assert.ok(
      window
        .getComputedStyle(
          document.querySelector('img[data-test-lqip-image=inline]')
        )
        .backgroundImage?.match(/data:image\/svg/),
      'it has a background SVG'
    );
  });
});
