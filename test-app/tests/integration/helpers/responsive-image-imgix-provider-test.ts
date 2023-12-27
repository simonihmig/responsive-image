import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, type RenderingTestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import type { ImageData } from 'ember-responsive-image';

interface TestContext extends RenderingTestContext {
  dump: (argument: ImageData) => void;
}

module(
  'Integration | Helper | responsive-image-imgix-provider',
  function (hooks) {
    setupRenderingTest(hooks);
    let data: ImageData | undefined;
    hooks.before(function (this: TestContext) {
      this.dump = (argument: ImageData) => {
        data = argument;
      };
    });

    test('it supports jpg, png and webp image types', async function (assert) {
      await render<TestContext>(
        hbs`{{this.dump (responsive-image-imgix-provider "foo/bar.jpg")}}`,
      );

      assert.deepEqual(data?.imageTypes, ['png', 'jpeg', 'webp']);
    });

    test('it returns correct image URLs', async function (assert) {
      await render<TestContext>(
        hbs`{{this.dump (responsive-image-imgix-provider "foo/bar.jpg")}}`,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, 'jpeg'),
        'https://kaliber5.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max',
      );

      assert.strictEqual(
        data?.imageUrlFor(1000, 'jpeg'),
        'https://kaliber5.imgix.net/foo/bar.jpg?fm=jpg&w=1000&fit=max',
      );

      assert.strictEqual(
        data?.imageUrlFor(100, 'webp'),
        'https://kaliber5.imgix.net/foo/bar.jpg?fm=webp&w=100&fit=max',
      );
    });

    test('it supports custom params', async function (assert) {
      await render<TestContext>(
        hbs`{{this.dump (responsive-image-imgix-provider "foo/bar.jpg" params=(hash monochrome="44768B" px=10))}}`,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, 'jpeg'),
        'https://kaliber5.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max&monochrome=44768B&px=10',
      );
    });

    test('it supports custom image formats', async function (assert) {
      await render<TestContext>(
        hbs`{{this.dump (responsive-image-imgix-provider "foo/bar.jpg" formats=(array "webp" "jpeg"))}}`,
      );

      assert.deepEqual(data?.imageTypes, ['webp', 'jpeg']);
    });

    test('it supports custom quality setting', async function (assert) {
      await render<TestContext>(
        hbs`{{this.dump (responsive-image-imgix-provider "foo/bar.jpg" quality=50)}}`,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, 'jpeg'),
        'https://kaliber5.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max&q=50',
      );
    });
  },
);
