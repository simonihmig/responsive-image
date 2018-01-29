/* jshint expr:true */
import { expect } from 'chai';
import {
  setupTest,
  it
} from 'ember-mocha';
import {
  describe,
  beforeEach
} from 'mocha';

const meta = {
  "prepend": "",
  "test.png": {
    images: [
      {
        "image": "/assets/images/responsive/test100w-00e24234f1b58e32b935b1041432916f.png",
        "width": 100,
        "height": 100
      },
      {
        "image": "/assets/images/responsive/test50w-00e24234f1b58e32b935b1041432916f.png",
        "width": 50,
        "height": 50
      }
    ]
  }
};

describe(
  'ResponsiveImageService',
  function() {
    setupTest('service:responsive-image', {});
    beforeEach(function() {
      let service = this.subject();
      service.set('meta', meta);
    });
    it('retrieve generated images by name', function() {
      let service = this.subject();
      let images = service.getImages('test.png');
      expect(images).to.be.deep.equal(meta['test.png'].images);
    });
    it('retrieve generated image data by size', function() {
      let service = this.subject();
      service.set('physicalWidth', 100);
      let images = service.getImageDataBySize('test.png', 120);
      expect(images).to.be.deep.equal(meta['test.png'].images[0]);
      images = service.getImageDataBySize('test.png', 60);
      expect(images).to.be.deep.equal(meta['test.png'].images[0]);
      images = service.getImageDataBySize('test.png', 45);
      expect(images).to.be.deep.equal(meta['test.png'].images[1]);
    });
    it('retrieve a generated image by size', function() {
      let service = this.subject();
      service.set('physicalWidth', 100);
      let image = service.getImageBySize('test.png', 120);
      expect(image).to.be.equal(meta['test.png'].images[0].image);
      image = service.getImageBySize('test.png', 60);
      expect(image).to.be.equal(meta['test.png'].images[0].image);
      image = service.getImageBySize('test.png', 45);
      expect(image).to.be.equal(meta['test.png'].images[1].image);
    });
  }
);
