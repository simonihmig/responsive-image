import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import setupDataDumper from 'dummy/tests/helpers/dump';
import { ProviderResult } from 'ember-responsive-image/types';

module(
  'Integration | Helper | responsive-image-imgix-provider',
  function (hooks) {
    setupRenderingTest(hooks);
    const getData = setupDataDumper(hooks);

    test('it supports jpg, png and webp image types', async function (assert) {
      await render(
        hbs`{{dump (responsive-image-imgix-provider "foo/bar.jpg")}}`
      );

      const data = getData() as ProviderResult;

      assert.deepEqual(data.imageTypes, ['png', 'jpeg', 'webp']);
    });

    test('it returns correct image URLs', async function (assert) {
      await render(
        hbs`{{dump (responsive-image-imgix-provider "foo/bar.jpg")}}`
      );

      const data = getData() as ProviderResult;

      assert.equal(
        data.imageUrlFor(100, 'jpeg'),
        'https://kaliber5.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max'
      );

      assert.equal(
        data.imageUrlFor(1000, 'jpeg'),
        'https://kaliber5.imgix.net/foo/bar.jpg?fm=jpg&w=1000&fit=max'
      );

      assert.equal(
        data.imageUrlFor(100, 'webp'),
        'https://kaliber5.imgix.net/foo/bar.jpg?fm=webp&w=100&fit=max'
      );
    });

    test('it supports custom params', async function (assert) {
      await render(
        hbs`{{dump (responsive-image-imgix-provider "foo/bar.jpg" params=(hash monochrome="44768B" px=10))}}`
      );

      const data = getData() as ProviderResult;

      assert.equal(
        data.imageUrlFor(100, 'jpeg'),
        'https://kaliber5.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max&monochrome=44768B&px=10'
      );
    });

    test('it supports custom image formats', async function (assert) {
      await render(
        hbs`{{dump (responsive-image-imgix-provider "foo/bar.jpg" formats=(array "webp" "jpeg"))}}`
      );

      const data = getData() as ProviderResult;

      assert.deepEqual(data.imageTypes, ['webp', 'jpeg']);
    });

    test('it supports custom quality setting', async function (assert) {
      await render(
        hbs`{{dump (responsive-image-imgix-provider "foo/bar.jpg" quality=50)}}`
      );

      const data = getData() as ProviderResult;

      assert.equal(
        data.imageUrlFor(100, 'jpeg'),
        'https://kaliber5.imgix.net/foo/bar.jpg?fm=jpg&w=100&fit=max&q=50'
      );
    });
  }
);
