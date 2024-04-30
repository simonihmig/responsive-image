# imgix

A provider helper for `ember-responsive-image` for the [imgix](https://imgix.com/) image CDN.

## Usage

Please make sure you have read the [main documentation](../../README.md) first, especially the section on [image providers](../../README.md#image-providers).

This addon provides a `{{responsive-image-imgix-provider}}` helper for use with the `<ResponsiveImage/>` component:

```hbs
<ResponsiveImage @src={{responsive-image-imgix-provider 'path/to/image.jpg'}} />
```

### Custom parameters

Besides the transformations that the addon itself implicitly adds (related to resizing images)
you can add your own [imgix parameters](https://docs.imgix.com/apis/rendering) by passing a `params` hash:

```hbs
<ResponsiveImage
  @src={{responsive-image-imgix-provider
    'path/to/image.jpg'
    params=(hash monochrome='44768B' px=10)
  }}
/>
```

### Quality

Use the `quality` parameter to pass a custom [quality](https://docs.imgix.com/apis/rendering/format/q) setting
instead of the default of `75`:

```hbs
<ResponsiveImage
  @src={{responsive-image-imgix-provider 'path/to/image.jpg' quality=50}}
/>
```

### Image formats

By default, all image formats supported by imgix (PNG, JPEG, WEBP, but no AVIF yet) are referenced in the generated `<source>` tags.
You can tweak that using the `formats` argument:

```hbs
<ResponsiveImage
  @src={{responsive-image-imgix-provider
    'path/to/image.jpg'
    formats=(array 'webp' 'jpeg')
  }}
/>
```

## Configuration

You need to specify your custom imgix `domain` in your app's `config/addons.js` file:

```js
// config/addons.js
'use strict';

module.exports = {
  '@ember-responsive-image/imgix': {
    domain: 'my-org.imgix.net',
  },
};
```

## License

This project is licensed under the [MIT License](../../LICENSE.md).
