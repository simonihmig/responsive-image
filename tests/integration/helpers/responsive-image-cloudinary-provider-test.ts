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
  }
);
