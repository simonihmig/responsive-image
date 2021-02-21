'use strict';

const CachingWriter = require('broccoli-caching-writer');
const path = require('path');
const fs = require('fs-extra');
const baseN = require('base-n');

const b64 = baseN.create();

class CssWriter extends CachingWriter {
  constructor(inputNodes, getMeta, cssExtensions, options) {
    options = options || {};
    options.cacheInclude = [/.*/];
    super(inputNodes, options);

    this.getMeta = getMeta;
    this.cssExtensions = cssExtensions;
  }

  async build() {
    const destinationPath = path.join(
      this.outputPath,
      'ember-responsive-image-dynamic.css'
    );

    await fs.writeFile(destinationPath, this.generateCss());
  }

  generateCss() {
    const meta = this.getMeta();
    let cssEntries = [];

    let classCounter = 0;
    const generateClassName = () => `eri-dyn-${b64.encode(classCounter++)}`;

    for (const [image, imageMeta] of Object.entries(meta)) {
      for (const { callback, target } of this.cssExtensions) {
        const css = callback.call(target, image, imageMeta, {
          generateClassName,
        });
        if (css) {
          cssEntries.push(css);
        }
      }
    }

    return cssEntries.join(`\n`);
  }
}

module.exports = CssWriter;
