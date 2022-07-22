import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import { Image, ImageMeta } from 'ember-responsive-image/types';
import ResponsiveImageLocalService from 'ember-responsive-image/services/responsive-image-local';
import ResponsiveImageService from 'ember-responsive-image/services/responsive-image';
import config from 'test-app/config/environment';

interface TestCase {
  moduleTitle: string;
  images: Record<string, ImageMeta>;
  imageMetas: Image[];
}
const defaultMeta = {
  deviceWidths: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
};

const testCases: TestCase[] = [
  {
    moduleTitle: 'without fingerprinting',
    images: {
      'test.png': {
        widths: [50, 100],
        formats: ['png', 'webp'],
        aspectRatio: 1,
      },
    },
    imageMetas: [
      {
        image: `${config.rootURL}test50w.png`,
        width: 50,
        height: 50,
        type: 'png',
      },
      {
        image: `${config.rootURL}test50w.webp`,
        width: 50,
        height: 50,
        type: 'webp',
      },
      {
        image: `${config.rootURL}test100w.png`,
        width: 100,
        height: 100,
        type: 'png',
      },
      {
        image: `${config.rootURL}test100w.webp`,
        width: 100,
        height: 100,
        type: 'webp',
      },
    ],
  },
  {
    moduleTitle: 'with fingerprinting',
    images: {
      'test.png': {
        widths: [50, 100],
        formats: ['png', 'webp'],
        aspectRatio: 1,
        fingerprint: '1234567890',
      },
    },
    imageMetas: [
      {
        image: `${config.rootURL}test50w-1234567890.png`,
        width: 50,
        height: 50,
        type: 'png',
      },
      {
        image: `${config.rootURL}test50w-1234567890.webp`,
        width: 50,
        height: 50,
        type: 'webp',
      },
      {
        image: `${config.rootURL}test100w-1234567890.png`,
        width: 100,
        height: 100,
        type: 'png',
      },
      {
        image: `${config.rootURL}test100w-1234567890.webp`,
        width: 100,
        height: 100,
        type: 'webp',
      },
    ],
  },
];

module('ResponsiveImageLocalService', function (hooks) {
  setupTest(hooks);

  testCases.forEach(({ moduleTitle, images, imageMetas }) => {
    module(moduleTitle, function (hooks) {
      hooks.beforeEach(function () {
        (
          this.owner.lookup(
            'service:responsive-image'
          ) as ResponsiveImageService
        ).meta = {
          ...defaultMeta,
          images,
        };
      });

      test('retrieve generated images by name', function (assert) {
        const service = this.owner.lookup(
          'service:responsive-image-local'
        ) as ResponsiveImageLocalService;
        const images = service.getImages('test.png');
        assert.deepEqual(images, imageMetas);
      });

      test('handle absolute paths', function (assert) {
        const service = this.owner.lookup(
          'service:responsive-image-local'
        ) as ResponsiveImageLocalService;
        const images = service.getImages('/test.png');
        assert.deepEqual(images, imageMetas);
      });

      test('retrieve generated images by name and type', function (assert) {
        const service = this.owner.lookup(
          'service:responsive-image-local'
        ) as ResponsiveImageLocalService;
        let images = service.getImages('test.png', 'png');
        assert.deepEqual(images, [imageMetas[0], imageMetas[2]]);

        images = service.getImages('test.png', 'webp');
        assert.deepEqual(images, [imageMetas[1], imageMetas[3]]);
      });

      test('get available types', function (assert) {
        const service = this.owner.lookup(
          'service:responsive-image-local'
        ) as ResponsiveImageLocalService;
        const types = service.getAvailableTypes('test.png');
        assert.deepEqual(types, ['png', 'webp']);
      });

      test('retrieve generated image data by size', function (assert) {
        const baseService = this.owner.lookup(
          'service:responsive-image'
        ) as ResponsiveImageService;
        const service = this.owner.lookup(
          'service:responsive-image-local'
        ) as ResponsiveImageLocalService;
        baseService.physicalWidth = 100;
        let images = service.getImageMetaBySize('test.png', 120);
        assert.deepEqual(images, imageMetas[2]);
        images = service.getImageMetaBySize('test.png', 60);
        assert.deepEqual(images, imageMetas[2]);
        images = service.getImageMetaBySize('test.png', 45);
        assert.deepEqual(images, imageMetas[0]);
      });

      test('retrieve generated image data by size and type', function (assert) {
        const baseService = this.owner.lookup(
          'service:responsive-image'
        ) as ResponsiveImageService;
        const service = this.owner.lookup(
          'service:responsive-image-local'
        ) as ResponsiveImageLocalService;
        baseService.physicalWidth = 100;
        let images = service.getImageMetaBySize('test.png', 120, 'webp');
        assert.deepEqual(images, imageMetas[3]);
        images = service.getImageMetaBySize('test.png', 60, 'webp');
        assert.deepEqual(images, imageMetas[3]);
        images = service.getImageMetaBySize('test.png', 45, 'webp');
        assert.deepEqual(images, imageMetas[1]);
      });
    });
  });
});
