import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import responsiveImageResolve from '@responsive-image/ember/helpers/responsive-image-resolve';
import testImage from 'ember-test-app/images/aurora.jpg?&w=640;2048&responsive';

module('Helper: responsive-image-resolve', function (hooks) {
  setupRenderingTest(hooks);

  test('works without size', async function (assert) {
    await render(
      <template>
        <h1>{{responsiveImageResolve testImage}}</h1>
      </template>,
    );
    assert.dom('h1').hasText(new RegExp('/assets/aurora-2048w(-\\w+)?.jpg'));
  });

  test('supports sidth', async function (assert) {
    await render(
      <template>
        <h1>{{responsiveImageResolve testImage width=2048}}</h1>
      </template>,
    );

    assert.dom('h1').hasText(new RegExp('/assets/aurora-2048w(-\\w+)?.jpg'));
  });

  test('supports size', async function (assert) {
    await render(
      <template>
        <h1>{{responsiveImageResolve testImage size=10}}</h1>
      </template>,
    );

    assert.dom('h1').hasText(new RegExp('/assets/aurora-640w(-\\w+)?.jpg'));
  });

  test('supports format', async function (assert) {
    await render(
      <template>
        <h1>{{responsiveImageResolve testImage format="webp"}}</h1>
      </template>,
    );

    assert.dom('h1').hasText(new RegExp('/assets/aurora-2048w(-\\w+)?.webp'));
  });
});
