'use strict';

/**
 * Created by andreasschacht on 28.01.16.
 */
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const CachingWriter = require('broccoli-caching-writer');
const async = require('async-q');
const sharp = require('sharp');

class ImageResizer extends CachingWriter {
  constructor(inputNodes, options, metaData, configData, imagePreProcessors, imagePostProcessors, userInterface) {
    options = options || {};
    options.cacheInclude = [/.*/];
    super(inputNodes, options);

    this.image_options = options;
    this.metaData = metaData || {};
    this.configData = configData || {};
    this.imagePreProcessors = imagePreProcessors || [];
    this.imagePostProcessors = imagePostProcessors || [];
    this.ui = userInterface;
  }

  writeGreen(message) {
    if (this.ui) {
      this.ui.writeLine(chalk.green(message));
    }
  }

  build() {
    let sourcePath = this.inputPaths[0];
    let destinationPath = path.join(this.outputPath, this.image_options.destinationDir);
    let justCopy = this.image_options.justCopy;

    fs.ensureDirSync(destinationPath);
    let files = fs.readdirSync(sourcePath);

    let tasks = files
      .map((file) => {
        this.writeGreen(file);
        this.addConfigData(file);
        if (justCopy) {
          return this.copyImages(file, sourcePath, destinationPath);
        } else {
          return this.generateImages(file, sourcePath, destinationPath);
        }
      })
      .reduce((res, fns) => res.concat(fns), []); // flat map to an array of promise-functions

    return async.parallelLimit(tasks, 4).then(() => {
      this.writeGreen(`\n${tasks.length} images ${justCopy ? 'copied' : 'generated'}.\n`);
    });
  }

  /**
   *
   * @param file
   * @param sourcePath
   * @param destinationPath
   * @returns {Array} an array of promise-functions
   */
  generateImages(file, sourcePath, destinationPath) {
    let image = sharp(path.join(sourcePath, file));
    let metaPromise = image.metadata();
    return this.image_options.supportedWidths.map((width) => {
      return () => {
        return metaPromise.then((meta) => this.generateImage(
          file,
          sourcePath,
          destinationPath,
          width,
          meta
        ));
      }
    });
  }

  /**
   * copy file from sourcePath to destinationPath for all the needed image size
   *
   * @param file
   * @param sourcePath
   * @param destinationPath
   * @returns {Array} an array of promise-functions
   */
  copyImages(file, sourcePath, destinationPath) {
    let source = path.join(sourcePath, file);
    let image = sharp(source);
    let metaPromise = image.metadata();
    return this.image_options.supportedWidths.map((width) => {
      return () => {
        return metaPromise.then((meta) => {
          let generatedFilename = this.generateFilename(file, width);
          let destination = path.join(destinationPath, generatedFilename);
          this.insertMetadata(file, generatedFilename, width, meta);
          return fs.copy(source, destination);
        });
      }
    });
  }

  /**
   * generate resized file from sourcePath to destinationPath for all the needed image size
   *
   * @param file
   * @param sourcePath
   * @param destinationPath
   * @param width
   * @param {Object} meta
   * @returns {deferred.promise|*}
   */
  generateImage(file, sourcePath, destinationPath, width, meta) {
    let source = path.join(sourcePath, file);
    let generatedFilename = this.generateFilename(file, width);
    let destination = path.join(destinationPath, generatedFilename);

    this.insertMetadata(file, generatedFilename, width, meta);
    let sharped = sharp(source);
    return this.preProcessImage(sharped, file, width)
    .then((preProcessedSharp) => {
      preProcessedSharp.resize(width, null)
      .withoutEnlargement(true)
      .jpeg({
        quality: this.image_options.quality,
        progressive: true,
        force: false
      });
      return this.postProcessImage(preProcessedSharp, file, width);
    })
    .then((postProcessed) => {
      return postProcessed.toFile(destination);
    });
  }

  /**
   * calls the image pre-processors
   *
   * @param sharp
   * @param filename
   * @param width
   * @returns {deferred.promise|*}
   */
  preProcessImage(sharp, filename, width) {
    return this.imagePreProcessors.reduce((sharpPromise, processor) => {
      return sharpPromise.then((result) => Promise.resolve(processor.callback.call(processor.target, result, filename, width, this.image_options)));
    }, Promise.resolve(sharp));
  }

  /**
   * calls the image post-processors
   *
   * @param sharp
   * @param filename
   * @param width
   * @returns {deferred.promise|*}
   */
  postProcessImage(sharp, filename, width) {
    return this.imagePostProcessors.reduce((sharpPromise, processor) => {
      return sharpPromise.then((result) => Promise.resolve(processor.callback.call(processor.target, result, filename, width, this.image_options)));
    }, Promise.resolve(sharp));
  }

  generateFilename(file, width) {
    return file.substr(0, file.lastIndexOf('.')) + width + 'w.' + file.substr(file.lastIndexOf('.') + 1);
  }

  insertMetadata(filename, imagename, width, meta) {
    let image = path.join(this.image_options.rootURL, this.image_options.destinationDir, imagename);
    if (process.platform === 'win32') {
      image = image.replace(/\\/g, '/');
    }
    let aspectRatio = 1;
    if (meta.height > 0) {
      aspectRatio = Math.round((meta.width / meta.height) * 100) / 100;
    }
    let height = Math.round(width / aspectRatio);
    let metadata = {
      image,
      width,
      height
    };
    if (this.metaData.hasOwnProperty(filename) === false) {
      this.metaData[filename] = { images: [] };
    }
    this.metaData[filename].images.push(metadata);
  }

  /**
   * adds the current configuration options for a particular image
   *
   * @param filename
   * @private
   */
  addConfigData(filename) {
    if (this.configData.hasOwnProperty(filename) === false) {
      this.configData[filename] = this.image_options;
    }
  }

}

module.exports = ImageResizer;
