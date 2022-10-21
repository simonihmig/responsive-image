import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { hbs } from 'ember-cli-htmlbars';
import ResponsiveImageService from '@ember-responsive-image/core/services/responsive-image';

module('Helper: ResponsiveImageResolve', function (hooks) {
  setupRenderingTest(hooks);

  test('works without size', async function (assert) {
    await render(
      hbs`<h1>{{responsive-image-resolve "assets/images/tests/test.png"}}</h1>`
    );
    assert
      .dom('h1')
      .hasText(new RegExp('/assets/images/tests/test640w(-\\w+)?.png'));
  });

  test('supports size', async function (assert) {
    const service = this.owner.lookup(
      'service:responsive-image'
    ) as ResponsiveImageService;
    service.set('physicalWidth', 100);
    await render(
      hbs`<h1>{{responsive-image-resolve "assets/images/tests/test.png" size=45}}</h1>`
    );

    assert
      .dom('h1')
      .hasText(new RegExp('/assets/images/tests/test50w(-\\w+)?.png'));
  });

  test('supports format', async function (assert) {
    await render(
      hbs`<h1>{{responsive-image-resolve "assets/images/tests/test.png" format="webp"}}</h1>`
    );

    assert
      .dom('h1')
      .hasText(new RegExp('/assets/images/tests/test640w(-\\w+)?.webp'));
  });
});
