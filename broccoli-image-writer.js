'use strict';
/**
 * Created by andreasschacht on 28.01.16.
 */
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const mkdirp = require('mkdirp');
const gm = require('gm').subClass({imageMagick: true});
const Q = require('q');
const CachingWriter = require('broccoli-caching-writer');
const util = require('util');
const async = require('async-q');

function ImageResizer(inputNodes, options, metaData, userInterface) {
  options = options || {};
  this.image_options = options;
  this.metaData = metaData || {};
  options.cacheInclude = [/.*/];
  this.ui = userInterface;
  CachingWriter.call(this, inputNodes, options);
}

util.inherits(ImageResizer, CachingWriter);

ImageResizer.prototype.writeGreen = function(message) {
  if (this.ui) {
    this.ui.writeLine(chalk.green(message));
  }
};

ImageResizer.prototype.writeRed = function(message) {
  if (this.ui) {
    this.ui.writeLine(chalk.red(message));
  }
};

ImageResizer.prototype.build = function () {
  let sourcePath = this.inputPaths[0];
  let destinationPath = path.join(this.outputPath, this.image_options.destinationDir);
  let promises = [];
  try {
    //make destination folder, if not exists
    mkdirp.sync(destinationPath);
    //read files from source folder
    let files = fs.readdirSync(sourcePath);
    files.forEach((file) => {
      this.writeGreen(file);

      let newPromise;
      if (this.image_options.justCopy) {
        newPromise = this.copyImages(file, sourcePath, destinationPath);
      } else {
        newPromise = this.generateImages(file, sourcePath, destinationPath);
      }
      promises = promises.concat(newPromise);
    });
  } catch (e) {
    this.writeRed(e);
    return e;
  }
  return async.parallelLimit(promises, 4).then((values) => {
    let message = promises.length + ' images ' + (this.image_options.justCopy ? 'copied' : 'generated');
    this.writeGreen('\n' + message + '\n');
  });
};

/**
 *
 * @param file
 * @param sourcePath
 * @param destinationPath
 * @returns {Array} an array of promise-functions
 */
ImageResizer.prototype.generateImages = function (file, sourcePath, destinationPath) {
  let promises = [];
  let gmImage = gm(path.join(sourcePath, file));
  let imageInfos = Q.all([
    Q.ninvoke(gmImage, 'format'),
    Q.ninvoke(gmImage, 'color'),
    Q.ninvoke(gmImage, 'size')
  ]);
  this.image_options.supportedWidths.forEach((width) => {
    promises.push(() => {
      return imageInfos.then((infos) => this.generateImage(file, sourcePath, destinationPath, width, infos));
    });
  });
  return promises;
};

/**
 * copy file from sourcePath to destinationPath for all the needed image size
 *
 * @param file
 * @param sourcePath
 * @param destinationPath
 * @returns {Array} an array of promise-functions
 */
ImageResizer.prototype.copyImages = function (file, sourcePath, destinationPath) {
  let promises = [];
  let source = path.join(sourcePath, file);
  let imageSize = Q.ninvoke(gm(source), 'size');
  this.image_options.supportedWidths.forEach((width) => {
    promises.push(() => {
      return imageSize.then((size) => {
        let generatedFilename = this.generateFilename(file, width);
        let destination = path.join(destinationPath, generatedFilename);
        this.insertMetadata(file, generatedFilename, width, ['', '', size]);
        return Q.nfcall(fs.copy, source, destination);
      });
    });
  });

  return promises;
};


/**
 * generate resized file from sourcePath to destinationPath for all the needed image size
 *
 * @param file
 * @param sourcePath
 * @param destinationPath
 * @param width
 * @param {Array} info
 * @returns {deferred.promise|*}
 */
ImageResizer.prototype.generateImage = function (file, sourcePath, destinationPath, width, infos) {
  let source = path.join(sourcePath, file);
  let generatedFilename = this.generateFilename(file, width);
  let destination = path.join(destinationPath, generatedFilename);
  let gmImage = gm(source);
  let format = infos[0];
  let colors = parseInt(infos[1], 10);

  gmImage.resize(width, null, '>') // resize, but do not enlarge
    .quality(this.image_options.quality)
    .strip() // remove profiles or comments
    .interlace('Line')
  ;

  if (format === 'PNG' && colors <= 256) {
    // force PNG8 to stay PNG8
    // gm otherwise writes a PNG24 file
    gmImage.colors(colors);
    gmImage.setFormat('PNG8');
  }

  this.insertMetadata(file, generatedFilename, width, infos);
  return Q.ninvoke(gmImage, 'write', destination);
};

ImageResizer.prototype.generateFilename = function (file, width) {
  return file.substr(0, file.lastIndexOf('.')) + width + 'w.' + file.substr(file.lastIndexOf('.') + 1);
};

ImageResizer.prototype.insertMetadata = function (filename, imagename, width, infos) {
  let image = path.join(this.image_options.rootURL, this.image_options.destinationDir, imagename);
  let aspectRatio = 1;
  if (infos[2].height > 0) {
    aspectRatio = Math.round((infos[2].width / infos[2].height) * 100) / 100;
  }
  let height = Math.round(width / aspectRatio);
  let meta = {
    image,
    width,
    height
  };
  if (this.metaData.hasOwnProperty(filename) === false) {
    this.metaData[filename] = [];
  }
  this.metaData[filename].push(meta);
};

module.exports = ImageResizer;
