import { find, render } from '@ember/test-helpers';
import { setupResponsiveImage } from 'ember-responsive-image/test-support';
import { setupRenderingTest } from 'ember-qunit';
import { test, module } from 'qunit';
import hbs from 'htmlbars-inline-precompile';

module('Integration: ResponsiveBackgroundComponent', function (hooks) {
  setupRenderingTest(hooks);
  setupResponsiveImage(hooks);

  test('renders with backround url', async function (assert) {
    await render(hbs`<ResponsiveBackground @image="test.png"/>`);
    assert.equal(
      find('div[style]').getAttribute('style'),
      "background-image: url('/assets/images/responsive/test640w-00e24234f1b58e32b935b1041432916f.png');"
    );
  });

  test('it renders the background url next to needed display size', async function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    service.set('physicalWidth', 45);
    await render(hbs`<ResponsiveBackground @image="test.png"/>`);
    assert.equal(
      find('div[style]').getAttribute('style'),
      "background-image: url('/assets/images/responsive/test50w-00e24234f1b58e32b935b1041432916f.png');"
    );
    service.set('physicalWidth', 51);
    await render(hbs`<ResponsiveBackground @image="test.png"/>`);
    assert.equal(
      find('div[style]').getAttribute('style'),
      "background-image: url('/assets/images/responsive/test100w-00e24234f1b58e32b935b1041432916f.png');"
    );
  });

  test('it renders the background url next to given render size', async function (assert) {
    this.owner.lookup('service:responsive-image').set('physicalWidth', 100);
    this.set('size', 45);
    await render(
      hbs`<ResponsiveBackground @image="test.png" @size={{this.size}}/>`
    );
    assert.equal(
      find('div[style]').getAttribute('style'),
      "background-image: url('/assets/images/responsive/test50w-00e24234f1b58e32b935b1041432916f.png');"
    );
    this.set('size', 51);
    assert.equal(
      find('div[style]').getAttribute('style'),
      "background-image: url('/assets/images/responsive/test100w-00e24234f1b58e32b935b1041432916f.png');"
    );
  });
});
