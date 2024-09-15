# imgix

The image processing capabilities of the [imgix](https://imgix.com) image CDN are supported by a helper function provided to you by this library.

## Setup

Make sure you have the `@responsive-image/cdn` package installed:

::: code-group

```bash [npm]
npm install @responsive-image/cdn
```

```bash [yarn]
yarn add @responsive-image/cdn
```

```bash [pnpm]
pnpm add @responsive-image/cdn
```

:::

You need to specify your imgix `domain` in your configuration, which can vary across the supported frameworks:

::: code-group

```js [Ember]
// config/addons.js
module.exports = {
  '@responsive-image/ember': {
    imgix: {
      domain: 'my-org.imgix.net',
    },
  },
};
```

:::

## Usage

> [!IMPORTANT]
> Please make sure you have read the section on [remote images](../usage/remote-images.md) first.

Use the imgix provider function passing the reference to the image on the CDN and optional transcustom parametersformations, and pass the return value to the [image component](../usage/component.md):

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { imgixProvider } from '@responsive-image/cdn';

<template>
  <ResponsiveImage @src={{imgixProvider 'path/to/uploaded/image.jpg'}} />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-imgix-provider 'path/to/uploaded/image.jpg'}}
/>
```

:::

### Custom parameters

Besides the transformations that the addon itself implicitly adds (related to resizing images)
you can add your own [imgix parameters](https://docs.imgix.com/apis/rendering) by passing a `params` object:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { imgixProvider } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{imgixProvider
      'path/to/uploaded/image.jpg'
      params=(hash monochrome='44768B' px=10)
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-imgix-provider
    'path/to/uploaded/image.jpg'
    params=(hash monochrome='44768B' px=10)
  }}
/>
```

:::

### Quality

Use the `quality` parameter to pass a custom [quality](https://docs.imgix.com/apis/rendering/format/q) setting
instead of the default `auto`:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { imgixProvider } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{imgixProvider
      'path/to/uploaded/image.jpg'
      quality=50
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-imgix-provider
    'path/to/uploaded/image.jpg'
    quality=50
  }}
/>
```

:::

### Image formats

By default, all supported image formats (PNG, JPEG, WEBP, AVIF) are referenced in the generated `<source>` tags.
You can tweak that using the `formats` argument:

::: code-group

```gjs [Ember .gjs]
import { ResponsiveImage } from '@responsive-image/ember';
import { imgixProvider } from '@responsive-image/cdn';

<template>
  <ResponsiveImage
    @src={{imgixProvider
      'path/to/uploaded/image.jpg'
      formats=(array 'webp' 'avif')
    }}
  />
</template>
```

```hbs [Ember .hbs]
<ResponsiveImage
  @src={{responsive-image-imgix-provider
    'path/to/uploaded/image.jpg'
    formats=(array 'webp' 'avif')
  }}
/>
```

:::
