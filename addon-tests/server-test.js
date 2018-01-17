'use strict';

const RSVP = require('rsvp');
const request = RSVP.denodeify(require('request'));
const AddonTestApp = require('ember-cli-addon-tests').AddonTestApp;
const expect = require('chai').expect;
const sharp = require('sharp');
const jpegquality = require('jpegquality');

const hash = '00e24234f1b58e32b935b1041432916f';
const images = [
  {
    file: 'test.jpg',
    type: 'image/jpeg',
    alpha: false,
    jpeqQuality: 50
  },
  {
    file: 'test.png',
    type: 'image/png',
    alpha: true
  }
];
const sizes = [50, 100];
const aspectRatio = 2;

describe('serve assets acceptance', function() {
  this.timeout(600000);

  let app;

  before(function() {

    app = new AddonTestApp();

    return app.create('dummy', {
      fixturesPath: 'addon-tests/fixtures'
    })
      .then(function() {
        return app.startServer();
      });
  });

  after(function() {
    return app.stopServer();
  });

  images.forEach((img) => {
    sizes.forEach((width) => {
      it(`loads image ${img.file} ${width}w`, function() {
        let parts = img.file.split(['.']);
        let name = parts[0];
        let ext = parts[1];
        let response;

        return request({
          url: `http://localhost:49741/assets/images/responsive/${name}${width}w-${hash}.${ext}`,
          encoding: null // for binary data, returns a Buffer
        })
          .then(function(r) {
            response = r;
            expect(response.statusCode).to.equal(200);
            expect(response.headers["content-type"]).to.eq(img.type);

            return sharp(response.body).metadata();
          })
          .then(function(meta) {
            expect(meta.width).to.equal(width);
            expect(meta.height).to.equal(Math.round(width/aspectRatio));
            expect(meta.format).to.equal(img.type.split('/')[1]);
            expect(meta.hasAlpha).to.equal(img.alpha);
            expect(meta.hasProfile).to.be.false;

            if (img.jpeqQuality) {
              expect(Math.round(jpegquality(response.body))).to.equal(img.jpeqQuality);
            }
          });
      });
    })
  });
});
