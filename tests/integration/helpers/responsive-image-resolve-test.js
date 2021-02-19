import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Helper: ResponsiveImageResolve', function (hooks) {
  setupRenderingTest(hooks);

  test('works without size', async function (assert) {
    await render(
      hbs`<h1>{{responsive-image-resolve "assets/images/tests/test.png"}}</h1>`
    );
    assert.dom('h1').hasText('/assets/images/tests/test640w.png');
  });

  test('is size aware', async function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    service.set('physicalWidth', 100);
    await render(
      hbs`<h1>{{responsive-image-resolve "assets/images/tests/test.png" 45}}</h1>`
    );

    assert.dom('h1').hasText('/assets/images/tests/test50w.png');
  });
});
