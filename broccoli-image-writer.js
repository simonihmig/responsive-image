/**
 * Created by andreasschacht on 28.01.16.
 */
var path = require('path');
var fs = require('fs-extra');
var chalk = require('chalk');
var mkdirp = require('mkdirp');
var gm = require('gm').subClass({imageMagick: true});
var Q = require('q');
const CachingWriter = require('broccoli-caching-writer');
const util = require('util');
const async = require('async-q');

function ImageResizer(inputNodes, options, userInterface) {
  options = options || {};
  this.image_options = options['responsive'];
  options.cacheInclude = [/.*/];
  this.ui = userInterface;
  CachingWriter.call(this, inputNodes, options);
}

util.inherits(ImageResizer, CachingWriter);

ImageResizer.prototype.build = function () {
  var ui = this.ui;
  var writeLn = function (line) {
    if (ui) {
      ui.writeLine(line);
    }
  };
  var options = this.image_options;
  var sourcePath = this.inputPaths[0];
  var destinationPath = path.join(this.outputPath, options.destinationDir);
  var promises = [];

  try {
    //make destination folder, if not exists
    mkdirp.sync(destinationPath);
    //read files from source folder
    var files = fs.readdirSync(sourcePath);
    var that = this;

    files.forEach(function (file) {
      writeLn(chalk.green(file));
      var newPromise;
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
    var message = promises.length + ' images ' + (options.justCopy ? 'copied' : 'generated');
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
  var promises = [];
  var that = this;
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
  var promises = [];
  var that = this;
  options.supportedWidths.forEach(function (width) {
    var source = path.join(sourcePath, file);
    var generatedFilename = that.generateFilename(file, width);
    var destination = path.join(destinationPath, generatedFilename);

    promises.push(function () {
      return Q.nfcall(fs.copy, source, destination);
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
  var source = path.join(sourcePath, file);
  var generatedFilename = this.generateFilename(file, width);
  var destination = path.join(destinationPath, generatedFilename);

  var gmImage = gm(source);


  return Q.all([
      Q.ninvoke(gmImage, 'format'),
      Q.ninvoke(gmImage, 'color')
    ])
    .then(function(infos) {
      var format = infos[0];
      var colors = parseInt(infos[1], 10);

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

      //gmImage.setFormat('PNG8');
      return Q.ninvoke(gmImage, 'write', destination);
    });
};

ImageResizer.prototype.generateFilename = function (file, width) {
  return file.substr(0, file.lastIndexOf('.')) + width + 'w.' + file.substr(file.lastIndexOf('.') + 1);
};


module.exports = ImageResizer;