'use strict';

/**
 * Created by andreasschacht on 28.01.16.
 */
const path = require('path');
const fs = require('fs-extra');
const CachingWriter = require('broccoli-caching-writer');
const async = require('async-q');
const sharp = require('sharp');

class ImageResizer extends CachingWriter {
  constructor(
    inputNodes,
    options,
    metaData,
    configData,
    imagePreProcessors,
    imagePostProcessors,
    userInterface
  ) {
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

  writeInfoLine(message) {
    if (this.ui) {
      this.ui.writeInfoLine(message);
    }
  }

  writeWarnLine(message) {
    if (this.ui) {
      this.ui.writeWarnLine(message);
    }
  }

  async build() {
    let sourcePath = this.inputPaths[0];
    let destinationPath = path.join(
      this.outputPath,
      this.image_options.destinationDir
    );
    let justCopy = this.image_options.justCopy;

    let files = this.getFiles(sourcePath, null, this.image_options.recursive);

    if (
      this.image_options.justCopy &&
      (this.imagePreProcessors.length || this.imagePostProcessors.length)
    ) {
      this.writeWarnLine(
        'You turned on the copy-mode and there are image-processors registered. So be aware of the image processors will be called, but their result will be ignored'
      );
    }

    let tasks = files
      .map((file) => {
        this.writeInfoLine(file);
        this.addConfigData(file);
        if (justCopy) {
          return this.copyImages(file, sourcePath, destinationPath);
        } else {
          return this.generateImages(file, sourcePath, destinationPath);
        }
      })
      .reduce((res, fns) => res.concat(fns), []); // flat map to an array of promise-functions

    await async.parallelLimit(tasks, 4);
    this.writeInfoLine(
      `\n${tasks.length} images ${justCopy ? 'copied' : 'generated'}.\n`
    );
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
      return async () => {
        let meta = await metaPromise;
        await this.generateImage(
          file,
          sourcePath,
          destinationPath,
          width,
          meta
        );
      };
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
      return async () => {
        let meta = await metaPromise;
        let generatedFilename = this.generateFilename(file, width);
        let destination = path.join(destinationPath, generatedFilename);
        this.insertMetadata(file, generatedFilename, width, meta);
        if (this.imagePreProcessors.length || this.imagePostProcessors.length) {
          let preProcessedSharp = await this.preProcessImage(
            sharp(source),
            file,
            width
          );
          await this.postProcessImage(preProcessedSharp, file, width);
          return fs.copy(source, destination);
        } else {
          return fs.copy(source, destination);
        }
      };
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
  async generateImage(file, sourcePath, destinationPath, width, meta) {
    let source = path.join(sourcePath, file);
    let generatedFilename = this.generateFilename(file, width);
    let destination = path.join(destinationPath, generatedFilename);
    fs.ensureDirSync(path.dirname(destination));

    this.insertMetadata(file, generatedFilename, width, meta);
    let sharped = sharp(source);
    let preProcessedSharp = await this.preProcessImage(sharped, file, width);
    preProcessedSharp.resize(width, null, { withoutEnlargement: true }).jpeg({
      quality: this.image_options.quality,
      progressive: true,
      force: false,
    });
    let postProcessed = await this.postProcessImage(
      preProcessedSharp,
      file,
      width
    );
    return postProcessed.toFile(destination);
  }

  /**
   * calls the image pre-processors
   *
   * @param sharp
   * @param filename
   * @param width
   * @returns {deferred.promise|*}
   */
  async preProcessImage(sharp, filename, width) {
    let result = sharp;
    for (let processor of this.imagePreProcessors) {
      result = await processor.callback.call(
        processor.target,
        result,
        filename,
        width,
        this.image_options
      );
    }

    return result;
  }

  /**
   * calls the image post-processors
   *
   * @param sharp
   * @param filename
   * @param width
   * @returns {deferred.promise|*}
   */
  async postProcessImage(sharp, filename, width) {
    let result = sharp;
    for (let processor of this.imagePostProcessors) {
      let result = await processor.callback.call(
        processor.target,
        result,
        filename,
        width,
        this.image_options
      );
    }

    return result;
  }

  generateFilename(file, width) {
    return (
      file.substr(0, file.lastIndexOf('.')) +
      width +
      'w.' +
      file.substr(file.lastIndexOf('.') + 1)
    );
  }

  insertMetadata(filename, imagename, width, meta) {
    let image = path.join(
      this.image_options.rootURL,
      this.image_options.destinationDir,
      imagename
    );
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
      height,
    };
    if (
      Object.prototype.hasOwnProperty.call(this.metaData, filename) === false
    ) {
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
    if (
      Object.prototype.hasOwnProperty.call(this.configData, filename) === false
    ) {
      this.configData[filename] = this.image_options;
    }
  }

  /**
   * Gets the files to process, potentially recursively
   * @param {string} sourcePath The starting path to index
   * @param {string} subPath The sub path to index or null
   * @param {boolean} recursive Should sub directories be indexed
   * @private
   * @returns {string[]} List of files
   */
  getFiles(sourcePath, subPath, recursive) {
    let files = [];
    let currentPath = subPath ? path.join(sourcePath, subPath) : sourcePath;
    let directoryContents = fs.readdirSync(currentPath);
    for (let item of directoryContents) {
      let fullFilePath = path.join(currentPath, item);
      let stat = fs.lstatSync(fullFilePath);
      if (stat.isDirectory() && recursive) {
        let subPathToIndex = subPath ? path.join(subPath, item) : item;
        files.push(...this.getFiles(sourcePath, subPathToIndex, true));
      } else if (stat.isDirectory()) {
        this.writeWarnLine(
          'The sourceDir contains a directory but "recursive" is not enabled so the contents will be ignored'
        );
      } else {
        files.push(subPath ? path.join(subPath, item) : item);
      }
    }
    return files;
  }
}

module.exports = ImageResizer;
