const sharp = require('sharp');
const jpegquality = require('jpegquality');
const execa = require('execa');
const fs = require('fs');
const path = require('path');

const hash = '00e24234f1b58e32b935b1041432916f';
const images = [
  {
    file: 'test.jpg',
    type: 'image/jpeg',
    alpha: false,
    jpeqQuality: 50,
  },
  {
    file: 'test.png',
    type: 'image/png',
    alpha: true,
  },
];
const sizes = [50, 100];
const aspectRatio = 2;
const appDir = './dist';

beforeAll(function () {
  jest.setTimeout(300000);
  return execa('./node_modules/ember-cli/bin/ember', ['build']);
});

images.forEach((img) => {
  sizes.forEach((width) => {
    test(`loads image ${img.file} ${width}w`, async function () {
      const [name, ext] = img.file.split(['.']);

      const imageData = fs.readFileSync(
        path.join(
          appDir,
          `assets/images/responsive/${name}${width}w-${hash}.${ext}`
        )
      );

      const meta = await sharp(imageData).metadata();

      expect(meta).toBeDefined();
      expect(meta.width).toEqual(width);
      expect(meta.height).toEqual(Math.round(width / aspectRatio));
      expect(meta.format).toEqual(img.type.split('/')[1]);
      expect(meta.hasAlpha).toEqual(img.alpha);
      expect(meta.hasProfile).toEqual(false);

      if (img.jpeqQuality) {
        expect(Math.round(jpegquality(imageData))).toEqual(img.jpeqQuality);
      }
    });
  });
});
