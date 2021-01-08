import { render } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

module('Helper: ResponsiveImageResolve', function (hooks) {
  setupRenderingTest(hooks);

  test('works without size', async function (assert) {
    await render(hbs`<h1>{{responsive-image-resolve "test.png"}}</h1>`);
    assert
      .dom('h1')
      .hasText(
        '/assets/images/responsive/test100w-00e24234f1b58e32b935b1041432916f.png'
      );
  });

  test('is size aware', async function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    service.set('physicalWidth', 100);
    await render(hbs`<h1>{{responsive-image-resolve "test.png" 45}}</h1>`);

    assert
      .dom('h1')
      .hasText(
        '/assets/images/responsive/test50w-00e24234f1b58e32b935b1041432916f.png'
      );
  });
});
