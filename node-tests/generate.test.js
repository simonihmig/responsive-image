const sharp = require('sharp');
const jpegquality = require('jpegquality');
const execa = require('execa');
const fs = require('fs');
const path = require('path');

const hash = '00e24234f1b58e32b935b1041432916f';
const images = [
  {
    file: 'assets/images/tests/image.jpg',
    type: 'jpeg',
    sizes: [50, 100],
    alpha: false,
    jpeqQuality: 50,
    removeSource: true,
  },
  {
    file: 'assets/images/tests/image.webp',
    type: 'webp',
    sizes: [50, 100],
    alpha: false,
    removeSource: true,
  },
  {
    file: 'assets/images/tests/image.avif',
    // sharp wrongly reports this as heif. See https://github.com/lovell/sharp/issues/2504
    type: 'heif',
    sizes: [50, 100],
    alpha: false,
    removeSource: true,
  },
  {
    file: 'assets/images/tests/test.png',
    type: 'png',
    sizes: [50, 100],
    alpha: true,
    removeSource: true,
  },
  {
    file: 'assets/images/tests/test.webp',
    type: 'webp',
    sizes: [50, 100],
    alpha: true,
    removeSource: true,
  },
  {
    file: 'assets/images/tests/test.avif',
    type: 'heif',
    sizes: [50, 100],
    alpha: true,
    removeSource: true,
  },
  {
    file: 'assets/images/tests/recursive/dir/test.png',
    type: 'png',
    sizes: [50, 100],
    alpha: false,
    removeSource: true,
  },
  {
    file: 'assets/images/tests/small.png',
    type: 'png',
    sizes: [10, 25],
    alpha: false,
    removeSource: false,
  },
  {
    file: 'assets/images/tests/small.webp',
    type: 'webp',
    sizes: [10, 25],
    alpha: false,
    removeSource: true,
  },
  // image output is somehow broken for avif at the the tiny size of 10px
  // and sharp reports the size of 25 as 24 :-/
  // {
  //   file: 'assets/images/tests/small.avif',
  //   type: 'heif',
  //   sizes: [10, 25],
  //   alpha: false,
  //   removeSource: true,
  // },
];
const aspectRatio = 2;
const appDir = './dist';

beforeAll(function () {
  jest.setTimeout(300000);
  return execa('./node_modules/ember-cli/bin/ember', ['build'], {
    env: {
      ERI_FINGERPRINT: hash,
    },
  });
});

images.forEach((img) => {
  img.sizes.forEach((width) => {
    test(`loads image ${img.file} ${width}w`, async function () {
      const [filename, ext] = img.file.split(['.']);

      const imageData = fs.readFileSync(
        path.join(appDir, `${filename}${width}w-${hash}.${ext}`)
      );
      const originalSource = path.join(appDir, `${filename}.${ext}`);
      const meta = await sharp(imageData).metadata();

      expect(meta).toBeDefined();
      expect(meta.width).toEqual(width);
      expect(meta.height).toEqual(Math.round(width / aspectRatio));
      expect(meta.format).toEqual(img.type);
      expect(meta.hasAlpha).toEqual(img.alpha);
      expect(meta.hasProfile).toEqual(false);
      expect(fs.existsSync(originalSource)).toBe(!img.removeSource);

      if (img.jpeqQuality) {
        expect(Math.round(jpegquality(imageData))).toEqual(img.jpeqQuality);
      }
    });
  });
});
