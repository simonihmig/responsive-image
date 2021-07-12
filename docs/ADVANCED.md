# Advanced Usage

## Service

The `responsive-image-local` service provides the available images (local privider) with the sizes for a given origin image, and retrieves the image that fits for the current screen size.

```js
let availableImages = responsiveImageService.getImages("myImage.png");
/**
availableImages contains now: 
[
    {width: 640, height: 320, image: "/assets/images/responsive/myImage640w.png"},
    {width: 750, height: 375, image: "/assets/images/responsive/myImage750w.png"},
    ...
    {width: 2048, height: 1012, image: "/assets/images/responsive/myImage2048w.png"}
]
*/

let imageData = responsiveImageService.getImageDataBySize("myImage.png", 100); // The size argument is in ´vw´, 100 is the default and can be omitted
// {width: 750, height: 375, image: "/assets/images/responsive/myImage750w.png"}

let fittingImage = responsiveImageService.getImageBySize("myImage.png", 100); // The size argument is in ´vw´, 100 is the default and can be omitted
// "/assets/images/responsive/myImage1080w.png"
```

The base width to calculate the necessary image width is the `screen.width` assigned to the `screenWidth` property of the services. If this doesn't fit your needs, you can assign an other value, e.g. `document.documentElement.clientWidth`. 

## Helper

The `responsive-image-resolve` helper provides the image url that fits for the current screen size. The first parameter is the name of the origin image. 

Optional named arguments are:
* `size`: the target width in `vw`. Has a default value of `100`, so it can be omitted.
* `format`: image format. By default, the format of the original source file.

```hbs
{{responsive-image-resolve "assets/images/myImage.png" size=50 format="webp"}}
```


## Extensibility hooks
### Extend the image processing

During the image process the addon calls the `preProcessImage` and the `postProcessImage` hooks for each origin image and supported width. Here you can add custom image process steps, like a watermark integration. The first hook will be called just before the addon's image process calls applies, the latter after. You can register your callbacks by calling the addon's `addImagePreProcessor` or `addImagePostProcessor` function before the addon's `postprocessTree` was called.
In both cases the callback function you provide must have the following signature:

```javascript
  function preProcessor(sharp, image, width, configuration)
  {
    // do something with the sharp-object...
    return sharp;
  }
```
* **sharp:** [sharp](https://github.com/lovell/sharp) object with the current origin image
* **image:** the name of the origin image file
* **width:** the width of the resulting resized image of the current process
* **configuration:** the configuration for the current image processing (from environments configuration)

The callback must return a `sharp`-object or a Promise resolves to it.

**Note:** In addition to the callback, you can also pass an optional target object that will be set as `this` on the context. This is a good way to give your function access to the current object.

**Note:** If you set `justCopy` to `true` in your configuration, your callback will be called, but the result doesn't take effect to the resulting image (because it's just a copy).

For an example see [ember-lazy-responsive-image](https://github.com/kaliber5/ember-lazy-responsive-image/blob/master/index.js)

### Extend the metadata

Before the addon injects the generated metadata into the build, a `extendMetadata`-hook is called for each origin image. The `metadata`-object contains the information for the addon's `ResponsiveImage`-Service. Here you can add custom metadata. You can register your callbacks by calling the addon's `addMetadataExtension` function before the addon's `postprocessTree` was called.
The callback function you provide must have the following signature:

```javascript
  function customMetadata(image, metadata, configuration)
  { 
    // do something with the metadata-object...  
    return metadata;
  }
```
* **image:** the name of the origin image file
* **metadata:** object with the metadata of the generated images
* **configuration:** the configuration for the image generation (from environments configuration)

The callback must return an object with the extended metadata.

**Note:** In addition to the callback, you can also pass an optional target object that will be set as `this` on the context. This is a good way to give your function access to the current object.

For an example see [ember-lazy-responsive-image](https://github.com/kaliber5/ember-lazy-responsive-image/blob/master/index.js) and the extended [ResponsiveImageService](https://github.com/kaliber5/ember-lazy-responsive-image/blob/master/addon/services/responsive-image.js)
