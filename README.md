# ember-responsive-image

[![Build Status](https://travis-ci.org/kaliber5/ember-responsive-image.svg?branch=master)](https://travis-ci.org/kaliber5/ember-responsive-image)

[![Code Climate](https://codeclimate.com/github/kaliber5/ember-responsive-image/badges/gpa.svg)](https://codeclimate.com/github/kaliber5/ember-responsive-image)

An ember-cli addon for generating resized images and use them in img-tags with the srcset-attribute 

## Getting started
### Install ImageMagick

For the resizing, ImageMagick has to be installed on the machine where the build process will be executed (local and/or your build-server).
Download and install [ImageMagick](http://www.imagemagick.org/). In Mac OS X, you can simply use [Homebrew](http://mxcl.github.io/homebrew/) and do:

    brew install imagemagick
### Install in ember-cli application

In your application's directory:

```bash
    npm install ember-responsive-image
```

## Basic Usage

Add the configuration to your environment.js

```js
module.exports = function(environment) {
  var ENV = {
    'responsive-image': {
      sourceDir: 'assets/images/generate',
      destinationDir: 'assets/images/responsive',
      quality: 80,
      supportedWidths: [2048, 1536, 1080, 750, 640],
      removeSourceDir: true,
      justCopy: false
    }
  }
}
```

### Options

**sourceDir:** The folder with the origin images.
**destinationDir:** This folder will contain the generated Images. It will be created, if not exists. Must not the same as sourceDir.
**supportedWidths:** These are the widths of the resized images.
**removeSourceDir:** If true, the sourceDir will be removed from the build.
**justCopy:** If true, the images will just be copied without resizing. This is usefull for development builds to speed things up, but should be false for production.

Put one or more images in the source-folder (in this case 'assets/images/generate/'), like 'myImage.png', and build the project. The resized images will be generated into the destination directory (assets/images/responsive):
```
myImage640w.png
myImage750w.png
myImage1080w.png
myImage1536w.png
myImage2048w.png
```

**Note:** If the width of your origin image is less than the generated should be, the image will be generated unresized.

## Component

In a template you can use the responsive-image component. The image argument is required and must be one of the origin files:

```js
{{responsive-image image="myImage.png"}}
```

this will generate an img-tag with the resized images as srcset, so the browser can decide, which image fits the needs:
```html
<img id="ember308" src="/assets/images/responsive/myImage1080w.png" srcset="/assets/images/responsive/myImage640w.png 640w, /assets/images/responsive/myImage750w.png 750w, /assets/images/responsive/myImage1080w.png 1080w, /assets/images/responsive/myImage1536w.png 1536w, /assets/images/responsive/myImage2048w.png 2048w" class="ember-view">
```

The image in the src-attribute is calculated from the component and will be used by browsers without the srcset-support.

Other attributes like 'alt', 'className' are optional:

```js
{{responsive-image image="myImage.png" className="my-css-class" alt="This is my image"}}
```

```html
<img id="ember308" src="..." srcset="..." class="ember-view my-css-class" alt="This is my image">
```

If your image-width is not '100vw', say 70vw for Example, you can specify the 'size' (only vw supported by now):
```js
{{responsive-image image="myImage.png" size="70"}}
```

```html
<img id="ember308" src="..." srcset="..." sizes="70vw">
```

You can also replace the sizes argument if your image width is more complicated like:
```js
{{responsive-image image="myImage.png" sizes="(min-width: 800px) 800px, 100vw"}}
```

```html
<img id="ember308" src="..." srcset="..." sizes="(min-width: 800px) 800px, 100vw">
```

**Important:** If you use this component, you have to exclude the destination folder from fingerprinting:
```js
//ember-cli-build.js

//  ...
    fingerprint: {
        exclude: ['assets/images/responsive'] // or whatever your destination folder is
      }
//  ...      

```
