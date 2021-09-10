const normalizePath = require('../utils/normalize-path');

class LqipColorPlugin {
  constructor(addon) {
    this.processed = [];
    this.metaData = new Map();

    addon.addMetadataExtension(this.addMetaData, this);
    addon.addImagePreProcessor(this.imagePreProcessor, this);
    addon.addCssExtension(this.addCss, this);
  }

  canProcessImage(config) {
    return config.lqip && config.lqip.type === 'color';
  }

  async imagePreProcessor(sharped, image, _width, config) {
    if (this.processed.includes(image) || !this.canProcessImage(config)) {
      return sharped;
    }
    this.processed.push(image);

    const { dominant } = await sharped.stats();
    const color =
      '#' +
      dominant.r.toString(16) +
      dominant.g.toString(16) +
      dominant.b.toString(16);

    this.metaData.set(normalizePath(image), { color });

    return sharped;
  }

  addMetaData(image, metadata /*, config*/) {
    const ourMeta = this.metaData.get(image);
    if (ourMeta) {
      metadata.lqip = { type: 'color', class: ourMeta.class };
    }

    return metadata;
  }

  addCss(image, metaData, { generateClassName }) {
    const ourMeta = this.metaData.get(image);
    if (ourMeta) {
      const className = generateClassName();
      ourMeta.class = className;
      return `.${className} { background-color: ${ourMeta.color}; }`;
    }

    return undefined;
  }
}

module.exports = LqipColorPlugin;
