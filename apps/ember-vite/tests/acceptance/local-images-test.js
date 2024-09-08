import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { setupApplicationTest } from '../helpers';

const sizes = [640, 750, 828, 1080, 1200, 1920, 2048, 3840];
const imageTypes = [
  ['jpeg', 'jpg'],
  ['webp', 'webp'],
];

module('Acceptance | local images', function (hooks) {
  setupApplicationTest(hooks);

  test('responsive layout', async function (assert) {
    await visit('/');

    assert
      .dom('[data-test-local-image="responsive"]')
      .hasClass('eri-responsive')
      .hasAttribute(
        'src',
        new RegExp(`/assets/dog-3840w(-[a-zA-Z0-9-_]+)?.jpg`),
        `has default src`,
      );

    const picture = this.element.querySelector(
      '[data-test-local-image="responsive"]',
    ).parentNode;

    for (const [type, ext] of imageTypes) {
      for (const size of sizes) {
        assert
          .dom(`source[type="image/${type}"]`, picture)
          .hasAttribute(
            'srcset',
            new RegExp(
              `/assets/dog-${size}w(-[a-zA-Z0-9-_]+)?.${ext} ${size}w`,
            ),
            `has ${type} with a width of ${size}`,
          );
      }
    }
  });

  test('fixed layout', async function (assert) {
    await visit('/');

    assert
      .dom('[data-test-local-image="fixed"]')
      .hasClass('eri-fixed')
      .hasAttribute(
        'src',
        new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.jpg`),
        `has default src`,
      );

    const picture = this.element.querySelector(
      '[data-test-local-image="fixed"]',
    ).parentNode;

    for (const [type, ext] of imageTypes) {
      assert.dom(`source[type="image/${type}"]`, picture).hasAttribute(
        'srcset',
        // 640px is the smallest size for our defaults
        new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.${ext} 1x`),
        `has ${type} with a width of 1x`,
      );

      assert
        .dom(`source[type="image/${type}"]`, picture)
        .hasAttribute(
          'srcset',
          new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.${ext} 2x`),
          `has ${type} with a width of 1x`,
        );
    }
  });

  module('LQIP', function () {
    test('color', async function (assert) {
      await visit('/');

      assert
        .dom('[data-test-local-image="fixed,lqip-color"]')
        .hasClass('eri-fixed')
        // .hasClass('eri-lqip-color')
        .hasAttribute(
          'src',
          new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.jpg`),
          `has default src`,
        );

      const picture = this.element.querySelector(
        '[data-test-local-image="fixed,lqip-color"]',
      ).parentNode;

      for (const [type, ext] of imageTypes) {
        assert.dom(`source[type="image/${type}"]`, picture).hasAttribute(
          'srcset',
          // 640px is the smallest size for our defaults
          new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.${ext} 1x`),
          `has ${type} with a width of 1x`,
        );

        assert
          .dom(`source[type="image/${type}"]`, picture)
          .hasAttribute(
            'srcset',
            new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.${ext} 2x`),
            `has ${type} with a width of 1x`,
          );
      }
    });
  });

  test('color', async function (assert) {
    await visit('/');

    assert
      .dom('[data-test-local-image="fixed,lqip-color"]')
      .hasClass('eri-fixed')
      // .hasClass('eri-lqip-color')
      // .hasClass('eri-dyn-0')
      .hasAttribute(
        'src',
        new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.jpg`),
        `has default src`,
      );

    const picture = this.element.querySelector(
      '[data-test-local-image="fixed,lqip-color"]',
    ).parentNode;

    for (const [type, ext] of imageTypes) {
      assert.dom(`source[type="image/${type}"]`, picture).hasAttribute(
        'srcset',
        // 640px is the smallest size for our defaults
        new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.${ext} 1x`),
        `has ${type} with a width of 1x`,
      );

      assert
        .dom(`source[type="image/${type}"]`, picture)
        .hasAttribute(
          'srcset',
          new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.${ext} 2x`),
          `has ${type} with a width of 1x`,
        );
    }
  });

  test('inline', async function (assert) {
    await visit('/');

    assert
      .dom('[data-test-local-image="fixed,lqip-inline"]')
      .hasClass('eri-fixed')
      // .hasClass('eri-lqip-inline')
      // .hasClass('eri-dyn-1')
      .hasAttribute(
        'src',
        new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.jpg`),
        `has default src`,
      );

    const picture = this.element.querySelector(
      '[data-test-local-image="fixed,lqip-inline"]',
    ).parentNode;

    for (const [type, ext] of imageTypes) {
      assert.dom(`source[type="image/${type}"]`, picture).hasAttribute(
        'srcset',
        // 640px is the smallest size for our defaults
        new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.${ext} 1x`),
        `has ${type} with a width of 1x`,
      );

      assert
        .dom(`source[type="image/${type}"]`, picture)
        .hasAttribute(
          'srcset',
          new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.${ext} 2x`),
          `has ${type} with a width of 1x`,
        );
    }
  });

  test('blurhash', async function (assert) {
    await visit('/');

    assert
      .dom('[data-test-local-image="fixed,lqip-blurhash"]')
      // .hasClass('eri-fixed')
      // .hasClass('eri-lqip-blurhash')
      .hasAttribute(
        'src',
        new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.jpg`),
        `has default src`,
      );

    const picture = this.element.querySelector(
      '[data-test-local-image="fixed,lqip-blurhash"]',
    ).parentNode;

    for (const [type, ext] of imageTypes) {
      assert.dom(`source[type="image/${type}"]`, picture).hasAttribute(
        'srcset',
        // 640px is the smallest size for our defaults
        new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.${ext} 1x`),
        `has ${type} with a width of 1x`,
      );

      assert
        .dom(`source[type="image/${type}"]`, picture)
        .hasAttribute(
          'srcset',
          new RegExp(`/assets/dog-640w(-[a-zA-Z0-9-_]+)?.${ext} 2x`),
          `has ${type} with a width of 1x`,
        );
    }
  });
});
