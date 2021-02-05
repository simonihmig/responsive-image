import { render } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration: Responsive Image Component', function (hooks) {
  setupRenderingTest(hooks);

  module('responsive layout', function () {
    test('it has responsive layout by default', async function (assert) {
      await render(hbs`<ResponsiveImage @image="assets/images/test.png"/>`);

      assert.dom('img').hasClass('eri-responsive');
      assert.dom('img').hasNoClass('eri-fixed');
    });

    test('it renders width and height attributes', async function (assert) {
      await render(hbs`<ResponsiveImage @image="assets/images/test.png"/>`);

      assert.dom('img').hasAttribute('width', '640');
      assert.dom('img').hasAttribute('height', '320');
    });

    test('it renders the correct sourceset with width descriptors', async function (assert) {
      await render(hbs`<ResponsiveImage @image="assets/images/test.png"/>`);
      // png
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute('srcset', new RegExp('/assets/images/test640w.png 640w'));
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute('srcset', new RegExp('/assets/images/test100w.png 100w'));
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute('srcset', new RegExp('/assets/images/test50w.png 50w'));

      // webp
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/test640w.webp 640w')
        );
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/test100w.webp 100w')
        );
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

    test('it renders the fallback src next to needed display size', async function (assert) {
      let service = this.owner.lookup('service:responsive-image');
      service.set('physicalWidth', 45);
      await render(hbs`<ResponsiveImage @image="assets/images/test.png"/>`);
      assert.dom('img').hasAttribute('src', '/assets/images/test50w.png');
      service.set('physicalWidth', 51);
      await render(hbs`<ResponsiveImage @image="assets/images/test.png"/>`);
      assert.dom('img').hasAttribute('src', '/assets/images/test100w.png');
      service.set('physicalWidth', 9);
      await render(hbs`<ResponsiveImage @image="assets/images/small.png"/>`);
      assert.dom('img').hasAttribute('src', '/assets/images/small10w.png');
      service.set('physicalWidth', 11);
      await render(hbs`<ResponsiveImage @image="assets/images/small.png"/>`);
      assert.dom('img').hasAttribute('src', '/assets/images/small25w.png');
      service.set('physicalWidth', 45);
      await render(
        hbs`<ResponsiveImage @image="assets/images/recursive/dir/test.png"/>`
      );
      assert
        .dom('img')
        .hasAttribute('src', '/assets/images/recursive/dir/test50w.png');
      service.set('physicalWidth', 51);
      await render(
        hbs`<ResponsiveImage @image="assets/images/recursive/dir/test.png"/>`
      );
      assert
        .dom('img')
        .hasAttribute('src', '/assets/images/recursive/dir/test100w.png');
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
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute('sizes', '(max-width: 767px) 100vw, 50vw');
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute('sizes', '(max-width: 767px) 100vw, 50vw');
    });
  });

  module('fixed layout', function () {
    test('it has fixed layout when width or height is provided', async function (assert) {
      await render(
        hbs`<ResponsiveImage @image="assets/images/test.png" @width={{100}}/>`
      );

      assert.dom('img').hasClass('eri-fixed');
      assert.dom('img').hasNoClass('eri-responsive');

      await render(
        hbs`<ResponsiveImage @image="assets/images/test.png" @height={{100}}/>`
      );

      assert.dom('img').hasClass('eri-fixed');
      assert.dom('img').hasNoClass('eri-responsive');
    });

    test('it renders width and height when given', async function (assert) {
      await render(
        hbs`<ResponsiveImage @image="assets/images/test.png" @width={{150}} @height={{50}} />`
      );

      assert.dom('img').hasAttribute('width', '150');
      assert.dom('img').hasAttribute('height', '50');
    });

    test('it renders height when width is given according to aspect ratio', async function (assert) {
      await render(
        hbs`<ResponsiveImage @image="assets/images/test.png" @width={{150}} />`
      );

      assert.dom('img').hasAttribute('width', '150');
      assert.dom('img').hasAttribute('height', '75');
    });

    test('it renders width when height is given according to aspect ratio', async function (assert) {
      await render(
        hbs`<ResponsiveImage @image="assets/images/test.png" @height={{100}} />`
      );

      assert.dom('img').hasAttribute('width', '200');
      assert.dom('img').hasAttribute('height', '100');
    });

    test('it renders the correct sourceset with pixel densities', async function (assert) {
      await render(
        hbs`<ResponsiveImage @width={{50}} @image="assets/images/test.png"/>`
      );
      // png
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute('srcset', new RegExp('/assets/images/test100w.png 2x'));
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute('srcset', new RegExp('/assets/images/test50w.png 1x'));

      // webp
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute('srcset', new RegExp('/assets/images/test100w.webp 2x'));
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute('srcset', new RegExp('/assets/images/test50w.webp 1x'));

      await render(
        hbs`<ResponsiveImage @width={{10}} @image="assets/images/small.png"/>`
      );
      // png
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute('srcset', new RegExp('/assets/images/small10w.png 1x'));
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute('srcset', new RegExp('/assets/images/small25w.png 2x'));

      // webp
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute('srcset', new RegExp('/assets/images/small10w.webp 1x'));
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute('srcset', new RegExp('/assets/images/small25w.webp 2x'));

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

    test('it renders the fallback src next to needed display size', async function (assert) {
      await render(
        hbs`<ResponsiveImage @width={{320}} @image="assets/images/test.png"/>`
      );
      assert.dom('img').hasAttribute('src', '/assets/images/test640w.png');

      await render(
        hbs`<ResponsiveImage @width={{101}} @image="assets/images/test.png"/>`
      );
      assert.dom('img').hasAttribute('src', '/assets/images/test640w.png');

      await render(
        hbs`<ResponsiveImage @width={{100}} @image="assets/images/test.png"/>`
      );
      assert.dom('img').hasAttribute('src', '/assets/images/test100w.png');

      await render(
        hbs`<ResponsiveImage @width={{51}} @image="assets/images/test.png"/>`
      );
      assert.dom('img').hasAttribute('src', '/assets/images/test100w.png');

      await render(
        hbs`<ResponsiveImage @width={{50}} @image="assets/images/test.png"/>`
      );
      assert.dom('img').hasAttribute('src', '/assets/images/test50w.png');
    });
  });

  test('it renders a source for every format', async function (assert) {
    await render(hbs`<ResponsiveImage @image="assets/images/test.png"/>`);

    assert.dom('picture').exists({ count: 1 });
    assert.dom('picture source').exists({ count: 2 });
    assert.dom('picture source[type="image/png"]').exists({ count: 1 });
    assert.dom('picture source[type="image/webp"]').exists({ count: 1 });
  });

  test('it loads lazily by default', async function (assert) {
    await render(hbs`<ResponsiveImage @image="assets/images/test.png" />`);
    assert.dom('img').hasAttribute('loading', 'lazy');
  });

  test('it can optionally load eager', async function (assert) {
    await render(
      hbs`<ResponsiveImage @image="assets/images/test.png" loading="eager" />`
    );
    assert.dom('img').hasAttribute('loading', 'eager');
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
