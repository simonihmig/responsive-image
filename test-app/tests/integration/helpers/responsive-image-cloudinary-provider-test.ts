import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, type RenderingTestContext } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import type { ProviderResult } from 'ember-responsive-image/types';

interface TestContext extends RenderingTestContext {
  dump: (argument: ProviderResult) => void;
}

module(
  'Integration | Helper | responsive-image-cloudinary-provider',
  function (hooks) {
    setupRenderingTest(hooks);

    let data: ProviderResult | undefined;
    hooks.before(function (this: TestContext) {
      this.dump = (argument: ProviderResult) => {
        data = argument;
      };
    });

    test('it supports all image types', async function (this: TestContext, assert) {
      await render<TestContext>(
        hbs`{{this.dump (responsive-image-cloudinary-provider "samples/animals/three-dogs")}}`,
      );

      assert.deepEqual(data?.imageTypes, ['png', 'jpeg', 'webp', 'avif']);
    });

    test('it returns correct upload image URLs', async function (this: TestContext, assert) {
      await render<TestContext>(
        hbs`{{this.dump (responsive-image-cloudinary-provider "samples/animals/three-dogs")}}`,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, 'jpeg'),
        'https://res.cloudinary.com/kaliber5/image/upload/w_100,c_limit,q_auto/samples/animals/three-dogs.jpeg',
      );

      assert.strictEqual(
        data?.imageUrlFor(1000, 'jpeg'),
        'https://res.cloudinary.com/kaliber5/image/upload/w_1000,c_limit,q_auto/samples/animals/three-dogs.jpeg',
      );

      assert.strictEqual(
        data?.imageUrlFor(100, 'webp'),
        'https://res.cloudinary.com/kaliber5/image/upload/w_100,c_limit,q_auto/samples/animals/three-dogs.webp',
      );
    });

    test('it returns correct fetch image URLs', async function (this: TestContext, assert) {
      await render<TestContext>(
        hbs`{{this.dump (responsive-image-cloudinary-provider "https://via.placeholder.com/150")}}`,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, 'jpeg'),
        'https://res.cloudinary.com/kaliber5/image/fetch/w_100,c_limit,q_auto,f_jpg/https%3A%2F%2Fvia.placeholder.com%2F150',
      );

      assert.strictEqual(
        data?.imageUrlFor(1000, 'jpeg'),
        'https://res.cloudinary.com/kaliber5/image/fetch/w_1000,c_limit,q_auto,f_jpg/https%3A%2F%2Fvia.placeholder.com%2F150',
      );

      assert.strictEqual(
        data?.imageUrlFor(100, 'webp'),
        'https://res.cloudinary.com/kaliber5/image/fetch/w_100,c_limit,q_auto,f_webp/https%3A%2F%2Fvia.placeholder.com%2F150',
      );
    });

    test('it supports custom transformations', async function (this: TestContext, assert) {
      await render<TestContext>(
        hbs`{{this.dump (responsive-image-cloudinary-provider "samples/animals/three-dogs" transformations="co_rgb:20a020,e_colorize:50")}}`,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, 'jpeg'),
        'https://res.cloudinary.com/kaliber5/image/upload/co_rgb:20a020,e_colorize:50/w_100,c_limit,q_auto/samples/animals/three-dogs.jpeg',
      );
    });

    test('it supports custom chained transformations', async function (this: TestContext, assert) {
      await render<TestContext>(
        hbs`{{this.dump (responsive-image-cloudinary-provider "samples/animals/three-dogs" transformations="co_rgb:20a020,e_colorize:50/ar_1.0,c_fill,w_150/r_max")}}`,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, 'jpeg'),
        'https://res.cloudinary.com/kaliber5/image/upload/co_rgb:20a020,e_colorize:50/ar_1.0,c_fill,w_150/r_max/w_100,c_limit,q_auto/samples/animals/three-dogs.jpeg',
      );
    });

    test('it supports custom image formats', async function (this: TestContext, assert) {
      await render<TestContext>(
        hbs`{{this.dump (responsive-image-cloudinary-provider "samples/animals/three-dogs" formats=(array "webp" "avif"))}}`,
      );

      assert.deepEqual(data?.imageTypes, ['webp', 'avif']);
    });

    test('it supports custom quality setting', async function (this: TestContext, assert) {
      await render<TestContext>(
        hbs`{{this.dump (responsive-image-cloudinary-provider "samples/animals/three-dogs" quality=50)}}`,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, 'jpeg'),
        'https://res.cloudinary.com/kaliber5/image/upload/w_100,c_limit,q_50/samples/animals/three-dogs.jpeg',
      );
    });

    test('it supports remote fetching', async function (this: TestContext, assert) {
      await render<TestContext>(
        hbs`{{this.dump (responsive-image-cloudinary-provider "https://www.example.com/image.jpg")}}`,
      );

      assert.strictEqual(
        data?.imageUrlFor(100, 'webp'),
        'https://res.cloudinary.com/kaliber5/image/fetch/w_100,c_limit,q_auto,f_webp/https%3A%2F%2Fwww.example.com%2Fimage.jpg',
      );
    });
  },
);
