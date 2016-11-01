# ember-kaliber5-responsive-image

An ember-cli addon for generating img-tags with the srcset-attribute which automatic resize specific images to supported widths by ImageMagick and include them to the srcset-attribute


## Getting started
First download and install [ImageMagick](http://www.imagemagick.org/). In Mac OS X, you can simply use [Homebrew](http://mxcl.github.io/homebrew/) and do:

    brew install imagemagick

    npm install kaliber5/ember-kaliber5-responsive-image


## Basic Usage

Add the configuration to your environment.js

The sourceDir contains the origin images folder.
The destinationDir will be created, if not exists.
The supportedWidths will be the widths of the resized images.
If removeSourceDir is true (default), the origin images will be removed from the build.
If justCopy is true, the images will just be copied without resizing. This is usefull for development builds to speed things up, but should be false for production.

```js
module.exports = function(environment) {
  var ENV = {
    'kaliber5-responsive-image': {
      sourceDir: 'assets/images/generate',
      destinationDir: 'assets/images/responsive',
      quality: 80,
      supportedWidths: [2048, 1536, 1080, 750, 640],
      removeSourceDir: true,
      justCopy: false
    }
  }
}
```js

Put one or more images in the source-folder (in this case '/assets/images/generate/'), like 'myImage.png', and build the project.

In a template you can use the responsive-image component with specify the image. Other attributes like 'style', 'className',... are optional:

```js
{{responsive-image image="myImage.png" className="my-css-class" }}
```js

this will generate an img-tag with the resized images as srcset.