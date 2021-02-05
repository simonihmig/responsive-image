import { find, render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { test, module } from 'qunit';

module('Integration: Responsive Image Component', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders a source for every format', async function (assert) {
    await render(hbs`<ResponsiveImage @image="assets/images/test.png"/>`);

    assert.dom('picture').exists({ count: 1 });
    assert.dom('picture source').exists({ count: 2 });
    assert.dom('picture source[type="image/png"]').exists({ count: 1 });
    assert.dom('picture source[type="image/webp"]').exists({ count: 1 });
  });

  test('it renders the correct sourceset', async function (assert) {
    await render(hbs`<ResponsiveImage @image="assets/images/test.png"/>`);
    // png
    assert
      .dom('picture source[type="image/png"]')
      .hasAttribute('srcset', new RegExp('/assets/images/test100w.png 100w'));
    assert
      .dom('picture source[type="image/png"]')
      .hasAttribute('srcset', new RegExp('/assets/images/test50w.png 50w'));

    // webp
    assert
      .dom('picture source[type="image/webp"]')
      .hasAttribute('srcset', new RegExp('/assets/images/test100w.webp 100w'));
    assert
      .dom('picture source[type="image/webp"]')
      .hasAttribute('srcset', new RegExp('/assets/images/test50w.webp 50w'));

    await render(hbs`<ResponsiveImage @image="assets/images/small.png"/>`);
    // png
    assert
      .dom('picture source[type="image/png"]')
      .hasAttribute('srcset', new RegExp('/assets/images/small10w.png 10w'));
    assert
      .dom('picture source[type="image/png"]')
      .hasAttribute('srcset', new RegExp('/assets/images/small25w.png 25w'));

    // webp
    assert
      .dom('picture source[type="image/webp"]')
      .hasAttribute('srcset', new RegExp('/assets/images/small10w.webp 10w'));
    assert
      .dom('picture source[type="image/webp"]')
      .hasAttribute('srcset', new RegExp('/assets/images/small25w.webp 25w'));

    await render(hbs`<ResponsiveImage @image="assets/images/small.png"/>`);
    // png
    assert
      .dom('picture source[type="image/png"]')
      .hasAttribute('srcset', new RegExp('/assets/images/small10w.png 10w'));
    assert
      .dom('picture source[type="image/png"]')
      .hasAttribute('srcset', new RegExp('/assets/images/small25w.png 25w'));

    // webp
    assert
      .dom('picture source[type="image/webp"]')
      .hasAttribute('srcset', new RegExp('/assets/images/small10w.webp 10w'));
    assert
      .dom('picture source[type="image/webp"]')
      .hasAttribute('srcset', new RegExp('/assets/images/small25w.webp 25w'));

    await render(
      hbs`<ResponsiveImage @image="assets/images/recursive/dir/test.png"/>`
    );
    // png
    assert
      .dom('picture source[type="image/png"]')
      .hasAttribute(
        'srcset',
        new RegExp('/assets/images/recursive/dir/test100w.png 100w')
      );
    assert
      .dom('picture source[type="image/png"]')
      .hasAttribute(
        'srcset',
        new RegExp('/assets/images/recursive/dir/test50w.png 50w')
      );

    // webp
    assert
      .dom('picture source[type="image/webp"]')
      .hasAttribute(
        'srcset',
        new RegExp('/assets/images/recursive/dir/test100w.webp 100w')
      );
    assert
      .dom('picture source[type="image/webp"]')
      .hasAttribute(
        'srcset',
        new RegExp('/assets/images/recursive/dir/test50w.webp 50w')
      );
  });

  test('it renders a given size as sizes', async function (assert) {
    await render(
      hbs`<ResponsiveImage @image="assets/images/test.png" @size="40"/>`
    );
    assert
      .dom('picture source[type="image/png"]')
      .hasAttribute('sizes', '40vw');
    assert
      .dom('picture source[type="image/webp"]')
      .hasAttribute('sizes', '40vw');
  });

  test('it renders with given sizes', async function (assert) {
    await render(
      hbs`<ResponsiveImage @image="assets/images/test.png" @sizes="(max-width: 767px) 100vw, 50vw"/>`
    );
    assert.equal(
      find('picture source[type="image/png"]').getAttribute('sizes'),
      '(max-width: 767px) 100vw, 50vw'
    );
    assert.equal(
      find('picture source[type="image/webp"]').getAttribute('sizes'),
      '(max-width: 767px) 100vw, 50vw'
    );
  });

  test('it renders the fallback src next to needed display size', async function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    service.set('physicalWidth', 45);
    await render(hbs`<ResponsiveImage @image="assets/images/test.png"/>`);
    assert.equal(find('img').getAttribute('src'), '/assets/images/test50w.png');
    service.set('physicalWidth', 51);
    await render(hbs`<ResponsiveImage @image="assets/images/test.png"/>`);
    assert.equal(
      find('img').getAttribute('src'),
      '/assets/images/test100w.png'
    );
    service.set('physicalWidth', 9);
    await render(hbs`<ResponsiveImage @image="assets/images/small.png"/>`);
    assert.equal(
      find('img').getAttribute('src'),
      '/assets/images/small10w.png'
    );
    service.set('physicalWidth', 11);
    await render(hbs`<ResponsiveImage @image="assets/images/small.png"/>`);
    assert.equal(
      find('img').getAttribute('src'),
      '/assets/images/small25w.png'
    );
    service.set('physicalWidth', 45);
    await render(
      hbs`<ResponsiveImage @image="assets/images/recursive/dir/test.png"/>`
    );
    assert.equal(
      find('img').getAttribute('src'),
      '/assets/images/recursive/dir/test50w.png'
    );
    service.set('physicalWidth', 51);
    await render(
      hbs`<ResponsiveImage @image="assets/images/recursive/dir/test.png"/>`
    );
    assert.equal(
      find('img').getAttribute('src'),
      '/assets/images/recursive/dir/test100w.png'
    );
  });

  test('it renders arbitrary HTML attributes', async function (assert) {
    await render(
      hbs`<ResponsiveImage @image="assets/images/test.png" class="foo" role="button" data-test-image />`
    );
    assert.dom('img').hasClass('foo');
    assert.dom('img').hasAttribute('role', 'button');
    assert.dom('img').hasAttribute('data-test-image');
  });
});
