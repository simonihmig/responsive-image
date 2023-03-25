import { module, test } from 'qunit';
import {
  setup,
  visit /* mockServer */,
} from 'ember-cli-fastboot-testing/test-support';
import { dependencySatisfies } from '@embroider/macros';

// FastBoot does not not suppport Ember 5 yet :-(
(dependencySatisfies('ember-source', '>= 5') ? module.skip : module)(
  'FastBoot | Cloudinary',
  function (hooks) {
    setup(hooks);

    test('it renders an image', async function (assert) {
      await visit('/cloudinary');

      assert.dom('img[data-test-image]').exists();
      assert
        .dom('img[data-test-image]')
        .hasAttribute(
          'src',
          new RegExp('https://res.cloudinary.com/kaliber5/')
        );
    });
  }
);
