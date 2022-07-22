import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import setupDataDumper from 'test-app/tests/helpers/dump';
import { ProviderResult } from 'ember-responsive-image/types';
import config from 'test-app/config/environment';

module(
  'Integration | Helper | responsive-image-local-provider',
  function (hooks) {
    setupRenderingTest(hooks);
    const getData = setupDataDumper(hooks);

    test('it returns ProviderResult', async function (assert) {
      await render(
        hbs`{{dump (responsive-image-local-provider "assets/images/tests/image.jpg")}}`
      );

      const data = getData() as ProviderResult;

      assert.deepEqual(
        { ...data, imageUrlFor: undefined },
        {
          aspectRatio: 2,
          availableWidths: [50, 100, 640],
          fingerprint: 'd4cc783fc0f24ecf14c47129743c5985',
          imageTypes: ['jpeg', 'webp', 'avif'],
          imageUrlFor: undefined,
          lqip: {
            class: 'eri-dyn-0',
            type: 'color',
          },
        }
      );
      assert.strictEqual(
        data.imageUrlFor(100, 'jpeg'),
        `${config.rootURL}assets/images/tests/image100w-d4cc783fc0f24ecf14c47129743c5985.jpg`
      );
    });
  }
);
