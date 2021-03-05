import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import {
  ImageMeta,
  Meta,
} from 'ember-responsive-image/services/responsive-image';

const meta: Record<string, Meta> = {
  'test.png': {
    widths: [50, 100],
    formats: ['png', 'webp'],
    aspectRatio: 1,
  },
};

const imageMetas: ImageMeta[] = [
  {
    image: '/test50w.png',
    width: 50,
    height: 50,
    type: 'png',
  },
  {
    image: '/test50w.webp',
    width: 50,
    height: 50,
    type: 'webp',
  },
  {
    image: '/test100w.png',
    width: 100,
    height: 100,
    type: 'png',
  },
  {
    image: '/test100w.webp',
    width: 100,
    height: 100,
    type: 'webp',
  },
];

module('ResponsiveImageService', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    const service = this.owner.lookup('service:responsive-image');
    service.set('meta', meta);
  });

  test('retrieve generated images by name', function (assert) {
    const service = this.owner.lookup('service:responsive-image');
    const images = service.getImages('test.png');
    assert.deepEqual(images, imageMetas);
  });

  test('handle absolute paths', function (assert) {
    const service = this.owner.lookup('service:responsive-image');
    const images = service.getImages('/test.png');
    assert.deepEqual(images, imageMetas);
  });

  test('retrieve generated images by name and type', function (assert) {
    const service = this.owner.lookup('service:responsive-image');
    let images = service.getImages('test.png', 'png');
    assert.deepEqual(images, [imageMetas[0], imageMetas[2]]);

    images = service.getImages('test.png', 'webp');
    assert.deepEqual(images, [imageMetas[1], imageMetas[3]]);
  });

  test('get available types', function (assert) {
    const service = this.owner.lookup('service:responsive-image');
    const types = service.getAvailableTypes('test.png');
    assert.deepEqual(types, ['png', 'webp']);
  });

  test('retrieve generated image data by size', function (assert) {
    const service = this.owner.lookup('service:responsive-image');
    service.physicalWidth = 100;
    let images = service.getImageMetaBySize('test.png', 120);
    assert.deepEqual(images, imageMetas[2]);
    images = service.getImageMetaBySize('test.png', 60);
    assert.deepEqual(images, imageMetas[2]);
    images = service.getImageMetaBySize('test.png', 45);
    assert.deepEqual(images, imageMetas[0]);
  });

  test('retrieve generated image data by size and type', function (assert) {
    const service = this.owner.lookup('service:responsive-image');
    service.physicalWidth = 100;
    let images = service.getImageMetaBySize('test.png', 120, 'webp');
    assert.deepEqual(images, imageMetas[3]);
    images = service.getImageMetaBySize('test.png', 60, 'webp');
    assert.deepEqual(images, imageMetas[3]);
    images = service.getImageMetaBySize('test.png', 45, 'webp');
    assert.deepEqual(images, imageMetas[1]);
  });
});
