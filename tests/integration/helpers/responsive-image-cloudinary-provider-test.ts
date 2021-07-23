import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupDataDumper from 'dummy/tests/helpers/dump';
import { ProviderResult } from 'ember-responsive-image/types';

module(
  'Integration | Helper | responsive-image-cloudinary-provider',
  function (hooks) {
    setupRenderingTest(hooks);
    const getData = setupDataDumper(hooks);

    test('it supports all image types', async function (assert) {
      await render(
        hbs`{{dump (responsive-image-cloudinary-provider "samples/animals/three-dogs")}}`
      );

      const data = getData() as ProviderResult;

      assert.deepEqual(data.imageTypes, ['png', 'jpeg', 'webp', 'avif']);
    });

    test('it returns correct image URLs', async function (assert) {
      await render(
        hbs`{{dump (responsive-image-cloudinary-provider "samples/animals/three-dogs")}}`
      );

      const data = getData() as ProviderResult;

      assert.equal(
        data.imageUrlFor(100, 'jpeg'),
        'https://res.cloudinary.com/kaliber5/image/upload/w_100,c_limit,q_auto/samples/animals/three-dogs.jpeg'
      );

      assert.equal(
        data.imageUrlFor(1000, 'jpeg'),
        'https://res.cloudinary.com/kaliber5/image/upload/w_1000,c_limit,q_auto/samples/animals/three-dogs.jpeg'
      );

      assert.equal(
        data.imageUrlFor(100, 'webp'),
        'https://res.cloudinary.com/kaliber5/image/upload/w_100,c_limit,q_auto/samples/animals/three-dogs.webp'
      );
    });

    test('it supports custom transformations', async function (assert) {
      await render(
        hbs`{{dump (responsive-image-cloudinary-provider "samples/animals/three-dogs" transformations="co_rgb:20a020,e_colorize:50")}}`
      );

      const data = getData() as ProviderResult;

      assert.equal(
        data.imageUrlFor(100, 'jpeg'),
        'https://res.cloudinary.com/kaliber5/image/upload/co_rgb:20a020,e_colorize:50/w_100,c_limit,q_auto/samples/animals/three-dogs.jpeg'
      );
    });

    test('it supports custom chained transformations', async function (assert) {
      await render(
        hbs`{{dump (responsive-image-cloudinary-provider "samples/animals/three-dogs" transformations="co_rgb:20a020,e_colorize:50/ar_1.0,c_fill,w_150/r_max")}}`
      );

      const data = getData() as ProviderResult;

      assert.equal(
        data.imageUrlFor(100, 'jpeg'),
        'https://res.cloudinary.com/kaliber5/image/upload/co_rgb:20a020,e_colorize:50/ar_1.0,c_fill,w_150/r_max/w_100,c_limit,q_auto/samples/animals/three-dogs.jpeg'
      );
    });

    test('it supports custom image formats', async function (assert) {
      await render(
        hbs`{{dump (responsive-image-cloudinary-provider "samples/animals/three-dogs" formats=(array "webp" "avif"))}}`
      );

      const data = getData() as ProviderResult;

      assert.deepEqual(data.imageTypes, ['webp', 'avif']);
    });

    test('it supports remote fetching', async function (assert) {
      await render(
        hbs`{{dump (responsive-image-cloudinary-provider "https://www.example.com/image.jpg")}}`
      );

      const data = getData() as ProviderResult;

      assert.equal(
        data.imageUrlFor(100, 'webp'),
        'https://res.cloudinary.com/kaliber5/image/fetch/w_100,c_limit,q_auto,f_webp/https%3A%2F%2Fwww.example.com%2Fimage.jpg'
      );
    });
  }
);
