import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

const meta = {
  prepend: '',
  'test.png': {
    images: [
      {
        image:
          '/assets/images/responsive/test100w-00e24234f1b58e32b935b1041432916f.png',
        width: 100,
        height: 100,
        type: 'png',
      },
      {
        image:
          '/assets/images/responsive/test50w-00e24234f1b58e32b935b1041432916f.png',
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

  test('retrieve generated image data by size', function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    service.physicalWidth = 100;
    let images = service.getImageDataBySize('test.png', 120);
    assert.deepEqual(images, meta['test.png'].images[0]);
    images = service.getImageDataBySize('test.png', 60);
    assert.deepEqual(images, meta['test.png'].images[0]);
    images = service.getImageDataBySize('test.png', 45);
    assert.deepEqual(images, meta['test.png'].images[1]);
  });

  test('retrieve generated image data by size and type', function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    service.physicalWidth = 100;
    let images = service.getImageDataBySize('test.png', 120, 'webp');
    assert.deepEqual(images, meta['test.png'].images[2]);
    images = service.getImageDataBySize('test.png', 60, 'webp');
    assert.deepEqual(images, meta['test.png'].images[2]);
    images = service.getImageDataBySize('test.png', 45, 'webp');
    assert.deepEqual(images, meta['test.png'].images[3]);
  });

  test('retrieve a generated image by size', function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    service.physicalWidth = 100;
    let image = service.getImageBySize('test.png', 120);
    assert.equal(image, meta['test.png'].images[0].image);
    image = service.getImageBySize('test.png', 60);
    assert.equal(image, meta['test.png'].images[0].image);
    image = service.getImageBySize('test.png', 45);
    assert.equal(image, meta['test.png'].images[1].image);
  });

  test('retrieve a generated image by size and type', function (assert) {
    let service = this.owner.lookup('service:responsive-image');
    service.physicalWidth = 100;
    let image = service.getImageBySize('test.png', 120, 'webp');
    assert.equal(image, meta['test.png'].images[2].image);
    image = service.getImageBySize('test.png', 60, 'webp');
    assert.equal(image, meta['test.png'].images[2].image);
    image = service.getImageBySize('test.png', 45, 'webp');
    assert.equal(image, meta['test.png'].images[3].image);
  });
});
