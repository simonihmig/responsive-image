# Cloudinary

A provider helper for `ember-responsive-image` for the [Cloudinary](https://cloudinary.com) image CDN.

## Usage

Please make sure you have read the [main documentation](../../README.md) first, especially the section on [image providers](../../README.md#image-providers).

This addon provides a `{{responsive-image-cloudinary-provider}}` helper for use with the `<ResponsiveImage/>` component:

```hbs
<ResponsiveImage
  @src={{responsive-image-cloudinary-provider 'path/to/uploaded/image.jpg'}}
/>
```

### Transformations

Besides the transformations that the addon itself implicitly adds (related to resizing images)
you can add your own [Cloudinary transformations](https://cloudinary.com/documentation/transformation_reference) by using the
`transformations` parameter:

```hbs
<ResponsiveImage
  @src={{responsive-image-cloudinary-provider
    'path/to/uploaded/image.jpg'
    transformations='e_sharpen:400,e_grayscale'
  }}
/>
```

### Quality

Use the `quality` parameter to pass a custom [quality](https://cloudinary.com/documentation/transformation_reference#q_quality) setting
instead of the default `auto`:

```hbs
<ResponsiveImage
  @src={{responsive-image-cloudinary-provider
    'path/to/uploaded/image.jpg'
    quality=50
  }}
/>
```

### Image formats

By default, all supported image formats (PNG, JPEG, WEBP, AVIF) are referenced in the generated `<source>` tags.
You can tweak that using the `formats` argument:

```hbs
<ResponsiveImage
  @src={{responsive-image-cloudinary-provider
    'path/to/uploaded/image.jpg'
    formats=(array 'webp' 'avif')
  }}
/>
```

### Remote files

The provider supports Cloudinary's [`fetch`](https://cloudinary.com/documentation/fetch_remote_images) mode to automatically fetch
images from a remote source and deliver them (with optional custom transformations) through Cloudinary's CDN. Simply
pass a fully qualified http(s) URL:

```hbs
<ResponsiveImage
  @src={{responsive-image-cloudinary-provider
    'https://upload.wikimedia.org/wikipedia/commons/1/13/Benedict_Cumberbatch_2011.png'
    transformations='e_grayscale'
  }}
/>
```

## Configuration

You need to specify the `cloudName` in your app's `config/addons.js` file:

```js
// config/addons.js
'use strict';

module.exports = {
  '@ember-responsive-image/cloudinary': {
    cloudName: 'my-org',
  },
};
```

## License

This project is licensed under the [MIT License](../../LICENSE.md).
