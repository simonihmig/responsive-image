const sharp = require('sharp');
const blurhash = require('blurhash');
const normalizePath = require('../utils/normalize-path');

class LqipBlurhashPlugin {
  constructor(addon) {
    this.processed = [];
    this.metaData = new Map();

    addon.addMetadataExtension(this.addMetaData, this);
    addon.addImagePreProcessor(this.imagePreProcessor, this);
  }

  canProcessImage(config) {
    return config.lqip && config.lqip.type === 'blurhash';
  }

  async getLqipDimensions(config, sharped) {
    const meta = await sharped.metadata();
    const targetPixels = config.lqip.targetPixels || 16;
    const aspectRatio = meta.width / meta.height;

    // taken from https://github.com/google/eleventy-high-performance-blog/blob/5ed39db7fd3f21ae82ac1a8e833bf283355bd3d0/_11ty/blurry-placeholder.js#L74-L92
    let bitmapHeight = targetPixels / aspectRatio;
    bitmapHeight = Math.sqrt(bitmapHeight);
    let bitmapWidth = targetPixels / bitmapHeight;

    // Blurhash has a limit of 9 "components"
    bitmapHeight = Math.min(9, Math.round(bitmapHeight));
    bitmapWidth = Math.min(9, Math.round(bitmapWidth));
    return { width: Math.round(bitmapWidth), height: Math.round(bitmapHeight) };
  }

  async imagePreProcessor(sharped, image, _width, config) {
    if (this.processed.includes(image) || !this.canProcessImage(config)) {
      return sharped;
    }
    this.processed.push(image);

    const { width, height } = await this.getLqipDimensions(config, sharped);
    const rawWidth = width * 8;
    const rawHeight = height * 8;
    const buffer = await sharped.toBuffer();
    const lqi = await sharp(buffer)
      .ensureAlpha()
      .resize(rawWidth, rawHeight, {
        fit: 'fill',
      })
      .raw();

    const data = new Uint8ClampedArray(await lqi.toBuffer());
    const hash = blurhash.encode(data, rawWidth, rawHeight, width, height);

    const meta = {
      type: 'blurhash',
      hash,
      width,
      height,
    };

    this.metaData.set(normalizePath(image), meta);

    return sharped;
  }

  addMetaData(image, metadata /*, config*/) {
    const ourMeta = this.metaData.get(image);
    if (ourMeta) {
      metadata.lqip = ourMeta;
    }

    return metadata;
  }
}

module.exports = LqipBlurhashPlugin;
