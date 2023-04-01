/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { render, settled } from '@ember/test-helpers';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { module, test } from 'qunit';
import { ProviderResult } from 'ember-responsive-image/types';
import ResponsiveImageService from 'ember-responsive-image/services/responsive-image';
import testImage from 'test-app/images/tests/image.jpg?widths=50,100,640&formats=original,webp,avif&responsive';
import testImageLqipInline from 'test-app/images/tests/image.jpg?lqip=inline&widths=50,100,640&responsive';
import testImageLqipColor from 'test-app/images/tests/image.jpg?lqip=color&widths=50,100,640&responsive';
import testImageLqipBlurhash from 'test-app/images/tests/image.jpg?lqip=blurhash&widths=50,100,640&responsive';
import smallImage from 'test-app/images/tests/image.jpg?widths=10,25&formats=original,webp,avif&responsive';

import type { RenderingTestContext } from '@ember/test-helpers';

module('Integration: Responsive Image Component', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    this.set('cacheBreaker', new Date().getTime());
    this.set('testImage', testImage);
    this.set('testImageLqipInline', testImageLqipInline);
    this.set('testImageLqipColor', testImageLqipColor);
    this.set('testImageLqipBlurhash', testImageLqipBlurhash);
    this.set('smallImage', smallImage);
  });

  module('source from local files', function () {
    module('responsive layout', function () {
      test('it has responsive layout by default', async function (assert) {
        await render(hbs`<ResponsiveImage @src={{this.testImage}} />`);

        assert.dom('img').hasClass('eri-responsive');
        assert.dom('img').hasNoClass('eri-fixed');
      });

      test('it renders width and height attributes', async function (this: RenderingTestContext, assert) {
        await render(hbs`<ResponsiveImage @src={{this.testImage}} />`);

        assert.dom('img').hasAttribute('width');
        assert.dom('img').hasAttribute('height');
        assert.strictEqual(
          parseInt(
            this.element.querySelector('img')?.getAttribute('width') ?? '',
            10
          ) /
            parseInt(
              this.element.querySelector('img')?.getAttribute('height') ?? '',
              10
            ),
          2
        );
      });

      test('it renders the correct sourceset with width descriptors', async function (assert) {
        await render(hbs`<ResponsiveImage @src={{this.testImage}} />`);

        // png
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-640w(-\\w+)?.jpg 640w')
          );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-100w(-\\w+)?.jpg 100w')
          );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-50w(-\\w+)?.jpg 50w')
          );

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-640w(-\\w+)?.webp 640w')
          );
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-100w(-\\w+)?.webp 100w')
          );
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-50w(-\\w+)?.webp 50w')
          );

        // avif
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-640w(-\\w+)?.avif 640w')
          );
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-100w(-\\w+)?.avif 100w')
          );
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-50w(-\\w+)?.avif 50w')
          );

        await render(hbs`<ResponsiveImage @src={{this.smallImage}} />`);
        // png
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-10w(-\\w+)?.jpg 10w')
          );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-25w(-\\w+)?.jpg 25w')
          );

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-10w(-\\w+)?.webp 10w')
          );
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-25w(-\\w+)?.webp 25w')
          );

        // avif
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-10w(-\\w+)?.avif 10w')
          );
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-25w(-\\w+)?.avif 25w')
          );
      });

      test('it renders the fallback src next to needed display size', async function (assert) {
        const service = this.owner.lookup(
          'service:responsive-image'
        ) as ResponsiveImageService;
        service.set('physicalWidth', 45);
        await render(hbs`<ResponsiveImage @src={{this.testImage}} />`);
        assert
          .dom('img')
          .hasAttribute(
            'src',
            new RegExp('/assets/images/image-50w(-\\w+)?.jpg')
          );
        service.set('physicalWidth', 51);
        await render(hbs`<ResponsiveImage @src={{this.testImage}} />`);
        assert
          .dom('img')
          .hasAttribute(
            'src',
            new RegExp('/assets/images/image-100w(-\\w+)?.jpg')
          );
        service.set('physicalWidth', 9);
        await render(hbs`<ResponsiveImage @src={{this.smallImage}} />`);
        assert
          .dom('img')
          .hasAttribute(
            'src',
            new RegExp('/assets/images/image-10w(-\\w+)?.jpg')
          );
        service.set('physicalWidth', 11);
        await render(hbs`<ResponsiveImage @src={{this.smallImage}} />`);
        assert
          .dom('img')
          .hasAttribute(
            'src',
            new RegExp('/assets/images/image-25w(-\\w+)?.jpg')
          );
      });

      test('it renders a given size as sizes', async function (assert) {
        await render(
          hbs`<ResponsiveImage @src={{this.testImage}} @size="40"/>`
        );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute('sizes', '40vw');
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute('sizes', '40vw');
      });

      test('it renders with given sizes', async function (assert) {
        await render(
          hbs`<ResponsiveImage @src={{this.testImage}} @sizes="(max-width: 767px) 100vw, 50vw"/>`
        );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute('sizes', '(max-width: 767px) 100vw, 50vw');
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute('sizes', '(max-width: 767px) 100vw, 50vw');
      });
    });

    module('fixed layout', function () {
      test('it has fixed layout when width or height is provided', async function (assert) {
        await render(
          hbs`<ResponsiveImage @src={{this.testImage}} @width={{100}}/>`
        );

        assert.dom('img').hasClass('eri-fixed');
        assert.dom('img').hasNoClass('eri-responsive');

        await render(
          hbs`<ResponsiveImage @src={{this.testImage}} @height={{100}}/>`
        );

        assert.dom('img').hasClass('eri-fixed');
        assert.dom('img').hasNoClass('eri-responsive');
      });

      test('it renders width and height when given', async function (assert) {
        await render(
          hbs`<ResponsiveImage @src={{this.testImage}} @width={{150}} @height={{50}} />`
        );

        assert.dom('img').hasAttribute('width', '150');
        assert.dom('img').hasAttribute('height', '50');
      });

      test('it renders height when width is given according to aspect ratio', async function (assert) {
        await render(
          hbs`<ResponsiveImage @src={{this.testImage}} @width={{150}} />`
        );

        assert.dom('img').hasAttribute('width', '150');
        assert.dom('img').hasAttribute('height', '75');
      });

      test('it renders width when height is given according to aspect ratio', async function (assert) {
        await render(
          hbs`<ResponsiveImage @src={{this.testImage}} @height={{100}} />`
        );

        assert.dom('img').hasAttribute('width', '200');
        assert.dom('img').hasAttribute('height', '100');
      });

      test('it renders the correct sourceset with pixel densities', async function (assert) {
        await render(
          hbs`<ResponsiveImage @width={{50}} @src={{this.testImage}}/>`
        );
        // png
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-100w(-\\w+)?.jpg 2x')
          );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-50w(-\\w+)?.jpg 1x')
          );

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-100w(-\\w+)?.webp 2x')
          );
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-50w(-\\w+)?.webp 1x')
          );

        // avif
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-100w(-\\w+)?.avif 2x')
          );
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-50w(-\\w+)?.avif 1x')
          );

        await render(
          hbs`<ResponsiveImage @width={{10}} @src={{this.smallImage}}/>`
        );
        // png
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-10w(-\\w+)?.jpg 1x')
          );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-25w(-\\w+)?.jpg 2x')
          );

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-10w(-\\w+)?.webp 1x')
          );
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-25w(-\\w+)?.webp 2x')
          );

        // avif
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-10w(-\\w+)?.avif 1x')
          );
        assert
          .dom('picture source[type="image/avif"]')
          .hasAttribute(
            'srcset',
            new RegExp('/assets/images/image-25w(-\\w+)?.avif 2x')
          );
      });

      test('it renders the fallback src next to needed display size', async function (assert) {
        await render(
          hbs`<ResponsiveImage @width={{320}} @src={{this.testImage}}/>`
        );
        assert
          .dom('img')
          .hasAttribute(
            'src',
            new RegExp('/assets/images/image-640w(-\\w+)?.jpg')
          );

        await render(
          hbs`<ResponsiveImage @width={{101}} @src={{this.testImage}}/>`
        );
        assert
          .dom('img')
          .hasAttribute(
            'src',
            new RegExp('/assets/images/image-640w(-\\w+)?.jpg')
          );

        await render(
          hbs`<ResponsiveImage @width={{100}} @src={{this.testImage}}/>`
        );
        assert
          .dom('img')
          .hasAttribute(
            'src',
            new RegExp('/assets/images/image-100w(-\\w+)?.jpg')
          );

        await render(
          hbs`<ResponsiveImage @width={{51}} @src={{this.testImage}}/>`
        );
        assert
          .dom('img')
          .hasAttribute(
            'src',
            new RegExp('/assets/images/image-100w(-\\w+)?.jpg')
          );

        await render(
          hbs`<ResponsiveImage @width={{50}} @src={{this.testImage}}/>`
        );
        assert
          .dom('img')
          .hasAttribute(
            'src',
            new RegExp('/assets/images/image-50w(-\\w+)?.jpg')
          );
      });
    });

    module('LQIP', function () {
      module('inline', function () {
        test('it sets LQIP SVG as background', async function (this: RenderingTestContext, assert) {
          let resolve: (v: unknown) => void;
          const waitUntilLoaded = new Promise((r) => {
            resolve = r;
          });
          this.set('onload', () => setTimeout(resolve, 0));

          await render(
            hbs`<ResponsiveImage @src={{this.testImageLqipInline}} @cacheBreaker={{this.cacheBreaker}} {{on "load" this.onload}}/>`
          );

          assert.ok(
            window
              .getComputedStyle(this.element.querySelector('img')!)
              .backgroundImage?.match(/data:image\/svg/),
            'it has a background SVG'
          );
          assert.dom('img').hasStyle({ 'background-size': 'cover' });
          assert.ok(
            window.getComputedStyle(this.element.querySelector('img')!)
              .backgroundImage?.length > 100,
            'the background SVG has a reasonable length'
          );

          await waitUntilLoaded;
          await settled();

          assert.strictEqual(
            window.getComputedStyle(this.element.querySelector('img')!)
              .backgroundImage,
            'none',
            'after image is loaded the background SVG is removed'
          );
        });
      });

      module('color', function () {
        test('it sets background-color', async function (assert) {
          let resolve: (v: unknown) => void;
          const waitUntilLoaded = new Promise((r) => {
            resolve = r;
          });
          this.set('onload', () => setTimeout(resolve, 0));

          await render(
            hbs`<ResponsiveImage @src={{this.testImageLqipColor}} @cacheBreaker={{this.cacheBreaker}} {{on "load" this.onload}}/>`
          );

          assert.dom('img').hasStyle({ 'background-color': 'rgb(88, 72, 56)' });

          await waitUntilLoaded;
          await settled();

          assert
            .dom('img')
            .hasStyle({ 'background-color': 'rgba(0, 0, 0, 0)' });
        });
      });

      module('blurhash', function () {
        test('it sets LQIP from blurhash as background', async function (this: RenderingTestContext, assert) {
          let resolve: (v: unknown) => void;
          const waitUntilLoaded = new Promise((r) => {
            resolve = r;
          });
          this.set('onload', () => setTimeout(resolve, 0));

          await render(
            hbs`<ResponsiveImage @src={{this.testImageLqipBlurhash}} @cacheBreaker={{this.cacheBreaker}} {{on "load" this.onload}}/>`
          );

          assert.ok(
            this.element
              .querySelector('img')!
              .style.backgroundImage?.match(/data:image\/png/),
            'it has a background PNG'
          );
          assert.dom('img').hasStyle({ 'background-size': 'cover' });
          assert.ok(
            window.getComputedStyle(this.element.querySelector('img')!)
              .backgroundImage?.length > 100,
            'the background SVG has a reasonable length'
          );

          await waitUntilLoaded;
          await settled();

          assert.strictEqual(
            window.getComputedStyle(this.element.querySelector('img')!)
              .backgroundImage,
            'none',
            'after image is loaded the background PNG is removed'
          );
        });
      });
    });
  });

  module('source from provider', function (hooks) {
    const defaultProviderResult: ProviderResult = {
      imageTypes: ['jpeg', 'webp'],
      imageUrlFor(width, type = 'jpeg') {
        return `/provider/w${width}/image.${type}`;
      },
    };

    hooks.beforeEach(function () {
      this.set('defaultProviderResult', defaultProviderResult);
    });

    module('responsive layout', function () {
      test('it has responsive layout by default', async function (assert) {
        await render(
          hbs`<ResponsiveImage @src={{this.defaultProviderResult}}/>`
        );

        assert.dom('img').hasClass('eri-responsive');
        assert.dom('img').hasNoClass('eri-fixed');
      });

      test('it renders width and height attributes when aspect ratio is known', async function (this: RenderingTestContext, assert) {
        this.set('providerResult', {
          ...defaultProviderResult,
          aspectRatio: 2,
        });
        await render(hbs`<ResponsiveImage @src={{this.providerResult}}/>`);

        assert.dom('img').hasAttribute('width');
        assert.dom('img').hasAttribute('height');
        assert.strictEqual(
          parseInt(
            this.element.querySelector('img')?.getAttribute('width') ?? '',
            10
          ) /
            parseInt(
              this.element.querySelector('img')?.getAttribute('height') ?? '',
              10
            ),
          2
        );
      });

      test('it renders the sourceset based on deviceWidths', async function (assert) {
        await render(
          hbs`<ResponsiveImage @src={{this.defaultProviderResult}}/>`
        );

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            'srcset',
            '/provider/w640/image.webp 640w, /provider/w750/image.webp 750w, /provider/w1920/image.webp 1920w'
          );

        // jpeg
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            'srcset',
            '/provider/w640/image.jpeg 640w, /provider/w750/image.jpeg 750w, /provider/w1920/image.jpeg 1920w'
          );
      });

      test('it renders the sourceset based on provided widths', async function (assert) {
        this.set('providerResult', {
          ...defaultProviderResult,
          availableWidths: [320, 640],
        });

        await render(hbs`<ResponsiveImage @src={{this.providerResult}}/>`);

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            'srcset',
            '/provider/w320/image.webp 320w, /provider/w640/image.webp 640w'
          );

        // jpeg
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            'srcset',
            '/provider/w320/image.jpeg 320w, /provider/w640/image.jpeg 640w'
          );
      });

      test('it renders the fallback src next to needed display size', async function (assert) {
        const service = this.owner.lookup(
          'service:responsive-image'
        ) as ResponsiveImageService;
        service.set('physicalWidth', 100);
        await render(
          hbs`<ResponsiveImage @src={{this.defaultProviderResult}}/>`
        );
        assert
          .dom('img')
          .hasAttribute('src', new RegExp('/provider/w100/image.jpeg'));
      });

      test('it renders a given size as sizes', async function (assert) {
        await render(
          hbs`<ResponsiveImage @src={{this.defaultProviderResult}} @size="40"/>`
        );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute('sizes', '40vw');
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute('sizes', '40vw');
      });

      test('it renders with given sizes', async function (assert) {
        await render(
          hbs`<ResponsiveImage @src={{this.defaultProviderResult}} @sizes="(max-width: 767px) 100vw, 50vw"/>`
        );
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute('sizes', '(max-width: 767px) 100vw, 50vw');
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute('sizes', '(max-width: 767px) 100vw, 50vw');
      });
    });

    module('fixed layout', function () {
      test('it has fixed layout when width or height is provided', async function (assert) {
        await render(
          hbs`<ResponsiveImage @src={{this.defaultProviderResult}} @width={{100}}/>`
        );

        assert.dom('img').hasClass('eri-fixed');
        assert.dom('img').hasNoClass('eri-responsive');
      });

      test('it renders width and height when given', async function (assert) {
        await render(
          hbs`<ResponsiveImage @src={{this.defaultProviderResult}} @width={{150}} @height={{50}} />`
        );

        assert.dom('img').hasAttribute('width', '150');
        assert.dom('img').hasAttribute('height', '50');
      });

      test('it renders height when width is given according to aspect ratio', async function (assert) {
        this.set('providerResult', {
          ...defaultProviderResult,
          aspectRatio: 2,
        });
        await render(
          hbs`<ResponsiveImage @src={{this.providerResult}} @width={{150}}/>`
        );

        assert.dom('img').hasAttribute('width', '150');
        assert.dom('img').hasAttribute('height', '75');
      });

      test('it renders width when height is given according to aspect ratio', async function (assert) {
        this.set('providerResult', {
          ...defaultProviderResult,
          aspectRatio: 2,
        });
        await render(
          hbs`<ResponsiveImage @src={{this.providerResult}} @height={{100}}/>`
        );

        assert.dom('img').hasAttribute('width', '200');
        assert.dom('img').hasAttribute('height', '100');
      });

      test('it renders the correct sourceset with pixel densities', async function (assert) {
        await render(
          hbs`<ResponsiveImage @width={{50}} @src={{this.defaultProviderResult}}/>`
        );

        // webp
        assert
          .dom('picture source[type="image/webp"]')
          .hasAttribute(
            'srcset',
            '/provider/w50/image.webp 1x, /provider/w100/image.webp 2x'
          );

        // avif
        assert
          .dom('picture source[type="image/jpeg"]')
          .hasAttribute(
            'srcset',
            '/provider/w50/image.jpeg 1x, /provider/w100/image.jpeg 2x'
          );
      });

      test('it renders the fallback src next to needed display size', async function (assert) {
        await render(
          hbs`<ResponsiveImage @width={{320}} @src={{this.defaultProviderResult}}/>`
        );
        assert.dom('img').hasAttribute('src', '/provider/w320/image.jpeg');
      });
    });
  });

  test('it renders a source for every format', async function (assert) {
    await render(hbs`<ResponsiveImage @src={{this.testImage}}/>`);

    assert.dom('picture').exists({ count: 1 });
    assert.dom('picture source').exists({ count: 3 });
    assert.dom('picture source[type="image/jpeg"]').exists({ count: 1 });
    assert.dom('picture source[type="image/webp"]').exists({ count: 1 });
  });

  test('it loads lazily by default', async function (assert) {
    await render(hbs`<ResponsiveImage @src={{this.testImage}} />`);
    assert.dom('img').hasAttribute('loading', 'lazy');
  });

  test('it can optionally load eager', async function (assert) {
    await render(
      hbs`<ResponsiveImage @src={{this.testImage}} loading="eager" />`
    );
    assert.dom('img').hasAttribute('loading', 'eager');
  });

  test('it decodes async', async function (assert) {
    await render(hbs`<ResponsiveImage @src={{this.testImage}} />`);
    assert.dom('img').hasAttribute('decoding', 'async');
  });

  test('it renders arbitrary HTML attributes', async function (assert) {
    await render(
      hbs`<ResponsiveImage @src={{this.testImage}} class="foo" role="button" data-test-image />`
    );
    assert.dom('img').hasClass('foo');
    assert.dom('img').hasAttribute('role', 'button');
    assert.dom('img').hasAttribute('data-test-image');
  });
});
