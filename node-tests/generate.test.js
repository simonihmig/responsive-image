const sharp = require('sharp');
const jpegquality = require('jpegquality');
const execa = require('execa');
const fs = require('fs');
const path = require('path');

const hash = '00e24234f1b58e32b935b1041432916f';
// compare with tests/dummy/config/environment.js
const images = [
  {
    file: 'assets/images/image.jpg',
    type: 'image/jpeg',
    sizes: [50, 100],
    alpha: false,
    jpeqQuality: 50,
    removeSource: true,
  },
  {
    file: 'assets/images/image.webp',
    type: 'image/webp',
    sizes: [50, 100],
    alpha: false,
    removeSource: true,
  },
  {
    file: 'assets/images/test.png',
    type: 'image/png',
    sizes: [50, 100],
    alpha: true,
    removeSource: true,
  },
  {
    file: 'assets/images/test.webp',
    type: 'image/webp',
    sizes: [50, 100],
    alpha: true,
    removeSource: true,
  },
  {
    file: 'assets/images/recursive/dir/test.png',
    type: 'image/png',
    sizes: [50, 100],
    alpha: false,
    removeSource: true,
  },
  {
    file: 'assets/images/small.png',
    type: 'image/png',
    sizes: [10, 25],
    alpha: false,
    removeSource: false,
  },
  {
    file: 'assets/images/small.webp',
    type: 'image/webp',
    sizes: [10, 25],
    alpha: false,
    removeSource: true,
  },
];
const aspectRatio = 2;
const appDir = './dist';

beforeAll(function () {
  jest.setTimeout(300000);
  return execa('./node_modules/ember-cli/bin/ember', ['build']);
});

images.forEach((img) => {
  img.sizes.forEach((width) => {
    test(`loads image ${img.file} ${width}w`, async function () {
      const [filename, ext] = img.file.split(['.']);

      const imageData = fs.readFileSync(
        path.join(appDir, `${filename}${width}w-${hash}.${ext}`)
      );
      const originalSource = path.join(appDir, `${filename}-${hash}.${ext}`);
      const meta = await sharp(imageData).metadata();

      expect(meta).toBeDefined();
      expect(meta.width).toEqual(width);
      expect(meta.height).toEqual(Math.round(width / aspectRatio));
      expect(meta.format).toEqual(img.type.split('/')[1]);
      expect(meta.hasAlpha).toEqual(img.alpha);
      expect(meta.hasProfile).toEqual(false);
      expect(fs.existsSync(originalSource)).toBe(!img.removeSource);

      if (img.jpeqQuality) {
        expect(Math.round(jpegquality(imageData))).toEqual(img.jpeqQuality);
      }
    });
  });
});
