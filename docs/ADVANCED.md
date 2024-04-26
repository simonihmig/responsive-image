# Advanced Usage

## Helper

The `responsive-image-resolve` helper provides the image url that fits for the current screen size. The first parameter is the name of the origin image.

Optional named arguments are:

- `size`: the target width in `vw`. Has a default value of `100`, so it can be omitted.
- `format`: image format. By default, the format of the original source file.

```hbs
{{responsive-image-resolve 'assets/images/myImage.png' size=50 format='webp'}}
```
