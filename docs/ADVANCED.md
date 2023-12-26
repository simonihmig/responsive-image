# Advanced Usage

## Service

The `responsive-image-local` service provides the available images (local privider) with the sizes for a given origin image, and retrieves the image that fits for the current screen size.

```js
let availableImages = responsiveImageService.getImages('myImage.png');
/**
availableImages contains now: 
[
    {width: 640, height: 320, image: "/assets/images/responsive/myImage640w.png"},
    {width: 750, height: 375, image: "/assets/images/responsive/myImage750w.png"},
    ...
    {width: 2048, height: 1012, image: "/assets/images/responsive/myImage2048w.png"}
]
*/

let imageData = responsiveImageService.getImageDataBySize('myImage.png', 100); // The size argument is in ´vw´, 100 is the default and can be omitted
// {width: 750, height: 375, image: "/assets/images/responsive/myImage750w.png"}

let fittingImage = responsiveImageService.getImageBySize('myImage.png', 100); // The size argument is in ´vw´, 100 is the default and can be omitted
// "/assets/images/responsive/myImage1080w.png"
```

The base width to calculate the necessary image width is the `screen.width` assigned to the `screenWidth` property of the services. If this doesn't fit your needs, you can assign an other value, e.g. `document.documentElement.clientWidth`.

## Helper

The `responsive-image-resolve` helper provides the image url that fits for the current screen size. The first parameter is the name of the origin image.

Optional named arguments are:

- `size`: the target width in `vw`. Has a default value of `100`, so it can be omitted.
- `format`: image format. By default, the format of the original source file.

```hbs
{{responsive-image-resolve 'assets/images/myImage.png' size=50 format='webp'}}
```
