'use strict';

const path = require('path');
const fs = require('fs-extra');
const CachingWriter = require('broccoli-caching-writer');
const async = require('async-q');
const sharp = require('sharp');

const imageExtensions = {
  jpeg: 'jpg',
};

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

  writeWarnLine(message) {
    if (this.ui) {
      this.ui.writeWarnLine(message);
    }
  }

  async build() {
    const sourcePath = this.inputPaths[0];
    const destinationPath = path.join(
      this.outputPath,
      this.image_options.destinationDir
    );
    const justCopy = this.image_options.justCopy;

    const files = this.getFiles(sourcePath, null);

    if (
      this.image_options.justCopy &&
      (this.imagePreProcessors.length || this.imagePostProcessors.length)
    ) {
      this.writeWarnLine(
        'You turned on the copy-mode and there are image-processors registered. So be aware of the image processors will be called, but their result will be ignored'
      );
    }

    let tasks = [];
    for (const file of files) {
      let image = sharp(path.join(sourcePath, file))
        .jpeg({
          quality: this.image_options.quality,
          progressive: true,
          force: false,
        })
        .webp({
          quality: this.image_options.quality,
          force: false,
        })
        .avif({
          quality: this.image_options.quality,
          force: false,
        });
      this.addConfigData(file);

      const meta = await image.metadata();
      let newTasks;
      if (justCopy) {
        newTasks = this.copyImages(file, image, meta, destinationPath);
      } else {
        newTasks = this.generateImages(file, image, meta, destinationPath);
      }
      this.generateMetaData(file, image, meta);

      tasks = [...tasks, ...newTasks];
    }

    await async.parallelLimit(tasks, 4);
  }

  /**
   *
   * @param filename
   * @param image
   * @param meta
   * @param destinationPath
   * @returns {Array} an array of promise-functions
   */
  generateImages(filename, image, meta, destinationPath) {
    return this.image_options.widths.map((width) => {
      return async () => {
        await this.generateResizedImages(
          filename,
          image,
          destinationPath,
          width,
          meta
        );
      };
    });
  }

  imageFormatsFor(meta) {
    if (this.image_options.formats) {
      return this.image_options.formats;
    }

    const preferredFormats = ['webp', 'avif'];
    // generate next-gen formats, but also include the original one (e.g. png or jpeg)
    return preferredFormats.includes(meta.format)
      ? preferredFormats
      : [...preferredFormats, meta.format];
  }

  /**
   * copy file from sourcePath to destinationPath for all the needed image size
   *
   * @param filename
   * @param image
   * @param meta
   * @param destinationPath
   * @returns {Array} an array of promise-functions
   */
  copyImages(filename, image, meta, destinationPath) {
    const source = path.join(this.inputPaths[0], filename);
    const formats = this.imageFormatsFor(meta);
    const tasks = [];

    for (const width of this.image_options.widths) {
      for (const format of formats) {
        const task = async () => {
          const generatedFilename = this.generateFilename(
            filename,
            width,
            format
          );
          const destination = path.join(destinationPath, generatedFilename);
          const preProcessedSharp = await this.preProcessImage(
            sharp(source),
            filename,
            width
          );
          await this.postProcessImage(preProcessedSharp, filename, width);
          return fs.copy(source, destination);
        };

        tasks.push(task);
      }
    }

    return tasks;
  }

  /**
   * generate resized file from sourcePath to destinationPath for all the needed image size
   *
   * @param filename
   * @param sharpObject
   * @param destinationPath
   * @param width
   * @param {Object} meta
   * @returns {deferred.promise|*}
   */
  async generateResizedImages(
    filename,
    sharpObject,
    destinationPath,
    width,
    meta
  ) {
    const preProcessedSharp = await this.preProcessImage(
      sharpObject.clone(),
      filename,
      width
    );
    preProcessedSharp.resize(width, null, { withoutEnlargement: true });
    const postProcessedSharp = await this.postProcessImage(
      preProcessedSharp,
      filename,
      width
    );

    const formats = this.imageFormatsFor(meta);
    return Promise.all(
      formats.map((format) =>
        this.saveImage(
          filename,
          postProcessedSharp,
          destinationPath,
          format,
          width
        )
      )
    );
  }

  async saveImage(filename, image, destinationPath, format, width) {
    const generatedFilename = this.generateFilename(filename, width, format);
    const destination = path.join(destinationPath, generatedFilename);
    await fs.ensureDir(path.dirname(destination));

    await image.toFormat(format).toFile(destination);
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

  generateFilename(file, width, format) {
    const ext = imageExtensions[format] || format;
    const base = file.substr(0, file.lastIndexOf('.'));
    return `${base}${width}w.${ext}`;
  }

  generateMetaData(imageWebPath, sharpImage, sharpMeta) {
    let aspectRatio = 1;
    if (sharpMeta.height > 0) {
      aspectRatio =
        Math.round((sharpMeta.width / sharpMeta.height) * 100) / 100;
    }
    const formats = this.imageFormatsFor(sharpMeta);

    this.metaData[imageWebPath] = {
      widths: this.image_options.widths,
      formats,
      aspectRatio,
    };
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
   * @private
   * @returns {string[]} List of files
   */
  getFiles(sourcePath, subPath) {
    let files = [];
    let currentPath = subPath ? path.join(sourcePath, subPath) : sourcePath;
    let directoryContents = fs.readdirSync(currentPath);
    for (let item of directoryContents) {
      let fullFilePath = path.join(currentPath, item);
      let stat = fs.lstatSync(fullFilePath);
      if (stat.isDirectory()) {
        let subPathToIndex = subPath ? path.join(subPath, item) : item;
        files.push(...this.getFiles(sourcePath, subPathToIndex));
      } else {
        files.push(subPath ? path.join(subPath, item) : item);
      }
    }
    return files;
  }
}

module.exports = ImageResizer;
