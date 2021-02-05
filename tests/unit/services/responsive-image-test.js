import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

const meta = {
  prepend: '',
  'test.png': {
    images: [
      {
        image: '/assets/images/responsive/test100w.png',
        width: 100,
        height: 100,
        type: 'png',
      },
      {
        image: '/assets/images/responsive/test50w.png',
        width: 50,
        height: 50,
        type: 'png',
      },
      {
        image:
          '/assets/images/responsive/test100w-00e24234f1b58e32b935b1041432916f.webp',
        width: 100,
        height: 100,
        type: 'webp',
      },
      {
        image:
          '/assets/images/responsive/test50w-00e24234f1b58e32b935b1041432916f.webp',
        width: 50,
        height: 50,
        type: 'webp',
      },
    ],
  },
};

module('ResponsiveImageService', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    let service = this.owner.lookup('service:responsive-image');
    service.set('meta', meta);
  });

  test('retrieve generated images by name', function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    let images = service.getImages('test.png');
    assert.deepEqual(images, meta['test.png'].images);
  });

  test('retrieve generated images by name and type', function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    let images = service.getImages('test.png', 'png');
    assert.deepEqual(images, meta['test.png'].images.slice(0, 2));

    images = service.getImages('test.png', 'webp');
    assert.deepEqual(images, meta['test.png'].images.slice(2, 4));
  });

  test('get available types', function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    let types = service.getAvailableTypes('test.png');
    assert.deepEqual(types, ['png', 'webp']);
  });

  test('retrieve generated image data by size', function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    service.physicalWidth = 100;
    let images = service.getImageMetaBySize('test.png', 120);
    assert.deepEqual(images, meta['test.png'].images[0]);
    images = service.getImageMetaBySize('test.png', 60);
    assert.deepEqual(images, meta['test.png'].images[0]);
    images = service.getImageMetaBySize('test.png', 45);
    assert.deepEqual(images, meta['test.png'].images[1]);
  });

  test('retrieve generated image data by size and type', function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    service.physicalWidth = 100;
    let images = service.getImageMetaBySize('test.png', 120, 'webp');
    assert.deepEqual(images, meta['test.png'].images[2]);
    images = service.getImageMetaBySize('test.png', 60, 'webp');
    assert.deepEqual(images, meta['test.png'].images[2]);
    images = service.getImageMetaBySize('test.png', 45, 'webp');
    assert.deepEqual(images, meta['test.png'].images[3]);
  });
});
