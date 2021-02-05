const sharp = require('sharp');

class LqipInlinePlugin {
  processed = [];
  metaData = new Map();

  constructor(addon) {
    addon.addMetadataExtension(this.addMetaData, this);
    addon.addImagePreProcessor(this.imagePreProcessor, this);
  }

  canProcessImage(config) {
    return config.lqip && config.lqip.type === 'inline';
  }

  getLqipWidth(config) {
    return config.lqip.width ?? 10;
  }

  async imagePreProcessor(sharped, image, width, config) {
    if (this.processed.includes(image) || !this.canProcessImage(config)) {
      return sharped;
    }
    this.processed.push(image);

    const buffer = await sharped.toBuffer();
    const lqi = await sharp(buffer)
      .resize(this.getLqipWidth(config), null, {
        withoutEnlargement: true,
      })
      .png({
        force: false,
      });

    const sharpMeta = await lqi.metadata();

    const meta = {
      image: (await lqi.toBuffer()).toString('base64'),
      width: sharpMeta.width,
      height: sharpMeta.height,
    };

    this.metaData.set(image, meta);

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

module.exports = LqipInlinePlugin;
