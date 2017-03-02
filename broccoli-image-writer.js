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

ImageResizer.prototype.build = function () {
  let ui = this.ui;
  let writeLn = function (line) {
    if (ui) {
      ui.writeLine(line);
    }
  };

  let options = this.image_options;
  let sourcePath = this.inputPaths[0];
  let destinationPath = path.join(this.outputPath, options.destinationDir);
  let promises = [];

  try {
    //make destination folder, if not exists
    mkdirp.sync(destinationPath);
    //read files from source folder
    let files = fs.readdirSync(sourcePath);
    let that = this;
    files.forEach(function (file) {
      writeLn(chalk.green(file));
      let newPromise;
      if (options.justCopy) {
        newPromise = that.copyImages(file, sourcePath, destinationPath, options);
      } else {
        newPromise = that.generateImages(file, sourcePath, destinationPath, options);
      }
      promises = promises.concat(newPromise);
    });
  } catch (e) {
    writeLn(chalk.red(e));
    return e;
  }
  return async.parallelLimit(promises, 4).then(function (values) {
    let message = promises.length + ' images ' + (options.justCopy ? 'copied' : 'generated');
    writeLn(chalk.green('\n' + message + '\n'));
  });
};

/**
 *
 * @param file
 * @param sourcePath
 * @param destinationPath
 * @param widths
 * @param options
 * @returns {Array} an array of promise-functions
 */
ImageResizer.prototype.generateImages = function (file, sourcePath, destinationPath, options) {
  let promises = [];
  let that = this;
  options.supportedWidths.forEach(function (width) {
    promises.push(function () {
      return that.generateImage(file, sourcePath, destinationPath, width, options)
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
 * @param options
 * @returns {Array} an array of promise-functions
 */
ImageResizer.prototype.copyImages = function (file, sourcePath, destinationPath, options) {
  let promises = [];
  let that = this;
  options.supportedWidths.forEach(function (width) {
    let source = path.join(sourcePath, file);
    let generatedFilename = that.generateFilename(file, width);
    let destination = path.join(destinationPath, generatedFilename);
    let gmImage = gm(source);
    promises.push(function () {
      return Q.all([
        Q.ninvoke(gmImage, 'format'),
        Q.ninvoke(gmImage, 'color'),
        Q.ninvoke(gmImage, 'size')
      ])
      .then(function(infos) {
        that.insertMetadata(generatedFilename, width, infos, options);
        return Q.nfcall(fs.copy, source, destination);
      })
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
 * @returns {deferred.promise|*}
 */
ImageResizer.prototype.generateImage = function (file, sourcePath, destinationPath, width, options) {
  let source = path.join(sourcePath, file);
  let generatedFilename = this.generateFilename(file, width);
  let destination = path.join(destinationPath, generatedFilename);
  let that = this;
  let gmImage = gm(source);

  return Q.all([
      Q.ninvoke(gmImage, 'format'),
      Q.ninvoke(gmImage, 'color'),
      Q.ninvoke(gmImage, 'size')
    ])
    .then(function(infos) {
      let format = infos[0];
      let colors = parseInt(infos[1], 10);

      gmImage.resize(width, null, '>') // resize, but do not enlarge
        .quality(options.quality)
        .strip() // remove profiles or comments
        .interlace('Line')
      ;

      if (format === 'PNG' && colors <= 256) {
        // force PNG8 to stay PNG8
        // gm otherwise writes a PNG24 file
        gmImage.colors(colors);
        gmImage.setFormat('PNG8');
      }

      that.insertMetadata(generatedFilename, width, infos, options);
      return Q.ninvoke(gmImage, 'write', destination);
    });
};

ImageResizer.prototype.generateFilename = function (file, width) {
  return file.substr(0, file.lastIndexOf('.')) + width + 'w.' + file.substr(file.lastIndexOf('.') + 1);
};

ImageResizer.prototype.insertMetadata = function (file, width, infos, options) {
  
  let aspectRatio = 1;
  let filename = path.join(options.rootURL, options.destinationDir, file);
  if (infos[2].height > 0) {
    aspectRatio = Math.round((infos[2].width / infos[2].height) * 100) / 100;
  }
  this.metaData[file] = {
    width,
    aspectRatio,
    filename
  }
};


module.exports = ImageResizer;
