import { render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';

module('Integration: Responsive Image Component', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set('cacheBreaker', new Date().getTime());
  });

  module('responsive layout', function () {
    test('it has responsive layout by default', async function (assert) {
      await render(hbs`<ResponsiveImage @src="assets/images/tests/test.png"/>`);

      assert.dom('img').hasClass('eri-responsive');
      assert.dom('img').hasNoClass('eri-fixed');
    });

    test('handles absolute paths', async function (assert) {
      await render(
        hbs`<ResponsiveImage @src="/assets/images/tests/test.png"/>`
      );

      assert
        .dom('img')
        .hasAttribute(
          'src',
          new RegExp('^/assets/images/tests/test([0-9])+w(-\\w+)?.png')
        );
    });

    test('it renders width and height attributes', async function (assert) {
      await render(hbs`<ResponsiveImage @src="assets/images/tests/test.png"/>`);

      assert.dom('img').hasAttribute('width', '640');
      assert.dom('img').hasAttribute('height', '320');
    });

    test('it renders the correct sourceset with width descriptors', async function (assert) {
      await render(hbs`<ResponsiveImage @src="assets/images/tests/test.png"/>`);
      // png
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test640w(-\\w+)?.png 640w')
        );
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test100w(-\\w+)?.png 100w')
        );
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test50w(-\\w+)?.png 50w')
        );

      // webp
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test640w(-\\w+)?.webp 640w')
        );
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test100w(-\\w+)?.webp 100w')
        );
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test50w(-\\w+)?.webp 50w')
        );

      // avif
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test640w(-\\w+)?.avif 640w')
        );
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test100w(-\\w+)?.avif 100w')
        );
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test50w(-\\w+)?.avif 50w')
        );

      await render(
        hbs`<ResponsiveImage @src="assets/images/tests/small.png"/>`
      );
      // png
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/small10w(-\\w+)?.png 10w')
        );
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/small25w(-\\w+)?.png 25w')
        );

      // webp
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/small10w(-\\w+)?.webp 10w')
        );
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/small25w(-\\w+)?.webp 25w')
        );

      // avif
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/small10w(-\\w+)?.avif 10w')
        );
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/small25w(-\\w+)?.avif 25w')
        );

      await render(
        hbs`<ResponsiveImage @src="assets/images/tests/recursive/dir/test.png"/>`
      );
      // png
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute(
          'srcset',
          new RegExp(
            '/assets/images/tests/recursive/dir/test100w(-\\w+)?.png 100w'
          )
        );
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute(
          'srcset',
          new RegExp(
            '/assets/images/tests/recursive/dir/test50w(-\\w+)?.png 50w'
          )
        );

      // webp
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp(
            '/assets/images/tests/recursive/dir/test100w(-\\w+)?.webp 100w'
          )
        );
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp(
            '/assets/images/tests/recursive/dir/test50w(-\\w+)?.webp 50w'
          )
        );

      // avif
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          'srcset',
          new RegExp(
            '/assets/images/tests/recursive/dir/test100w(-\\w+)?.avif 100w'
          )
        );
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          'srcset',
          new RegExp(
            '/assets/images/tests/recursive/dir/test50w(-\\w+)?.avif 50w'
          )
        );
    });

    test('it renders the fallback src next to needed display size', async function (assert) {
      let service = this.owner.lookup('service:responsive-image');
      service.set('physicalWidth', 45);
      await render(hbs`<ResponsiveImage @src="assets/images/tests/test.png"/>`);
      assert
        .dom('img')
        .hasAttribute(
          'src',
          new RegExp('/assets/images/tests/test50w(-\\w+)?.png')
        );
      service.set('physicalWidth', 51);
      await render(hbs`<ResponsiveImage @src="assets/images/tests/test.png"/>`);
      assert
        .dom('img')
        .hasAttribute(
          'src',
          new RegExp('/assets/images/tests/test100w(-\\w+)?.png')
        );
      service.set('physicalWidth', 9);
      await render(
        hbs`<ResponsiveImage @src="assets/images/tests/small.png"/>`
      );
      assert
        .dom('img')
        .hasAttribute(
          'src',
          new RegExp('/assets/images/tests/small10w(-\\w+)?.png')
        );
      service.set('physicalWidth', 11);
      await render(
        hbs`<ResponsiveImage @src="assets/images/tests/small.png"/>`
      );
      assert
        .dom('img')
        .hasAttribute(
          'src',
          new RegExp('/assets/images/tests/small25w(-\\w+)?.png')
        );
      service.set('physicalWidth', 45);
      await render(
        hbs`<ResponsiveImage @src="assets/images/tests/recursive/dir/test.png"/>`
      );
      assert
        .dom('img')
        .hasAttribute(
          'src',
          new RegExp('/assets/images/tests/recursive/dir/test50w(-\\w+)?.png')
        );
      service.set('physicalWidth', 51);
      await render(
        hbs`<ResponsiveImage @src="assets/images/tests/recursive/dir/test.png"/>`
      );
      assert
        .dom('img')
        .hasAttribute(
          'src',
          new RegExp('/assets/images/tests/recursive/dir/test100w(-\\w+)?.png')
        );
    });

    test('it renders a given size as sizes', async function (assert) {
      await render(
        hbs`<ResponsiveImage @src="assets/images/tests/test.png" @size="40"/>`
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
        hbs`<ResponsiveImage @src="assets/images/tests/test.png" @sizes="(max-width: 767px) 100vw, 50vw"/>`
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
        hbs`<ResponsiveImage @src="assets/images/tests/test.png" @width={{100}}/>`
      );

      assert.dom('img').hasClass('eri-fixed');
      assert.dom('img').hasNoClass('eri-responsive');

      await render(
        hbs`<ResponsiveImage @src="assets/images/tests/test.png" @height={{100}}/>`
      );

      assert.dom('img').hasClass('eri-fixed');
      assert.dom('img').hasNoClass('eri-responsive');
    });

    test('it renders width and height when given', async function (assert) {
      await render(
        hbs`<ResponsiveImage @src="assets/images/tests/test.png" @width={{150}} @height={{50}} />`
      );

      assert.dom('img').hasAttribute('width', '150');
      assert.dom('img').hasAttribute('height', '50');
    });

    test('it renders height when width is given according to aspect ratio', async function (assert) {
      await render(
        hbs`<ResponsiveImage @src="assets/images/tests/test.png" @width={{150}} />`
      );

      assert.dom('img').hasAttribute('width', '150');
      assert.dom('img').hasAttribute('height', '75');
    });

    test('it renders width when height is given according to aspect ratio', async function (assert) {
      await render(
        hbs`<ResponsiveImage @src="assets/images/tests/test.png" @height={{100}} />`
      );

      assert.dom('img').hasAttribute('width', '200');
      assert.dom('img').hasAttribute('height', '100');
    });

    test('it renders the correct sourceset with pixel densities', async function (assert) {
      await render(
        hbs`<ResponsiveImage @width={{50}} @src="assets/images/tests/test.png"/>`
      );
      // png
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test100w(-\\w+)?.png 2x')
        );
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test50w(-\\w+)?.png 1x')
        );

      // webp
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test100w(-\\w+)?.webp 2x')
        );
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test50w(-\\w+)?.webp 1x')
        );

      // avif
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test100w(-\\w+)?.avif 2x')
        );
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/test50w(-\\w+)?.avif 1x')
        );

      await render(
        hbs`<ResponsiveImage @width={{10}} @src="assets/images/tests/small.png"/>`
      );
      // png
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/small10w(-\\w+)?.png 1x')
        );
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/small25w(-\\w+)?.png 2x')
        );

      // webp
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/small10w(-\\w+)?.webp 1x')
        );
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/small25w(-\\w+)?.webp 2x')
        );

      // avif
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/small10w(-\\w+)?.avif 1x')
        );
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          'srcset',
          new RegExp('/assets/images/tests/small25w(-\\w+)?.avif 2x')
        );

      await render(
        hbs`<ResponsiveImage @src="assets/images/tests/recursive/dir/test.png"/>`
      );
      // png
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute(
          'srcset',
          new RegExp(
            '/assets/images/tests/recursive/dir/test100w(-\\w+)?.png 100w'
          )
        );
      assert
        .dom('picture source[type="image/png"]')
        .hasAttribute(
          'srcset',
          new RegExp(
            '/assets/images/tests/recursive/dir/test50w(-\\w+)?.png 50w'
          )
        );

      // webp
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp(
            '/assets/images/tests/recursive/dir/test100w(-\\w+)?.webp 100w'
          )
        );
      assert
        .dom('picture source[type="image/webp"]')
        .hasAttribute(
          'srcset',
          new RegExp(
            '/assets/images/tests/recursive/dir/test50w(-\\w+)?.webp 50w'
          )
        );

      // avif
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          'srcset',
          new RegExp(
            '/assets/images/tests/recursive/dir/test100w(-\\w+)?.avif 100w'
          )
        );
      assert
        .dom('picture source[type="image/avif"]')
        .hasAttribute(
          'srcset',
          new RegExp(
            '/assets/images/tests/recursive/dir/test50w(-\\w+)?.avif 50w'
          )
        );
    });

    test('it renders the fallback src next to needed display size', async function (assert) {
      await render(
        hbs`<ResponsiveImage @width={{320}} @src="assets/images/tests/test.png"/>`
      );
      assert
        .dom('img')
        .hasAttribute(
          'src',
          new RegExp('/assets/images/tests/test640w(-\\w+)?.png')
        );

      await render(
        hbs`<ResponsiveImage @width={{101}} @src="assets/images/tests/test.png"/>`
      );
      assert
        .dom('img')
        .hasAttribute(
          'src',
          new RegExp('/assets/images/tests/test640w(-\\w+)?.png')
        );

      await render(
        hbs`<ResponsiveImage @width={{100}} @src="assets/images/tests/test.png"/>`
      );
      assert
        .dom('img')
        .hasAttribute(
          'src',
          new RegExp('/assets/images/tests/test100w(-\\w+)?.png')
        );

      await render(
        hbs`<ResponsiveImage @width={{51}} @src="assets/images/tests/test.png"/>`
      );
      assert
        .dom('img')
        .hasAttribute(
          'src',
          new RegExp('/assets/images/tests/test100w(-\\w+)?.png')
        );

      await render(
        hbs`<ResponsiveImage @width={{50}} @src="assets/images/tests/test.png"/>`
      );
      assert
        .dom('img')
        .hasAttribute(
          'src',
          new RegExp('/assets/images/tests/test50w(-\\w+)?.png')
        );
    });
  });

  module('LQIP', function () {
    module('inline', function () {
      test('it sets LQIP SVG as background', async function (assert) {
        let resolve;
        const waitUntilLoaded = new Promise((r) => {
          resolve = r;
        });
        this.onload = () => setTimeout(resolve, 0);

        await render(
          hbs`<ResponsiveImage @src="assets/images/tests/lqip/inline.jpg" @cacheBreaker={{this.cacheBreaker}} {{on "load" this.onload}}/>`
        );

        assert.ok(
          window
            .getComputedStyle(this.element.querySelector('img'))
            .backgroundImage?.match(/data:image\/svg/),
          'it has a background SVG'
        );
        assert.dom('img').hasStyle({ 'background-size': 'cover' });
        assert.ok(
          window.getComputedStyle(this.element.querySelector('img'))
            .backgroundImage?.length > 100,
          'the background SVG has a reasonable length'
        );

        await waitUntilLoaded;
        await settled();

        assert.equal(
          window.getComputedStyle(this.element.querySelector('img'))
            .backgroundImage,
          'none',
          'after image is loaded the background SVG is removed'
        );
      });
    });

    module('color', function () {
      test('it sets background-color', async function (assert) {
        let resolve;
        const waitUntilLoaded = new Promise((r) => {
          resolve = r;
        });
        this.onload = () => setTimeout(resolve, 0);

        await render(
          hbs`<ResponsiveImage @src="assets/images/tests/lqip/color.jpg" @cacheBreaker={{this.cacheBreaker}} {{on "load" this.onload}}/>`
        );

        assert.dom('img').hasStyle({ 'background-color': 'rgb(88, 72, 56)' });

        await waitUntilLoaded;
        await settled();

        assert.dom('img').hasStyle({ 'background-color': 'rgba(0, 0, 0, 0)' });
      });
    });

    module('blurhash', function () {
      test('it sets LQIP from blurhash as background', async function (assert) {
        let resolve;
        const waitUntilLoaded = new Promise((r) => {
          resolve = r;
        });
        this.onload = () => setTimeout(resolve, 0);

        await render(
          hbs`<ResponsiveImage @src="assets/images/tests/lqip/blurhash.jpg" @cacheBreaker={{this.cacheBreaker}} {{on "load" this.onload}}/>`
        );

        assert.ok(
          this.element
            .querySelector('img')
            .style.backgroundImage?.match(/data:image\/png/),
          'it has a background PNG'
        );
        assert.dom('img').hasStyle({ 'background-size': 'cover' });
        assert.ok(
          window.getComputedStyle(this.element.querySelector('img'))
            .backgroundImage?.length > 100,
          'the background SVG has a reasonable length'
        );

        await waitUntilLoaded;
        await settled();

        assert.equal(
          window.getComputedStyle(this.element.querySelector('img'))
            .backgroundImage,
          'none',
          'after image is loaded the background PNG is removed'
        );
      });
    });
  });

  test('it renders a source for every format', async function (assert) {
    await render(hbs`<ResponsiveImage @src="assets/images/tests/test.png"/>`);

    assert.dom('picture').exists({ count: 1 });
    assert.dom('picture source').exists({ count: 3 });
    assert.dom('picture source[type="image/png"]').exists({ count: 1 });
    assert.dom('picture source[type="image/webp"]').exists({ count: 1 });
  });

  test('it loads lazily by default', async function (assert) {
    await render(hbs`<ResponsiveImage @src="assets/images/tests/test.png" />`);
    assert.dom('img').hasAttribute('loading', 'lazy');
  });

  test('it can optionally load eager', async function (assert) {
    await render(
      hbs`<ResponsiveImage @src="assets/images/tests/test.png" loading="eager" />`
    );
    assert.dom('img').hasAttribute('loading', 'eager');
  });

  test('it decodes async', async function (assert) {
    await render(hbs`<ResponsiveImage @src="assets/images/tests/test.png" />`);
    assert.dom('img').hasAttribute('decoding', 'async');
  });

  test('it renders arbitrary HTML attributes', async function (assert) {
    await render(
      hbs`<ResponsiveImage @src="assets/images/tests/test.png" class="foo" role="button" data-test-image />`
    );
    assert.dom('img').hasClass('foo');
    assert.dom('img').hasAttribute('role', 'button');
    assert.dom('img').hasAttribute('data-test-image');
  });
});
